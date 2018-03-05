# UW_BAW_2018
Brain Awareness Week interactive exhibit - 2018


### Steps:
Steps for creating each brain surface

1. run `makeSurfaces.py` to complete freesurfer recon-all on the specified brain

2. run `makeObjFromPial.py` to combine hemisphere pial files, and then convert to `obj` file (using [Anderson Winkle's srf2obj](https://brainder.org/2012/05/08/importing-freesurfer-cortical-meshes-into-blender/) script)

3. Open `obj` file in meshlab, reduce faces using Quadratic Edge Collapse Decimation (something like <100,000 faces is decent)

4. Export as JSON file