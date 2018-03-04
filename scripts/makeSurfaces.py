"""
Tool to take unprocessed T1 anatomical images (nifti format) and run
a full freesurfer recon-all job on them. This will produce lh.pial and rh.pial
surface files for each subject (as well as a whole bunch of other stuff that
should probably be cleaned up afterward to save on space)


make sure you:

export SUBJECTS_DIR=/path/to/subjects

and call with 'caffeinate' to make sure computer doesn't go to sleep while running
(could take up to 6-10 hours)

e.g.

> caffeinate python makeSurfaces.py jeff.nii.gz subj01
"""

import os
from os.path import join
import sys
import subprocess
import argparse

import pandas as pd

# set up directories
scriptsDir = os.path.abspath(os.path.dirname(__file__))
rootDir = os.path.split(scriptsDir)[0]

srcDir = join(rootDir, 'origBrains')
fsDir = join(rootDir, 'freesurfer')


def runFreesurfer(brain, subj):
	"""
	Prep input anatomical and run full freesurfer recon-all routine
	"""
	try:
		# fs output dir
		outputDir = join(fsDir, subj, 'mri/orig')
		if not os.path.isdir(outputDir):
			os.makedirs(outputDir)

		#convert the nifti file to mgz and copy to freesurfer subjs dir
		subprocess.call(['mri_convert',
						join(srcDir, brain),
						join(outputDir, '001.mgz')])

		# call recon all
		cmd = ' '.join(['recon-all', '-s', subj, '-all', '-notal-check', '-parallel'])
		os.system(cmd)
	except:
		print('subject {} failed...'.format(brain))
		pass

if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument("brain")  # name of the anatomical, e.g. jeff.nii.gz
	parser.add_argument("subj")   # subjID to assign, e.g. subj01

	args = parser.parse_args()

	runFreesurfer(args.brain, args.subj)
