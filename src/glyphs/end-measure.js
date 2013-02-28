
//
// end-measure glyph
//
// A single bar line demarcating the end of a measure
//

(function(Notate) {

    Notate.sizeCallback['end-measure'] = function() {
        var s = Notate.settings;

        return {
            top: 0,
            bottom: (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING,
            left: 0,
            right: 0,
        };
    }


    Notate.layoutCallback['end-measure'] = function(measure) { }

    Notate.renderCallback['end-measure'] = function(canvas, ctx, measure) {
        var s = Notate.settings,
            x = measure.x,
            y = measure.y;

        ctx.fillRect(x, y, s.BAR_LINE_WIDTH, s.STAFF_HEIGHT);
    }
    
})(Notate);

