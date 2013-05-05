
Intermediate representation
===========================

The first stage of Notate's rendering engine (`Notate.layout()`) receives
a document (see [format.markdown](https://github.com/davekilian/notate.js/blob/master/doc/format.markdown))
and produces a layout tree, which can then be rendered by passing the tree
and a canvas to `Notate.render()`. 

This document describes the layout tree produced by the `layout` step and
consumed by the `render` step.

## Tree Structure

The nodes of the tree are subtypes of the `Notate.Glyph` objects. The nodes are
colloquially known as glyphs. Each glyph contains its absolute position on the
canvas (i.e. its origin), a bounding box describing the area is occupies, and a
list of child glyphs (which are also subtypes of `Notate.Glyph`). 

The properties of the base type are listed below:

### `x`, `y`

These parameters contain the absolute position of the glyph in canvas
coordinates (which correspond to pixel coordinates). The coordinate system
starts with (0, 0) at the top-left of the canvas. The horizontal axis values
increase as you move right, and the vertical axis values increase as you move
down. 

### `top`, `bottom`, `left`, `right`

Each glyph has a bounding box large enough to contain the glyph and its
chidlren. The layout system uses a recursive box model, to make sure glyphs do
not intersect each other. This bounding box should be tight, with no margins. 

`top`, `bottom`, `left` and `right` are each floating point numbers that
represent the difference between the glyph's origin and the relevant boundary.
For example:

    bounds.minX = glyph.x + glyph.left;
    bounds.maxX = glyph.x + glyph.right;
    bounds.minY = glyph.y + glyph.top;
    bounds.maxY = glyph.y + glyph.bottom;

### `children`

A list containing the child glyph objects that are rendered on top of
this glyph.

Parent-child relationships are determiend logically, usually in a way
that is convenient for rendering.

## Subclassing Glyphs

To subclass `Notate.Glyph`, you must

* Inherit from `Notate.Glyph`
* Override `minSize`, `layout` and `render`
* Register the glyph by adding an entry to `Notate.glyphs`

notate.js ships with several built-in glyphs, which use the same process to
hook into the system. You may consult any `Notate.Glyph` subtype in
`src/glyphs` for examples.

