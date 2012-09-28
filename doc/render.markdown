
Render Engine
=============

The result of laying out a document is a layout tree, detailed in 
[intermediate.markdown](https://github.com/davekilian/notate.js/blob/master/doc/intermediate.markdown).
The final stage of document processing is rendering. 

## Algorithm

Rendering is accomplished by simply walking the layout tree. At 
each node in the tree, the render engine looks up a rendering callback
in a hash table indexed by glyph type. It calls that function, passing an
HTML5 `<canvas>` context and the current glyph. 

Glyphs contain all layout, positioning, and options needed to render the 
glyph. No extra state is tracked by the renderer.

## Z-Order

Glyph rendering is a preorder traversal. In terms of z-order, this means
that glyphs are rendered behind their child glyphs. This is almost certainly
what you always want :)

## Extensibility

The layout tree format is not in any way tied to the rendering engine. This
means you can take the layout and implement your own renderer (possibly 
forked from the default notate.js renderer). 

This lets you do useful things like creating a renderer that renders the 
layout bounding boxes as well as the notes themselves.

