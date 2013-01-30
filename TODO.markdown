
# TODO

## Groups

* Create a group glyph that can stand in place of a note glyph in some cases
* Duplicate note-positioning logic inside the group glyph
    * Split out into a helper
    * Or maybe a measure is a note group? mind=blown

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

