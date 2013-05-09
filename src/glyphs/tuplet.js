
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
        y -= s.TUPLET_MARGIN;
        this.moveTo(x, y);

        this.top = -s.TUPLET_HEIGHT;
        this.bottom = 0;
        this.left = 0;
        this.right = right - left;
    }

    Tuplet.prototype.render = function(canvas, ctx) {
        ctx.fillRect(this.x + this.left, 
                     this.y + this.top,
                     this.width(),
                     this.height());
    }

})(Notate);

