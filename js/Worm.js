// Figure 2: interactive anatomy (p5.js, instance mode)
//
// The micrograph and the organ overlays are drawn in the original 1000 x 700 layout, in which the hover
// regions were measured. That layout stretched the worm vertically, so the whole drawing is scaled by
// Y_SCALE to restore the micrograph's proportions, and the pointer position is mapped back before hit testing.

new p5(function (p) {
    const W = 1000, H = 700;        // original layout
    const Y_TOP = 150, Y_BOTTOM = 550;
    const Y_SCALE = 0.75;
    const HIGHLIGHT = [220, 203, 133, 215];

    // hits: [x, y, radius] in the original layout
    const ORGANS = [
        { name: "Head", file: "Head.png",
          desc: "Contains most of the nervous system, including the ganglia around the pharynx that form the worm's “brain”. It also houses sensory neurons that detect chemical, tactile and thermal stimuli. The excretory pore opens on its ventral side.",
          hits: [[181,430,5],[147,456,5],[215,388,5],[215,440,20],[240,415,20]] },
        { name: "Pharynx", file: "Pharynx.png",
          desc: "A muscular, two-lobed organ that takes in and grinds food. It has its own basal lamina, neurons, muscles and epithelium, and pumps food into the intestine through a valve.",
          hits: [[172,456,20],[215,410,20],[150,478,20],[197,430,13],[130,495,10]] },
        { name: "Intestine", file: "Intestine.png",
          desc: "Twenty cells arranged as a tube around a central lumen. Microvilli on their inner surfaces absorb nutrients.",
          hits: [[234,398,10],[269,358,10],[302,321,10],[330,290,10],[770,420,15],[600,270,15],[665,325,15],[545,235,15]] },
        { name: "Distal gonad", file: "Distal_Gonad.png",
          desc: "A stem cell niche in which germline stem cells divide by mitosis. Somatic sheath cells and a basal lamina wrap it and support the germ cells as they enter meiosis.",
          hits: [[774,385,25],[707,350,30],[650,290,25],[330,284,25],[290,315,25],[260,350,25]] },
        { name: "Proximal gonad", file: "Proximal_Gonad.png",
          desc: "Lies on the ventral side and holds maturing oocytes or sperm inside a thicker gonadal sheath. Gametes mature here before ovulation.",
          hits: [[275,370,15],[311,335,15],[343,293,15],[660,340,15],[680,360,15],[720,395,15]] },
        { name: "Uterus", file: "Uterus.png",
          desc: "Holds fertilised eggs until they are laid. It opens to the outside through the vulva.",
          hits: [[450,240,25],[520,250,25],[570,285,25],[490,245,25]] },
        { name: "Vulva", file: "Vulva.png",
          desc: "A ventral opening at mid-body through which eggs are laid. It connects the uterus to the outside.",
          hits: [[513,265,20]] },
        { name: "Anus", file: "Anus.png",
          desc: "A ventral opening near the tail for excretion. It is lined with cuticle and is the end of the alimentary system.",
          hits: [[797,445,25]] },
        { name: "Tail", file: "Tail.png",
          desc: "Tapers to a fine whip beyond the anus. It contains small ganglia and sensory neurons.",
          hits: [[830,460,25]] }
    ];

    let wormImg;
    let hovered = null;    // organ under the pointer
    let pinned = null;     // organ chosen from the list
    let shown;             // what the caption currently describes
    const caption = document.getElementById("c-elegans-text");
    const list = document.getElementById("organ-list");

    p.preload = function () {
        wormImg = p.loadImage("images/C_elegans.png");
        ORGANS.forEach(function (o) { o.overlay = p.loadImage("images/" + o.file); });
    };

    p.setup = function () {
        const canvas = p.createCanvas(W, (Y_BOTTOM - Y_TOP) * Y_SCALE);
        canvas.parent("c-elegans-canvas");
        p.imageMode(p.CENTER);

        ORGANS.forEach(function (o) {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = o.name;
            b.setAttribute("aria-pressed", "false");
            b.addEventListener("click", function () { pinned = pinned === o ? null : o; });
            b.addEventListener("mouseenter", function () { hovered = o; });
            b.addEventListener("mouseleave", function () { hovered = null; });
            list.appendChild(b);
            o.button = b;
        });
    };

    p.draw = function () {
        p.clear();

        // Pointer in the original layout's coordinates
        const mx = p.mouseX, my = p.mouseY / Y_SCALE + Y_TOP;
        const over = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
        if (over) {
            hovered = null;
            let best = 1;
            ORGANS.forEach(function (o) {
                o.hits.forEach(function (h) {
                    const d = p.dist(mx, my, h[0], h[1]) / h[2];
                    if (d < best) { best = d; hovered = o; }
                });
            });
        }
        const active = hovered || pinned;

        p.push();
        p.scale(1, Y_SCALE);
        p.translate(0, -Y_TOP);
        const s = Math.min(W / wormImg.width, H / wormImg.height);
        p.image(wormImg, W / 2, H / 2, wormImg.width * s - 250, wormImg.height * s);
        if (active) {
            // The overlays are grey, so a tint alone comes out dull; a second additive pass lifts it
            p.tint(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], HIGHLIGHT[3]);
            p.image(active.overlay, W / 2 + 12, H / 2, active.overlay.width * s - 250, active.overlay.height * s);
            p.blendMode(p.ADD);
            p.tint(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 110);
            p.image(active.overlay, W / 2 + 12, H / 2, active.overlay.width * s - 250, active.overlay.height * s);
            p.blendMode(p.BLEND);
            p.noTint();
        }
        p.pop();

        if (active !== shown) {
            shown = active;
            ORGANS.forEach(function (o) { o.button.setAttribute("aria-pressed", String(o === active)); });
            caption.innerHTML = "<b>Figure 2.</b> Adult hermaphrodite, head to the left. " +
                (active ? "<b>" + active.name + ".</b> " + active.desc : "");
        }
    };

    // Tapping the worm on a touch screen pins the organ, since there is no hover
    p.mousePressed = function () {
        const over = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
        if (over) pinned = hovered;
    };
});
