
# TODO

## Grouped Semantics

A little more design is needed here. Currently there isn't a way for a group
glyph to find the other glyphs it depends on. Worse, there's no way for the
glyph to know finally where in the document the glyph it depends on will end up
unless it traverses the tree to find out).

The best thing I can come up with is, as the final step of laying out, to walk
the tree and bake absolute coordinates into each glyph. Do the same traversal
as Notate.render(), storing the x/y coordinates into each Glyph in the tree.

I like the second better, so let's do that.

* Write the absolute coordinate calculation step
* Change internal specifications so a map from ID string to glyph is passed
  around during layout and rendering. Have need for the first but not the
  second, but I can't see the second hurting anything.
* Write the desugarer that assigns glyph IDs and creates grouping glyphs (bar,
  slur, etc) with inter-glyph references. Assuming layout engine processes
  glyphs in order (I believe it will naively), we can just jam the new glyph at
  the end of the document
* Eventually we'll need logic for splitting groups that span multiple lines,
  but we can get to that once we have basic functionality for triplets and
  slurs and bars and stuff
* Change triplet / slur / barring sections below to mention groups need to
  refer to other notes to lay themselves out.

## Triplets

* Support the triplet flag in the JSON format
* Render the triplet markup in the group glyph's render method

## Slurs

* Support the slur flag in the JSON format
* Heuristic for placing the slur based on pitches of notes
* Render the slur

## Barring

* Support the barring parameters in the group JSON format
* Design a heuristic to determine where to place the bar given the position of
  the stems of the notes under the bar
* Change the size of the child stems during layout so that the stem always goes
  into the bar
* Render the bar
* Support multiple bar types in a single group

## Chords

* Support in JSON
* Support in rendering
* Should work exactly like regular notes otherwise

## Add basics to layout and rendering engines

* Rests
* Time signatures
* Clef markers
* Key signatures
* Accidentals
* Tempo markers
* Dynamics
* Legato
* Codas
* Note accents
* [Anything else I missed](http://en.wikipedia.org/wiki/List_of_musical_symbols)

## Multi-stave systems

* Figure out what needs to be done
    * Changes to public format
    * Changes to intermediate format
    * Changes to layout engine
    * Changes to render engine

## Tablature staves

* Figure out what needs to be done
    * Changes to public format
    * Changes to intermediate format
    * Changes to layout engine
    * Changes to render engine

