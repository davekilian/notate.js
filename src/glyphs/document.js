
// 
// document glyph
//
// The document glyph exists only to be the root of the glyph tree.
// It has no behavior.
//

(function(Notate) {

    var Document = function() {
        Notate.Glyph.call(this);
    }

    Document.prototype = new Notate.Glyph();
    Document.prototype.constructor = Document;
    Notate.glyphs['document'] = Document;

    Document.prototype.minSize = function() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    Document.prototype.layout = function() { }

    Document.prototype.render = function(canvas, ctx) { }

})(Notate);

