
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

        this.STAFF_HEIGHT = (this.STAFF_LINE_COUNT - 1) * this.STAFF_LINE_SPACING;

        this.STEM_OFFSET = (function(s) {
            var a = s.NOTE_HEAD_RADIUS_MAX,
                b = s.NOTE_HEAD_RADIUS_MIN,
                theta = -s.NOTE_HEAD_ROTATION,
                bCosTheta = b * Math.cos(theta),
                aSinTheta = a * Math.sin(theta);

            return a * b / Math.sqrt(bCosTheta * bCosTheta + aSinTheta * aSinTheta);
        })(this);
    }

    // 
    // class Glyph
    //
    // Node in the intermediate layout tree.
    // Generated from a document in Notate.layout()
    // Can be rendered using Notate.render()
    // 
    var Glyph = function(type) {
        this.type = type;

        this.top = 0;
        this.bottom = 0;
        this.left = 0;
        this.right = 0;

        this.x = 0;
        this.y = 0;

        this.children = new Array();
    }

    Glyph.prototype.width = function() { return this.right - this.left; }
    Glyph.prototype.height = function() { return this.bottom - this.top; }
    Glyph.prototype.union = function(rect) {
        function min(a, b) { return a <= b ? a : b; }
        function max(a, b) { return a >= b ? a : b; }

        this.top    = min(this.top, rect.top);
        this.bottom = max(this.bottom, rect.bottom);
        this.left   = min(this.left, rect.left);
        this.right  = max(this.right, rect.right);
    }

    //
    // Per-glyph implementions of the initial size method:
    //
    // function size()
    //
    // Determines the minimum bounding box coordinates for a type of glyph
    //
    // @return      A rectangle object containing top, bottom, left, and 
    //              right integer properties
    //
    var sizeCallback = { };

    //
    // Per-glyph implementations of the layout method:
    //
    // function layout(glyph)
    //
    // Determines the final positions of the children of a glyph, as well as
    // the final size of the glyph itself. 
    //
    // @param glyph The glyph whose size should be determined and whose contents
    //              should be positioned
    //
    var layoutCallback = { };

    //
    // Per-glyph implementations of the render method:
    //
    // function render(canvas, ctx, glyph, x, y)
    //
    // Renders a glyph on a canvas at a specified location. This location is
    // specified in canvas coordiantes; it is not superceded by the glyph's
    // x and y properties (which are defined in their parents' coordinate
    // systems).
    //
    // @param canvas    The canvas element that will be rendered to
    // @param ctx       The canvas2d context for the canvas element
    // @param glyph     The glyph to render (see Notate.Glyph)
    // @param x         The X coordinate of the glyph's origin in canvas coords
    // @param y         The Y coordinate of the glyph's origin in canvas coords
    //
    var renderCallback = { };

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
    // Creates a list of layout trees containing the glyphs inside each
    // measure of the given document. The return value of this method is
    // a list of measure glyphs. None of the resulting glyphs will contain
    // any position or size information.
    //
    // Notate.layout() uses this method as a subroutine. layout() computes
    // sizes and positions for each glyph, then generates staves by placing
    // as many measures in each staff as possible.
    //
    var convert = function(doc) {
        var trees = [];

        for (var i = 0; i < doc.length; ++i) {
            var measure = doc[i];

            var tree = new Glyph("measure");
            trees.push(tree);

            for (var j = 0; j < measure.notes.length; ++j) {
                var note = measure.notes[j];

                // The note itself
                if (note.type != "note") continue;
                var glyph = new Glyph("note");
                glyph.length = toLength(note.length);
                glyph.pitch = note.pitch;
                
                // Its stem
                if (hasStem(glyph.length)) 
                    glyph.children.push(new Glyph("stem"));

                // Its flags
                var flags = numFlags(glyph.length);
                if (flags > 0) {
                    var flagsGlyph = new Glyph("flags");
                    flagsGlyph.count = flags;

                    glyph.children.push(flagsGlyph);
                }

                tree.children.push(glyph);
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
    // @param measures The measures to fit into the document
    // @param width    The width of the document
    //
    var fillStaves = function(measures, width) {
        function nextStaff(doc, y, width) {
            var staff = new Glyph('staff');
            staff.x = s.MARGIN_HORIZ;
            staff.y = y;
            staff.right = width - 2 * s.MARGIN_HORIZ;

            doc.children.push(staff);

            return staff;
        }

        function finishStaff(staff) {
            var last = staff.children[staff.children.length - 1];
            last.right = staff.width() - last.x;
        }

        var s = Notate.settings;

        var doc = new Glyph('document');
        doc.right = width;

        var x = 0;
        var y = s.MARGIN_VERT;

        var staff = nextStaff(doc, y, width);

        for (var i = 0; i < measures.length; ++i) {
            var measure = measures[i];

            // If this measure won't fit, finish the staff
            var fits = x + measure.width() <= staff.width();
            if (staff.children.length > 0 && !fits) {
                finishStaff(staff);

                x = 0;
                y += staff.height() + s.STAFF_SPACING;
                staff = nextStaff(doc, y, width);
            }

            // Measure fits, add it to the staff
            measure.x = x;
            x += measure.width();
            staff.children.push(measure);
            staff.union(measure);
        }

        finishStaff(staff);

        console.log(measures);
        console.log(doc);
        return doc;
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
        var measures = convert(doc);

        function recur(glyph) {
            // Size and lay out the children glyph subtrees
            for (var i = 0; i < glyph.children.length; ++i)
                recur(glyph.children[i]);

            // Move child glyphs and determine this glyph's size
            layoutCallback[glyph.type](glyph);

            // Expand the glyph's bounding rect to hold its children
            var minbounds = sizeCallback[glyph.type]();
            glyph.union(minbounds);

            for (var i = 0; i < glyph.children.length; ++i) {
                var child = glyph.children[i];
                var bounds = translate(child, { x:0, y:0 }, child);

                glyph.union(bounds);
            }
        }

        // Lay out each individual measure
        for (var i = 0; i < measures.length; ++i)
            recur(measures[i]);

        // Build staves out of measures
        var width = 800;    // TODO param?
        return fillStaves(measures, width);
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

        function recur(canvas, ctx, glyph, x, y) {
            renderCallback[glyph.type](canvas, ctx, glyph, x, y);

            for (var i = 0; i < glyph.children.length; ++i) {
                var c = glyph.children[i];
                recur(canvas, ctx, c, x + c.x, y + c.y);
            }
        }

        recur(canvas, ctx, glyph, glyph.x, glyph.y);
    }

    var Notate = { };

    // Export public interface
    Notate.Glyph = Glyph;
    Notate.Settings = Settings;

    Notate.layout = layout;
    Notate.render = render;

    Notate.settings = new Settings();

    // These callbacks are published so other source files can add to them.
    // This allows for other source files to extend notate's glyph system. The
    // core glyphs also use this mechanism - see the files in src/glyphs.
    Notate.sizeCallback = sizeCallback;
    Notate.layoutCallback = layoutCallback;
    Notate.renderCallback = renderCallback;

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
