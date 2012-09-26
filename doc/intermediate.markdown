
Intermediate representation
===========================

The first stage of Notate's rendering engine (`Notate.layout()`) receives
a document (see [format.markdown](https://github.com/davekilian/notate.js/blob/master/doc/format.markdown))
and produces a layout tree, which can then be rendered by passing the tree
and a canvas to `Notate.render()`. 

This document describes the layout tree produced by the `layout` step and
consumed by the `render` step.

## Tree Structure

The nodes of the trees are Javascript objects called glyphs. Each 
glyph is defined as follows:

    {
        'top': -10, 'bottom': -10, 'left': 20, 'right': 20, // bounds
        'x': 5, 'y': 12,                                    // position
        'type': 'wholeNote',                                // type
        ...                                  // type-specific parameters
        'children': [{...}, {...},],         // child glyphs
    }

Note that the layout tree is pure data, with no functions. You can use the
layout engine to generate a layout tree, and then use that tree for your
own purposes.

### `top`, `bottom`, `left`, `right`

The layout tree uses a recursive box model to lay out glyphs relative to
each other. Each glyph has a bounding box large enough to contain the
glyph itself and its children.

The `top`/`bottom`/`left`/`right` parameters describe the respective
boundaries of the glyph's bounding box, in the glyph's own coordinate
system. 

The origin of the glyph's coordinate system is defined at (0, 0). Each
unit in the glyph's coordinate system is the same size as a `<canvas>`
unit. Thus each glyph's coordinate system is a translation applied to the
`<canvas>` coordinate system.

### `x`, `y`

These parameters contain the position of this child element relative to
its parent. Specifically, they specify the position of this glyph's 
origin in the parent glyph's coordinate system.

### `type`

Contains the type of current glyph. This decides which function is used
to render the glyph. 

If more data is needed to render the glyph (e.g. the text for a dynamic),
those parameters will be included as properties of the glyph object.

A list of glyph types, examples, and parameters can be found
[here](TODO).

### `children`

A list containing the child glyph objects that are rendered on top of
this glyph.

Parent-child relationships are determiend logically, usually in a way
that is convenient for rendering.

