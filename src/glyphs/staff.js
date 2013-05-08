
//
// staff glyph
//
// The staff glyph contains measures and renders the staff lines on top of
// which individual notes are drawn.
//

(function(Notate) {

    var Staff = function() {
        Notate.Glyph.call(this);

        var s = Notate.settings;
        this.nextChildX = s.NOTE_SPACING;
    }

    Staff.prototype = new Notate.Glyph();
    Staff.prototype.constructor = Staff;
    Notate.glyphs['staff'] = Staff;

    Staff.prototype.addChild = function(child) {
        Notate.Glyph.prototype.addChild.call(this, child);

        child.staffX = this.nextChildX;
        this.nextChildX += Notate.settings.NOTE_SPACING;
    }

    Staff.prototype.parseCommand = function(cmd, ctype) { }

    Staff.prototype.minSize = function() {
        var s = Notate.settings;

        return {
            top: 0,
            bottom: (s.STAFF_LINE_COUNT - 1) * s.STAFF_LINE_SPACING,
            left: 0,
            right: 0,
        };
    }

    Staff.prototype.layout = function() { }

    Staff.prototype.render = function(canvas, ctx) {
        var s = Notate.settings;
        var lines = s.STAFF_LINE_COUNT;
        var w = this.width();
        var x = this.x,
            y = this.y;

        for (var i = 0; i < s.STAFF_LINE_COUNT; ++i) {
            var dh = i * s.STAFF_LINE_SPACING;
            ctx.fillRect(x, y + dh, w, s.STAFF_LINE_HEIGHT);
        }

        ctx.fillRect(x, y, s.BAR_LINE_WIDTH, s.STAFF_HEIGHT);
    }

})(Notate);

