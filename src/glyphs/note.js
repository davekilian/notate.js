
//
// note glyph
//
// The note glyph acts as the root for a node. The glyph itself renders the
// note head, but stems and flags (if applicable) are rendered as children of
// the note glyph -- see stem.js, flags.js. 
//

(function(Notate) {

    Notate.sizeCallback['note'] = function() {
        var s = Notate.settings;
        var r = s.NOTE_HEAD_RADIUS_MAX;

        return { top: -r, bottom: r, left: -r, right: r };
    }

    Notate.layoutCallback['note'] = function(note) {
        var s = Notate.settings;

        for (var i = 0; i < note.children.length; ++i) {
            var child = note.children[i];

            if (child.type == 'stem') {
                child.x = s.STEM_OFFSET;
            } else if (child.type == 'flags') {
                child.x = s.STEM_OFFSET;
                child.y = -s.NOTE_STEM_HEIGHT;
            }
        }
    }

    function renderNoteHeadOuter(canvas, ctx, x, y, rotation) {
        var s = Notate.settings;

        ctx.save();

        ctx.translate(x, y);
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

        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(1.0 * maxRadius / minRadius, 1.0);

        ctx.beginPath();
        ctx.arc(0, 0, minRadius, 0, 6.28, false);
        ctx.fill();

        ctx.restore();
        ctx.fillStyle = '#000';
    }

    Notate.renderCallback['note'] = function(canvas, ctx, note, x, y) {
        // n.b. This renders the note head, with the origin at the center of the note head.
        //      Stems, flags, bars and dots are all children of the note glyph.
   
        var s = Notate.settings;

        var rotation = (note.length == "1/1") ? 0 : s.NOTE_HEAD_ROTATION;
        renderNoteHeadOuter(canvas, ctx, x, y, rotation);

        var isHollow = (note.length == "1/1") || (note.length == "1/2");
        if (isHollow) {
            var minRadius, maxRadius;

            if (note.length == "1/1") {
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

