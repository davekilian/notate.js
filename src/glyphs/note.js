
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
    Notate.glyphs['note'] = Note;

    Note.prototype.size = function() {
        var s = Notate.settings;
        var r = s.NOTE_HEAD_RADIUS_MAX;

        return { top: -r, bottom: r, left: -r, right: r };
    }

    Note.prototype.layout = function() {
        var s = Notate.settings;

        var mid = -s.STAFF_LINE_COUNT;  // * 2 = num half steps
                                        // * 2 / 2 = midpoint
        var flipped = this.pitchDelta > mid;

        if (flipped) {  // Stem points down
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];

                if (child.type() == 'stem') {
                    child.x = -s.STEM_OFFSET - 1.0;
                    child.y = s.NOTE_STEM_HEIGHT + 1.0;

                } else if (child.type() == 'flags') {
                    child.x = -s.STEM_OFFSET - 1.0;
                    child.y = s.NOTE_STEM_HEIGHT + 1.0;
                    child.flipped = true;
                }
            }
        } else {    // Stem points up
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];

                if (child.type() == 'stem') {
                    child.x = s.STEM_OFFSET;

                } else if (child.type() == 'flags') {
                    child.x = s.STEM_OFFSET;
                    child.y = -s.NOTE_STEM_HEIGHT;
                }
            }
        }
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
        ctx.fillStyle = '#000';
    }

    function renderLedgers(canvas, ctx, x, y, note) {
        var s = Notate.settings;
        var dy = note.dy;
        y -= dy;

        var h = (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING;
        if (dy >= 0 && dy <= h)
            return;

        var min = 0, max = 0;

        if (dy < 0) {
            min = y + dy - (dy % s.STAFF_LINE_SPACING);
            max = y;
        } else {
            min = y + h + s.STAFF_LINE_SPACING;
            max = y + dy;
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

        renderLedgers(canvas, ctx, this.x, this.y, this);

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

