
//
// staff glyph
//
// The staff glyph contains measures and renders the staff lines on top of
// which individual notes are drawn.
//

(function(Notate) {

    Notate.sizeCallback['staff'] = function() { 
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

    Notate.layoutCallback['staff'] = function(staff) {
        var s = Notate.settings;
        var x = s.NOTE_SPACING;

        for (var i = 0; i < staff.children.length; ++i) {
            var glyph = staff.children[i];

            if (glyph.type == 'note') {
                var note = glyph;
                note.pitchDelta = pitchDelta(note.pitch, 'treble');
                note.x = x;
                note.y = pitchOffset(note.pitchDelta);

                x += s.NOTE_SPACING;
            } else if (glyph.type == 'end-measure') {
                var measure = glyph;
                measure.x = x;
                measure.y = 0;

                x += s.NOTE_SPACING;
            }
        }
    }

    Notate.renderCallback['staff'] = function(canvas, ctx, staff, x, y) {
        var s = Notate.settings;
        var lines = s.STAFF_LINE_COUNT;
        var w = staff.width();

        var s = Notate.settings;

        for (var i = 0; i < s.STAFF_LINE_COUNT; ++i) {
            var dh = i * s.STAFF_LINE_SPACING;
            ctx.fillRect(x, y + dh, w, s.STAFF_LINE_HEIGHT);
        }

        ctx.fillRect(x, y, s.BAR_LINE_WIDTH, s.STAFF_HEIGHT);
    }

})(Notate);

