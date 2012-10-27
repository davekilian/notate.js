
# TODO

## Initial implementation

* Document changes to layout algorithm
* Lay out notes based on pitch and clef
* Ledger lines 

### New Layout Algorithm

Same as the old one, except instead of calling a position function, we allow
each glyph one layout() callback. This callback both lays out the glyph's
children and sizes the glyph itself.

## Add basics to layout and rendering engines

* Different note types
* Barring
* Rests
* Time signatures
* Clefs
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

