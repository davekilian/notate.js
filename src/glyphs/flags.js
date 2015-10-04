
// 
// flags glyph
//
// The flags glyph renders one or more flags at the top of a note.
//

(function(Notate) {

    var Flags = function() {
        Notate.Glyph.call(this);
    }

    Flags.prototype = new Notate.Glyph();
    Flags.constructor = Flags;
    Notate.showable['flags'] = Flags;

    Flags.prototype.parseCommand = function(cmd, ctype) { }

    Flags.prototype.minSize = function() {
        var width = 11.2,
            height = 21.5;

        if (this.parent.isFlipped()) {
            return { top: height, bottom: 0, left: width, right: 0 };
        }
        else {
            return { top: 0, bottom: height, left: 0, right: width };
        }
    }

    Flags.prototype.layout = function() {
        var s = Notate.settings;

        this.moveTo(this.parent.x, this.parent.y);

        this.flipped = this.parent.isFlipped();
        if (this.flipped) {
            this.moveBy(-s.STEM_OFFSET - 1,
                        s.NOTE_STEM_HEIGHT + 1);
        }
        else {
            this.moveBy(s.STEM_OFFSET,
                        -s.NOTE_STEM_HEIGHT);
        }
    }

    Flags.prototype.render = function(canvas, ctx) {
        var x = this.x, 
            y = this.y;

        for (var i = 0; i < this.count; ++i) {
            ctx.save();

            if (this.flipped) {
                ctx.translate(x, y - 6 * i);
                ctx.scale(1.0, -1.0);
            } else {
                ctx.translate(x, y + 6 * i);
            }

            ctx.beginPath();
            ctx.moveTo(.6, 0);
            ctx.bezierCurveTo(.6, 0, 0, 1.5, 4.9, 6.2);
            ctx.bezierCurveTo(9.8, 10.8, 9.6, 19.7, 7.3, 21.5);
            ctx.bezierCurveTo(7.3, 21.5, 11.2, 7.8, .9, 7.3);
            ctx.lineTo(.6, 0);
            ctx.closePath();

            ctx.fill();

            ctx.restore();
        }
    }

})(Notate);

