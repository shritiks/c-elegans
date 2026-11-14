# Gene expression simulation in *C. elegans*

An interactive article about four neuronal genes in *C. elegans* (`unc-47`, `eat-4`, `odr-10`, `glr-1`) and a
simulated worm whose behaviour changes with their expression.

Live: https://shritiks.github.io/c-elegans/

## What is on the page

- **Simulation.** A worm on an agar plate. Four sliders set gene expression; food, diacetyl and a repellent can
  be added to the plate and dragged around. The current behaviour, speed and elapsed time are shown under the plate.
- **Genes.** What each gene encodes, where it acts, the loss-of-function phenotype, and what its slider does in the model.
- **Anatomy.** A micrograph of an adult hermaphrodite. Pointing at a region highlights the organ and describes it.
- **Model.** The rules the worm follows and the biology they leave out.

## The model

1. If `unc-47` is higher than both `eat-4` and `odr-10`, the worm ignores attractants and wanders.
2. Otherwise it heads for diacetyl or food. With both present it chooses food if `eat-4` exceeds `odr-10`.
3. `glr-1` sets crawling speed and how often the worm changes heading while exploring.
4. Within a fixed distance of the repellent, the worm turns away.

This is a rule-based sketch, not a circuit model. The page lists its limitations.

## Files

```
index.html         The article
style.css          Styling
js/Simulation.js   Figure 1: worm behaviour (p5.js, instance mode)
js/Worm.js         Figure 2: interactive anatomy (p5.js, instance mode)
js/p5.min.js       p5.js 1.4.0
images/            Micrograph, organ overlays, link-preview image
c-elegans.html, genes.html, simulation.html, home.html
                   Redirects from the old multi-page layout
```

## Running locally

No build step. Serve the folder and open it:

```
python3 -m http.server
```

## Licence

MIT.
