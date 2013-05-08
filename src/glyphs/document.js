
// 
// document glyph
//
// The document glyph exists only to be the root of the glyph tree.
// It helps with Notate.layout(), but has no rendering behavior.
//

(function(Notate) {

    var Document = function() {
        Notate.Glyph.call(this);
    }

    Document.prototype = new Notate.Glyph();
    Document.prototype.constructor = Document;
    Notate.glyphs['document'] = Document;

    Document.prototype.parseCommand = function(cmd, ctype) { }

    Document.prototype.minSize = function() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    Document.prototype.layout = function() { }

    Document.prototype.render = function(canvas, ctx) { }

    //
    // Returns the amount of horizontal space that would be needed by the
    // glyphs in the given list if they were placed next to each other in a
    // staff.
    //
    function measureGlyphs(glyphs) {
        var staff = new Notate.glyphs['staff']();
        staff.children = glyphs;
        staff.layout();

        var bounds = new Notate.Rect();
        for (var i = 0; i < staff.children.length; ++i) {
            bounds.union(staff.children[i]);
        }

        return bounds.width();
    }

    //
    // Helper for 'finishing' a staff after we have determined we will not be
    // adding any more measures to it. This entails computing the staff's final
    // position and bounding box
    //
    function finishStaff(staff, prev) {
        var s = Notate.settings;

        // Compute the staff's bounding box
        staff.layout();
        for (var i = 0; i < staff.children.length; ++i)
            staff.union(staff.children[i]);

        // Move the staff into position
        var x = s.MARGIN_HORIZ;
        var y = 0;

        if (!prev)
            y = Math.floor(s.MARGIN_VERT - staff.top);
        else
            y = Math.floor((prev.y + prev.bottom) + s.STAFF_SPACING - staff.top);

        staff.moveTo(x, y);

        // Move the last end-measure bar to the end of the staff
        var last = staff.children[staff.children.length - 1];
        last.x = staff.x + staff.width();
    }

    //
    // function addMeasure()
    //
    // Adds a measure of glyphs to this document, creating a new staff if
    // necessary. This function is called as a subroutine in Notate.layout(),
    // and is not intended for public use.
    //
    Document.prototype.addMeasure = function(glyphs) {
        var s = Notate.settings;

        // See if we can fit the measure into an existing staff
        if (this.children.length > 0) {
            var staff = this.children[this.children.length - 1];
            var oldWidth = measureGlyphs(staff.children);
            var remaining = staff.width() - oldWidth;

            var newWidth = measureGlyphs(glyphs);
            if (newWidth < remaining) {
                for (var i = 0; i < glyphs.length; ++i) {
                    staff.addChild(glyphs[i]);
                }

                return;
            }
            else {
                // We couldn't fit the measure in this staff.
                // Finish this staff so we can add a new one below
                var len = this.children.length;
                var finished = this.children[len - 1];
                var prev = (len > 1) ? this.children[len - 2] : null;

                finishStaff(finished, prev);
            }
        }

        // The measure doesn't fit, or there is no staff. Create a new one.
        var staff = new Notate.glyphs['staff']();
        staff.right = this.width() - 2 * s.MARGIN_HORIZ;
        for (var i = 0; i < glyphs.length; ++i) {
            staff.addChild(glyphs[i]);
        }

        this.addChild(staff);
    }

    //
    // function finish()
    //
    // Adds the end bar to the document and finalizes staff positioning.
    // This function is called as a subroutine to Notate.layout(), and is not
    // intended for public use.
    //
    Document.prototype.finish = function() {
        var len = this.children.length;
        if (len == 0) {
            return;
        }

        var finished = this.children[len - 1];
        var prev = (len > 1) ? this.children[len - 2] : null;

        finishStaff(finished, prev);
    }

})(Notate);

