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

    // Options which affect glyph sizes and shapes.
    // Modifying these options affects global document style.
    //
    var opt = { };

    opt.FONT_FAMILY = 'serif';
    opt.FONT_STYLE = 'bold italic';
    opt.FOREGROUND_COLOR = '#333';
    opt.BACKGROUND_COLOR = '#fff';
    opt.MARGIN_HORIZ = 30;
    opt.MARGIN_VERT = 50;
    opt.STAFF_LINE_HEIGHT = 1;
    opt.STAFF_LINE_SPACING = 8;
    opt.STAFF_SPACING = 50;
    opt.STAFF_LINE_COUNT = 5;
    opt.NOTE_HEAD_RADIUS_MIN = 4;
    opt.NOTE_HEAD_RADIUS_MAX = 6;
    opt.NOTE_HEAD_ROTATION = -.5;
    opt.NOTE_SPACING = 23;
    opt.HALFNOTE_INNER_RADIUS_MIN = 2;
    opt.HALFNOTE_INNER_RADIUS_MAX = 5;
    opt.WHOLENOTE_INNER_RADIUS_MIN = 2.25;
    opt.WHOLENOTE_INNER_RADIUS_MAX = 3.25;
    opt.WHOLENOTE_INNER_ROTATION = 1;
    opt.NOTE_STEM_WIDTH = 1;
    opt.NOTE_STEM_HEIGHT = 30;
    opt.LEDGER_WIDTH = 18;
    opt.LEDGER_HEIGHT = 1;
    opt.BAR_LINE_WIDTH = 1;
    opt.BAR_BOLD_WIDTH = 3;
    opt.TUPLET_VMARGIN = 22;
    opt.TUPLET_HMARGIN = 3;
    opt.TUPLET_HEIGHT = 15;
    opt.TUPLET_FONT_SIZE = 13;
    opt.TUPLET_FONT_MARGIN = 5;
    opt.TUPLET_THICKNESS = 1;
    opt.SLUR_MARGIN = 3;
    opt.SLUR_HEIGHT = 5;
    opt.SLUR_THICKNESS = 1.5;

    opt.STAFF_HEIGHT = (opt.STAFF_LINE_COUNT - 1) * opt.STAFF_LINE_SPACING 
                      + opt.STAFF_LINE_HEIGHT;

    opt.STEM_OFFSET = (function(opt) {
        var a = opt.NOTE_HEAD_RADIUS_MAX,
        b = opt.NOTE_HEAD_RADIUS_MIN,
        theta = -opt.NOTE_HEAD_ROTATION,
        bCosTheta = b * Math.cos(theta),
        aSinTheta = a * Math.sin(theta);

        return a * b / Math.sqrt(bCosTheta * bCosTheta + aSinTheta * aSinTheta) - 1.0;
    })(opt);

    Notate.RenderOptions = opt;

})(Notate);
