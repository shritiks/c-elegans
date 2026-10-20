# Gene Expression Simulation for Behavioural Genetics

## 🧬 Overview
This project is an interactive **gene expression simulation** for *C. elegans*, focusing on **behavioral genetics**. Users can adjust **gene expression levels** and observe how they influence worm behavior in response to food and odor sources.

## 🚀 Features
- **Adjustable Gene Expression**: Sliders for `unc-47`, `eat-4`, `odr-10`, and `glr-1`.
- **Dynamic Environment**: Add/remove **food** and **odor sources**.
- **Interactive Worm Model**: The worm moves based on gene expression levels.
- **Real-time Descriptions**: Hovering or selecting inputs updates the description panel.
- **Smooth Visuals**: Custom styling for a **dark mode interface**.

## 🎮 How to Use
1. **Adjust gene expression** using the sliders.
2. **Toggle food and odor sources** using the checkboxes.
3. **Observe how the worm moves** based on expression levels.
4. On the anatomy page, **hover over the worm** to highlight each organ and read what it does.

## 🛠️ Technologies Used
- **p5.js** – Interactive simulation rendering
- **JavaScript (ES6)** – Logic & interactivity
- **HTML/CSS** – UI structure and design
- **GitHub Pages** – Hosting the live project

## 📂 Folder Structure
```
├── 📂 images/            # Worm micrograph, organ overlays, link-preview image
├── 📂 js/
│   ├── Worm.js           # Interactive anatomy (hover to highlight organs)
│   └── Simulation.js     # Worm movement & gene expression logic
├── 📜 index.html         # Home page
├── 📜 c-elegans.html     # Anatomy page
├── 📜 genes.html         # Behavioural genes page
├── 📜 simulation.html    # Simulation page
├── 📜 style.css          # Shared styling
└── 📜 README.md          # Project documentation (this file)
```

## 🌍 Live Demo
🔗 **[View the project online](https://shritiks.github.io/c-elegans/)**

## 📝 Future Improvements
- 🏗️ Add more behavioral genes.
- 🔬 Introduce additional environmental factors.
- 🎨 Improve UI animations for better visualization.

## 💡 Contributing
Contributions are welcome! Feel free to **fork** the repo and submit a **pull request**.

## 📜 License
This project is licensed under the **MIT License**. See the `LICENSE` file for details.
