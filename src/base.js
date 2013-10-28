
var Notate = (function() {

    //
    // class Settings
    //
    // Contains constants used for sizing and positioning glyphs in the
    // layout and render engines
    //
    var Settings = function() {
        this.FONT_FAMILY = 'serif';
        this.FONT_STYLE = 'bold italic';
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
        this.TUPLET_VMARGIN = 22;
        this.TUPLET_HMARGIN = 3;
        this.TUPLET_HEIGHT = 15;
        this.TUPLET_FONT_SIZE = 13;
        this.TUPLET_FONT_MARGIN = 5;
        this.TUPLET_THICKNESS = 1;
        this.SLUR_MARGIN = 3;
        this.SLUR_HEIGHT = 5;
        this.SLUR_THICKNESS = 1.5;

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
    // Notate.showable / Notate.beginnable as necessary. See some of the stock
    // implementations in src/glyphs for examples.
    // 
    var Glyph = function() {
        Rect.call(this);

        this.parent = null;             // The Glyph that owns this one
        this.children = new Array();    // This Glyph's list of child Glyphs
    }

    Glyph.prototype = new Rect();
    Glyph.constructor = Glyph;

    //
    // Adds a child to this glyph's list of children glyphs. 
    // Also manages the child's parent property.
    //
    Glyph.prototype.addChild = function(child) {
        child.parent = this;
        this.children.push(child);
    }

    //
    // Removes a child from this glyph's list of children glyphs.
    // Also manages the child's parent property.
    //
    Glyph.prototype.removeChild = function(child) {
        if (child.parent == this) {
            child.parent = null;
        }

        var index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    //
    // Returns this glyph's type string.
    //
    // If you do not implement this method in your Glyph subclass, the base
    // class implementation will fall back by searching Notate.showable and
    // Notate.beginnable. If this search doesn't turn up anything, this method
    // will return null.
    //
    Glyph.prototype.type = function() {
        for (var key in Notate.showable) {
            if (this instanceof Notate.showable[key]) 
                return key;
        }

        for (var key in Notate.beginnable) {
            if (this instanceof Notate.beginnable[key]) 
                return key;
        }

        return null;
    }

    //
    // Recursively moves this glyph and its children by the given amount
    //
    // @paran dx    The horizontal distance to move this glyph tree
    // @param dy    The vertical distance to move this glyph tree
    //
    Glyph.prototype.moveBy = function(dx, dy) {
        function recur(glyph) {
            glyph.x += dx;
            glyph.y += dy;

            for (var i = 0; i < glyph.children.length; ++i)
                recur(glyph.children[i]);
        }

        recur(this);
    }

    //
    // Moves this glyph to the given location, recursively moving this glyph's
    // children so they remain in the same place relative to this glyph
    //
    // @param x     The X coordinate of the new origin of this glyph
    // @param y     The Y coordinate of the new origin of this glyph
    //
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
    // Determines this glyph's final position, and then computes the final
    // dimensions of the glyph's bounding box. 
    //
    // This method may assume the glyph's children have already been laid out,
    // and is not responsible for calling layout on its children.
    //
    // This method is, however, responsible for moving the glyph's children
    // along with the glyph, as necessary. Glyph.moveTo and Glyph.moveBy help
    // with this.
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
    // function addBeginEndGlyphs()
    //
    // Creates glyphs corresponding to the begun/ended lists in ctx
    //
    // @param ctx   The context containing the begun/ended glyph information to
    //              use to instantiate the glyphs and the document to receive
    //              the glyphs created.
    //
    var addBeginEndGlyphs = function(ctx) {
        var targetStaff = ctx.outdoc.children[ctx.outdoc.children.length - 1];
        if (!targetStaff) {
            return;
        }

        var items = ctx.begun.concat(ctx.ended);

        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            var ended = ctx.ended.indexOf(item) > -1; // begun list or ended list?

            // Figure out which targets of this command (if any) belong to the
            // staff we just finalized
            var targets = [ ];
            for (var j = item.targets.length - 1; j >= 0; --j) {
                var target = item.targets[j];

                if (target.parent == targetStaff) {
                    targets.push(target);
                    item.targets.splice(j, 1);
                }
            }

            if (targets.length > 0) { 
                // Since some glyphs rely on the order targets appear in the
                // array matching the order they appeared in the document, undo
                // the implicit array reversal from looping backwards above
                targets.reverse();

                // Create the glyph if necessary
                var glyph = new Notate.beginnable[item.type]();
                if (item.beginsWithLineBreak) {
                    glyph.beginsWithLineBreak = true;
                }

                glyph.parseCommand(item.cmd);
                glyph.targets = targets;

                targetStaff.addChild(glyph);

                // If the glyph has more targets coming, add line break flags
                if (!ended || item.targets.length > 0) {
                    glyph.endsWithLineBreak = true;
                    item.beginsWithLineBreak = true;
                }

                // If the glyph is ended and has no more targets, 
                // garbage collect it
                else {
                    ctx.ended.splice(ctx.ended.indexOf(item), 1);
                }
            }
        }
    }

    //
    // function commandType()
    //
    // Given a command object from a document, returns the type of command.
    // Used internally by the parser.
    //
    var commandType = function(cmd) {
        var commands = [
            'show', 'begin', 'end', 'break', 'clef',
            'title', 'composer', 'arranged', 'year',
        ];

        for (var i = 0; i < commands.length; ++i) {
            if (cmd.hasOwnProperty(commands[i])) {
                return commands[i];
            }
        }
    }

    //
    // function handleShowCommand()
    //
    // Helper for Notate.layout() that runs whenever layout() encounters a
    // show: 'something' command.
    //
    // @param cmd   The show command
    // @param ctx   The layout context to apply the command to
    //
    var handleShowCommand = function(cmd, ctx) {
        var type = cmd['show'];
        var doc = ctx.outdoc;
        var measure = ctx.measure;

        if (type == 'measure') {
            measure.push(new Notate.showable['bar']());

            if (doc.needsLineBreakFor(measure)) {
                handleLineBreak(ctx);
            }

            doc.addMeasure(ctx.measure);
            ctx.measure = [ ];
        }
        else if (Notate.showable.hasOwnProperty(type)) {
            var glyph = new Notate.showable[type]();
            glyph.parseCommand(cmd);

            ctx.measure.push(glyph);
            for (var i = 0; i < ctx.begun.length; ++i) {
                ctx.begun[i].targets.push(glyph);
            }
        }
        else {
            console.log('Unknown showable in Notate.layout(): ' + type);
        }
    }

    //
    // function handleBeginCommand()
    //
    // Helper for Notate.layout() that runs whenever layout() encounters a
    // begin: 'something' command.
    //
    // @param cmd   The begin command
    // @param ctx   The layout context to apply the command to
    //
    var handleBeginCommand = function(cmd, ctx) {
        var type = cmd['begin'];

        if (Notate.beginnable.hasOwnProperty(type)) {
            ctx.begun.push({ 
                cmd: cmd,
                targets: [ ],
                type: type,
                name: cmd['named'] || null,
            });
        }
        else {
            console.log('Unknown beginnable in Notate.layout(): ' + type);
        }
    }

    //
    // function handleEndCommand()
    //
    // Helper for Notate.layout() that runs whenever layout() encounters a
    // end: 'something' command.
    //
    // @param cmd   The end command
    // @param ctx   The layout context to apply the command to
    //
    var handleEndCommand = function(cmd, ctx) {
        var name = cmd['named'];
        var type = cmd['end'];

        // n.b. we loop through the list backwards here so we always end the
        // matching glyph that was most recently begun. That way, if you nest
        // multiple of the same glyph for some reason, Notate does what you'd
        // expect.

        for (var i = ctx.begun.length - 1; i >= 0; --i) {
            var item = ctx.begun[i];

            var match = (name && (item.name == name)) ||
                        (item.type == type);

            if (match) {
                ctx.begun.splice(i, 1);
                ctx.ended.push(item);
                return;
            }
        }

        console.log('No ' + type + (name ? ' named ' + name : '') +
                    ' to end in Notate.layout()');
    }

    //
    // function handleLineBreak()
    //
    // Inserts a new staff into the document.
    // Adds glyphs from pending begin/end commands as necessary.
    //
    // @param ctx   The current layout context
    //
    var handleLineBreak = function(ctx) { 
        addBeginEndGlyphs(ctx);
        ctx.outdoc.breakLine();
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
            outdoc: new Notate.showable['document'](), // The final document
            measure: [ ],   // The glyphs that will form the next document
            begun: [ ],     // State for begin:s without end:s
            ended: [ ],     // State for end:s that aren't in outdoc yet
        };

        context.outdoc.right = 800; // TODO pass this in somehow
        context.outdoc.breakLine(); // Create the first measure

        // Parse each command
        for (var i = 0; i < doc.length; ++i) {
            var cmd = doc[i];
            var ctype = commandType(cmd);

            if (ctype == 'show') {
                handleShowCommand(cmd, context);
            }
            else if (ctype == 'begin') {
                handleBeginCommand(cmd, context);
            }
            else if (ctype == 'end') {
                handleEndCommand(cmd, context);
            }
            else if (ctype == 'break') {
                handleLineBreak(context);
            }
            else {
                console.log('Unknown command type in Notate.layout(): ' 
                            + ctype);
            }
        }

        // Finish the document
        if (context.measure.length > 0) {
            if (context.outdoc.needsLineBreakFor(context.measure)) {
                handleLineBreak(context);
            }

            context.outdoc.addMeasure(context.measure);
            context.measure = [ ];
        }

        addBeginEndGlyphs(context);
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

    Notate.showable = { };  // For glyphs that can be used with show:
    Notate.beginnable = { }; // For glyphs that can be used with begin:

    return Notate;
}());

