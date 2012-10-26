
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

            width: Glyph.prototype.width,
            height: Glyph.prototype.height,
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
        // TODO look up the height of a staff
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
    // note glyph
    //
    sizeCallback['note'] = function() {
        // TODO settings
        var r = 6;
        return { top: 0, bottom: 2 * r, left: 0, right: 2 * r };
    }

    positionCallback['note'] = function(parent, child, arg) {
        // TODO 'real' implementation, just doing rendering for now
        // Based on pitch and measure clef, choose a y coordinate
        // Origin of the note is the center of the note head

        return {
            x: -child.left,
            y: -child.top,
            params: null
        };
    }

    function renderNoteHeadOuter(canvas, ctx, x, y, rotation) {
        // TODO settings object
        var NOTE_HEAD_RADIUS_MAX = 6;
        var NOTE_HEAD_RADIUS_MIN = 4;

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(1.0 * NOTE_HEAD_RADIUS_MAX / NOTE_HEAD_RADIUS_MIN, 1.0);

        ctx.beginPath();
        ctx.arc(0, 0, NOTE_HEAD_RADIUS_MIN, 0, 6.28, false);
        ctx.fill();

        ctx.restore();
    }

    function renderNoteHeadInner(canvas, ctx, x, y, minRadius, maxRadius, rotation) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(1.0 * maxRadius / minRadius, 1.0);

        ctx.beginPath();
        ctx.arc(0, 0, minRadius, 0, 6.28, false);
        ctx.fill();

        ctx.restore();
        ctx.fillStyle = "rgb(0, 0, 0)";
    }

    renderCallback['note'] = function(canvas, ctx, note, x, y) {
        // n.b. This renders the note head, with the origin at the center of the note head.
        //      Stems, flags, bars and dots are all children of the note glyph.

        // TODO settings object :D
        var NOTE_HEAD_ROTATION = -.5;
        var HALFNOTE_INNER_RADIUS_MIN = 2;
        var HALFNOTE_INNER_RADIUS_MAX = 5;
        var WHOLENOTE_INNER_RADIUS_MIN = 2.25;
        var WHOLENOTE_INNER_RADIUS_MAX = 3.25;
        var WHOLENOTE_INNER_ROTATION = 1;

        var rotation = (note.length == "1/1") ? 0 : NOTE_HEAD_ROTATION;
        renderNoteHeadOuter(canvas, ctx, x, y, rotation);

        var isHollow = (note.length == "1/1") || (note.length == "1/2");
        if (isHollow) {
            var minRadius, maxRadius;

            if (note.length == "1/1") {
                minRadius = WHOLENOTE_INNER_RADIUS_MIN;
                maxRadius = WHOLENOTE_INNER_RADIUS_MAX;
                rotation = WHOLENOTE_INNER_ROTATION;
            } else {
                minRadius = HALFNOTE_INNER_RADIUS_MIN;
                maxRadius = HALFNOTE_INNER_RADIUS_MAX;
            }

            renderNoteHeadInner(canvas, ctx, x, y, minRadius, maxRadius, rotation);
        }
    }

    //
    // stem glyph
    //
    sizeCallback['stem'] = function() {
        // TODO settings
        var NOTE_STEM_WIDTH = 1;
        var NOTE_STEM_HEIGHT = 30;

        return { top: NOTE_STEM_HEIGHT, bottom: 0,
                 left: -.5 * NOTE_STEM_WIDTH,
                 right: .5 * NOTE_STEM_WIDTH, 
        };
    }

    positionCallback['stem'] = function(parent, child, arg) {
        // TODO cache this value in the settings
        var NOTE_HEAD_RADIUS_MIN = 4;
        var NOTE_HEAD_RADIUS_MAX = 6;
        var NOTE_HEAD_ROTATION = -.5;

        var a = NOTE_HEAD_RADIUS_MAX,
            b = NOTE_HEAD_RADIUS_MIN,
            theta = -NOTE_HEAD_ROTATION,
            bCosTheta = b * Math.cos(theta),
            aSinTheta = a * Math.sin(theta),
            r = a * b / Math.sqrt(bCosTheta * bCosTheta + aSinTheta * aSinTheta);

        return {
            x: r,
            y: 0,
            params: null,
        };
    }

    renderCallback['stem'] = function(canvas, ctx, stem, x, y) {
        var NOTE_STEM_WIDTH = 1;
        var NOTE_STEM_HEIGHT = 30;

        var rect = translate(stem, { x: 0, y: 0 }, { x: x, y: y });
        ctx.fillRect(rect.left, rect.top, rect.width(), rect.height());
    }

    // 
    // flags glyph
    //
    sizeCallback['flags'] = function() {
        return { top: 0, bottom: 21.5, left: 0, right: 11.2 };
    }

    positionCallback['flags'] = function(parent, child, arg) {
        // TODO cache this value in the settings
        var NOTE_HEAD_RADIUS_MIN = 4;
        var NOTE_HEAD_RADIUS_MAX = 6;
        var NOTE_HEAD_ROTATION = -.5;

        var a = NOTE_HEAD_RADIUS_MAX,
            b = NOTE_HEAD_RADIUS_MIN,
            theta = -NOTE_HEAD_ROTATION,
            bCosTheta = b * Math.cos(theta),
            aSinTheta = a * Math.sin(theta),
            r = a * b / Math.sqrt(bCosTheta * bCosTheta + aSinTheta * aSinTheta);

        return {
            x: r,
            y: 0,
            params: null,
        };
    }

    renderCallback['flags'] = function(canvas, ctx, flags, x, y) {
        for (var i = 0; i < flags.count; ++i) {
            ctx.save();
            ctx.translate(x, y + 6.5 * i);

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
    measure.right = 180;
    measure.bottom = staff.height();

    fill.x = measure.width();
    fill.y = 0;
    fill.top = 0;
    fill.bottom = measure.height();
    fill.left = 0;
    fill.right = staff.width() - measure.width();

    var denom = 1;
    for (var i = 0; i < 6; ++i) {
        var note = new Notate.Glyph("note");
        note.x = 15 + 25 * i;
        note.y = 24.5;
        note.top = -10;
        note.bottom = 10;
        note.left = -10;
        note.right = 10;
        note.length = "1/" + denom;
        denom *= 2;

        if (i > 0) {
            var NOTE_HEAD_RADIUS_MIN = 4;
            var NOTE_HEAD_RADIUS_MAX = 6;
            var NOTE_HEAD_ROTATION = -.5;
            var a = NOTE_HEAD_RADIUS_MAX,
                b = NOTE_HEAD_RADIUS_MIN,
                theta = -NOTE_HEAD_ROTATION,
                bCosTheta = b * Math.cos(theta),
                aSinTheta = a * Math.sin(theta),
                r = a * b / Math.sqrt(bCosTheta * bCosTheta + aSinTheta * aSinTheta);
            
            var stem = new Notate.Glyph("stem");
            stem.x = r;
            stem.y = 0;
            stem.top = -30;
            stem.bottom = 0;
            stem.left = -.5;
            stem.right = .5;

            for (var j = 0; j < i - 2; ++j) {
                var flags = new Notate.Glyph("flags");
                flags.x = 0;
                flags.y = -stem.height();
                flags.top = 0;
                flags.bottom = 21.5;
                flags.left = 0;
                flags.right = 11.2;
                flags.count = j + 1;

                stem.children.push(flags);
            }

            note.children.push(stem);
        }

        measure.children.push(note);
    }

    doc.children.push(staff);
    staff.children.push(measure);
    staff.children.push(fill);
    
    Notate.render(canvas, ctx, doc);
}

