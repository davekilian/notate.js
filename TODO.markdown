
# TODO

## Grouped Semantics

Older design is clunky due to the fact that groups (notably slurs) can overlap
measure boundaries. The most straightforward solution it seems is to make
measure boundaries just another glyph, thus flattening the document model. 

Then we can change the document format so that groups are nested, like so:

    {
        bar:
        [
            slur:
            [
                { ... some note ... },
                { ... some note ... },
                { ... some note ... },
                { ... some note ... },
            ],
        ],
    }

The parser can desugar this by
* Assigning a unique ID to each note in the document
* Creating bar / slur glyphs that reference the child notes

Then bar / slur / etc glyphs can refer to those child glyphs and use them to
lay themselves out. This requires us to have some notion of the order in which
glyphs are laid out. 

* Move note layout logic to staff glyph
* Measure glyph should become an end-of-measure glyph
* Change conversion engine to handle the new format, and test extensively
* Mention how to group things in the JSON doc
* Write the desugarer that assigns glyph IDs and creates grouping glyphs (bar,
  slur, etc) with inter-glyph references. Assuming layout engine processes
  glyphs in order (I believe it will naively), we can just jam the new glyph at
  the end of the document
* Eventually we'll need logic for splitting groups that span multiple lines,
  but we can get to that once we have basic functionality for triplets and
  slurs and bars and stuff

Finally, the work items below for triplets, slurs and barring are probably out
of date now.

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

