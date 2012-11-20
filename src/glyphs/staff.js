
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

    Notate.layoutCallback['staff'] = function(staff) { }

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

