
//
// measure glyph
//
// Measures contain their child notes, plus any special glyphs that need to
// appear within the measure (tempo markers, clef symbols, etc). Measures are
// responsible for rendering the vertical bars that divide the piece's
// measures.
//

(function(Notate) {

    Notate.sizeCallback["measure"] = function() {
        var s = Notate.settings;

        return {
            top: 0,
            bottom: (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING,
            left: 0,
            right: 0,
        };
    }

    Notate.layoutCallback['measure'] = function(measure) {
        var s = Notate.settings;
        var x = s.NOTE_SPACING;

        for (var i = 0; i < measure.children.length; ++i) {
            var note = measure.children[i];
            note.x = x;
            note.y = 20.5;    // TODO determine based on pitch

            x += s.NOTE_SPACING;
        }

        measure.right = x;
    }

    Notate.renderCallback['measure'] = function(canvas, ctx, measure, x, y) {
        var s = Notate.settings;

        ctx.fillRect(x + measure.width() - s.BAR_LINE_WIDTH, 
                     y,
                     s.BAR_LINE_WIDTH,
                     s.STAFF_HEIGHT);
    }
    
})(Notate);

