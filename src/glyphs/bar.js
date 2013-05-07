
//
// bar glyph
//
// A bar line. Can be a single bar line (to end a measure) or a bold bar line
// (to end a document)
//

(function(Notate) {

    var Bar = function() {
        Notate.Glyph.call(this);
    }

    Bar.prototype = new Notate.Glyph();
    Bar.constructor = Bar;
    Notate.glyphs['bar'] = Bar;

    Bar.prototype.parseCommand = function(cmd, ctype) { }

    Bar.prototype.minSize = function() {
        var s = Notate.settings;

        return {
            top: 0,
            bottom: (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING,
            left: 0,
            right: 0,
        };
    }

    Bar.prototype.layout = function() { }

    Bar.prototype.render = function(canvas, ctx) {
        var s = Notate.settings;

        ctx.fillRect(this.x, this.y, s.BAR_LINE_WIDTH, s.STAFF_HEIGHT);
    }
    
})(Notate);

