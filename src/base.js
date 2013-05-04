
var Notate = (function() {

    //
    // class Settings
    //
    // Contains constants used for sizing and positioning glyphs in the
    // layout and render engines
    //
    var Settings = function() {
        this.MARGIN_HORIZ = 30;
        this.MARGIN_VERT = 50;
        this.STAFF_LINE_HEIGHT = 1;
        this.STAFF_LINE_SPACING = 8;
        this.STAFF_SPACING = 50;
        this.STAFF_LINE_COUNT = 5;
        this.NOTE_HEAD_RADIUS_MIN = 4;
        this.NOTE_HEAD_RADIUS_MAX = 6;
        this.NOTE_HEAD_ROTATION = -.5;
        this.NOTE_SPACING = 23;
        this.HALFNOTE_INNER_RADIUS_MIN = 2;
        this.HALFNOTE_INNER_RADIUS_MAX = 5;
        this.WHOLENOTE_INNER_RADIUS_MIN = 2.25;
        this.WHOLENOTE_INNER_RADIUS_MAX = 3.25;
        this.WHOLENOTE_INNER_ROTATION = 1;
        this.NOTE_STEM_WIDTH = 1;
        this.NOTE_STEM_HEIGHT = 30;
        this.LEDGER_WIDTH = 18;
        this.LEDGER_HEIGHT = 1;
        this.BAR_LINE_WIDTH = 1;
        this.BAR_BOLD_WIDTH = 3;

        this.STAFF_HEIGHT = (this.STAFF_LINE_COUNT - 1) * this.STAFF_LINE_SPACING 
                          + this.STAFF_LINE_HEIGHT;

        this.STEM_OFFSET = (function(s) {
            var a = s.NOTE_HEAD_RADIUS_MAX,
                b = s.NOTE_HEAD_RADIUS_MIN,
                theta = -s.NOTE_HEAD_ROTATION,
                bCosTheta = b * Math.cos(theta),
                aSinTheta = a * Math.sin(theta);

            return a * b / Math.sqrt(bCosTheta * bCosTheta + aSinTheta * aSinTheta) - 1.0;
        })(this);
    }


    //
    // class Rect
    //
    // Defines a rectangular area in 2D pixel coordinates:
    // - (0, 0) is at the top-left of the canvas
    // - The horizontal axis values increase as you move right
    // - The vertical axis values increase as you move down
    //
    var Rect = function() {
        this.x = 0;         // The X coordinate of this rectangle's origin
        this.y = 0;         // The Y coordinate of this rectangle's origin

        this.top = 0;       // The top bound of this rectangle, relative to this.y
        this.bottom = 0;    // The bototm bound of this rectangle, relative to this.y
        this.left = 0;      // The left bound of this rectangle, relative to this.x
        this.right = 0;     // The right bound of this rectangle, relative to this.x
    }

    // Returns the width of this region
    Rect.prototype.width = function() { return Math.abs(this.right - this.left); }

    // Returns the height of this region
    Rect.prototype.height = function() { return Math.abs(this.bottom - this.top); }

    //
    // Sets this rectangle to the smallest possible rectangle that encompasses
    // both this rectangle and the given rectangle
    //
    // @param rect The other rectangle to union this rectangle with
    //
    Rect.prototype.union = function(rect) {
        function min(a, b) { return a <= b ? a : b; }
        function max(a, b) { return a >= b ? a : b; }

        this.top    = min(this.top, rect.top);
        this.bottom = max(this.bottom, rect.bottom);
        this.left   = min(this.left, rect.left);
        this.right  = max(this.right, rect.right);
    }


    // 
    // class Glyph
    //
    // Node in the intermediate layout tree. Generated in Notate.layout() and
    // rendered in Notate.render().
    //
    // Everything drawn by Notate is a Glyph object. To subclass, override the
    // methods 'size', 'layout' and 'render', and then add your glyph to
    // Notate.glyphs. See some of the stock implementations in src/glyphs for
    // examples.
    // 
    var Glyph = function() {
        Rect.call(this);

        this.children = new Array();    // This Glyph's list of child Glyphs
    }

    Glyph.prototype = new Rect();
    Glyph.constructor = Glyph;

    //
    // Returns this glyph's type string.
    //
    // If you do not implement this method in your Glyph subclass, the base
    // class implementation will fall back by searching Notate.glyphs. If this
    // search doesn't turn up anything, this method will return null.
    //
    Glyph.prototype.type = function() {
        for (var key in Notate.glyphs) {
            if (this instanceof Notate.glyphs[key]) 
                return key;
        }

        return null;
    }

    //
    // TODO this should really be called minSize() or something
    //
    // Returns the minimum bounding box for this glyph, assuming the glyph has
    // no children
    //
    // @return      A rectangle object containing top, bottom, left and right
    //              properties, containing the bounding box sides relative to 
    //              this glyph's origin (i.e. this.x and this.y)
    //
    Glyph.prototype.size = function() {
        console.log("This glyph does not override .size()!");
        console.log(this);
    }

    //
    // Determines the final positions of each of this glyph's children, and
    // then computes the final dimensions of this glyph's bounding box. This
    // method may assume the glyph's children have already been laid out. This
    // method is *not* responsible for recursively calling layout on its
    // children.
    //
    Glyph.prototype.layout = function() {
        console.log("This glyph does not override .layout()!");
        console.log(this);
    }

    //
    // Renders this glyph 
    //
    // @param canvas    The canvas element to render to
    // @param ctx       The canvas2d context associated with the canvas element
    //
    Glyph.prototype.render = function(canvas, ctx) {
        console.log("This glyph does not override .render()!");
        console.log(this);
    }


    //
    // function translate()
    //
    // Translates a rectangle into a different coordinate space
    //
    // @param rect      The rect to translate (an object with top/bottom/left/right)
    // @param src       The origin of rect's coordinate system (an object with x/y)
    // @param dst       The origin of the new coordinate system (object with x/y)
    //
    function translate(rect, src, dst) {
        var dx = dst.x - src.x;
        var dy = dst.y - src.y;

        return { 
            top: rect.top + dy,
            bottom: rect.bottom + dy,
            left: rect.left + dx,
            right: rect.right + dx,

            width: Glyph.prototype.width,
            height: Glyph.prototype.height,
        };
    }

    //
    // function toLength(nickname)
    //
    // Translates a note nickname ("whole" or "eighth") into a fraction ("1/1"
    // or "1/8" respectively)
    //
    function toLength(nickname) {
        if (nickname == "whole")        return "1/1";
        if (nickname == "half")         return "1/2";
        if (nickname == "quarter")      return "1/4";
        if (nickname == "eighth")       return "1/8";
        if (nickname == "sixteenth")    return "1/16";
        if (nickname == "thirtysecond") return "1/32";
        if (nickname == "sixtyfourth")  return "1/64";

        return nickname;
    }

    //
    // function hasStem(length)
    //
    // Returns a bool indicating whether a note with a given length has a stem.
    // The input length must be a time division '1/X', where X is a power of 2.
    //
    function hasStem(length) {
        return length != "1/1";
    }

    //
    // function numFlags(length)
    //
    // Returns the number of flags a note with the given length has.
    // The input length must be a time division '1/X', where X is a power of 2.
    //
    function numFlags(length) {
        var denom = parseInt(length.substring(length.indexOf('/') + 1));

        var pow = 0;    // such that length = 1/(2^{pow})
        while (denom > 1) {
            ++pow;
            denom /= 2;
        }

        return pow >= 3 ? pow - 2 : 0;
    }

    //
    // function convert(doc)
    //
    // Creates a list of layout trees for each glyph in the document. The
    // return value of this method is a list of glyphs that go inside staves
    // (e.g. 'note', 'end-measure'). None of the resulting glyphs will contain
    // any position or size information.
    //
    // Notate.layout() uses this method as a subroutine. layout() computes
    // sizes and positions for each glyph. Notate.layout() then generates 
    // staves by placing as many measures in each staff as possible.
    //
    var convert = function(doc) {
        var trees = [];

        for (var i = 0; i < doc.length; ++i) {
            var glyph = doc[i];

            if (glyph.type == 'note') {
                var note = new Notate.glyphs['note']();

                // The note itself
                note.length = toLength(glyph.length);
                note.pitch = glyph.pitch;
                
                // Its stem
                if (hasStem(note.length)) 
                    note.children.push(new Notate.glyphs['stem']());

                // Its flags
                var nFlags = numFlags(note.length);
                if (nFlags > 0) {
                    var flags = new Notate.glyphs['flags']();
                    flags.count = nFlags;

                    note.children.push(flags);
                }

                trees.push(note);
            } else if (glyph.type == 'end-measure') {
                trees.push(new Notate.glyphs['end-measure']());
            }
        }

        return trees;
    }

    //
    // function fillStaves(measures, width)
    //
    // Creates as many staves as needed to fit every measure, in order, into
    // a document. Returns the resulting document
    //
    // @param glyphs   The list of subtrees to fit into the document
    // @param width    The width of the document
    //
    var fillStaves = function(glyphs, width) {
        function nextStaff(doc, width) {
            var staff = new Notate.glyphs['staff']();
            staff.x = s.MARGIN_HORIZ;
            staff.right = width - 2 * s.MARGIN_HORIZ;

            doc.children.push(staff);

            return staff;
        }

        function nextEndMeasure(glyphs, start) {
            for (var i = start; i < glyphs.length; ++i) {
                if (glyphs[i].type() == 'end-measure')
                    return i;
            }

            // If we get here, there are glyphs after the final end-measure.
            // That probably means someone forgot to finish with an end-measure
            glyphs.push(new Notate.glyphs['end-measure']);
            return glyphs.length - 1;
        }

        function sizeof(glyphs, start, end) {
            var staff = new Notate.glyphs['staff']();
            for (var i = start; i <= end; ++i)
                staff.children.push(glyphs[i]);

            layoutGlyph(staff);
            return staff.width();
        }

        function finishStaff(staff, prev) {
            layoutGlyph(staff);

            var last = staff.children[staff.children.length - 1];
            last.x = staff.width();

            var s = Notate.settings;

            if (prev == null)
                staff.y = Math.floor(s.MARGIN_VERT - staff.top);
            else
                staff.y = Math.floor((prev.y + prev.bottom) + s.STAFF_SPACING - staff.top);
        }

        var s = Notate.settings;

        var doc = new Notate.glyphs['document']();
        doc.right = width;

        var prev = null;
        var staff = nextStaff(doc, width);

        var x = 0;

        for (var i = 0; i < glyphs.length; ) {

            // Find the glyphs in this measure
            var start = i;
            var end = nextEndMeasure(glyphs, start);
            i = end + 1;

            // If the measure won't fit, finish the staff and start a new one
            var measureWidth = sizeof(glyphs, start, end);
            var fits = x + measureWidth <= staff.width();
            if (staff.children.length > 0 && !fits) {
                finishStaff(staff, prev);

                x = 0;
                prev = staff;
                staff = nextStaff(doc, width);
            }

            // Measure fits, add it to the staff
            for (var j = start; j <= end; ++j) 
                staff.children.push(glyphs[j]);

            x += measureWidth;
        }

        finishStaff(staff, prev);
        return doc;
    }

    //
    // function layoutGlyph
    //
    // Recursively computes the positions and sizes of the glyph's subtree,
    // then determines the glyph's size (the union of its minimum size and the
    // bounding rectangles of all its descendents)
    //
    function layoutGlyph(glyph) {

        // Determine where children of this glyph belong
        glyph.layout();

        // Size and lay out the children glyph subtrees
        for (var i = 0; i < glyph.children.length; ++i)
            layoutGlyph(glyph.children[i]);

        // Expand the glyph's bounding rect to hold its children
        var minbounds = glyph.size();
        glyph.union(minbounds);

        for (var i = 0; i < glyph.children.length; ++i) {
            var child = glyph.children[i];
            var bounds = translate(child, { x:0, y:0 }, child);

            glyph.union(bounds);
        }
    }

    //
    // function bakeCoords(tree)
    //
    // Replaces relative coordinates stored at each node in the glyph tree and
    // converts them to absolute coordinates in document canvas space
    //
    // @tree    A tree of Glyph objects whose coordinates are always relative
    //          to their parents
    //
    var bakeCoords = function(tree) {
        function recur(tree, x, y) {
            var dx = tree.x;
            var dy = tree.y;

            for (var i = 0; i < tree.children.length; ++i)
                recur(tree.children[i], x + dx, y + dy);

            tree.dx = Math.floor(dx);
            tree.dy = Math.floor(dy);

            tree.x = Math.floor(x + dx);
            tree.y = Math.floor(y + dy);
        }

        recur(tree, 0, 0);
    }

    // 
    // function layout(doc)
    //
    // Creates a layout tree from a document description.
    // The resulting layout tree contains a hierarchical tree of glyph objects
    // (see Notate.Glyph) which can be further processed, analyzed, and / or
    // rendered (see Notate.render())
    //
    // @param doc The document to generate a layout tree for
    // @return a layout tree corresponding to the document.
    // 
    var layout = function(doc) {
        var glyphs = convert(doc);

        // Lay out each individual glyph
        for (var i = 0; i < glyphs.length; ++i)
            layoutGlyph(glyphs[i]);

        // Build staves out of glyphs
        var width = 800;    // TODO param?
        tree = fillStaves(glyphs, width);
    
        // Convert relative coordinates to absolute coordinates
        bakeCoords(tree);

        return tree;
    }

    //
    // function render(canvas, ctx, glyph)
    //
    // Recursively renders a glyph and its children using the built-in style.
    //
    // @param canvas The canvas object to render to
    // @param ctx    The canvas2d context to use to render
    // @param glyph  The glyph to be rendered
    //
    var render = function(canvas, ctx, glyph) {
        ctx.fillStyle = '#000';

        function recur(canvas, ctx, glyph) {
            glyph.render(canvas, ctx);

            for (var i = 0; i < glyph.children.length; ++i)
                recur(canvas, ctx, glyph.children[i]);
        }

        recur(canvas, ctx, glyph);
    }


    var Notate = { };

    // Export public interface
    Notate.Rect = Rect;
    Notate.Glyph = Glyph;
    Notate.Settings = Settings;

    Notate.layout = layout;
    Notate.render = render;

    Notate.settings = new Settings();

    // Published so subclasses of Notate.Glyph can register themselves
    // Maps from glyph type (e.g. 'document') to the glyph constructor
    Notate.glyphs = { };

    // The following methods are provided to glyphs as helpers. Glyphs may
    // choose to add items as necessary, but are strongly discouraged from
    // removing helpers.
    Notate.Helpers = { };
    Notate.Helpers.translate = translate;
    Notate.Helpers.toLength = toLength;
    Notate.Helpers.hasStem = hasStem;
    Notate.Helpers.numFlags = numFlags;

    return Notate;
}());

