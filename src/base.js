
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
    // both this rectangle and the given rectangle. Only the boundaries of this
    // rectangle are modified; the ends are left unchanged.
    //
    // @param rect The other rectangle to union this rectangle with
    //
    Rect.prototype.union = function(rect) {
        function min(a, b) { return a <= b ? a : b; }
        function max(a, b) { return a >= b ? a : b; }
        
        this.top    = min(this.top    + this.y, rect.top    + rect.y) - this.y;
        this.bottom = max(this.bottom + this.y, rect.bottom + rect.y) - this.y;
        this.left   = min(this.left   + this.x, rect.left   + rect.x) - this.x;
        this.right  = max(this.right  + this.x, rect.right  + rect.x) - this.x;
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

    Glyph.prototype.moveBy = function(dx, dy) {
        function recur(glyph) {
            glyph.x += dx;
            glyph.y += dy;

            for (var i = 0; i < glyph.children.length; ++i)
                recur(glyph.children[i]);
        }

        recur(this);
    }

    Glyph.prototype.moveTo = function(x, y) {
        this.moveBy(x - this.x, y - this.y);
    }

    //
    // Parses the given command (i.e. from the original document) and populates
    // this object to match the command. This includes creating child glyphs as
    // necessary.
    //
    // The input command will be either 'show' or 'begin'. The value associated
    // with the show/begin key of the object (i.e. the type of thing to show or
    // begin) is guaranteed to be the same as this.type().
    //
    // The resulting subtree should not be laid out yet. This method should not
    // move the Glyph; when the method returns, this Glyph's x and y
    // coordinates should both be 0.
    //
    // @param cmd   The command to parse
    // @param ctype The type of command (either 'show' or 'begin')
    //
    Glyph.prototype.parseCommand = function(cmd, ctype) {
        console.log("This glyph does not override .parseCommand()!");
        console.log(this);
    }

    //
    // Returns the minimum bounding box for this glyph, assuming the glyph has
    // no children
    //
    // @return      A rectangle object containing top, bottom, left and right
    //              properties, containing the bounding box sides relative to 
    //              this glyph's origin (i.e. this.x and this.y)
    //
    Glyph.prototype.minSize = function() {
        console.log("This glyph does not override .minSize()!");
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
    // function commandType()
    //
    // Given a command object from a document, returns the type of command.
    // Used internally by the parser.
    //
    var commandType = function(cmd) {
        var commands = [
            'show', 'begin', 'end', 'clef',
            'title', 'composer', 'arranged', 'year',
        ];

        for (var i = 0; i < commands.length; ++i) {
            if (cmd.hasOwnProperty(commands[i])) {
                return commands[i];
            }
        }
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
        var minbounds = glyph.minSize();
        minbounds.x = glyph.x;
        minbounds.y = glyph.y;
        glyph.union(minbounds);

        for (var i = 0; i < glyph.children.length; ++i) {
            glyph.union(glyph.children[i]);
        }
    }

    //
    // function handleShowCommand
    //
    // Helper for Notate.layout() that runs whenever layout() encounters a
    // show: 'something' command.
    //
    // @param cmd   The show command
    // @param ctx   The layout context to apply the command to
    //
    var handleShowCommand = function(cmd, ctx) {
        var type = cmd['show'];

        if (type == 'measure') {
            ctx.measure.push(new Notate.glyphs['bar']());

            ctx.outdoc.addMeasure(ctx.measure);
            ctx.measure = [ ];
        }
        else if (Notate.glyphs.hasOwnProperty(type)) {
            var glyph = new Notate.glyphs[type]();
            glyph.parseCommand(cmd);

            layoutGlyph(glyph);

            ctx.measure.push(glyph);
        }
        else {
            console.log('Unknown showable in Notate.layout(): ' + type);
        }
    }

    var handleBeginCommand = function(cmd, ctx) {
    }

    var handleEndCommand = function(cmd, ctx) {
        /*
         * TODO
         *
         * Still need to figure out how the glyph gets positioned. Its position
         * can't be determined until the other glyphs are already placed, but
         * staff positions can't be determined until this glyph is in the
         * staff. So maybe we should always defer until a line break?
         *
         * Then what we'd want is:
         * - context has a begun list and an ended list
         * - handleShowCommand adds a child to every begun command
         * - handleBeginCommand adds an entry to the begun list
         * - handleEndCommand moves an entry from the begun list to the ended
         *   list
         * - handleLineBreak is complicated probably
         */
    }

    var handleLineBreak = function(ctx) { 
        /*
         * TODO
         *
         * Figure out how to do this ^^
         *
         * First, let's consider anything that was begun and end on this line
         * Then we can expand to cover things that wrapped at the start and/or
         * end of this line.
         *
         * Basic idea:
         * - Lay out the staff
         * - Add each ended glyph
         * - Lay out each of those glyphs
         * - Clear the ended glyph list
         * - Finish the staff
         *
         * Seems simple, but the semantics are kind of broken
         * - layout() is supposed to lay out the glyph's chidlren
         * - But we're calling layout() on the (e.g. tuplet) glyph to lay
         *   itself out
         * - We could change the semantics of layout so that the glyph
         *   positions itself, but the glyph doesn't have a reference to its
         *   parent glyph. Maybe it'd be okay if we added a parent glyph and
         *   changed the semantics?
         * - An alternative is to put layout logic for tuplets and stuff in the
         *   staff glyph, but that's kinda shitty
         * - Another alternative is to add another callback, but that's messy.
         *
         * I think the best bet is to change what layout does. This is going to
         * require some refactoring before we can start begin/end commands
         * though.
         *
         * As promised, we should also talk about what to do on a line break if
         * there are any items in the begin list. The basic extension is:
         * - Add each begun glyph as well as the ended glyphs
         * - Set the endsWithLineBreak property = true on each of those glyphs
         * - Clear the child lists of every begun glyph, but don't remove them
         * - Set a flag so that each of glyphs in the list will have a
         *   startsWithLineBreak property set to true
         *
         * Then child glyphs can handle the logic for changing the way they
         * render based on those line break property flags
         */
    }

    // 
    // function layout(doc)
    //
    // Creates a layout tree from a document description.
    // The resulting layout tree contains a hierarchical tree of glyph objects
    // (see Notate.Glyph) which can be further processed, analyzed, and/or
    // rendered (see Notate.render())
    //
    // @param doc The document to generate a layout tree for
    // @return a layout tree corresponding to the document.
    // 
    var layout = function(doc) {
        var context = {
            outdoc: new Notate.glyphs['document'](),
            measure: [ ],
        };

        context.outdoc.right = 800; // TODO pass this in somehow

        // Parse each command
        for (var i = 0; i < doc.length; ++i) {
            var cmd = doc[i];
            var ctype = commandType(cmd);

            if (ctype == 'show') {
                handleShowCommand(cmd, context);
            }
            else {
                console.log('Unknown command type in Notate.layout(): ' 
                            + ctype);
            }
        }

        // Finish the document
        if (context.measure.length > 0) {
            context.outdoc.addMeasure(context.measure);
            context.measure = [ ];
        }

        context.outdoc.finish();

        // Recursively floor all coordinates (prevents partial-pixel offset
        // blurs when rendering the document)
        (function floorCoords(glyph) {
            glyph.x = Math.floor(glyph.x);
            glyph.y = Math.floor(glyph.y);

            for (var i = 0; i < glyph.children.length; ++i) {
                floorCoords(glyph.children[i]);
            }
        })(context.outdoc);

        return context.outdoc;
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
        ctx.fillStyle = '#333';

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

    return Notate;
}());

