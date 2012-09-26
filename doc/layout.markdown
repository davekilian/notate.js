
Layout Engine
=============

---

### TODO

Basic design is to take a document and build a tree hierarchy, where the 
document is the root. Individual glyphs are fixed-size and are placed in
the parent's coordinate system. A recursive post-order `measure()`
method walks each glyph and sets its bounds to exactly encompass itself
and its child glyphs. 

One important question to answer is how the origin works. There should
be a well-defined origin for each glyph type, and I think the best idea
is to have a rect with top/bottom/left/right relative to this origin.
Then the origin of the glyph is positioned to a point in the parent
element's coordinate space.

The layout engine can start by rendering each measure separately, then
positioning them into staves at the end, generating and positioning
staves on the fly. 

In fact I think this traversal order works out in general. The general
algorithm becomes:

    1       layoutGlyph:
    2           for each child glyph:
    3               child = create correct glyph type
    4               children.append(layoutGlyph(child))
    5           for each child in children:
    6               move child to correct position in my coordinate space
    7           measure min/max child extends to find my extents
        
Then we make lines 3 (glyph construction from JSON object) and
6 (figuring out how to position children of this element) extensible.

This model is complicated somewhat because we need to track the current
clef, since that affects where notes are positioned vertically. Not sure
if there's any other state we need to track within the layout engine.

