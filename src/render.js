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

    // Renders the given glyph tree to the given HTML5 canavs.
    // ctx is the rendering context associated with the given canvas.
    //
    Notate.render = function(canvas, ctx, tree) {
        ctx.fillStyle = Notate.RenderOptions.FOREGROUND_COLOR;

        tree.walkPre(function(glyph) {
            glyph.render(canvas, ctx);
        });
    }

})(Notate);
