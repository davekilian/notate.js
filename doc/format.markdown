
JSON Representation
===================

This document describes the JSON representation for documents that can
be rendered by notate.js.

## Note

notate.js is just a rendering engine; it does not understand your
document beyond what it needs to render it. If you want to validate your
document (e.g. check the number of beats per measure matches the time
signature), you're on your own! :)

## Format

A document consists of a list of glyphs, each of which is an object:

    [
        { ... },    // First glyph
        { ... },    // Second glyph
    ]

A glyph is something can appear inside a staff. Most glyphs are either notes,
rests or measure markers; other glyphs include time / key signatures and codas.

    [
        { type: "clef", clef: "treble" },
        { type: "keysig", key="C major" },
        { type: "timesig", over: 6, under: 8 },
        { ... notes ... },
    ]

Notes are glyphs too. They're a little more complicated:

    {
        type: "note",         // or "rest"
        length: "whole",      // "half", "eighth", ..., "1/4", "1/8", ...
        dots: 0,              // Number of times the note is dotted
        pitch: "C4",          // Pitch name and octave
        accidental: "none",   // "sharp", "flat", "doublesharp", "doubleflat"
    }

Clefs and key signatures affect the document modally; that is, after a treble
clef declaration, all notes encountered will be placed on the treble clef until
the clef is changed by declaring another note.

The `end-measure` glyph denotes the end of a measure (i.e. a single vertical
line). It should be placed after the last note of a measure and the first 
note of the next:

    [
        { type: "note", ... },
        { type: "note", ... },
        { type: "note", ... },
        { type: "note", ... },

        { type: "end-measure" },

        { type: "note", ... },
    ]

## Chords

Chords are a special case of the note object. Instead of `type` `note`, chords
have type `chord`. They also contain multiple pitches:

    {
       type: "chord",
       pitches: [ "C4", "G4" ],
       // (other note flags)
    }

## References

Each glyph has a unique ID, specified by the `id` attribute. If no `id` is
specified in the JSON file, notate will auto-assign one for future use. IDs
must be unique throughout the document.

Some glyphs depend on other glyphs. For example, bar and slur glyphs bar notes
together and slur notes together (respectively) -- in order to do their jobs,
they need to know which notes they're barring and slurring together. They do
this simply by referring to the IDs of the glyphs they group.

## Groupings

Since manually choosing IDs for notes can be tedius, notate can do it for you.
As mentioned earlier, notate will auto-assign an ID to any glyph that doesn't
already have an ID. 

An alternate syntax allows you to group glyphs together. For example, the
following example slurs a set of barred eighth notes:


    [
        { type: "group", bar: [
            { type: "group", slur: [
                { ... some note ... },
                { ... some note ... },
                { ... some note ... },
                { ... some note ... },
            ], },
        ], },
    ]

This is shorthand for:

    [
        { type: "note", id: "note1", ... },
        { type: "note", id: "note2", ... },
        { type: "note", id: "note3", ... },
        { type: "note", id: "note4", ... },
        { type: bar, children: [ "note1", "note2", "note3", "note4" ] },
        { type: slur, children: [ "note1", "note2", "note3", "note4" ] },
    ]

## TODO

As more advanced capabilities are added, update the format above. Currently 
missing information like tempo, multi-measure rests, etc.

[This page](http://en.wikipedia.org/wiki/List_of_musical_symbols) is a pretty
good list of things that should eventually make it into the format and then
the rendering engine.

Will need to fundamentally change the format a bit to support systems.

