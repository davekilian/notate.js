
//
// tuplet glyph
//
// Renders a tuplet marker for a group of notes.
// Intended for groups of notes that aren't barred together; 
// in that case, you can use the bar glyph's tuplet property.
//

(function(Notate) {

    var Tuplet = function() {
        Notate.Glyph.call(this);
    }

    Tuplet.prototype = new Notate.Glyph();
    Tuplet.constructor = Tuplet;
    Notate.glyphs['tuplet'] = Tuplet;

    Tuplet.prototype.parseCommand = function(cmd, ctype) {
        this.beats = cmd.beats;
    }

    Tuplet.prototype.minSize = function() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    Tuplet.prototype.layout = function() {
        var s = Notate.settings;

        // If we don't have any targets, not much we can do ...
        if (this.targets.length == 0) {
            console.log("Warning: not rendering empty tuplet");
            return;
        }

        // Set the Y coordinate to the top of the staff
        var y = this.parent.y;

        // Find the left/right boundaries.
        // Also raise the Y coordinate if there are notes above the staff
        var left = Infinity, 
            right = -Infinity;

        for (var i = 0; i < this.targets.length; ++i) {
            var c = this.targets[i],
                cleft = c.x + c.left,
                cright = c.x + c.right,
                ctop = c.y + c.top;

            if (cleft < left) {
                left = cleft;
            }

            if (cright > right) {
                right = cright;
            }

            if (ctop < y) {
                y = ctop;
            }
        }

        var x = left;
        y -= s.TUPLET_VMARGIN;
        this.moveTo(x, y);

        this.top = -s.TUPLET_HEIGHT;
        this.bottom = 0;
        this.left = 0;
        this.right = right - left;
    }

    function hline(ctx, x0, x, y) {
        var s = Notate.settings;

        ctx.fillRect(x0, y, x - x0, s.TUPLET_THICKNESS);
    }

    function vline(ctx, x, y0, y) {
        var s = Notate.settings;

        ctx.fillRect(x, y0, s.TUPLET_THICKNESS, y - y0);
    }

    Tuplet.prototype.render = function(canvas, ctx) {
        var s = Notate.settings;

        // Draw the text
        ctx.font = s.FONT_STYLE + ' ' + s.TUPLET_FONT_SIZE + 'px ' + s.FONT_FAMILY;
        ctx.textBaseline = 'middle';

        var text = this.beats;
        var size = ctx.measureText(text);

        var x = this.x + .5 * (this.width() - size.width);
        var y = this.y + .5 * this.height();

        ctx.fillText(text, x, y);

        // Draw the horizontal grouping lines
        hline(ctx, 
              this.x + s.TUPLET_HMARGIN,
              x - s.TUPLET_FONT_MARGIN,
              this.y + .5 * this.height());

        hline(ctx,
              x + size.width + s.TUPLET_FONT_MARGIN,
              this.x + this.width() - s.TUPLET_HMARGIN,
              this.y + .5 * this.height());

        // Draw the vertical lines
        if (!this.startsWithLineBreak) {
            vline(ctx,
                  this.x + s.TUPLET_HMARGIN,
                  this.y + .5 * this.height(),
                  this.y + this.height());
        }

        if (!this.endsWithLineBreak) {
            vline(ctx,
                  this.x + this.width() - s.TUPLET_HMARGIN,
                  this.y + .5 * this.height(),
                  this.y + this.height());
        }

        /*
        this.TUPLET_VMARGIN = 22;
        this.TUPLET_HMARGIN = 3;
        this.TUPLET_HEIGHT = 15;
        this.TUPLET_FONT_SIZE = 12;
        this.TUPLET_FONT_MARGIN = 5;
        this.TUPLET_THICKNESS = 1;
         */
    }

})(Notate);

