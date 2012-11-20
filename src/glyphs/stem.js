
//
// stem glyph
//
// The stem glyph renders a note's stem
//
    
(function(Notate) {

    Notate.sizeCallback['stem'] = function() {
        var s = Notate.settings;

        return { 
            top: -s.NOTE_STEM_HEIGHT, 
            bottom: 0,
            left: -.5 * s.NOTE_STEM_WIDTH,
            right: .5 * s.NOTE_STEM_WIDTH, 
        };
    }

    Notate.layoutCallback['stem'] = function(stem) { }

    Notate.renderCallback['stem'] = function(canvas, ctx, stem, x, y) {
        var translate = Notate.Helpers.translate;
        var rect = translate(stem, { x: 0, y: 0 }, { x: x, y: y });
        ctx.fillRect(rect.left, rect.top, rect.width(), rect.height());
    }

})(Notate);

