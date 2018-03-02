## Basic FS preprocessing
* Inputs:
	* subjID
* Command: `recon-all -subjid <subjID> -autorecon1`
* Outputs (among other things):
	* `orig.mgz, orig_nu.mgz brainmask.mgz T1.mgz nu.mgz`

## Create `transforms/talairach.lta`
* Inputs:
	* brainmask.mgz
	* nu.mgz
* Command: `mri_em_register -uns 3 -mask brainmask.mgz nu.mgz $FREESURFER_HOME/average/RB_all_2016-05-10.vc700.gca transforms/talairach.lta`
* Outputs: `transforms/talairach.lta`

## Create `norm.mgz`
* Inputs:
	* brainmask.mgz
	* nu.mgz
	* transforms/talairach.lta
* Command: `mri_ca_normalize -c ctrl_pts.mgz -mask brainmask.mgz nu.mgz $FREESURFER_HOME/average/RB_all_2016-05-10.vc700.gca transforms/talairach.lta norm.mgz`
* Outputs: `norm.mgz`

## Create `brain.mgz`  
* Inputs:
	* brainmask.mgz
	* norm.mgz
	* aseg.presurf.mgz
* Command: `mri_normalize -mprage -mask brainmask.mgz norm.mgz brain.mgz`
* Outputs: `brain.mgz`

## Create `brain.finalsurfs.mgz`  
* Inputs:
	* brain.mgz
	* brainmask.mgz
* Command: `mri_mask -T 5 brain.mgz brainmask.mgz brain.finalsurfs.mgz`
* Outputs: `brain.finalsurfs.mgz`


## Create `wm.mgz`
* Inputs:
	* brain.mgz
* Command: `mri_segment -mprage brain.mgz wm.mgz`

## Create `filled.mgz`
* Inputs:
	* wm.mgz
	* transforms/talairach.lta
* Command: `mri_fill -xform transforms/talairach.lta wm.mgz filled.mgz`

## Create lh.pial & rh.pial files:  
* Inputs:
	* aseg.presurf.mgz
	* brain.finalsurfs.mgz
	* wm.mgz
	* filled.mgz
	* *h.orig
* Command: `mris_make_surfaces`
* Outputs: `*h.pial & more`
 