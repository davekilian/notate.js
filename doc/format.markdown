
JSON Representation
===================

This document describes the JSON representation for documents that can
be rendered by notate.js.

### Note

notate.js is just a rendering engine; it does not understand your
document beyond what it needs to render it. If you want to validate your
document (e.g. check the number of beats per measure matches the time
signature), you're on your own! :)

### Format

A document is just a list of measures, each of which is an object.
The measures in the list are specified in the order they should be rendered.

    [
        { ... },    // First measure
        { ... },    // Second measure
    ]

Mesure objects contain some metadata and a list of notes, each of which is 
also an object:

    {
        "clef": "treble",
        "timesig-over": 6,
        "timesig-under": 8,
        // ... (other metadata)
        "notes": 
        [
            { ... },    // First note
            { ... },    // Second note
        ]
    }

Measure metadata is applied modally. That is, if the first measure in the 
docuemnt specifies the "clef" attribute, then the rest of the measures 
afterward inherit that clef value. If a measure halfway through the document
changes the clef attribute, then all the measures after that measure inherit
the new clef value.

Redundantly specifying measure metadata (e.g. "clef", "timesig-...") will cause
relevant glyphs to be rendered again, even if the value of the attribute is the
same as what the measure would have inherited anyway.

Note objects are specified as follows:

    {
        "type": "note",         // or "rest"
        "length": "whole",      // "half", "eighth", ..., "1/4", "1/8", ...
        "dots": 0,              // Number of times the note is dotted
        "pitch": "C4",          // Pitch name and octave
        "accidental": "none",   // "sharp", "flat", "doublesharp", "doubleflat"
        "bar": false,           // Whether this note is barred with the next note
        "slur": false,          // Whether this note is slurred with the next note
    }

### TODO

As more advanced capabilities are added, update the format above. Currently 
missing information like tempo, multi-measure rests, etc.

[This page](http://en.wikipedia.org/wiki/List_of_musical_symbols) is a pretty
good list of things that should eventually make it into the format and then
the rendering engine.

Will need to fundamentally change the format a bit to support systems.

