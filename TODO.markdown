
# TODO

## Layout engine redesign

* Rewrite build.py to take an ordered list of patterns to conat
* Port over the debug project
* Make sure the debug project always uses the compiled build.py
* Port over the settings object
* Port primary APIs
* Glyph base type
* Block type
* Annotation type
* Block generation
* Block spacing
* Port note glyph
* Get block generation and spacing working
* Port stem glyph
* Port flags glyph
* Support measures
* Line breaking
* Dynamically reflow the document when the debug app window is resized
* Track annotation targets while generating block glyphs
* Generate annotations
* Port tuplet annotation
* Generate staves

## Visual test cases

* Create a test.html which shows test cases
* Javascript helpers for defining test cases
* Each test case has a name, an optional description, and renders a simple
  document
* Test cases are stacked vertically so the user can look at them
* Write test cases for notes of different durations
* Write test cases for notes of different durations with the stems flipped
* Write test case for natural line breaking
* Write test case for tuplets

## Forced line breaking

* Figure out how to specify 'hint' commands which don't correspond to glyphs
* Hint command for forcing a line break
* Honor the hint command in the line breaking phase
* Visual test case for artifical line breaking

## Chords

* Define document syntax for defining chords
* Change note generation to generate chords with one note
* Support chords with more than one note

## Slurs

* Port old slurs to the new layout engine
* Heuristic for placing the slur above or below based on the note pitches
* Never let a slur overlap with the staff

## Bars

* Support the bar command in the conversion step
* Heuristic for placing the bar above or below based on the note pitches
* Change the size of child stems to meet the bar (or replace the stems with
  stems created by the bar?)
* Render the bar
* Support multiple bar types in a single group
* Support putting a tuplet number over the bar
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

