
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
    Notate.showable['stem'] = Stem;

    Stem.prototype.parseCommand = function(cmd, ctype) { }

    Stem.prototype.minSize = function() {
        var s = Notate.settings;

        return { 
            top: -s.NOTE_STEM_HEIGHT, 
            bottom: 0,
            left: 0,
            right: s.NOTE_STEM_WIDTH, 
        };
    }

    Stem.prototype.layout = function() {
        var s = Notate.settings;

        this.moveTo(this.parent.x, this.parent.y);

        if (this.parent.isFlipped()) {
            this.moveBy(-s.STEM_OFFSET - 1, 
                        s.NOTE_STEM_HEIGHT + 1.0);
        }
        else {
            this.moveBy(s.STEM_OFFSET, 0);
        }
    }

    Stem.prototype.render = function(canvas, ctx) {
        ctx.fillRect(this.x + this.left, 
                     this.y + this.top,
                     this.width(),
                     this.height());
    }

})(Notate);

