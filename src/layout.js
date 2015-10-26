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

        // Scan the command list to generate glyphs
        var blockGlyphs = [ ];
        commands.forEach(function(cmd) {
            if (cmd.hasOwnProperty('show')) {
                var type = cmd.show;

                var generator = Notate.BlockGenerators[type];
                if (!generator) {
                    throw "Unknown block glyph type: " + type;
                }

                blockGlyphs.push(generator(cmd));
            }
        });

        // The document must always end with a measure bar
        if (blockGlyphs.length == 0 ||
            blockGlyphs[blockGlyphs.length - 1].type() != "measure") {

            blockGlyphs.push(new Notate.MeasureBar());
        }

        // Break measures into multiple lines based on the document's width
        var lines = [ ];

        var currentLine = [ ];
        var currentLineWidth = 0;
        var currentMeasure = [ ];
        var currentMeasureWidth = 0;

        var staffWidth = documentWidth - 2 * opt.MARGIN_HORIZ;

        blockGlyphs.forEach(function(glyph) {

            // Add the glyph to the current measure
            currentMeasure.push(glyph);

            glyph.calcBounds();
            currentMeasureWidth += glyph.width();

            // If the glyph is the end of a measure, add the measure to a line
            if (glyph.type() == "measure") {

                // Start a new line if needed
                if (currentLineWidth + currentMeasureWidth > staffWidth) {
                    lines.push(currentLine);
                    currentLine = [ ];
                    currentLineWidth = 0;
                }

                // Add the measure to the current line
                currentMeasure.forEach(function(glyph) {
                    currentLine.push(glyph);
                    currentLineWidth += glyph.width();
                });

                currentMeasure = [ ];
                currentMeasureWidth = 0;
            }
        });

        if (currentLine.length > 0) {
            lines.push(currentLine);
        }

        // FUTURE: Generate and place annotations in the document

        // Generate staves to hold the block glyphs
        var staves = [ ];
        lines.forEach(function(line) {
            var staff = new Notate.Staff();
            staff.right = staffWidth;

            line.forEach(function(glyph) {
                staff.addChild(glyph);
            });

            staves.push(staff);
        });
        
        // Space the block glyphs horizontally along each staff
        staves.forEach(function(staff) {
            var x = 0;
            staff.children.forEach(function(glyph) {
                glyph.moveBy(x - glyph.leftEdge(), 0);
                x += glyph.width();
            });
        });

        // Place each staff's final measure bar at the end of the staff
        staves.forEach(function(staff) {
            var bar = staff.children[staff.children.length - 1];
            if (bar.type() != "measure") {
                throw "Staff did not end with a measure bar";
            }

            staff.calcBounds();
            bar.move(staff.rightEdge(), 0);
        });

        // Add staves a document and space them vertically
        var doc = new Notate.Document();
        var y = opt.MARGIN_VERT;
        staves.forEach(function(staff) {
            staff.move(opt.MARGIN_HORIZ, y - staff.topEdge());
            doc.addChild(staff);

            y += staff.height() + opt.STAFF_SPACING;
        });

        return doc;
    }

})(Notate);
