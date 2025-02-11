let WormImg;
let headOverlay, pharynxOverlay, intestineOverlay, tailOverlay;
let regions = [];
let scaleFactor = 1;

function preload(){
    WormImg = loadImage('images/C_elegans.png', 
        // () => { console.log("Image loaded successfully."); }, 
        // (err) => { console.error("Error loading image:", err); }
    );
    headOverlay = loadImage('images/Head.png');
    intestineOverlay = loadImage('images/Intestine.png');
    uterusOverlay = loadImage('images/Uterus.png');
    pharynxOverlay = loadImage('images/Pharynx.png', 
    () => { console.log("Image loaded successfully."); }, 
    (err) => { console.error("Error loading image:", err); }
);
    PGonadOverlay = loadImage('images/Proximal_Gonad.png');
    DGonadOverlay = loadImage('images/Distal_Gonad.png');
    anusOverlay = loadImage('images/Anus.png')
    TailOverlay = loadImage('images/Tail.png')
    VulvaOverlay = loadImage('images/Vulva.png')
}


function setup() {
    if (document.getElementById("c-elegans").style.display !== "block") {
        return; // Don't run if C. elegans tab isn't active
    }
  

    let canvasParent = document.getElementById("c-elegans-canvas");
        if (canvasParent) {
          let canvas = createCanvas(1000, 700);
          canvas.parent("c-elegans-canvas");
          // For example, if you have direct access to the HTML element:
        } else {
          console.error("Canvas parent div not found!");
        }
        imageMode(CENTER);
        console.log("Pharynx overlay dimensions:", pharynxOverlay.width, pharynxOverlay.height);
    
        let wormCenterX = width / 2;
        let wormCenterY = height / 2;

        regions = [
            { 
            name: "Head", 
            x: 181, 
            y: 480-50,   // Adjust as needed
            overlay: headOverlay, 
            desc: "Head: The head contains the majority of the nervous system, including ganglia surrounding the pharynx, forming the “brain” of the worm. It also houses sensory neurons that detect chemical, tactile, and thermal stimuli. The excretory pore is located ventrally in the head",
            hoverRadius: 5
            },
            { 
                name: "Head", 
                x: 147, 
                y: 506-50,   // Adjust as needed
                overlay: headOverlay, 
                desc: "Head: The head contains the majority of the nervous system, including ganglia surrounding the pharynx, forming the “brain” of the worm. It also houses sensory neurons that detect chemical, tactile, and thermal stimuli. The excretory pore is located ventrally in the head",
                hoverRadius: 5
                },
                { 
                    name: "Head", 
                    x: 215, 
                    y: 438-50,   // Adjust as needed
                    overlay: headOverlay, 
                    desc: "Head: The head contains the majority of the nervous system, including ganglia surrounding the pharynx, forming the “brain” of the worm. It also houses sensory neurons that detect chemical, tactile, and thermal stimuli. The excretory pore is located ventrally in the head",
                    hoverRadius: 5
                    },
                    { 
                        name: "Head", 
                        x: 215, 
                        y: 490-50,   // Adjust as needed
                        overlay: headOverlay, 
                        desc: "Head: The head contains the majority of the nervous system, including ganglia surrounding the pharynx, forming the “brain” of the worm. It also houses sensory neurons that detect chemical, tactile, and thermal stimuli. The excretory pore is located ventrally in the head",
                        hoverRadius: 20
                        },
                        { 
                            name: "Head", 
                            x: 240, 
                            y: 465-50,   // Adjust as needed
                            overlay: headOverlay, 
                            desc: "Head: The head contains the majority of the nervous system, including ganglia surrounding the pharynx, forming the “brain” of the worm. It also houses sensory neurons that detect chemical, tactile, and thermal stimuli. The excretory pore is located ventrally in the head",
                            hoverRadius: 20
                            },
            { 
              name: "Pharynx", 
              x:  172,
              y: 506-50,   // Adjust as needed
              overlay: pharynxOverlay, 
              desc: "Pharynx: A muscular, two-lobed organ responsible for food intake and processing. It has its own basal lamina, neuronal system, muscles, and epithelium. The pharynx pumps food into the intestine via a valve",
              hoverRadius: 20
            },
            { 
                name: "Pharynx", 
                x:  215,
                y: 460-50,   // Adjust as needed
                overlay: pharynxOverlay, 
                desc: "Pharynx: A muscular, two-lobed organ responsible for food intake and processing. It has its own basal lamina, neuronal system, muscles, and epithelium. The pharynx pumps food into the intestine via a valve",
                hoverRadius: 20
              },
              { 
                name: "Pharynx", 
                x:  150,
                y: 528-50,   // Adjust as needed
                overlay: pharynxOverlay, 
                desc: "Pharynx: A muscular, two-lobed organ responsible for food intake and processing. It has its own basal lamina, neuronal system, muscles, and epithelium. The pharynx pumps food into the intestine via a valve",
                hoverRadius: 20
              },
              { 
                name: "Pharynx", 
                x:  197,
                y: 480-50,   // Adjust as needed
                overlay: pharynxOverlay, 
                desc: "Pharynx: A muscular, two-lobed organ responsible for food intake and processing. It has its own basal lamina, neuronal system, muscles, and epithelium. The pharynx pumps food into the intestine via a valve",
                hoverRadius: 13
              },
              { 
                name: "Pharynx", 
                x:  130,
                y: 545-50,   // Adjust as needed
                overlay: pharynxOverlay, 
                desc: "Pharynx: A muscular, two-lobed organ responsible for food intake and processing. It has its own basal lamina, neuronal system, muscles, and epithelium. The pharynx pumps food into the intestine via a valve",
                hoverRadius: 10
              },
            { 
                name: "First Intestine", 
                x:  234,
                y: 448-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 10
              },
            { 
                name: "First Intestine", 
                x:  269,
                y: 408-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 10
              },
              { 
                name: "First Intestine", 
                x:  302,
                y: 371-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 10
              },
              { 
                name: "Second Intestine", 
                x:  330,
                y: 340-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 10
              },
              { 
                name: "Last Intestine", 
                x:  770,
                y: 470-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 15
              },
              { 
                name: "Last Intestine", 
                x:  600,
                y: 320-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 15
              },
              { 
                name: "Last Intestine", 
                x:  665,
                y: 375-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 15
              }, { 
                name: "Last Intestine", 
                x:  545,
                y: 285-50,   // Adjust as needed
                overlay: intestineOverlay, 
                desc: "Intestine: Composed of 20 cells arranged into a tubular structure with a central lumen. Intestinal cells have microvilli on their apical surfaces for nutrient absorption",
                hoverRadius: 15
              },
              { 
                name: "Proximal Gonad", 
                x:  275,
                y: 420-50,   // Adjust as needed
                overlay: PGonadOverlay, 
                desc: "Proximal Gonad: Located on the ventral side, it contains maturing oocytes or sperm surrounded by a thicker gonadal sheath. This region is involved in gamete maturation and ovulation",
                hoverRadius: 15
              },
              { 
                name: "Proximal Gonad", 
                x:  311,
                y: 385-50,   // Adjust as needed
                overlay: PGonadOverlay, 
                desc: "Proximal Gonad: Located on the ventral side, it contains maturing oocytes or sperm surrounded by a thicker gonadal sheath. This region is involved in gamete maturation and ovulation",
                hoverRadius: 15
              },
              { 
                name: "Proximal Gonad", 
                x:  343,
                y: 343-50,   // Adjust as needed
                overlay: PGonadOverlay, 
                desc: "Proximal Gonad: Located on the ventral side, it contains maturing oocytes or sperm surrounded by a thicker gonadal sheath. This region is involved in gamete maturation and ovulation",
                hoverRadius: 15
              },
              { 
                name: "Proximal Gonad", 
                x:  660,
                y: 390-50,   // Adjust as needed
                overlay: PGonadOverlay, 
                desc: "Proximal Gonad: Located on the ventral side, it contains maturing oocytes or sperm surrounded by a thicker gonadal sheath. This region is involved in gamete maturation and ovulation",
                hoverRadius: 15
              },
              { 
                name: "Proximal Gonad", 
                x:  680,
                y: 410-50,   // Adjust as needed
                overlay: PGonadOverlay, 
                desc: "Proximal Gonad: Located on the ventral side, it contains maturing oocytes or sperm surrounded by a thicker gonadal sheath. This region is involved in gamete maturation and ovulation",
                hoverRadius: 15
              },
              { 
                name: "Proximal Gonad", 
                x:  720,
                y: 445-50,   // Adjust as needed
                overlay: PGonadOverlay, 
                desc: "Proximal Gonad: Located on the ventral side, it contains maturing oocytes or sperm surrounded by a thicker gonadal sheath. This region is involved in gamete maturation and ovulation",
                hoverRadius: 15
              },
              { 
                name: "Uterus", 
                x:  450,
                y: 290-50,   // Adjust as needed
                overlay: uterusOverlay, 
                desc: "Uterus: Part of the reproductive system where fertilized eggs are stored before being laid. It connects to the vulva for egg deposition",
                hoverRadius: 25
              },
              { 
                name: "Uterus", 
                x:  520,
                y: 300-50,   // Adjust as needed
                overlay: uterusOverlay, 
                desc: "Uterus: Part of the reproductive system where fertilized eggs are stored before being laid. It connects to the vulva for egg deposition",
                hoverRadius: 25
              },
              { 
                name: "Uterus", 
                x:  570,
                y: 335-50,   // Adjust as needed
                overlay: uterusOverlay, 
                desc: "Uterus: Part of the reproductive system where fertilized eggs are stored before being laid. It connects to the vulva for egg deposition",
                hoverRadius: 25
              },
              { 
                name: "Uterus", 
                x:  490,
                y: 245,   // Adjust as needed
                overlay: uterusOverlay, 
                desc: "Uterus: Part of the reproductive system where fertilized eggs are stored before being laid. It connects to the vulva for egg deposition",
                hoverRadius: 25
              },
              { 
                name: "DGonad", 
                x:  774,
                y: 435-50,   // Adjust as needed
                overlay: DGonadOverlay, 
                desc: "Distal Gonad: The distal gonad serves as a stem cell niche with germline stem cells undergoing mitosis. It is ensheathed by somatic sheath cells and basal lamina, supporting germ cell development as they transition to meiosis",
                hoverRadius: 25
              },
              { 
                name: "DGonad", 
                x:  707,
                y: 400-50,   // Adjust as needed
                overlay: DGonadOverlay, 
                desc: "Distal Gonad: The distal gonad serves as a stem cell niche with germline stem cells undergoing mitosis. It is ensheathed by somatic sheath cells and basal lamina, supporting germ cell development as they transition to meiosis",
                hoverRadius: 30
              },
              { 
                name: "DGonad", 
                x:  650,
                y: 340-50,   // Adjust as needed
                overlay: DGonadOverlay, 
                desc: "Distal Gonad: The distal gonad serves as a stem cell niche with germline stem cells undergoing mitosis. It is ensheathed by somatic sheath cells and basal lamina, supporting germ cell development as they transition to meiosis",
                hoverRadius: 25
              },
              { 
                name: "DGonad", 
                x:  330,
                y: 334-50,   // Adjust as needed
                overlay: DGonadOverlay, 
                desc: "Distal Gonad: The distal gonad serves as a stem cell niche with germline stem cells undergoing mitosis. It is ensheathed by somatic sheath cells and basal lamina, supporting germ cell development as they transition to meiosis",
                hoverRadius: 25
              },
              { 
                name: "DGonad", 
                x:  290,
                y: 365-50,   // Adjust as needed
                overlay: DGonadOverlay, 
                desc: "Distal Gonad: The distal gonad serves as a stem cell niche with germline stem cells undergoing mitosis. It is ensheathed by somatic sheath cells and basal lamina, supporting germ cell development as they transition to meiosis",
                hoverRadius: 25
              },
              { 
                name: "DGonad", 
                x:  260,
                y: 400-50,   // Adjust as needed
                overlay: DGonadOverlay, 
                desc: "Distal Gonad: The distal gonad serves as a stem cell niche with germline stem cells undergoing mitosis. It is ensheathed by somatic sheath cells and basal lamina, supporting germ cell development as they transition to meiosis",
                hoverRadius: 25
              },
              { 
                name: "Anus", 
                x:  797,
                y: 495-50,   // Adjust as needed
                overlay: anusOverlay, 
                desc: "Anus: A ventral opening near the tail that allows waste excretion. It is lined with cuticle and forms part of the alimentary system",
                hoverRadius: 25
              },
              { 
                name: "Tail", 
                x:  830,
                y: 510-50,   // Adjust as needed
                overlay: TailOverlay, 
                desc: "Tail: Tapered at the posterior end, it contains small ganglia and neurons. The tail whip is located just beyond the anus and contributes to locomotion and sensory functions",
                hoverRadius: 25
              },
              { 
                name: "Vulva", 
                x:  513,
                y: 315-50,   // Adjust as needed
                overlay: VulvaOverlay, 
                desc: "Vulva: A ventral opening in the midbody that facilitates egg-laying. It connects the uterus to the external environment",
                hoverRadius: 20
              },
        ];
}


function draw() {
    clear();
    
    let hoveredRegion = null;
    let hoveredText = "";
    let mouseOver = true;
    // fill(255);
    // textSize(16);
    // text("X: " + mouseX + " Y: " + mouseY, mouseX + 10, mouseY - 10);

     // Calculate a scale factor that fits the image within the canvas while preserving aspect ratio.
  let scaleFactor = min(width / WormImg.width, height / WormImg.height);

  // Draw the image centered, scaling it down.
  image(WormImg, width / 2, height / 2, WormImg.width * scaleFactor - 250, WormImg.height * scaleFactor);
    
  for (let region of regions) {
    // Use the distance from the mouse to the region's center as a simple hover check.
    if (dist(mouseX, mouseY, region.x, region.y) < region.hoverRadius) {
        hoveredRegion=region
        console.log("Hovering over region:", region.name);  // Debug log
        tint(57, 255, 20, 200);
        image(region.overlay, width / 2+12, height / 2, region.overlay.width * scaleFactor-250, region.overlay.height * scaleFactor);
        noTint();
    }
    let descriptionBox = document.getElementById("c-elegans-text");
if (descriptionBox) {
    descriptionBox.innerText = hoveredRegion ? hoveredRegion.desc : "Hover over a region on the C. elegans body to see details on the organ." ;
}
}


}

