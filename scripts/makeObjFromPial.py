"""
Convert the freesurfer surface output (.pial) from each hemisphere to an obj file
"""

import os
from os.path import join
import subprocess
import argparse
import shutil

# set up directories
scriptsDir = os.path.abspath(os.path.dirname(__file__))
rootDir = os.path.split(scriptsDir)[0]

srcDir = join(rootDir, 'origBrains')
fsDir = join(rootDir, 'freesurfer')
objDir = join(rootDir, 'objFiles')

def makeObjFile(subjID):
    # make the output dir for this subj
    outputDir = join(objDir, subjID)
    if not os.path.isdir(outputDir):
        os.makedirs(outputDir)

    # do for each hemisphere
    for hemi in ['lh', 'rh']:
        # copy pial file
        src_path = join(fsDir, subjID, 'surf', (hemi + '.pial'))
        dst_path = join(outputDir, (hemi  + '.pial'))
        shutil.copyfile(src_path, dst_path)

    # combine surfaces into single brain
    subprocess.call(['mris_convert', '--combinesurfs',
        join(outputDir, 'lh.pial'),
        join(outputDir, 'rh.pial'),
        join(outputDir, 'fullBrain.asc')])

    # rename asc to srf
    subprocess.call(['mv',
        join(outputDir, 'fullBrain.asc'),
        join(outputDir, 'fullBrain.srf')])

    # convert to OBJ using srf2obj tool
    cmd = ' '.join(['./srf2obj', join(outputDir, 'fullBrain.srf'), '>', join(outputDir, 'fullBrain.obj')])
    os.system(cmd)



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("subj")   # subjID to assign, e.g. subj01

    args = parser.parse_args()

    makeObjFile(args.subj)
