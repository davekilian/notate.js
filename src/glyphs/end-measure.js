
//
// end-measure glyph
//
// A single bar line demarcating the end of a measure
//

(function(Notate) {

    var EndMeasure = function() {
        Notate.Glyph.call(this);
    }

    EndMeasure.prototype = new Notate.Glyph();
    EndMeasure.constructor = EndMeasure;
    Notate.glyphs['end-measure'] = EndMeasure;

    EndMeasure.prototype.minSize = function() {
        var s = Notate.settings;

        return {
            top: 0,
            bottom: (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING,
            left: 0,
            right: 0,
        };
    }

    EndMeasure.prototype.layout = function() { }

    EndMeasure.prototype.render = function(canvas, ctx) {
        var s = Notate.settings;

        ctx.fillRect(this.x, this.y, s.BAR_LINE_WIDTH, s.STAFF_HEIGHT);
    }
    
})(Notate);

