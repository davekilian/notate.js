
# TODO

## New Document Format

I'm starting to think the document format (at least the initial document
format) is too hierarchical. It could make more sense for decorators to be
apply modally. Then you can make something of a DSL. For example, you could 
have:

    [
        { start: "bar" },
        { start: "slur" },

        { show: "note", ... },
        { show: "note", ... },
        ...

        { end: "slur" },
        { end: "bar" },
    ]

That gives you the ability to easily overlap different groups:

    [
        { start: "bar" },
            { show: "note", ... },
            { show: "note", ... },
            { show: "note", ... },
        { start: "slur" },
            { show: "note", ... },
        { end: "bar" },
        { start: "bar" },
            { show: "note", ... },
        { end: "slur" },
            { show: "note", ... },
            { show: "note", ... },
            { show: "note", ... },
        { end: "bar" },
    ]

If you need to overlap two of the same sort of thing (for example, you're
barring eighth notes together and you need a sixteenth note section), you can
specify names to your start/end glyphs:

    [
        { start: "bar", named: "outer", ... },
            { show: "note", ... },
        { start: "bar", named: "inner", ... },
            { show: "note", ... },
            { show: "note", ... },
        { end: "inner" },
            { show: "note", ... },
        { end: "outer" },
    ]

I'm not yet certain whether we'd then want to scrap the idea of a layout tree
and just go with document glyphs. There seem to only be a few classes of glyphs
we need to consider:

1. Things that appear on the clef and take up some amount of horizonal space.
   Examples: notes, measure bars, clefs, time signatures
2. Things that decorate a single note.
   Examples: note accents
3. Things that decorate multiple notes.
   Examples: bar lines, slurs
4. Things that decorate measures.
   Examples: tempo / dynamic text

Items in class (1) can appear on their own in the document as "show" commands.
Items in class (2) can basically be parameters of the "show" command for notes.
Items in class (3) can appear modally as begin/end commands.
Items in class (4) can either appear as a different command ("text"?) or just
use "show" commands like class (1).

It might be worthwhile at this point to look through a lot of musical notation
and figure out if there are more classes of things I missed.

Once that's done, it's worthwhile to think about

* How we'd parse such a document
* How we'd fit this document into measures
* Whether we can simplify the layout tree for the intermediate representation.
  Maybe talk a about a notate.js object model? (NOM lol)

I'm starting to wonder if it wouldn't make sense to parse and lay out at the
same time. Maybe it'd make sense to generate glyph subtrees as we parse, and
then either

* Fit the measures into the staves in a second pass
* Have some kind of lookahead where we preparse an entire measure and then lay
  it out

Items can still know how to lay themselves out relative to some anchor (e.g.
the top of the staff). 

We can also have modally-applied commands. For example, you can specify the
clef:

    { clef: "treble" }
    ... (notes)

Every `show: "note"` command after the `clef: "treble"` command will then use
the treble clef with the note's `pitch` parameter to decide how to lay out the
note vertically.

## Grouped Semantics

A little more design is needed here. Currently there isn't a way for a group
glyph to find the other glyphs it depends on. Worse, there's no way for the
glyph to know finally where in the document the glyph it depends on will end up
unless it traverses the tree to find out).

The best thing I can come up with is, as the final step of laying out, to walk
the tree and bake absolute coordinates into each glyph. Do the same traversal
as Notate.render(), storing the x/y coordinates into each Glyph in the tree.

Then we lay things out in two passes. In the first pass, we lay out 'normal'
glyphs, and in the second we lay out group glyphs / glyphs that depend on note
positions.

* Write the desugarer that assigns glyph IDs and creates grouping glyphs (bar,
  slur, etc) with inter-glyph references. This should happen first, before we
  convert() the document into a list of layout trees
* Write logic for processing glyphs in two passes: non-groups first, groups
  second.

Eventually we'll need logic for splitting groups that span multiple lines,
but we can get to that once we have basic functionality for triplets and
slurs and bars and stuff

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

