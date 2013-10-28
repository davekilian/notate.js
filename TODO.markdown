
# TODO

## Slurs

* Heuristic for placing the slur above or below based on the note pitches
* Never let a slur overlap with the staff

## Chrome Rendering Problems

Currently seeing some glitches in slur rendering in Chrome on OS X. Things work
great on Safari and Firefox, so I'm hoping this is not a bug in Chrome's canvas
engine :/ Do some research into where we go wrong.

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

