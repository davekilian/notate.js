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

    Notate.Staff = function() {
        Notate.Block.call(this);

        this.bottom = Notate.RenderOptions.STAFF_HEIGHT;
    }

    Notate.Staff.prototype = new Notate.Block();

    Notate.Staff.prototype.type = function() { return "staff"; }

    Notate.Staff.prototype.render = function(canvas, ctx) {
        var opt = Notate.RenderOptions;

        for (var i = 0; i < opt.STAFF_LINE_COUNT; ++i) {
            ctx.fillRect(this.leftEdge(),
                         this.y + i * opt.STAFF_LINE_SPACING,
                         this.width(),
                         opt.STAFF_LINE_HEIGHT);
        }

        ctx.fillRect(this.x, this.y, opt.BAR_LINE_WIDTH, opt.STAFF_HEIGHT);
    }

})(Notate);
