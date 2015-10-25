#!/usr/bin/env python
#
# notate.js
# Copyright (c) 2015 David Kilian
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http:#www.gnu.org/licenses/>.

import glob
import os

def main():

    # The final notate.js file is generated by concatenating each individual
    # source file in the src/ directory. This script does so by globbing
    # each of the patterns in srcpatterns and concatenating each match into
    # the final document.
    #
    # Make sure the order of the patterns below matches the inter-file
    # dependencies, such that each file appears in the list after the files
    # it depends on.
    #
    srcpatterns = [
        'src/base.js',
        'src/glyphs/*.js',
        ]

    if os.path.exists('bin/notate.js'):
        os.remove('bin/notate.js')

    if os.path.exists('bin'):
        os.rmdir('bin')

    os.mkdir('bin')
    dest = open('bin/notate.js', 'w')

    for srcpattern in srcpatterns:
        print srcpattern

        for srcpath in glob.glob(srcpattern):
            print " -> " + srcpath

            srcfile = open(srcpath)
            dest.write(srcfile.read())
            dest.write('\n')

    print "Done!"

if __name__ == '__main__':
    main()

