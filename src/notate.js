
var Notate = (function() {

    var Notate = { };

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

    }

    Notate.Glyph = Glyph;
    Notate.layout = layout;
    Notate.render = render;
    return Notate;

}());


//
// DEBUG
// code from old prototype
// Should be superceded by actual library components ^^
//

            /** The horizontal page margins, in pixels */
            var MARGIN_HORIZ = 30;
            /** The vertical page margins, in pixels */
            var MARGIN_VERT = 50;
            /** Height of a line of the staff, in pixels */
            var STAFF_LINE_HEIGHT = 1;
            /** Number of pixels of blank space between staff lines, in pixels */
            var STAFF_LINE_SPACING = 8;
            /** Number of pixels between staves, in pixels */
            var STAFF_SPACING = 50;
            /** Number of lines in a staff */
            var STAFF_LINE_COUNT = 5;
            /** The radius of the note head at its narrowest point, in pixels */
            var NOTE_HEAD_RADIUS_MIN = 4;
            /** The radius of the note head at its widest point, in pixels */
            var NOTE_HEAD_RADIUS_MAX = 6;
            /** The rotation of the note head, in radians */
            var NOTE_HEAD_ROTATION = -.5;
            /** The radius of the hollow region of the half note head at its narrowest point, in pixels */
            var HALFNOTE_INNER_RADIUS_MIN = 2;
            /** The radius of the hollow region of the half note head at its widest point, in pixels */
            var HALFNOTE_INNER_RADIUS_MAX = 5;
            /** The radius of the hollow region of the whole note head at its narrowest point, in pixels */
            var WHOLENOTE_INNER_RADIUS_MIN = 2.25;
            /** The radius of the hollow region of the whole note head at its widest point, in pixels */
            var WHOLENOTE_INNER_RADIUS_MAX = 3.25;
            /** The rotation of the hollow region of the whole note head, in radians */
            var WHOLENOTE_INNER_ROTATION = 1;
            /** The width of the note flag, in pixels */
            var NOTE_FLAG_WIDTH = 12;
            /** The height of the note flag, in pixels */
            var NOTE_FLAG_HEIGHT = 20;
            /** The width of the note stem, in pixels */
            var NOTE_STEM_WIDTH = 1;
            /** The height of the note stem, in pixels */
            var NOTE_STEM_HEIGHT = 30;
            /** The width of non-bold bar lines, in pixels */
            var BAR_LINE_WIDTH = 1;
            /** The width of the bold bar line, in pixels */
            var BAR_BOLD_WIDTH = 3;

            function dimensions(canvas) {
                var w = canvas.width,
                    h = canvas.height;

                if (window.devicePixelRatio) {
                    var ratio = window.devicePixelRatio;
                    w /= ratio;
                    h /= ratio;
                }

                return [w, h];
            }

            function renderNoteHead(canvas, ctx, x, y, style) {
                if (style != 'whole') {

                    // Filled region
                    ctx.save();

                    ctx.translate(x, y);
                    ctx.rotate(NOTE_HEAD_ROTATION);
                    ctx.scale(1.0 * NOTE_HEAD_RADIUS_MAX / NOTE_HEAD_RADIUS_MIN, 1);

                    ctx.beginPath();
                    ctx.arc(0, 0, NOTE_HEAD_RADIUS_MIN, 0, 6.28, false);
                    ctx.fill();

                    ctx.restore();

                    // Hollow region
                    if (style == 'half') {
                        ctx.fillStyle = 'rgb(255, 255, 255)';

                        ctx.save();

                        ctx.translate(x, y);
                        ctx.rotate(NOTE_HEAD_ROTATION);
                        ctx.scale(1.0 * HALFNOTE_INNER_RADIUS_MAX / HALFNOTE_INNER_RADIUS_MIN, 1);

                        ctx.beginPath();
                        ctx.arc(0, 0, HALFNOTE_INNER_RADIUS_MIN, 0, 6.28, false);
                        ctx.fill();

                        ctx.restore();

                        ctx.fillStyle = 'rgb(0, 0, 0)';

                    } 
                } else {

                    // Filled region
                    ctx.save();

                    ctx.translate(x, y);
                    ctx.scale(1.0 * NOTE_HEAD_RADIUS_MAX / NOTE_HEAD_RADIUS_MIN, 1);

                    ctx.beginPath();
                    ctx.arc(0, 0, NOTE_HEAD_RADIUS_MIN, 0, 6.28, false);
                    ctx.fill();

                    ctx.restore();

                    // Hollow region
                    ctx.fillStyle = 'rgb(255, 255, 255)';

                    ctx.save();

                    ctx.translate(x, y);
                    ctx.rotate(WHOLENOTE_INNER_ROTATION);
                    ctx.scale(1.0 * WHOLENOTE_INNER_RADIUS_MAX / WHOLENOTE_INNER_RADIUS_MIN, 1);

                    ctx.beginPath();
                    ctx.arc(0, 0, WHOLENOTE_INNER_RADIUS_MIN, 0, 6.28, false);
                    ctx.fill();

                    ctx.restore();

                    ctx.fillStyle = 'rgb(0, 0, 0)';
                }
            }

            function noteStemOffset() {
                
                var a = NOTE_HEAD_RADIUS_MAX,
                    b = NOTE_HEAD_RADIUS_MIN,
                    theta = -NOTE_HEAD_ROTATION,
                    bCosTheta = b * Math.cos(theta),
                    aSinTheta = a * Math.sin(theta),
                    r = a * b / Math.sqrt(bCosTheta * bCosTheta + aSinTheta * aSinTheta);

                return r;
            }

            function renderNoteStem(canvas, ctx, x, y) {
                ctx.fillRect(x + noteStemOffset() - .75 * NOTE_STEM_WIDTH,
                             y - NOTE_STEM_HEIGHT,
                             NOTE_STEM_WIDTH,
                             NOTE_STEM_HEIGHT);
            }

            function renderNoteFlag(canvas, ctx, x, y, dy) {

                x += noteStemOffset();

                ctx.beginPath();

                var w = NOTE_FLAG_WIDTH;
                var h = NOTE_FLAG_HEIGHT;

                ctx.moveTo(x, y);
                ctx.quadraticCurveTo(x + w, y,          x + w, y + h);
                ctx.quadraticCurveTo(x + w, y + .5 * h, x,     y + .17 * h);

                ctx.closePath();

                ctx.fill();
            }

            function renderSixteenthNote(canvas, ctx, x, y) {
                renderNoteHead(canvas, ctx, x, y, 'sixteenth');
                renderNoteStem(canvas, ctx, x, y);
                renderNoteFlag(canvas, ctx, x, y - NOTE_STEM_HEIGHT);
                renderNoteFlag(canvas, ctx, x, y - .75 * NOTE_STEM_HEIGHT);
            }

            function renderEighthNote(canvas, ctx, x, y) {
                renderNoteHead(canvas, ctx, x, y, 'eighth');
                renderNoteStem(canvas, ctx, x, y);
                renderNoteFlag(canvas, ctx, x, y - NOTE_STEM_HEIGHT);
            }

            function renderQuarterNote(canvas, ctx, x, y) {
                renderNoteHead(canvas, ctx, x, y, 'quarter');
                renderNoteStem(canvas, ctx, x, y);
            }

            function renderHalfNote(canvas, ctx, x, y) {
                renderNoteHead(canvas, ctx, x, y, 'half');
                renderNoteStem(canvas, ctx, x, y);
            }

            function renderWholeNote(canvas, ctx, x, y) {
                renderNoteHead(canvas, ctx, x, y, 'whole');
            }

            function translateNoteLength(length) {
                if (length == "whole")
                    return "1/1";
                if (length == "half")
                    return "1/2";
                if (length == "quarter")
                    return "1/4";
                if (length == "eighth")
                    return "1/8";
                if (length == "sixteenth")
                    return "1/16";

                return name;
            }

            function renderLegers(canvas, ctx, x, y, dy) {
                h = (STAFF_LINE_COUNT - 1) * STAFF_LINE_SPACING;
                if (dy >= 0 && dy <= h)
                    return;

                var min = 0, max = 0;

                if (dy < 0) {
                    min = y + dy;
                    max = y;
                } else {
                    min = y + h + STAFF_LINE_SPACING;
                    max = y + dy;
                }

                for (var y = min; y < max; y += STAFF_LINE_SPACING) {
                    ctx.fillRect(x - 9, y, 18, 1);
                }
            }

            function pitchOffset(pitch) {
                // Origin is at top of treble staff, or F5
                var ORIGIN_NOTE = "F".charCodeAt(0);
                var ORIGIN_PITCH = 5;

                var octave = parseInt(pitch.charAt(pitch.length - 1));

                var note = pitch.charCodeAt(0);

                var delta = 7 * (octave - ORIGIN_PITCH) + (note - ORIGIN_NOTE);
                return -delta * .5 * STAFF_LINE_SPACING + 0.5;
            }

            function renderNote(canvas, ctx, x, y, n) {
                n.length = translateNoteLength(n.length);

                var dy = pitchOffset(n.pitch);
                renderLegers(canvas, ctx, x, y, dy);
                
                if (n.length == "1/1")
                    renderWholeNote(canvas, ctx, x, y + dy);
                else if (n.length == "1/2")
                    renderHalfNote(canvas, ctx, x, y + dy);
                else if (n.length == "1/4")
                    renderQuarterNote(canvas, ctx, x, y + dy);
                else if (n.length == "1/8")
                    renderEighthNote(canvas, ctx, x, y + dy);
                else if (n.length == "1/16")
                    renderSixteenthNote(canvas, ctx, x, y + dy);

                return 23;
            }

            function renderBarLine(canvas, ctx, x, y) {
                h = (STAFF_LINE_COUNT - 1) * STAFF_LINE_SPACING;

                ctx.fillRect(x, y, BAR_LINE_WIDTH, h);
            }

            function renderMeasure(canvas, ctx, x, y, m) {
                x += 10;

                for (var i = 0; i < m.notes.length; ++i) 
                    x += renderNote(canvas, ctx, x, y, m.notes[i]);

                renderBarLine(canvas, ctx, x, y);

                return x + 7;
            }

            function renderDocument(canvas, ctx, x, y, d) {
                for (var i = 0; i < d.length; ++i)
                    x = renderMeasure(canvas, ctx, x, y, d[i]);
            }

            function renderStaff(canvas, ctx) {
                var dim = dimensions(canvas),
                    w = dim[0], h = dim[1];

                ctx.fillStyle = 'rgb(0, 0, 0)';

                var y = MARGIN_VERT;
                while (y < canvas.height - MARGIN_VERT) {

                    renderBarLine(canvas, ctx, MARGIN_HORIZ, y);
                    renderBarLine(canvas, ctx, w - MARGIN_HORIZ, y);

                    for (var i = 0; i < STAFF_LINE_COUNT; ++i) {
                        ctx.fillRect(MARGIN_HORIZ,
                                     y,
                                     w - 2 * MARGIN_HORIZ,
                                     STAFF_LINE_HEIGHT);


                        y += STAFF_LINE_SPACING;
                    }

                    y += STAFF_SPACING;
                }
            }

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
                renderStaff(canvas, ctx);

                doc = 
                [
                    {
                        "notes":
                        [
                            { "type": "note", "length": "whole", "dots": 0, "pitch": "C3", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "half", "dots": 0, "pitch": "D3", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "quarter", "dots": 0, "pitch": "E3", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "eighth", "dots": 0, "pitch": "F3", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "sixteenth", "dots": 0, "pitch": "G3", "accidental": "none", "bar": false, "slur": false },
                        ],
                    },
                    {
                        "notes":
                        [
                            { "type": "note", "length": "whole", "dots": 0, "pitch": "A4", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "half", "dots": 0, "pitch": "B4", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "quarter", "dots": 0, "pitch": "C4", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "eighth", "dots": 0, "pitch": "D4", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "sixteenth", "dots": 0, "pitch": "E4", "accidental": "none", "bar": false, "slur": false },
                        ],
                    },
                    {
                        "notes":
                        [
                            { "type": "note", "length": "whole", "dots": 0, "pitch": "F4", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "half", "dots": 0, "pitch": "G4", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "quarter", "dots": 0, "pitch": "A5", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "eighth", "dots": 0, "pitch": "B5", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "sixteenth", "dots": 0, "pitch": "C5", "accidental": "none", "bar": false, "slur": false },
                        ],
                    },
                    {
                        "notes":
                        [
                            { "type": "note", "length": "whole", "dots": 0, "pitch": "D5", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "half", "dots": 0, "pitch": "E5", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "quarter", "dots": 0, "pitch": "F5", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "eighth", "dots": 0, "pitch": "G5", "accidental": "none", "bar": false, "slur": false },
                            { "type": "note", "length": "sixteenth", "dots": 0, "pitch": "A6", "accidental": "none", "bar": false, "slur": false },
                        ],
                    },
                ];

                renderDocument(canvas, ctx, MARGIN_HORIZ, MARGIN_VERT, doc);
            }

