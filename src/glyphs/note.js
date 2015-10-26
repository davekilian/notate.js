// notate.js
// Copyright (c) 2015 David Kilian
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
(function(Notate) {
    "use strict";

    Notate.Note = function() {
        Notate.Block.call(this);

        var r = Notate.RenderOptions.NOTE_HEAD_RADIUS_MAX;
        var s = Notate.RenderOptions.NOTE_SPACING;

        this.x = 0;
        this.y = 0;

        this.top = -r;
        this.bottom = r;
        this.left = -r - .5 * s;
        this.right = r + .5 * s;
    }

    Notate.Note.prototype = new Notate.Block();

    Notate.Note.prototype.type = function() { return "note"; }

    Notate.BlockGenerators['note'] = function(cmd) {
        var opt = Notate.RenderOptions;

        var result = new Notate.Note();

        // Parse the 'length' parameter. If the length is specified using a
        // short form nickname, convert it to the corresponding long form name
        // (i.e. 1/N).
        //
        if (cmd.length == 'whole')             result.duration = '1/1';
        else if (cmd.length == 'half')         result.duration = '1/2';
        else if (cmd.length == 'quarter')      result.duration = '1/4';
        else if (cmd.length == 'eighth')       result.duration = '1/8';
        else if (cmd.length == 'sixteenth')    result.duration = '1/16';
        else if (cmd.length == 'thirtysecond') result.duration = '1/32';
        else if (cmd.length == 'sixtyfourth')  result.duration = '1/64';
        else                                   result.duration = cmd.length;

        // Determine the note's number of half steps from the top of the staff
        //
        // FUTURE: This currently assumes trble clef. To support other clefs,
        // the layout engine needs to store the current clef and pass it along
        // here.
        //
        var clefNote = 'F'.charCodeAt(0);
        var clefOctave = 5;

        var note = cmd.pitch.charCodeAt(0);
        var octave = parseInt(cmd.pitch.charAt(1));

        result.pitch = cmd.pitch;
        result.halfSteps = 7 * (octave - clefOctave) + (note - clefNote);

        // Using the number of half steps, determine the note's pixel offset
        // from the top of the staff.
        //
        var y = -result.halfSteps * .5 * opt.STAFF_LINE_SPACING + .5;
        y = y | 0;

        result.pixelOffset = y;
        result.moveBy(0, y);

        return result;
    }

    // Renders the outer (black) section of a note's head
    function renderNoteHeadOuter(canvas, ctx, x, y, rotation) {
        var opt = Notate.RenderOptions;

        ctx.save();

        ctx.translate(x - 0.5, y + 0.5);
        ctx.rotate(rotation);
        ctx.scale(1.0 * opt.NOTE_HEAD_RADIUS_MAX / opt.NOTE_HEAD_RADIUS_MIN, 1.0);

        ctx.beginPath();
        ctx.arc(0, 0, opt.NOTE_HEAD_RADIUS_MIN, 0, 6.28, false);
        ctx.fill();

        ctx.restore();
    }

    // Renders the inner (white) section of a note's head =
    // (used for whole and half notes only)
    //
    function renderNoteHeadInner(canvas, ctx, x, y, minRadius, maxRadius, rotation) {
        var opt = Notate.RenderOptions;

        ctx.fillStyle = opt.BACKGROUND_COLOR;
        ctx.save();

        ctx.translate(x - 0.5, y + 0.5);
        ctx.rotate(rotation);
        ctx.scale(1.0 * maxRadius / minRadius, 1.0);

        ctx.beginPath();
        ctx.arc(0, 0, minRadius, 0, 6.28, false);
        ctx.fill();

        ctx.restore();
        ctx.fillStyle = opt.FOREGROUND_COLOR;
    }

    function renderLedgers(canvas, ctx, x, y, note) {
        var opt = Notate.RenderOptions;

        var dy = note.pixelOffset;
        if (dy >= 0 && dy <= h)
            return;

        var noteY = y;
        var staffY = y - dy;
        var h = (opt.STAFF_LINE_COUNT - 1) * opt.STAFF_LINE_SPACING;

        var min = 0, max = 0;

        if (dy < 0) {   // Ledgers above staff line
            min = Math.floor(noteY - ((dy - 1) % opt.STAFF_LINE_SPACING));
            max = Math.floor(staffY);
        }
        else {          // Ledgers below staff line
            min = Math.floor(staffY + h + opt.STAFF_LINE_SPACING + 1);
            max = Math.floor(noteY);
        }

        var w = opt.LEDGER_WIDTH, h = opt.LEDGER_HEIGHT;
        for (var y = min; y <= max; y += opt.STAFF_LINE_SPACING) {
            ctx.fillRect(x - .5 * w, y, w, h);
        }
    }

    Notate.Note.prototype.render = function(canvas, ctx) {
        var opt = Notate.RenderOptions;

        var r = Notate.RenderOptions.NOTE_HEAD_RADIUS_MAX;
        var x = this.x;
        var y = this.y;

        renderLedgers(canvas, ctx, x, y, this);

        var rotation = (this.duration == "1/1") ? 0 : opt.NOTE_HEAD_ROTATION;
        renderNoteHeadOuter(canvas, ctx, x, y, rotation);

        var isHollow = (this.duration == "1/1") || (this.duration == "1/2");
        if (isHollow) {
            var minRadius, maxRadius;

            if (this.duration == "1/1") {
                minRadius = opt.WHOLENOTE_INNER_RADIUS_MIN;
                maxRadius = opt.WHOLENOTE_INNER_RADIUS_MAX;
                rotation = opt.WHOLENOTE_INNER_ROTATION;
            } else {
                minRadius = opt.HALFNOTE_INNER_RADIUS_MIN;
                maxRadius = opt.HALFNOTE_INNER_RADIUS_MAX;
            }

            renderNoteHeadInner(canvas, ctx, x, y, minRadius, maxRadius, rotation);
        }
    }

})(Notate);
