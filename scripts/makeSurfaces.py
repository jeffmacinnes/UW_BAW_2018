"""
Tool to take unprocessed T1 anatomical images (nifti format) and run
a full freesurfer recon-all job on them. This will produce lh.pial and rh.pial
surface files for each subject (as well as a whole bunch of other stuff that
should probably be cleaned up afterward to save on space)
"""

import os
from os.path import join
import sys
import subprocess

import pandas as pd

# set up directories
scriptsDir = os.path.abspath(os.path.dirname(__file__))
rootDir = os.path.split(scriptsDir)[0]

srcDir = join(rootDir, 'origBrains')
fsDir = join(rootDir, 'freesurfer')


def makeSubjSurface(subjID):
	pass




if __name__ == '__main__':

    # read in the key file
	brainKeys = pd.read_table(join(srcDir, 'brainsKey.tsv'))


	# loop over each row
	for i,row in brainKeys.iterrows():
		try:
			# fs output dir
			outputDir = join(fsDir, row['subj'], 'mri/orig')
			if not os.path.isdir(outputDir):
				os.makedirs(outputDir)

			#convert the nifti file to mgz and copy to freesurfer subjs dir
			subprocess.call(['mri_convert',
							join(srcDir, row['brain']),
							join(outputDir, '001.mgz')])


			# call recon all
			cmd = ' '.join(['recon-all', '-s', row['subj'], '-all', '-notal-check', '-parallel', '-qcache'])
			os.system(cmd)
		except:
			print('subject {} failed...'.format(row['brain']))
			pass
