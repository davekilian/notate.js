
var Notate = (function() {

    var Notate = { };


    /** The maximum number of ticks a 4/4 measure can contain.
      * All time in Notate is measured in ticks; this parameter controls
      * the granularity of time -- the shortest note Notate can handle
      * is a (TICKS_PER_WHOLE_NOTE)th note, e.g. a 128th note.
      */
    Notate.TICKS_PER_WHOLE_NOTE = 128;
    var TICKS_PER_WHOLE_NOTE = Notate.TICKS_PER_WHOLE_NOTE;

    /** class Pitch
      *
      * Denotes the pitch of a note.
      *
      * Pitch.step      string  The note letter of this pitch (ABCDEFG)
      * Pitch.octave    int     The octave number of this pitch (1-9)
      */

    Notate.Pitch = function(step, octave) {
        this.step = step;
        this.octave = octave;
    }

    /** Converts this pitch to a pitch string, e.g. 'A4' */
    Notate.Pitch.prototype.toString = function() {
        return step.toString() + octave.toString();
    }

    /** Parses a pitch string (e.g. 'A4') and returns a pitch object */
    Notate.Pitch.fromString = function(str) {
        return new Notate.Pitch(str.substring(0, 1), 
                                parseInt(str.substring(1)));
    }


    /** class TimeSignature
      *
      * Represents a time signature. Although time signatures contain a
      * numerator and a denominator, Notate currently renders all music
      * as if the denominator is 4 (i.e. the quarter note always gets
      * the beat). This will be updated in the future.
      *
      * TimeSignature.over  int The number of beats per measure
      * TimeSignature.under int The note value that 'gets' the beat
      */

    Notate.TimeSignature = function(over, under) {
        this.over = over;
        this.under = under;
    }

    /** Returns whether the time signature is common time (4/4) */
    Notate.TimeSignature.prototype.isCommonTime = function() {
        return over = 4 && under = 4;
    }

    /** Returns whether the time signature is common time (2/2) */
    Notate.TimeSignature.prototype.isCutTime = function() {
        return over = 2 && under = 2;
    }

    /** Returns the total number of ticks in any measure whose time
      * signature matches the time signature in this object
      */
    Notate.TimeSignature.prototype.ticksPerMeasure = function() {
        return TICKS_PER_WHOLE_NOTE * over / 4;
    }


    /** Denotes the type of a note. This is determined automatically by Notate.Note
      * by parsing its tick length
      */
    Notate.NoteType = {
        WHOLE:              { name: "Whole", ticks: TICKS_PER_WHOLE_NOTE },
        HALF:               { name: "Half", ticks: TICKS_PER_WHOLE_NOTE / 2 },
        QUARTER:            { name: "Quarter", ticks: TICKS_PER_WHOLE_NOTE / 4 },
        EIGHTH:             { name: "Eighth", ticks: TICKS_PER_WHOLE_NOTE / 8 },
        SIXTEENTH:          { name: "Sixteenth", ticks: TICKS_PER_WHOLE_NOTE / 16 },
        THIRTYSECOND:       { name: "32nd", ticks: TICKS_PER_WHOLE_NOTE / 32 },
        SIXTYFOURTH:        { name: "64th", ticks: TICKS_PER_WHOLE_NOTE / 64 },
        ONETWENTYEIGHTH:    { name: "128th", ticks: TICKS_PER_WHOLE_NOTE / 128 },
    };

    /** Contains information needed to render notes by type */
    var RenderAttributes = { 
        WHOLE:              { hollowBase: true, stem: false, tails: 0, },
        HALF:               { hollowBase: true, stem: true, tails: 0, },
        QUARTER:            { hollowBase: false, stem: true, tails: 0, },
        EIGHTH:             { hollowBase: false, stem: true, tails: 1, },
        SIXTEENTH:          { hollowBase: false, stem: true, tails: 2, },
        THIRTYSECOND:       { hollowBase: false, stem: true, tails: 3, },
        SIXTYFOURTH:        { hollowBase: false, stem: true, tails: 4, },
        ONETWENTYEIGHTH:    { hollowBase: false, stem: true, tails: 5, },
    };

    (function() {
        var i = 0;
        for (var key in Notate.NoteType) {
            Notate.NoteType[key].key = key.toString();
            Notate.NoteType[key].value = i++;
            Notate.NoteType[key].render = RenderAttributes[key];

            RenderAttributes[key].key = key.toString();
            RenderAttributes[key].type = Notate.NoteType[key];
        }
    }());


    /** class Note
      *
      * Notes are the basic building blocks of notate.js documents. They
      * denote both played notes (which have a pitch and beat count) and
      * rests (which have just a best count).
      *
      * Note.isRest bool            True if this note is a rest, false if 
      *                             it is played
      * Note.pitch  Notate.Pitch    This note's pitch. Ignored if this note
      *                             is a rest.
      * Note.length int             The duration of this note in ticks.
      * Note.type   Notate.NoteType The semantic type of this note
      * Note.dots   int             The number of times this note is dotted
      */

    Notate.Note = function(rest, pitch, length) {
        this.rest = rest;
        this.pitch = pitch;
        this.length = length;
        calcType();
    }

    /** Returns the length of this note in beats rather than ticks.
     *
      * Unlike ticks, which are always integral, beats may be fractional.
      * Therefore the results of this method are reported is floating point.
      *
      * The result of this method is undefined if the note has not been
      * added to a measure yet (i.e. if this.measure == null).
     */
    Notate.Note.prototype.beatLength = function() {
        var time = measure.timeSignature;
        var ticksPerBeat = TICKS_PER_WHOLE_NOTE / time.under;

        return 1.0 * length / ticksPerBeat;
    }

    /** Calculates this note's lenght property to determine the note's 
      * type and dots properties. Should be called after updating this
      * note's length property. Called automatically by Note's constructor
      */
    Notate.Note.prototype.calcType = function() { 
        this.type = null;
        this.dots = 0;

        var rem = length;
        var nextDot = 0;

        for (var key in Notate.NoteType) {
            type = Notate.NoteType[key];
            if (type.ticks <= rem) {
                this.type = type;
                rem -= type.ticks;
                nextDot = type.ticks / 2;
            }
        }

        while (nextDot < rem) {
            rem -= nextDot;
            nextDot /= 2;
            ++this.dots;
        }
    }


    /** class Measure 
      *
      * Represents a measure. In addition to a series of notes, Measures
      * contain metadata like time signatures, key signatures and dynamics.
      *
      * One should always use Measure.append() to add new notes to a measure;
      * directly modifying Measure.notes may have unintended side effects.
      * If the notes in a measure sum to more beats than the measure itself,
      * the behavior of this library is undefined.
      *
      * If the notes in a measure sum to fewer beats than the measure itself,
      * the remaining time is placed in an implied rest at the end of a measure.
      * For example, a 4/4 measure containing only a quarter note has 3 beats 
      * of implied rest at the end.
      */

    Notate.Measure = function(timeSignature) {
        this.timeSignature = timeSignature;
        this.notes = [ ];
    }

    /** Gets the length, in ticks, of the implied rest at the end of this
      * measure (see the doc comment for the Measure object for more).
      */
    Notate.Measure.prototype.impliedRestLength = function() {
        var rem = timeSignature.ticksPerMeasure();
        for (var i = 0; i < notes.length; ++i)
            rem -= notes[i].length;

        return rem < 0 ? 0 : rem;
    }

    /** Returns whether or not this method consists only of a single,
      * implied rest. 
      *
      * The renderer detects strings of Measures that return true
      * for isRest(), and combines them into a single multi-measure
      * rest.
      */
    Notate.Measure.prototype.isRest = function() {
        return notes.length == 0;
    }

    /** Appends a note to this measure. If the note is too long for this
      * measure, it is truncated to fit within this measure (this directly
      * modifies the parameter passed to the method).
      *
      * As a side effect, sets the note's Note.measure property
      *
      * note    Notate.Note     The note to add to the end of this measure
      */
    Notate.Measure.prototype.append = function(note) {
        var rem = impliedRestLength();
        if (note.length > rem)
            note.length = rem;

        if (note.length > 0) {
            notes.push(note);
            note.measure = this;
        }
    }


    /** class Document 
      *
      * A Document represents an entire piece, and is composed of a list
      * of measures, each containing notes and other information. Most
      * common operations are performed at the document level, since this
      * object can split and merge measures to accomodate notes as needed.
      */

    Notate.Document = function(defaultTimeSignature) {
        this.measures = [ ];
        this.defaultTimeSignature = defaultTimeSignature;
    }

    /** Appends a new note or rest with the given pitch and duration to the
      * end of this document.
      *
      * If the document is empty, a new measure is created with the
      * document's default time signature, and the note is added to
      * that measure. Otherwise, appends the note to the last measure
      * in the document, creating a new measure(s) and splitting the note
      * if necessary.
      *
      * pitch       Notate.Pitch    The note's pitch. If null, the method
      *                             adds a rest instead of a note
      * numBeats    double          The duration of the new note in beats
      */
    Notate.Document.prototype.append = function(pitch, numBeats) {

        var isRest = pitch != null;

        function createNote(timeSignature) {
            var EPSILON = 1e-3;
            var ticksPerBeat = TICKS_PER_WHOLE_NOTE / timeSignature.under;
            var tickCount = int(ticksPerBeat * (numBeats + EPSILON));

            return new Notate.Note(isRest, pitch, tickCount);
        }

        function lastMeasure() {
            if (measures.length == 0)
                return null;

            return measures[measures.length - 1];
        }

        function ticksRemaining() {
            var last = lastMeasure();
            if (!last)
                return 0;

            return last.impliedRestLength();
        }

        var note = createNote(lastMeasure.timeSignature);

        while (note.length > 0) {
            if (ticksRemaining() == 0) {
                measures.push(
                    new Notate.Measure(lastMeasure().timeSignature));
            }

            if (note.length <= ticksRemaining()) {
                lastMeasure().append(note);
            } else {
                var leftover = note.length - ticksRemaining();
                note.length -= leftover;
                lastMeasure().append(note);
                note = new Notate.Note(isRest, pitch, leftover);
            }
        }
    }

    /** Renders the document's contents as sheet music to a <canvas> element.
      * canvas              A reference to an HTML5 canvas DOM element
      * mayExtend   bool    Whether this function may vertically expand the
      *                     canvas element to fit the contents of the document
      */
    Notate.Document.prototype.render = function(canvas, mayExtend) {

    }


    return Notate;

}());

document.write("ok");

