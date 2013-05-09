
# TODO

## [Tuplets](http://en.wikipedia.org/wiki/Tuplet)

* Tuplet glyph (layout and rendering)
* Support line breaks in the middle of a tuplet
* Document the command

## Validation

* Instead of `Notate.glyphs`, have two dicts:
    * `Notate.showable` is for things that can appear in a `show:`
    * `Notate.beginable` is for things that can appear in a `begin:`

## Line Break Command

* Documentation
* Implementation (basically, `layout()` can just call `handleLineBreak()`)

## Slurs

* Support for the slur command in the conversion step
* Heuristic for placing the slur above or below based on the note pitches
* Render slurs
* Document the command

## Bars

* Support the bar command in the conversion step
* Heuristic for placing the bar above or below based on the note pitches
* Change the size of child stems to meet the bar (or replace the stems with
  stems created by the bar?)
* Render the bar
* Support multiple bar types in a single group
* Support putting a tuplet number over the bar
* Document the command

## Chords

* Support in JSON
* Support in rendering
* Should work exactly like regular notes otherwise
* Document the command

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

