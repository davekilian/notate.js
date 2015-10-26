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

    Notate.Flags = function(flagCount, flipped) {
        Notate.Block.call(this);

        var opt = Notate.RenderOptions;

        this.flagCount = flagCount;
        this.flipped = flipped;

        var width = 11.2;
        var height = 21.5;

        if (flipped) {
            this.moveBy(-opt.STEM_OFFSET - 1, opt.NOTE_STEM_HEIGHT + 1);

            this.top = height;
            this.left = width;
        }
        else {
            this.moveBy(opt.STEM_OFFSET - 1, -opt.NOTE_STEM_HEIGHT - 1);

            this.bottom = height;
            this.right = width;
        }
    }

    Notate.Flags.prototype = new Notate.Block();

    Notate.Flags.prototype.type = function() { return "flags"; }

    Notate.Flags.prototype.render = function(canvas, ctx) {
        var x = this.x;
        var y = this.y;

        for (var i = 0; i < this.flagCount; ++i) {
            ctx.save();

            if (this.flipped) {
                ctx.translate(x, y - 6 * i);
                ctx.scale(1.0, -1.0);
            } else {
                ctx.translate(x, y + 6 * i);
            }

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

})(Notate);
