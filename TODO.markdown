
# TODO

## Initial implementation

* Layout algorithm
* Turns out I wanted positionCallback() all along (sizing staves is the only case 
  where we need to stretch something to fill a variable amount of its parent)
* Basic / static layouts for implemented glyph types
* Lay out notes based on pitch and clef
* Ledger lines 

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

