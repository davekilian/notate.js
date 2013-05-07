
//
// staff glyph
//
// The staff glyph contains measures and renders the staff lines on top of
// which individual notes are drawn.
//

(function(Notate) {

    var Staff = function() {
        Notate.Glyph.call(this);
    }

    Staff.prototype = new Notate.Glyph();
    Staff.prototype.constructor = Staff;
    Notate.glyphs['staff'] = Staff;

    Staff.prototype.parseCommand = function(cmd, ctype) { }

    Staff.prototype.minSize = function() {
        var s = Notate.settings;

        return {
            top: 0,
            bottom: (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING,
            left: 0,
            right: 0,
        };
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

    Staff.prototype.layout = function() {
        var s = Notate.settings;
        var x = s.NOTE_SPACING;

        for (var i = 0; i < this.children.length; ++i) {
            var glyph = this.children[i];

            if (glyph.type() == 'note') {
                var note = glyph;
                note.pitchDelta = pitchDelta(note.pitch, 'treble');
                note.pitchOffset = pitchOffset(note.pitchDelta);

                note.moveTo(x, note.pitchOffset);
                x += s.NOTE_SPACING;
            } else if (glyph.type() == 'bar') {
                var bar = glyph;
                bar.moveTo(x, 0);

                x += s.NOTE_SPACING;
            }
        }
    }

    Staff.prototype.render = function(canvas, ctx) {
        var s = Notate.settings;
        var lines = s.STAFF_LINE_COUNT;
        var w = this.width();
        var x = this.x,
            y = this.y;

        for (var i = 0; i < s.STAFF_LINE_COUNT; ++i) {
            var dh = i * s.STAFF_LINE_SPACING;
            ctx.fillRect(x, y + dh, w, s.STAFF_LINE_HEIGHT);
        }

        ctx.fillRect(x, y, s.BAR_LINE_WIDTH, s.STAFF_HEIGHT);
    }

})(Notate);

