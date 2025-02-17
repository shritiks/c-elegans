// Gene Expression Simulation - Worm Behavior (p5.js)

let worm;
let PositivefoodSource = null;
let NegativefoodSource = null;
let odorSource = null;
let unc47, eat4, odr10, glr1;
let movementPhase = 0;
let changeDirection = 0;
let targetStayCounter = 0;
let lastTarget = null;
let maxStayFrames = 900; // 15 seconds at 60 FPS
let headAwayCounter = 0;
let canvasRadius = 240;
let trail = []; // Stores previous positions for the trail effect
let maxTrailLength = 150; // Number of positions before fading starts
let sources = []

function setup() {
    if (document.getElementById("simulation").style.display !== "block") {
        return; // Don't run if Simulation tab isn't active
    }

    let canvasParent = document.getElementById("worm-canvas");
    if (canvasParent) {
        let canvas = createCanvas(600,600);
        canvas.parent("worm-canvas");
    } else {
        console.error("Canvas parent div not found!");
    }
    worm = new Worm(width / 2, height / 2);
    
    document.getElementById("PositivefoodCheckbox").addEventListener("change", togglePositivefoodSource);
    document.getElementById("NegativefoodCheckbox").addEventListener("change", toggleNegativefoodSource);
    document.getElementById("odorCheckbox").addEventListener("change", toggleOdorSource);

    sources = [
        {Name : "Positive Food",
        desc: "Bacterial lawns of E. coli strain OP50 or compost-dwelling microbes"
        },
        {Name : "Negative Food",
        desc: "Repellents like quinine or isoamyl alcohol or low quality food suppress feeding behaviour"
        },
        {Name : "Diacteyl Odorant",
        desc: "Diacetyl: odorant compound associated with bacterial food sources"
        },
        {Name: "Both",
            desc:"s"
        }
    ]
}

function draw() {

    //draw circular boundary
    fill(200); // Grey background for the dish
    stroke(0);
    strokeWeight(2);
    ellipse(width / 2, height / 2, 600);
   // Draw worm's trail
   for (let i = 0; i < trail.length; i++) {
    let alpha = map(i, 0, trail.length, 0, 50); // Fade effect
    fill(150, alpha);
    noStroke();
    ellipse(trail[i].x, trail[i].y, 6, 6);
    }

    let descriptionBox = document.getElementById("simulation-text");

    if (descriptionBox) {
        let descriptionText = "";

         if (document.getElementById("PositivefoodCheckbox").checked) {
            descriptionText = sources.find(source => source.Name === "Positive Food").desc;
         }
         if (document.getElementById("NegativefoodCheckbox").checked) {
            descriptionText = sources.find(source => source.Name === "Negative Food").desc;
        }
        if (document.getElementById("odorCheckbox").checked) {
            descriptionText = sources.find(source => source.Name === "Diacteyl Odorant").desc;
        }

        descriptionBox.innerText = descriptionText;
    }

    
    unc47 = document.getElementById("unc47Slider").value;
    eat4 = document.getElementById("eat4Slider").value;
    odr10 = document.getElementById("odr10Slider").value;
    glr1 = document.getElementById("glr1Slider").value;

    let hoveredText = "";
    
    if (PositivefoodSource) {
        fill(0, 153, 0);
        stroke(0);
        strokeWeight(2);
        ellipse(PositivefoodSource.x, PositivefoodSource.y, 20, 20);
        // if (dist(mouseX, mouseY, foodSource.x, foodSource.y) < 10) {
        //     hoveredText = "Food Source";
        // }
    }
    if (NegativefoodSource) {
        fill(153, 0, 0);
        stroke(0);
        strokeWeight(2);
        ellipse(NegativefoodSource.x, NegativefoodSource.y, 20, 20);
        // if (dist(mouseX, mouseY, foodSource.x, foodSource.y) < 10) {
        //     hoveredText = "Food Source";
        // }
    }
    
    if (odorSource) {
        fill(213,246,148);
        stroke(0);
        strokeWeight(2);
        ellipse(odorSource.x, odorSource.y, 20, 20);
  

        if (dist(mouseX, mouseY, odorSource.x, odorSource.y) < 10) {
            hoveredText = "Diacetyl Odorant";
        }
    }

    if (hoveredText !== "") {
        fill(0);
        textSize(14);
        textStyle(BOLD);
        text(hoveredText, mouseX + 10, mouseY);
    }
    
    worm.update();
    worm.display();
}

function togglePositivefoodSource() {
    if (this.checked) {
        PositivefoodSource = createVector(random(87, width - 87), random(87, height - 87));
    } else {
        PositivefoodSource = null;
    }
}
function toggleNegativefoodSource() {
    if (this.checked) {
        NegativefoodSource = createVector(random(87, width - 87), random(87, height - 87));
    } else {
        NegativefoodSource = null;
    }
}

function toggleOdorSource() {
    if (this.checked) {
        odorSource = createVector(random(87, width - 87), random(87, height - 87));
    } else {
        odorSource = null;
    }
    
}


class Worm {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.segments = [];
        for (let i = 0; i < 13; i++) {
            this.segments.push(createVector(this.pos.x - i * 5, this.pos.y));
        }
        this.randomTarget = createVector(random(width), random(height));
    }
    
    update() {
            let x = getChangeInterval();
            let target = null;
            
            if (unc47 > eat4 && unc47 > odr10) {
                if (frameCount - changeDirection > x / 2) {
                    this.randomTarget = createVector(random(width), random(height));
                    changeDirection = frameCount;
                }
                target = this.randomTarget;
            } else {
                if (PositivefoodSource && odorSource) {
                    target = eat4 > odr10 ? PositivefoodSource : odorSource;
                } else if (odorSource) {
                    target = odorSource;
                } else if (PositivefoodSource) {
                    target = PositivefoodSource;
                } else {
                    if (frameCount - changeDirection > x || dist(this.pos.x, this.pos.y, this.randomTarget.x, this.randomTarget.y) < 10) { 
                        this.randomTarget = createVector(random(50, width - 50), random(50, height - 50));
                        changeDirection = frameCount;
                    }
                    target = this.randomTarget;
                }
            }
    
            let direction = p5.Vector.sub(target, this.pos);
            
            // Introduce a sinusoidal wave pattern for slithering motion
            let baseSpeed = map(glr1, 0, 100, 0.2, 1);
            let waveAmplitude = 5; // Adjust this to control the wave intensity
            let waveFrequency = 0.1; // Controls how frequently the wave oscillates
    
            let angle = movementPhase * waveFrequency;
            let waveOffset = sin(angle) * waveAmplitude;
            
            direction.rotate(radians(waveOffset)); // Apply wave motion to movement direction
            direction.setMag(baseSpeed);
            this.pos.add(direction);
            
            movementPhase += 0.05;
            
            // Keep the worm inside the circular boundary
            let center = createVector(width / 2, height / 2);
            let distanceFromCenter = dist(this.pos.x, this.pos.y, center.x, center.y);
            if (distanceFromCenter > canvasRadius) {
                let bounceAngle = random(TWO_PI);
                let bounceDirection = createVector(cos(bounceAngle), sin(bounceAngle));
                bounceDirection.setMag(3);
                this.pos.add(bounceDirection);
            }
              
        // Add position to trail and maintain maximum length
        trail.push(createVector(this.pos.x, this.pos.y));
        if (trail.length > maxTrailLength) {
            trail.shift();
        }
            
            this.segments.pop();
            this.segments.unshift(createVector(this.pos.x, this.pos.y));
        }
    
     display() {
            noFill();
            stroke(0);
            strokeWeight(6);
            beginShape();
            for (let i = 0; i < this.segments.length; i++) {
                let offset = sin(i * 0.5 + movementPhase) * 5; // Adjust wave movement along body
                curveVertex(this.segments[i].x + offset, this.segments[i].y);
            }
            endShape();
        }
}

function getChangeInterval(){
    return map(glr1,0,100,120,15)
}
