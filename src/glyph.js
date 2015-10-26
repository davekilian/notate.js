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
    Notate.Glyph = function() {
        this.x = 0;         // Pixel coordinate of the bounding rect's left edge
        this.y = 0;         // Pixel coordinate of the bounding rect's top edge
        this.width = 0;     // Width of the bounding rect, in pixels
        this.height = 0;    // Height of the bounding rect, in pixels
        this.parent = null; // Reference to the parent glyph (null for the root)
        this.children = []; // References to child glyphs
    }

    // Gets the pixel coordinate of the top of this glyph's bounding rectangle
    Notate.Glyph.prototype.top = function() { return this.y; }

    // Gets the pixel coordinate of the bottom of this glyph's bounding rectangle
    Notate.Glyph.prototype.bottom = function() { return this.y + this.height; }

    // Gets the pixel coordinate of the left edge of this glyph's bounding rectangle
    Notate.Glyph.prototype.left = function() { return this.x; }

    // Gets the pixel coordinate of the right edge of this glyph's bounding rectangle
    Notate.Glyph.prototype.right = function() { return this.x + this.width; }

    // Adds a child glyph to this glyph's hierarchy
    Notate.Glyph.prototype.addChild = function(child) {
        child.parent = this;
        this.children.push(child);
    }

    // Removes a child glyph from this glyph's hierarchy
    Notate.Glyph.prototype.removeChild = function(child) {
        if (child.parent == this) {
            child.parent = null;
        }

        var index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    // Walks this glyph's hierarchy using a preorder traversal,
    // calling the given callback function at each node.
    //
    Notate.Glyph.prototype.walk = function(callback) {
        callback(this);
        this.children.forEach(function(child) {
            child.walk(callback);
        });
    }

    // Recursively computes this Glyph's bounding rectangle as the minimum
    // bounding rectangle containing both this Glyph's bounds and all its
    // children's bounds, recursively.
    //
    Notate.Glyph.prototype.calcBounds = function() {
        var top = this.top();
        var bottom = this.bottom();
        var left = this.left();
        var right = this.right();

        this.children.forEach(function(child) {
            child.calcBounds();

            var t = child.top();
            if (t < top) {
                top = t;
            }

            var b = child.bottom();
            if (b > bottom) {
                bottom = b;
            }

            var l = child.left();
            if (l < left) {
                left = l;
            }

            var r = child.right();
            if (r > right) {
                right = r;
            }
        });

        this.x = left;
        this.width = right - left;
        this.y = top;
        this.height = bottom - top;
    }

    // Moves this glyph so that its bounding rectangle's top left coordinate is
    // at the given pixel coordinates, and recursively moves this glyph's node
    // hierarchy by the same amount.
    // 
    Notate.Glyph.prototype.move = function(x, y) {
        this.moveBy(x - this.x, y - this.y);
    }

    // Moves this glyph and its child hierarchy by the given amount, in pixels.
    Notate.Glyph.prototype.moveBy = function(dx, dy) {
        this.walk(function(glyph) {
            glyph.x += dx;
            glyph.y += dy;
        });
    }

    // Notate.render() calls Notate.Glyph.render() recursively on each Glyph to
    // allow the Glyph to render itself in the document. 
    //
    // This is a dummy implementation of that API, and just logs a warning to
    // the debug console saying the method was not overridden.
    //
    Notate.Glyph.prototype.render = function(canvas, ctx) {
        console.warn("Glyph does not override render()");
        console.trace();
    }

})(Notate);
