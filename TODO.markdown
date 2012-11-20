
# TODO

## Barring

* Prototype by hardcoding bar between two notes
* Extend JSON format so barring groups are parents of the notes themselves in
  the glyph tree.
* Bar glyph representing the barring group in the glyph tree
* Parse and position bar glyphs
* Position notes inside the bar glyph (probably need to duplicate the pitch
  offset logic from measures, which is messy)
* Notes inside a barring group shouldn't have flags
* Figure out a heuristic for positioning bars based on note pitches / vertical
  positions
* Change child stem sizes based on the position of the bar
* Support 16, 32, 64th note barring
* Support multiple barring types in a single system

## Add basics to layout and rendering engines

* Triplets
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

## Chords

* Can the existing JSON model support chords?

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

