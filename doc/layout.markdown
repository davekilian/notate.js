
Layout Engine
=============

The layout engine is an extensible system for generating and positioning
glyphs from a document.

The original document format is descrbed in 
[format.markdown](https://github.com/davekilian/notate.js/blob/master/doc/intermediate.markdown).

The result of laying out is a layout tree descrbed in
[intermediate.markdown](https://github.com/davekilian/notate.js/blob/master/doc/intermediate.markdown).

## Glyph Generation

The first step is glyph generation. During glyph generation, the engine 
walks through the measures of a document, generating glpyhs in a hierarchical 
layout tree.

Internally, the engine does this by walking through the measures and 
notes in a document, conditionally generating glpyhs from the from the notes
and measures found.

The result is a layout tree whose elements have the correct hierarchy, but
have no associated positions or boundaries.

## Glyph Layout

The next and final stage of layout is traversing the layout tree, determining
the position and bounding box for each glyph. This is done as follows:

    1       layoutGlyph:
    2           orig_size = my minimum bounds, if applicable
    3           for each child glyph:
    4               layoutGlyph(child)
    5               move child to correct position in my coordinate space
    6           my size = union(orig_size, all child bounding boxes)

Lines 2 and 5 are each implemented by calling into a hash table whose keys
are glyph types and whose values are functions that implement the respective
behavior.

For example, staves accept measures and lay them out horizontally. The
document accepts staves and lays them out vertically. Individual notes
accept a variety of child glyphs (accidentals, dots, etc) and have more
involved logic for laying out sub-elements.

