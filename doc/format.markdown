
Note Format
===========

notate uses a domain-specific language built on top of JSON. At its core, the
language is simply a list of JSON objects, each of which represents a rendering
command.

## Note

notate.js is just a rendering engine. It does not understand your document
beyond what it needs to render it. If you want to validate your document (e.g.
check the number of beats in a measure matches the time signature), you're on
your own :)

## Example

     1  [
     2      { title: "Hot Cross Buns (Sample Document)" },
     3      { composer: "notate.js" },
     4
     5      { clef: "treble" },
     6
     7      { show: "clef", type: "treble" },
     8      { show: "timesig", over: 4, under: 4 },
     9      { show: "keysig", key: "C major" },
    10
    11      { show: "note", pitch: "B5", length: "quarter" },
    12      { show: "note", pitch: "A5", length: "quarter" },
    13      { show: "note", pitch: "G4", length: "half" },
    14      { show: "measure" },
    15
    16      { show: "note", pitch: "B5", length: "quarter" },
    17      { show: "note", pitch: "A5", length: "quarter" },
    18      { show: "note", pitch: "G4", length: "half" },
    19      { show: "measure" },
    20
    21      { begin: "bar" },
    22      { show: "note", pitch: "G4", length: "eighth" },
    23      { show: "note", pitch: "G4", length: "eighth" },
    24      { show: "note", pitch: "G4", length: "eighth" },
    25      { show: "note", pitch: "G4", length: "eighth" },
    26      { end: "bar" },
    27      
    28      { begin: "bar" },
    29      { show: "note", pitch: "A5", length: "eighth" },
    30      { show: "note", pitch: "A5", length: "eighth" },
    31      { show: "note", pitch: "A5", length: "eighth" },
    32      { show: "note", pitch: "A5", length: "eighth" },
    33      { end: "bar" },
    34      { show: "measure" },
    35
    36      { show: "note", pitch: "B5", length: "quarter" },
    37      { show: "note", pitch: "A5", length: "quarter" },
    38      { show: "note", pitch: "G4", length: "half" },
    39      { show: "measure" },
    40  ]

### What's Going On?

As previously mentioned, the notate DSL consists of a list of command objects. 

The document above begins with some metadata like the title and author.
notate.js will render this in a pretty way at the top of the document. If you'd
rather handle this yourself, you're free to omit these parameters and render
them onto the document canvas yourself.

Next, on line 5, is the `clef` command. The `clef` command denotes which clef
notes are rendered in. It is applied modally; that is, once you specify a
`clef` command, all notes after it are affected until you specify a different
clef. Note that the `clef` command doesn't actually draw a clef symbol. That
will come later in the document. Since the default `clef` is `treble`, we could
have ommitted line 5 from our document.

On line 7 we see our first `show` command. The `show` command is used for the
majority of things notate.js renders. Different parameters are required when
showing different objects. A complete list of show commands are specified later
in this document. Notably, the `show` command draws the vertical bars that
terminate a measure (see line 14).

Some pieces of musical notation affect multiple notes. On line 21, we see an
example: the bar that connects a group of eighth notes. All `show: "note"`
commands inside a `begin`/`end` command block are affected by that `begin`
command. In this case, the four notes between `begin: "bar"` and `end: "bar"`
are barred together.

## Commands

### Metadata

These commands specify textual information that can be rendered on your notate
document:

* `{ title: "The Title of Your Piece" }`
* `{ composer: "He Who Composed the Piece" }`
* `{ arranged: "He Who Arranged the Piece? }`
* `{ year: "Like 2000 or MM }`

### `clef`

The `clef` command changes what clef your document is currently using. Notes
after the current `clef` command use the specified clef to determine how to map
their pitches to places on the staff. Specifying a clef only affects the
subsequent notes.

The default clef is `treble`. Other possibilities are 

* `violin`, the French violin clef
* `soprano`
* `mezzo-soprano`,
* `alto`
* `tenor`
* `baritone`
* `bass`
* `sub-bass`

### `show`

The `show` command renders an object. There are many different objects that can
be rendered with the `show` command, and many of these objects require a
different set of parameters to be passed in via the show command. A full list
of objects that can be rendered with `show`, complete with necessary
parameters, is provided in another section.

### `begin` & `end`

`begin` and `end` are used to render notation that affects or depends on
multiple notes. Examples include bars and slurs. Any `show` command between
`begin` and `end` is processed normally. Any `show: "note"` command between
`begin` and `end` gets included in the bar/slur/etc.

Things that can be included in a begin or end:

* `begin: "bar"` causes all notes in the block to get barred together. notate
  automatically determines what kind of barring to use (eighth-note,
  sixteenth-note, etc)
* `begin: "slur"` renders a slur that covers all notes in the block
* `TODO` anything else?

`begin`/`end` blocks are designed so they can overlap:

    { begin: "bar" },
        { show: "note", length: "eighth", pitch: "C4" },
        { show: "note", length: "eighth", pitch: "C4" },
        { show: "note", length: "eighth", pitch: "C4" },
    { begin: "slur" },
        { show: "note", length: "eighth", pitch: "C4" },
    { end: "bar" },

    { show: "measure" }

    { begin: "bar" },
        { show: "note", length: "eighth", pitch: "C4" },
    { end: "slur" },
        { show: "note", length: "eighth", pitch: "C4" },
        { show: "note", length: "eighth", pitch: "C4" },
        { show: "note", length: "eighth", pitch: "C4" },
    { end: "bar" },

## `show`able Objects

TODO -- use [this page](http://en.wikipedia.org/wiki/List_of_musical_symbols) 

Don't forget to talk about notes, chords, and things that affect both.

## `begin`able Objects

### `tuplet`

`begin: 'tuplet'` draws a tuplet above the notes it groups. The `beats`
parameter contains the text to draw on the tuplet bar.

For example, the following three notes will be grouped into a triplet:

    { begin: 'tuplet', beats: '3' },
    
    { show: 'note', length: 'eighth', pitch: 'C4' },
    { show: 'note', length: 'eighth', pitch: 'C5' },
    { show: 'note', length: 'eighth', pitch: 'C6' },

    { end: 'tuplet' },

Note that, if you're adding an irregular rhythm to a group of notes that is
already barred together, you can use the `beats` parameter of the `begin:
'bar'` command described below to draw an irregular rhythm above the bar.

### `slur`

`begin: 'slur'` draws a slur line above or below the notes it groups. It does
not take any parameters (i.e. `{ show: 'slur' }` and `{ end: 'slur' }` are
sufficient to display a slur). 

`begin: 'slur'` can also be used for ties -- just `slur` together two
consectuve notes of the same pitch. 

## Breaking a Line

Sometimes it's useful to be able to instruct the renderer to start a new staff,
even if the next measure can fit into the current staff. You can do this by
adding a `break: 'line'` command before said measure:

     1      { show: 'note', pitch: 'B5', length: 'quarter' },
     2      { show: 'note', pitch: 'A5', length: 'quarter' },
     3      { show: 'note', pitch: 'G4', length: 'half' },
     4      { show: 'measure' },
     5
     6      { break: 'line' },
     7
     8      { show: 'note', pitch: 'B5', length: 'quarter' },
     9      { show: 'note', pitch: 'A5', length: 'quarter' },
    10      { show: 'note', pitch: 'G4', length: 'half' },
    11      { show: 'measure' },

## TODO

Would we ever want to nest group objects? If so, we need a `named: ` parameter
for the `begin` and `end` commands. Otherwise the end command will be
ambiguous.

