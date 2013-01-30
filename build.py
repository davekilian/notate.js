#!/usr/bin/env python2

import os

def main():
    if os.path.exists('bin/notate.js'):
        os.remove('bin/notate.js')

    if os.path.exists('bin'):
        os.rmdir('bin')

    os.mkdir('bin')

    print "Building bin/notate.js"
    dst = open('bin/notate.js', 'w')

    print "Adding base.js"
    base = open('src/base.js')
    dst.write(base.read())
    dst.write('\n')

    glyphs = os.listdir('src/glyphs')
    for glyph in glyphs:
        if glyph.endswith('.js'):
            print "Adding", glyph

            g = open('src/glyphs/' + glyph)
            dst.write(g.read())
            dst.write('\n')

    print "Done!"

if __name__ == '__main__':
    main()

