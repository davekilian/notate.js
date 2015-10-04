
# TODO

## The layout phase is too complex

The problem here is we're trying to do everything at the same time, which means
everything must consider what everything else is going to be doing at the same 
time. This is going to make adding new glyph types complex.

Instead, it might be better to break layout into a more rich set of simpler
phases:

1. Writing, in which we lay out glyphs which occupy horizontal space, and add
   them all into a single infinitely-long staff

2. Line breaking, in which we break up that staff into multiple staffs into
   multiple lines

3. Annotating, in which we add glyphs which don't occupy horizontal space and
   are line-breaking aware (like bars and slurs)

4. Line-spacing, in which we measure the staffs vertically and make sure they
   don't intersect.

To implement this, we'd want to keep the rendering logic and probably keep the
note-related glyphs as is; however, the layout engine would take over owership
of the concepts of a document, staff, and a measure. 

## Bugfixes

The current debug.js is exhibiting two problems:

* The `{show: "measure"}` command isn't being honored
  - For some reason, we're not rendering the last measure command,
    even if there are more notes after it.

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

