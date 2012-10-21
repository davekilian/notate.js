
var Notate = (function() {

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
    // Per-glyph implementations of the position method:
    //
    // function position(parent, child, params)
    //
    // Determines the position at which the child should be placed, in the
    // parent's coordinate space.
    //
    // If stateful parameters are needed between invocations of this function
    // on the same parent glyph object, they can be stored in the params
    // object.
    //
    // @param parent    The parent glyph containing the child
    //
    // @param child     The child glyph to be placed
    //
    // @param params    Params created by this function the last time this
    //                  function was called on the same parent object.
    //
    //                  If this is the first time this function was called for
    //                  the parent object, this parameter is null.
    //
    // @return          An object whose x and y properties are the position
    //                  of the child glyph in its parent's coordinate space,
    //                  and whose params property is the value that should be
    //                  passed as the params paremeter the next time this method
    //                  is called on the same parent object.
    //
    var positionCallback = { };

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
    //
    // @param ctx       The canvas2d context for the canvas element
    //
    // @param glyph     The glyph to render (see Notate.Glyph)
    //
    // @param x         The X coordinate of the glyph's origin in canvas coords
    //
    // @param y         The Y coordinate of the glyph's origin in canvas coords
    //
    var renderCallback = { };

    //
    // function translate()
    //
    // Translates a rectangle into a different coordinate space
    //
    // @param rect      The rect to translate (an object with top/bottom/left/right)
    // 
    // @param src       The origin of rect's coordinate system (an object with x/y)
    //
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
        };
    }

    // sizeCallback for glyphs that don't have a minimum size
    var noMinSize = function() { return { top: 0, bottom: 0, left: 0, right: 0 }; }

    // positionCallback for glyphs that stack their elements horizontally
    var stackHorizontally = function(parent, child, x) {
        x = x || 0;

        var ret = { };
        ret.x = x - child.left;
        ret.y = -child.top;
        ret.params = x + child.width();

        return ret;
    }

    // positionCallback for glyphs that stack their elements vertically
    var stackVertically = function(parent, child, y) {
        y = y || 0;

        var ret = { };
        ret.x = -child.left;
        ret.y = y - child.top;
        ret.params = y + child.height();

        return ret;
    }

    // renderCallback for glyphs that don't render anything
    var renderNothing = function(canvas, ctx, glyph, x, y) { }

    // 
    // document glyph
    //
    sizeCallback['document'] = noMinSize;
    positionCallback['document'] = stackVertically;
    renderCallback['document'] = renderNothing;

    //
    // staff glyph
    //
    sizeCallback['staff'] = function() { 
        // TODO settings object (for bottom prop)
        return { top: 0, bottom: 32, left: 0, right: 0 }; 
    }

    positionCallback['staff'] = stackHorizontally;

    renderCallback['staff'] = function(canvas, ctx, staff, x, y) {

        var lines = staff.numLines;
        var w = staff.width(), 
            h = staff.height();
        var r = translate(staff, { x: 0, y: 0 }, { x: x, y: y });

        var STAFF_LINE_WIDTH = 1;  // TODO settings object
        var MEASURE_BAR_WIDTH = 1; // TODO settings object

        ctx.fillStyle = 'rgb(0, 0, 0)';

        for (var dh = 0; dh <= h; dh += h / (lines - 1))
            ctx.fillRect(r.left, r.top + dh, w, STAFF_LINE_WIDTH);

        ctx.fillRect(r.left, r.top, MEASURE_BAR_WIDTH, h);
    }

    //
    // measure glyph
    //
    sizeCallback["measure"] = function() {
        return { top: 0, bottom: 32, left: 0, right: 0 };
    }

    positionCallback['measure'] = stackHorizontally;

    renderCallback['measure'] = function(canvas, ctx, measure, x, y) {

        var r = translate(measure, { x: 0, y: 0 }, { x: x, y: y });
        var w = measure.width(), h = measure.height();

        var MEASURE_BAR_WIDTH = 1; // TODO settings object

        ctx.fillStyle = 'rgb(0, 0, 0)';

        ctx.fillRect(r.right - MEASURE_BAR_WIDTH,
                     r.top, 
                     MEASURE_BAR_WIDTH, 
                     h);
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
    Notate.Glyph = Glyph;
    Notate.layout = layout;
    Notate.render = render;
    return Notate;

}());

// DEBUG

function renderBackground(canvas, ctx) { 
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function enableRetina(canvas, ctx) {
    if (window.devicePixelRatio) {
        var ratio = window.devicePixelRatio;

        var w = canvas.width;
        var h = canvas.height;

        canvas.width = w * ratio;
        canvas.height = h * ratio;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        ctx.scale(ratio, ratio);
    }
}

function debug() {
    var canvas = document.getElementById('testCanvas');
    var ctx = canvas.getContext('2d');
    enableRetina(canvas, ctx);

    renderBackground(canvas, ctx);

    // document, staff, register
    var doc = new Notate.Glyph("document");
    var staff = new Notate.Glyph("staff");
    var measure = new Notate.Glyph("measure");
    var fill = new Notate.Glyph("measure");

    var MARGINX = 50;
    var MARGINY = 50;
    var ratio = window.devicePixelRatio; 
    var w = canvas.width / ratio;
    var h = canvas.height / ratio;

    doc.top = 0;
    doc.bottom = h;
    doc.left = 0;
    doc.right = w;

    staff.x = MARGINX;
    staff.y = MARGINY;
    staff.top = 0;
    staff.bottom = 32;
    staff.left = 0;
    staff.right = doc.width() - 2 * MARGINX;
    staff.numLines = 5;

    measure.top = 0;
    measure.left = 0;
    measure.right = 150;
    measure.bottom = staff.height();

    fill.x = measure.width();
    fill.y = 0;
    fill.top = 0;
    fill.bottom = measure.height();
    fill.left = 0;
    fill.right = staff.width() - measure.width();

    doc.children.push(staff);
    staff.children.push(measure);
    staff.children.push(fill);
    
    Notate.render(canvas, ctx, doc);
}

