// Figure 1: worm behaviour on a plate (p5.js, instance mode so it can share the page with Worm.js)
//
// The decision rules are unchanged from the first version:
//   unc-47 > eat-4 and unc-47 > odr-10  -> ignore attractants, wander
//   otherwise                            -> approach diacetyl or food (food if eat-4 > odr-10)
//   glr-1                                -> speed, and how often heading changes while exploring
//   repellent within AVOID_R             -> turn away

new p5(function (p) {
    const SIZE = 600;
    const C = SIZE / 2;
    const PLATE_R = 288;      // agar surface
    const ROAM_R = 240;       // the worm turns back beyond this
    const AVOID_R = 110;      // repellent takes effect inside this
    const BODY = 62;          // body length in px
    const WAVELENGTH = 40;    // of the crawling wave, px along the track
    const WIGGLE = 0.55;      // heading swing in radians
    const MAX_TURN = 0.05;    // radians per frame
    const TRACK_POINTS = 1400;

    const el = (id) => document.getElementById(id);
    const slider = { unc47: el("unc47Slider"), eat4: el("eat4Slider"), odr10: el("odr10Slider"), glr1: el("glr1Slider") };
    const box = { food: el("PositivefoodCheckbox"), odour: el("odorCheckbox"), repel: el("NegativefoodCheckbox") };
    const out = { state: el("sim-state"), speed: el("sim-speed"), time: el("sim-time") };

    const INK = {
        agar: [227, 223, 201], rim: [140, 147, 150], worm: [50, 47, 40], track: [120, 110, 70],
        food: [141, 158, 88], odour: [201, 138, 27], repel: [158, 70, 124], label: [70, 66, 54]
    };
    const LABEL = { food: "OP50 lawn", odour: "diacetyl", repel: "repellent" };

    let sources = { food: null, odour: null, repel: null };
    let worm, track, frames, paused, dragging = null;
    let wanderTarget, lastChange;

    // ---- setup ----------------------------------------------------------

    p.setup = function () {
        const canvas = p.createCanvas(SIZE, SIZE);
        canvas.parent("worm-canvas");

        Object.keys(box).forEach(function (kind) {
            box[kind].addEventListener("change", function () {
                sources[kind] = this.checked ? placeSource(kind) : null;
            });
        });
        Object.values(slider).forEach(function (s) {
            s.addEventListener("input", function () { syncSlider(s); });
            syncSlider(s);
        });

        el("sim-pause").addEventListener("click", function () { setPaused(!paused); });
        el("sim-reset").addEventListener("click", function () { setExpression(50, 50, 50, 50); resetWorm(); });
        document.querySelectorAll("button.set").forEach(function (b) {
            b.addEventListener("click", function () { applyPreset(b.dataset.preset); });
        });

        resetWorm();
        // Start still for readers who ask for reduced motion; they can press Play
        setPaused(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    function syncSlider(s) {
        s.parentElement.querySelector("output").textContent = s.value;
        s.style.setProperty("--fill", s.value + "%");
    }

    function setExpression(unc47, eat4, odr10, glr1) {
        const v = { unc47: unc47, eat4: eat4, odr10: odr10, glr1: glr1 };
        Object.keys(v).forEach(function (k) { slider[k].value = v[k]; syncSlider(slider[k]); });
    }

    function ensure(kind) {
        if (!box[kind].checked) { box[kind].checked = true; sources[kind] = placeSource(kind); }
    }

    function applyPreset(name) {
        if (name === "food") { ensure("food"); ensure("odour"); setExpression(30, 80, 40, 50); }
        if (name === "inhibit") { ensure("food"); ensure("odour"); setExpression(90, 60, 60, 50); }
        if (name === "slow") { ensure("odour"); setExpression(30, 50, 60, 10); }
        setPaused(false);
        el("simulation").scrollIntoView({ block: "nearest" });
    }

    function setPaused(v) {
        paused = v;
        el("sim-pause").textContent = paused ? "Play" : "Pause";
    }

    function resetWorm() {
        worm = { x: C, y: C, heading: p.random(p.TWO_PI), phase: 0, speed: 0 };
        track = [];
        frames = 0;
        lastChange = 0;
        wanderTarget = pointOnPlate(ROAM_R - 30);
    }

    function pointOnPlate(maxR, minR) {
        const r = Math.sqrt(p.random((minR || 0) * (minR || 0), maxR * maxR));
        const a = p.random(p.TWO_PI);
        return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
    }

    // Somewhere the worm can reach, clear of the worm and of the other stimuli
    function placeSource(kind) {
        let best = null;
        for (let i = 0; i < 40; i++) {
            const c = pointOnPlate(205, 95);
            let clear = worm ? p.dist(c.x, c.y, worm.x, worm.y) : 999;
            Object.keys(sources).forEach(function (k) {
                if (k !== kind && sources[k]) clear = Math.min(clear, p.dist(c.x, c.y, sources[k].x, sources[k].y));
            });
            if (!best || clear > best.clear) best = { x: c.x, y: c.y, clear: clear };
            if (clear > 130) break;
        }
        return { x: best.x, y: best.y };
    }

    // ---- model ----------------------------------------------------------

    function step() {
        const unc47 = Number(slider.unc47.value);
        const eat4 = Number(slider.eat4.value);
        const odr10 = Number(slider.odr10.value);
        const glr1 = Number(slider.glr1.value);

        const interval = p.map(glr1, 0, 100, 120, 15);   // frames between heading changes
        let speed = p.map(glr1, 0, 100, 0.2, 1);
        let target, state;

        if (unc47 > eat4 && unc47 > odr10) {
            if (frames - lastChange > interval / 2) newWander();
            target = wanderTarget;
            state = "wandering, inhibition dominant";
        } else {
            let kind = null;
            if (sources.food && sources.odour) kind = eat4 > odr10 ? "food" : "odour";
            else if (sources.odour) kind = "odour";
            else if (sources.food) kind = "food";

            if (kind) {
                const s = sources[kind];
                if (p.dist(worm.x, worm.y, s.x, s.y) < 16) {
                    // Arrived: slow down and stay around the source
                    if (frames - lastChange > 45) { wanderTarget = { x: s.x + p.random(-14, 14), y: s.y + p.random(-14, 14) }; lastChange = frames; }
                    target = wanderTarget;
                    speed *= 0.4;
                    state = kind === "food" ? "feeding on the lawn" : "at the diacetyl source";
                } else {
                    target = s;
                    state = kind === "food" ? "approaching food" : "approaching diacetyl";
                }
            } else {
                if (frames - lastChange > interval || p.dist(worm.x, worm.y, wanderTarget.x, wanderTarget.y) < 10) newWander();
                target = wanderTarget;
                state = "exploring";
            }
        }

        let dx = target.x - worm.x, dy = target.y - worm.y;
        let m = Math.hypot(dx, dy) || 1;
        dx /= m; dy /= m;

        if (sources.repel) {
            const ax = worm.x - sources.repel.x, ay = worm.y - sources.repel.y;
            const d = Math.hypot(ax, ay) || 1;
            if (d < AVOID_R) {
                const push = p.map(d, 0, AVOID_R, 2, 0.2);
                dx += (ax / d) * push; dy += (ay / d) * push;
                if (push > 0.6) state = "avoiding the repellent";
            }
        }

        // Turn back from the edge of the plate
        const fromCentre = p.dist(worm.x, worm.y, C, C);
        if (fromCentre > ROAM_R) { dx = C - worm.x; dy = C - worm.y; newWander(); }

        // Steer towards the wanted direction, limited by how fast a worm can turn
        const want = Math.atan2(dy, dx);
        let diff = Math.atan2(Math.sin(want - worm.heading), Math.cos(want - worm.heading));
        worm.heading += p.constrain(diff, -MAX_TURN, MAX_TURN);

        // The head swings from side to side as it advances, which is what leaves a sinusoidal track
        worm.phase += speed * p.TWO_PI / WAVELENGTH;
        const a = worm.heading + WIGGLE * Math.cos(worm.phase);
        worm.x += speed * Math.cos(a);
        worm.y += speed * Math.sin(a);
        worm.speed = speed;

        track.push({ x: worm.x, y: worm.y });
        if (track.length > TRACK_POINTS) track.shift();
        frames++;

        if (out.state.textContent !== state) out.state.textContent = state;
        if (frames % 15 === 0) {
            out.speed.textContent = speed.toFixed(2);
            out.time.textContent = Math.floor(frames / 60);
        }
    }

    function newWander() {
        wanderTarget = pointOnPlate(ROAM_R - 30);
        lastChange = frames;
    }

    // ---- drawing --------------------------------------------------------

    p.draw = function () {
        if (!paused) step();

        p.clear();
        const ctx = p.drawingContext;

        // Dish and agar
        p.noStroke();
        p.fill(INK.rim[0], INK.rim[1], INK.rim[2], 70);
        p.circle(C, C, 2 * (PLATE_R + 9));
        p.fill(INK.agar);
        p.circle(C, C, 2 * PLATE_R);
        p.noFill();
        p.stroke(255, 255, 255, 90);
        p.strokeWeight(1.5);
        p.circle(C, C, 2 * (PLATE_R - 7));

        // Nothing drawn on the agar may spill past its edge
        ctx.save();
        ctx.beginPath();
        ctx.arc(C, C, PLATE_R - 8, 0, Math.PI * 2);
        ctx.clip();
        if (sources.food) drawFood(sources.food);
        if (sources.odour) drawPoint(sources.odour, INK.odour, [26, 52, 82], false);
        if (sources.repel) drawPoint(sources.repel, INK.repel, [AVOID_R], true);
        ctx.restore();

        // Track: older points fade
        p.noFill();
        p.strokeWeight(1.2);
        for (let i = 2; i < track.length; i += 2) {
            p.stroke(INK.track[0], INK.track[1], INK.track[2], p.map(i, 0, track.length, 0, 120));
            p.line(track[i - 2].x, track[i - 2].y, track[i].x, track[i].y);
        }

        drawWorm();

        // Labels last, so the worm never hides them
        ctx.font = "15px " + getComputedStyle(document.body).fontFamily;
        ctx.textBaseline = "middle";
        Object.keys(sources).forEach(function (k) {
            const s = sources[k];
            if (!s) return;
            const w = ctx.measureText(LABEL[k]).width;
            const left = s.x + 14 + w > C + PLATE_R - 20;   // flip near the right edge
            ctx.fillStyle = "rgb(" + INK.label.join(",") + ")";
            ctx.fillText(LABEL[k], left ? s.x - 14 - w : s.x + 14, s.y - 14);
        });

        updateCursor();
    };

    function drawFood(s) {
        p.noStroke();
        p.fill(INK.food[0], INK.food[1], INK.food[2], 70);
        p.circle(s.x, s.y, 56);
        // Lawns are thicker at the rim
        p.noFill();
        p.stroke(INK.food[0], INK.food[1], INK.food[2], 150);
        p.strokeWeight(3);
        p.circle(s.x, s.y, 54);
    }

    function drawPoint(s, ink, rings, dashed) {
        const ctx = p.drawingContext;
        p.noFill();
        p.strokeWeight(1.2);
        if (dashed) ctx.setLineDash([5, 6]);
        rings.forEach(function (r, i) {
            p.stroke(ink[0], ink[1], ink[2], dashed ? 150 : 150 - i * 45);
            p.circle(s.x, s.y, 2 * r);
        });
        ctx.setLineDash([]);
        p.noStroke();
        p.fill(ink);
        p.circle(s.x, s.y, 11);
    }

    // The body lies along the path the head has just taken, as it does for a worm crawling on agar
    function drawWorm() {
        const pts = [];
        let len = 0;
        for (let i = track.length - 1; i > 0 && len < BODY; i--) {
            pts.push(track[i]);
            len += p.dist(track[i].x, track[i].y, track[i - 1].x, track[i - 1].y);
        }
        if (pts.length < 2) {            // nothing crawled yet: a short straight body
            for (let s = 0; s <= BODY; s += 2) pts.push({ x: worm.x - s * Math.cos(worm.heading), y: worm.y - s * Math.sin(worm.heading) });
            len = BODY;
        }
        p.stroke(INK.worm[0], INK.worm[1], INK.worm[2], 235);
        let s = 0;
        for (let i = 1; i < pts.length; i++) {
            s += p.dist(pts[i].x, pts[i].y, pts[i - 1].x, pts[i - 1].y);
            p.strokeWeight(bodyWidth(s / len));
            p.line(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
        }
    }

    // Blunt head, widest in the first half, long tapered tail
    function bodyWidth(u) {
        if (u < 0.12) return p.map(u, 0, 0.12, 3.2, 5.6);
        if (u < 0.55) return 5.6;
        return p.map(u, 0.55, 1, 5.6, 0.9);
    }

    // ---- dragging stimuli -----------------------------------------------

    function inCanvas() { return p.mouseX >= 0 && p.mouseX <= SIZE && p.mouseY >= 0 && p.mouseY <= SIZE; }

    function sourceUnderPointer() {
        let hit = null, best = 24;
        Object.keys(sources).forEach(function (k) {
            const s = sources[k];
            if (!s) return;
            const d = p.dist(p.mouseX, p.mouseY, s.x, s.y);
            if (d < best) { best = d; hit = k; }
        });
        return hit;
    }

    function updateCursor() {
        const c = dragging ? "grabbing" : (inCanvas() && sourceUnderPointer() ? "grab" : "default");
        if (p.canvas.style.cursor !== c) p.canvas.style.cursor = c;
    }

    p.mousePressed = function () {
        if (inCanvas()) dragging = sourceUnderPointer();
    };

    p.mouseDragged = function () {
        if (!dragging) return;
        let dx = p.mouseX - C, dy = p.mouseY - C;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, 225 / d);
        sources[dragging].x = C + dx * k;
        sources[dragging].y = C + dy * k;
        return false;   // keep the page from scrolling while a stimulus is being dragged
    };

    p.mouseReleased = function () { dragging = null; };
});
