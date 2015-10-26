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

    // Notate.Block is the subtype of Notate.Glyph used for 'block' glyphs.
    // Block glyphs are the backbone of a musical document. Block glyphs stack
    // horizontally, and occupy horizontal space (that is, block glyphs cannot
    // overlap vertically). 
    //
    // Block glyphs are displayed in a measure by stacking them horizontally
    // side by side. Any required spacing is defined within the bounds of glyph
    // itself; as a result, the pixel width of a measure is simply the sum of
    // the pixel widths of that measure's block glyphs.
    //
    Notate.Block = function() {
        Notate.Glyph.call(this);
    }

    Notate.Block.prototype = new Notate.Glyph();

    // Defines a mapping between 'show' command types and constructor functions
    // which can produce a Notate.Block glyph for the given show command.
    //
    // Block glyphs can register themselves in this array upon inclusion of
    // their .js file.
    //
    // When Notate.layout() encounters a show='type' command, it executes
    // Notate.BlockGenerators['type'], passing in the command object and
    // expecting a Notate.Block object in return. If there is no item for
    // 'type' in BlockGenerators, Notate.layout() fails.
    //
    Notate.BlockGenerators = { };

})(Notate);
