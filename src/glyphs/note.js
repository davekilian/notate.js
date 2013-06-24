
//
// note glyph
//
// The note glyph acts as the root for a node. The glyph itself renders the
// note head, but stems and flags (if applicable) are rendered as children of
// the note glyph -- see stem.js, flags.js. This glyph also handles ledger
// lines.
//

(function(Notate) {

    var Note = function() {
        Notate.Glyph.call(this);
    }

    Note.prototype = new Notate.Glyph();
    Note.constructor = Note;
    Notate.showable['note'] = Note;

    //
    // function toLength(nickname)
    //
    // Translates a note nickname ("whole" or "eighth") into a fraction ("1/1"
    // or "1/8" respectively)
    //
    function toLength(nickname) {
        if (nickname == "whole")        return "1/1";
        if (nickname == "half")         return "1/2";
        if (nickname == "quarter")      return "1/4";
        if (nickname == "eighth")       return "1/8";
        if (nickname == "sixteenth")    return "1/16";
        if (nickname == "thirtysecond") return "1/32";
        if (nickname == "sixtyfourth")  return "1/64";

        return nickname;
    }

    //
    // function hasStem(length)
    //
    // Returns a bool indicating whether a note with a given length has a stem.
    // The input length must be a time division '1/X', where X is a power of 2.
    //
    function hasStem(length) {
        return length != "1/1";
    }

    //
    // function numFlags(length)
    //
    // Returns the number of flags a note with the given length has.
    // The input length must be a time division '1/X', where X is a power of 2.
    //
    function numFlags(length) {
        var denom = parseInt(length.substring(length.indexOf('/') + 1));

        var pow = 0;    // such that length = 1/(2^{pow})
        while (denom > 1) {
            ++pow;
            denom /= 2;
        }

        return pow >= 3 ? pow - 2 : 0;
    }

    function pitchDelta(pitch, clef) {
        var originNote, originPitch;

        if (clef == 'treble') {
            originNote = 'F'.charCodeAt(0);
            originPitch = 5;
        } else {
            console.log('NYI: note pitch on ' + clef + ' clef');
        }

        var note = pitch.charCodeAt(0);
        var octave = parseInt(pitch.charAt(1));

        return 7 * (octave - originPitch) + (note - originNote);
    }

    function pitchOffset(delta) {
        var s = Notate.settings;
        return -delta * .5 * s.STAFF_LINE_SPACING + 0.5;
    }

    //
    // Indicates whether this note's stem is flipped.
    // If true, the stem points down. Otherwise the stem points up.
    //
    Note.prototype.isFlipped = function() {
        var s = Notate.settings;
        var mid = -s.STAFF_LINE_COUNT;  // * 2 = num half steps
                                        // * 2 / 2 = midpoint
        return this.pitchDelta > mid;
    }

    Note.prototype.parseCommand = function(cmd, ctype) {

        // The note itself
        this.length = toLength(cmd.length);
        this.pitch = cmd.pitch;
        this.pitchDelta = pitchDelta(this.pitch, 'treble');
        this.pitchOffset = pitchOffset(this.pitchDelta);

        // Its stem
        if (hasStem(this.length)) {
            this.addChild(new Notate.showable['stem']());
        }

        // Its flags
        var nFlags = numFlags(this.length);
        if (nFlags > 0) {
            var flags = new Notate.showable['flags']();
            flags.count = nFlags;

            this.addChild(flags);
        }
    }

    Note.prototype.minSize = function() {
        var s = Notate.settings;
        var r = s.NOTE_HEAD_RADIUS_MAX;

        return { top: -r, bottom: r, left: -r, right: r };
    }

    Note.prototype.layout = function() {
        var s = Notate.settings;

        this.moveTo(this.staffX,
                    this.pitchOffset);
    }

    function renderNoteHeadOuter(canvas, ctx, x, y, rotation) {
        var s = Notate.settings;

        ctx.save();

        ctx.translate(x - 0.5, y + 0.5);
        ctx.rotate(rotation);
        ctx.scale(1.0 * s.NOTE_HEAD_RADIUS_MAX / s.NOTE_HEAD_RADIUS_MIN, 1.0);

        ctx.beginPath();
        ctx.arc(0, 0, s.NOTE_HEAD_RADIUS_MIN, 0, 6.28, false);
        ctx.fill();

        ctx.restore();
    }

    function renderNoteHeadInner(canvas, ctx, x, y, minRadius, maxRadius, rotation) {
        ctx.fillStyle = '#fff';
        ctx.save();

        ctx.translate(x - 0.5, y + 0.5);
        ctx.rotate(rotation);
        ctx.scale(1.0 * maxRadius / minRadius, 1.0);

        ctx.beginPath();
        ctx.arc(0, 0, minRadius, 0, 6.28, false);
        ctx.fill();

        ctx.restore();
        ctx.fillStyle = '#333';
    }

    function renderLedgers(canvas, ctx, x, y, note) {
        var s = Notate.settings;

        var dy = note.pitchOffset;
        if (dy >= 0 && dy <= h)
            return;

        var noteY = y;
        var staffY = y - dy;
        var h = (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING;

        var min = 0, max = 0;

        if (dy < 0) {   // Ledgers above staff line
            min = Math.floor(noteY - ((dy - 1) % s.STAFF_LINE_SPACING));
            max = Math.floor(staffY);
        }
        else {          // Ledgers below staff line
            min = Math.floor(staffY + h + s.STAFF_LINE_SPACING + 1);
            max = Math.floor(noteY);
        }

        var w = s.LEDGER_WIDTH, h = s.LEDGER_HEIGHT;
        for (var y = min; y <= max; y += s.STAFF_LINE_SPACING) {
            ctx.fillRect(x - .5 * w, y, w, h);
        }
    }

    Note.prototype.render = function(canvas, ctx) {
        // n.b. This renders the note head, with the origin at the center of the note head.
        //      Stems, flags, bars and dots are all children of the note glyph.
   
        var s = Notate.settings,
            x = this.x,
            y = this.y;

        renderLedgers(canvas, ctx, x, y, this);

        var rotation = (this.length == "1/1") ? 0 : s.NOTE_HEAD_ROTATION;
        renderNoteHeadOuter(canvas, ctx, x, y, rotation);

        var isHollow = (this.length == "1/1") || (this.length == "1/2");
        if (isHollow) {
            var minRadius, maxRadius;

            if (this.length == "1/1") {
                minRadius = s.WHOLENOTE_INNER_RADIUS_MIN;
                maxRadius = s.WHOLENOTE_INNER_RADIUS_MAX;
                rotation = s.WHOLENOTE_INNER_ROTATION;
            } else {
                minRadius = s.HALFNOTE_INNER_RADIUS_MIN;
                maxRadius = s.HALFNOTE_INNER_RADIUS_MAX;
            }

            renderNoteHeadInner(canvas, ctx, x, y, minRadius, maxRadius, rotation);
        }
    }

})(Notate);

