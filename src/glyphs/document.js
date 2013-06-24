
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
    Notate.showable['document'] = Document;

    Document.prototype.parseCommand = function(cmd, ctype) { }

    Document.prototype.minSize = function() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    Document.prototype.layout = function() { }

    Document.prototype.render = function(canvas, ctx) { }

    //
    // Recursively computes the positions and sizes of the glyph's subtree,
    // then determines the glyph's size (the union of its minimum size and the
    // bounding rectangles of all its descendents)
    //
    function layoutGlyph(glyph) {

        // Size and lay out the children glyph subtrees
        for (var i = 0; i < glyph.children.length; ++i)
            layoutGlyph(glyph.children[i]);

        // Determine where children of this glyph belong
        glyph.layout();

        // Expand the glyph's bounding rect to hold its children
        var minbounds = glyph.minSize();
        minbounds.x = glyph.x;
        minbounds.y = glyph.y;
        glyph.union(minbounds);

        for (var i = 0; i < glyph.children.length; ++i) {
            glyph.union(glyph.children[i]);
        }
    }

    //
    // Returns the amount of horizontal space that would be needed by the
    // glyphs in the given list if they were placed next to each other in a
    // staff.
    //
    function measureGlyphs(glyphs) {
        var staff = new Notate.showable['staff']();

        var parents = [ ];
      
        for (var i = 0; i < glyphs.length; ++i) {
            parents.push(glyphs[i].parent);
            staff.addChild(glyphs[i]);
        }

        layoutGlyph(staff);

        for (var i = 0; i < glyphs.length; ++i) {
            glyphs[i].parent = parents[i];
        }

        return staff.width();
    }

    //
    // Helper for 'finishing' a staff after we have determined we will not be
    // adding any more measures to it. This entails computing the staff's final
    // position and bounding box
    //
    function finishStaff(staff, prev) {
        var s = Notate.settings;

        // Lay out the staff's children
        layoutGlyph(staff);

        // Move the staff into position
        var x = s.MARGIN_HORIZ;
        var y = 0;

        if (!prev)
            y = Math.floor(s.MARGIN_VERT - staff.top);
        else
            y = Math.floor((prev.y + prev.bottom) + s.STAFF_SPACING - staff.top);

        staff.moveTo(x, y);

        // Move the last end-measure bar to the end of the staff
        for (var i = staff.children.length - 1; i >= 0; --i) {
            var c = staff.children[i];

            if (c.type() == 'bar') {
                c.x = staff.x + staff.width();
                break;
            }
        }
    }

    //
    // function needsLineBreakFor()
    //
    // Returns a value indicating whether the caller needs to call
    // Document.breakLine() before calling Document.addMeasure() on the given
    // glyphs. This function is called as a subroutine in Notate.layout(), and
    // is not intended for public use.
    //
    // @param glyphs    The glyphs that will be added next time the caller
    //                  calls Document.addMeasure()
    //
    Document.prototype.needsLineBreakFor = function(glyphs) {
        if (this.children.length == 0) {
            return true;
        }

        var staff = this.children[this.children.length - 1];
        var oldWidth = measureGlyphs(staff.children);
        var remaining = staff.width() - oldWidth;

        var newWidth = measureGlyphs(glyphs);

        return newWidth > remaining;
    }

    //
    // function breakLine()
    //
    // Finishes the current staff and creates a new, empty one. Future calls to
    // addMeasure() will add to this newly-created staff. This function is
    // called as a subroutine in Notate.layout(), and is not intended for
    // public use.
    //
    Document.prototype.breakLine = function() {
        var s = Notate.settings;

        // Finish the old staff
        if (this.children.length > 0) {
            var len = this.children.length;
            var finished = this.children[len - 1];
            var prev = (len > 1) ? this.children[len - 2] : null;

            finishStaff(finished, prev);
        }

        // Add a new staff
        var staff = new Notate.showable['staff']();
        staff.right = this.width() - 2 * s.MARGIN_HORIZ;

        this.addChild(staff);
    }

    //
    // function addMeasure()
    //
    // Adds a measure of glyphs to this document, creating a new staff if
    // necessary. This function is called as a subroutine in Notate.layout(),
    // and is not intended for public use.
    //
    Document.prototype.addMeasure = function(glyphs) {
        var staff = this.children[this.children.length - 1];

        for (var i = 0; i < glyphs.length; ++i) {
            staff.addChild(glyphs[i]);
        }
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

