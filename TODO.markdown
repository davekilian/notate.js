
# TODO

## New Document Format

* Implement the show command in the layout engine
* I think we can add an extensibility point for command -> glyph subtree
  conversion. The parser needs separate logic for show vs begin/end commands,
  but the actual conversion to a subtree can be done as follows:

        Look up the thing being shown/begun by type
        Instantiate one
        Call parseCommand()

## Triplets

* Implement the begin/end commands in the layout engine
* Support for the triplet command in the conversion step
* Render the triplet markup 

## Slurs

* Support for the slur command in the conversion step
* Heuristic for placing the slur above or below based on the note pitches
* Render slurs

## Bars

* Support the bar command in the conversion step
* Heuristic for placing the bar above or below based on the note pitches
* Change the size of child stems to meet the bar (or replace the stems with
  stems created by the bar?)
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

