
# TODO

## Notate engine design

* Design the rendering engine at a high level
    * Takes in intermediate format and a canvas to render to
    * Renders each glyph in the intermediate representation
    * Use rendering parameter constants we could later expand into themes

## Initial implementation

* Implement the basic layout and rendering engines with just a couple of glyph
  types.
    * Staves
    * Measure bars
    * Whole notes

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

