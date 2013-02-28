
// 
// flags glyph
//
// The flags glyph renders one or more flags at the top of a note.
//

(function(Notate) {

    Notate.sizeCallback['flags'] = function() {
        return { top: 0, bottom: 21.5, left: 0, right: 11.2 };
    }

    Notate.layoutCallback['flags'] = function(flags) { }

    Notate.renderCallback['flags'] = function(canvas, ctx, flags) {
        var translate = Notate.Helpers.translate;
        var x = flags.x, 
            y = flags.y;

        for (var i = 0; i < flags.count; ++i) {
            ctx.save();

            if (flags.flipped) {
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

