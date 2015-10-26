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

    Notate.Stem = function(flipped) {
        Notate.Block.call(this);

        var opt = Notate.RenderOptions;
        this.top = -opt.NOTE_STEM_HEIGHT;
        this.right = opt.NOTE_STEM_WIDTH;

        if (flipped) {
            this.moveBy(-opt.STEM_OFFSET - 1, opt.NOTE_STEM_HEIGHT + 1);
        }
        else {
            this.moveBy(opt.STEM_OFFSET - 1, -1);
        }
    }

    Notate.Stem.prototype = new Notate.Block();

    Notate.Stem.prototype.type = function() { return "stem"; }

    Notate.Stem.prototype.render = function(canvas, ctx) {
        var opt = Notate.RenderOptions;

        ctx.fillRect(this.leftEdge(),
                     this.topEdge(),
                     this.width(),
                     this.height());
    }

})(Notate);
