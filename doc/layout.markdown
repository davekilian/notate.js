
Layout Engine
=============

The layout engine is an extensible system for generating and positioning
glyphs from a document. You can invoke it by calling `Notate.layout()`.

As input, the layout engine takes a command list, as described in
[format.markdown](https://github.com/davekilian/notate.js/blob/master/doc/intermediate.markdown).

As output, the layout engine produces a glyph tree, as described in
[intermediate.markdown](https://github.com/davekilian/notate.js/blob/master/doc/intermediate.markdown).

You can pass the output glyph tree directly into `Notate.render()` in order to
draw the object.

## High-Level Algorithm

    For each command in the input document
        Create the corresponding glyph subtree
        Recursively lay out the subtree

        Add the subtree to the current measure
        If the current measure no longer fits in the current staff
            Move the measure to a new staff

## Glyph Generation

The layout system walks through each command in the input document. For each
command, it starts by converting the command to a corresponding glyph. The
glyph will contain the necessary child glyphs in order to implement the
original command. At this point, however, the children of the glyph will have
no positioning or bounding box data.

For simplicity, the conversion process is not extensible at the moment. It is
implemented in full as a subroutine in base.js. Once the prototype is more
functional, this behavior may be factored out into an extensible command
conversion system.

## Subtree Layout

After generating the glyph subtree, the layout engine lays out the glyph using
a bottom-up walk of the glyph's subtree:

    lay_out(glyph):
        for each child of glyph:
            lay_out(child)

        glyph.layout()

The result is a properly laid out glyph subtree with no positioning
information. That is, the glyph's children will be properly placed relative to
each other and the parent glyph, and the bounding box of the glyph will be
properly sized. However, the glyph at the root of the tree will be at some
default position (e.g. `(0, 0)`).

## Measure-Filling

Each of the resulting glyph subtrees will be placed inside a staff. The layout
engine tracks the size of each measure as glyph subtrees are added, and
automatically moves the entire measure to a staff on the next line when needed.

These staves are added to a root document glyph. This document glyph,
containing the entire document, is then returned from the call into
`Notate.layout()`.

