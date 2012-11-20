
// 
// document glyph
//
// The document glyph exists only to be the root of the glyph tree. It serves
// no particular purpose.
//

(function(Notate) {

    Notate.sizeCallback['document'] = function() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    Notate.layoutCallback['document'] = function(doc) { }

    Notate.renderCallback['document'] = function(a, b, c, d, e) { }

})(Notate);

