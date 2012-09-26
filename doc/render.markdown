
Render Engine
=============

---

### TODO

This stage is pretty simple. All we need to do is recursively walk
the layout tree, rendering each glyph (extensible for glyph type). 

Basically we can create an object whose members are

    function(canvas, ctx, glyph) { ... }

Then we can index into this object using the glyph type to find the
right glyph, and call that function to render the glyph. The glyph
should contain all necessary render parameters.

Talk about z-order in this document

