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
        this.x = 0;         // Horizontal origin point coordinate, in pixels
        this.y = 0;         // Vertical origin point coordinate in pixels
        this.top = 0;       // Pixel offset between this.y and the bound rect's top
        this.bottom = 0;    // Pixel offset between this.y and the bound rect's bottom
        this.left = 0;      // Pixel offset between this.x and the bound rect's left edge
        this.right = 0;     // Pixel offset between this.x and the bound rect's right edge
        this.parent = null; // Reference to the parent glyph (null for the root)
        this.children = []; // References to child glyphs
    }

    // Gets the width of this glyph's bounding rectangle in pixels
    Notate.Glyph.prototype.width = function() { return this.right - this.left; }

    // Gets the height of this glyph's bounding rectangle in pixels
    Notate.Glyph.prototype.height = function() { return this.bottom - this.top; }

    // Gets the pixel coordinate of this glyph's top edge
    Notate.Glyph.prototype.topEdge = function() { return this.y + this.top; }

    // Gets the pixel coordinate of this glyph's bottom edge
    Notate.Glyph.prototype.bottomEdge = function() { return this.y + this.bottom; }

    // Gets the pixel coordinate of this glyph's left edge
    Notate.Glyph.prototype.leftEdge = function() { return this.x + this.left; }

    // Gets the pixel coordinate of this glyph's right edge
    Notate.Glyph.prototype.rightEdge = function() { return this.x + this.right; }

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
    Notate.Glyph.prototype.walkPre = function(callback) {
        callback(this);
        this.children.forEach(function(child) {
            child.walkPre(callback);
        });
    }

    // Walks this glyph's hierarchy using a postorder traversal,
    // calling the given callback function at each node.
    //
    Notate.Glyph.prototype.walkPost = function(callback) {
        this.children.forEach(function(child) {
            child.walkPost(callback);
        });
        callback(this);
    }

    // Recursively computes this Glyph's bounding rectangle as the minimum
    // bounding rectangle containing both this Glyph's bounds and all its
    // children's bounds, recursively.
    //
    Notate.Glyph.prototype.calcBounds = function() {
        var top = this.topEdge();
        var bottom = this.bottomEdge();
        var left = this.leftEdge();
        var right = this.rightEdge();

        this.walkPost(function(child) {
            var t = child.topEdge();
            if (t < top) {
                top = t;
            }

            var b = child.bottomEdge();
            if (b > bottom) {
                bottom = b;
            }

            var l = child.leftEdge();
            if (l < left) {
                left = l;
            }

            var r = child.rightEdge();
            if (r > right) {
                right = r;
            }
        });

        this.top = top - this.y;
        this.bottom = bottom - this.y;
        this.left = left - this.x;
        this.right = right - this.x;
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
        this.walkPre(function(glyph) {
            glyph.x += dx;
            glyph.y += dy;
        });
    }

    // Returns a string which uniquely identifies the subtype of the
    // Notate.Glyph.
    //
    // This is a dummy implementation which throws unconditionally.
    // Subtypes of Notate.Glyph must override this method.
    //
    Notate.Glyph.prototype.type = function() {
        throw "Notate.Glyph subtype must override .type()";
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
