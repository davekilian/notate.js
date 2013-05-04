
//
// stem glyph
//
// The stem glyph renders a note's stem
//
    
(function(Notate) {

    var Stem = function() {
        Notate.Glyph.call(this);
    }

    Stem.prototype = new Notate.Glyph();
    Stem.constructor = Stem;
    Notate.glyphs['stem'] = Stem;

    Stem.prototype.size = function() {
        var s = Notate.settings;

        return { 
            top: -s.NOTE_STEM_HEIGHT, 
            bottom: 0,
            left: 0,
            right: s.NOTE_STEM_WIDTH, 
        };
    }

    Stem.prototype.layout = function() { }

    Stem.prototype.render = function(canvas, ctx) {
        var translate = Notate.Helpers.translate;
        var rect = translate(this, { x: 0, y: 0 }, { x: this.x, y: this.y });
        ctx.fillRect(rect.left, rect.top, rect.width(), rect.height());
    }

})(Notate);

