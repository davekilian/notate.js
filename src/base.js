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

var Notate = (function() {
    "use strict";

    // Options which affect glyph sizes and shapes.
    // Modifying these options affects global document style.
    //
    var RenderOptions = function() {
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
    };


    // Glyph is the base type for all renderable artifacts of a notate.js
    // document. Notate.layout produces a glyph tree, and Notate.render renders
    // it.
    //
    // Each glyph is a node in a tree. Every glyph except the root glpyh has a
    // reference to its parent, and every parent glyph contains a list of child
    // glpyh references.
    //
    // A glyph tree is rendered using a preorder traversal; this means that, by
    // default, each glyph is drawn before its children, and thus appears
    // behind its children in terms of z-order. 
    //
    // Each glyph has a boundary rectangle defining its location and size
    // within the document. The boundary rectangle is defined in terms of
    // document-relative pixel coordinates; glyph locations are not defined
    // relative to their parents. When moving a glyph, always use .move() or
    // .moveBy() to move all of the glyph's child coordinates.
    //
    function Glyph() {
        this.x = 0;         // Pixel coordinate of the bounding rect's left edge
        this.y = 0;         // Pixel coordinate of the bounding rect's top edge
        this.width = 0;     // Width of the bounding rect, in pixels
        this.height = 0;    // Height of the bounding rect, in pixels
        this.parent = null; // Reference to the parent glyph (null for the root)
        this.children = []; // References to child glyphs
    }

    Glyph.prototype.top = function() { return this.y; }
    Glyph.prototype.bottom = function() { return this.y + this.height; }
    Glyph.prototype.left = function() { return this.x; }
    Glyph.prototype.right = function() { return this.x + this.width; }

    Glyph.prototype.addChild = function(child) {
        child.parent = this;
        this.children.push(child);
    }

    Glyph.prototype.removeChild = function(child) {
        if (child.parent == this) {
            child.parent = null;
        }

        var index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    Glyph.prototype.walk = function(callback) {
        callback(this);

        children.forEach(function(child) {
            child.walk(callback);
        });
    }

    Glyph.move = function(x, y) { this.moveBy(x - this.x, y - this.y); }
    Glyph.moveBy = function(dx, dy) {
        this.walk(function(glyph) {
            glyph.x += dx;
            glyph.y += dy;
        });
    }


    var Notate = { };
    Notate.Glyph = Glyph;
    Notate.renderOptions = RenderOptions;

    return Notate;

})();
