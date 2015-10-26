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

    // Produces a glyph tree from the given command list.
    //
    // The resulting glyph tree can be rendered by passing it to
    // Notate.render() along with an HTML5 canvas object.
    //
    // documentWidth will be used to automatically break lines into multiple
    // staves, and should match the pixel width of the canvas the resulting
    // glyph tree will be rendered to.
    //
    Notate.layout = function(commands, documentWidth) {
        var opt = Notate.RenderOptions;

        // DEBUG: just return a single staff glyph
        var staff = new Notate.Staff();
        staff.moveBy(opt.MARGIN_HORIZ, opt.MARGIN_VERT);
        staff.width = documentWidth - 2 * opt.MARGIN_HORIZ;

        return staff;
    }

})(Notate);