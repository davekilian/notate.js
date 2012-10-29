
# Build System Notes

After a little deliberation, I think I'll try not using a build system for
now.

If the codebae gets too messy, break things up and compile using e.g.
[Jake](http://cappuccino.org/discuss/2010/04/28/introducing-jake-a-build-tool-for-javascript/)

---

# Update

I think something like Jake might be unnecessary overhead, but here's a simple
way to break things down and write a bare-bones `build.py`:

* Break out all the code for glyphs into separate source files. Put them in
  `src/glyphs`
    * e.g. `src/glyphs/note.js`
* Rename the remaining stuff base.js
* In each glyph source file, add a little boilerplate to the end that adds
  the glyph's size / layout / render functions to the globally defined 
  `Notate` object
* Then in index.html, include base.js, followed by each of the glyphs
* In build.py, produce a notate.js by concatenating the contents of
  base.js followed by each glyph's source. These definitions are order-
  independent anyways

Possible issues: may need some facility for publishing shared helper objects.
Decoupling helpers between modules is nice but could also add more maintenance
overhead later.

This breakup should make it easier to test individual glyph layout behavior,
as well as make the source a bit more sane and easier to extend. 

