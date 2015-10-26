
function redraw() {

    doc = [
        /*
        { title: "Hot Cross Buns (Dubstep Remix)" },
        { composer: "notate.js" },
        { clef: "treble" },
        { show: "clef", type: "treble" },
        { show: "timesig", over: 4, under: 4 },
        { show: "keysig", key: "C major" },
        */

        { show: "note", pitch: "A4", length: "1/1" },
        { show: "note", pitch: "B4", length: "1/2" },
        { show: "note", pitch: "C4", length: "1/4" },
        { show: "measure" },
        { show: "note", pitch: "D4", length: "1/8" },
        { show: "note", pitch: "E4", length: "1/16" },
        { show: "measure" },
        { show: "note", pitch: "F4", length: "1/32" },
        { show: "measure" },

        { show: "note", pitch: "A5", length: "1/1" },
        { show: "note", pitch: "B5", length: "1/2" },
        { show: "note", pitch: "C5", length: "1/4" },
        { show: "measure" },
        { show: "note", pitch: "D5", length: "1/8" },
        { show: "note", pitch: "E5", length: "1/16" },
        { show: "measure" },
        { show: "note", pitch: "F5", length: "1/32" },
        { show: "measure" },

        { show: "note", pitch: "A6", length: "1/1" },
        { show: "note", pitch: "B6", length: "1/2" },
        { show: "note", pitch: "C6", length: "1/4" },
        { show: "measure" },
        { show: "note", pitch: "D6", length: "1/8" },
        { show: "note", pitch: "E6", length: "1/16" },
        { show: "measure" },
        { show: "note", pitch: "F6", length: "1/32" },
        { show: "measure" },

        /*
        { begin: "tuplet", beats: 3 },
        { show: "note", pitch: "G4", length: "eighth" },
        { show: "note", pitch: "G4", length: "eighth" },
        { show: "note", pitch: "G4", length: "eighth" },
        { end: "tuplet" },
        
        { begin: "tuplet", beats: 3 },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { end: "tuplet" },
        { show: "measure" },

        { begin: 'tuplet', beats: '63 : 42' },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "measure" },

        //{ begin: "slur" },
        { show: "note", pitch: "G3", length: "eighth" },
        { show: "note", pitch: "F3", length: "eighth" },
        { show: "note", pitch: "E3", length: "eighth" },
        { show: "note", pitch: "D3", length: "eighth" },
        { show: "note", pitch: "C3", length: "eighth" },
        { show: "note", pitch: "B3", length: "eighth" },
        { show: "note", pitch: "A3", length: "eighth" },
        //{ end: "slur" },

        //{ begin: "slur" },
        { show: "measure" },
        { show: "note", pitch: "A3", length: "eighth" },
        { show: "note", pitch: "B3", length: "eighth" },
        { show: "note", pitch: "C3", length: "eighth" },
        { show: "note", pitch: "D3", length: "eighth" },
        { show: "note", pitch: "E3", length: "eighth" },
        { show: "note", pitch: "F3", length: "eighth" },
        { show: "note", pitch: "G3", length: "eighth" },
        //{ end: "slur" },
        { show: "measure" },
        */

        /*
        { begin: "slur" },
        { show: "note", pitch: "G5", length: "eighth" },
        { show: "note", pitch: "F5", length: "eighth" },
        { show: "note", pitch: "E5", length: "eighth" },
        { show: "note", pitch: "D5", length: "eighth" },
        { show: "note", pitch: "C5", length: "eighth" },
        { show: "note", pitch: "B5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { end: "slur" },

        { begin: "slur" },
        { show: "measure" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "B5", length: "eighth" },
        { show: "note", pitch: "C5", length: "eighth" },
        { show: "note", pitch: "D5", length: "eighth" },
        { show: "note", pitch: "E5", length: "eighth" },
        { show: "note", pitch: "F5", length: "eighth" },
        { show: "note", pitch: "G5", length: "eighth" },
        { end: "slur" },
        */

        /*
        { show: "measure" },

        //{ begin: "slur" },
        { show: "note", pitch: "G4", length: "eighth" },
        { show: "note", pitch: "F4", length: "eighth" },
        { show: "note", pitch: "E4", length: "eighth" },
        { show: "note", pitch: "D4", length: "eighth" },
        { show: "note", pitch: "C4", length: "eighth" },
        { show: "note", pitch: "B4", length: "eighth" },
        { show: "note", pitch: "A4", length: "eighth" },
        //{ end: "slur" },

        //{ begin: "slur" },
        { show: "measure" },
        { show: "note", pitch: "A4", length: "eighth" },
        { show: "note", pitch: "B4", length: "eighth" },
        { show: "note", pitch: "C4", length: "eighth" },
        { show: "note", pitch: "D4", length: "eighth" },
        { show: "note", pitch: "E4", length: "eighth" },
        { show: "note", pitch: "F4", length: "eighth" },
        { show: "note", pitch: "G4", length: "eighth" },
        //{ end: "slur" },
        { show: "measure" },

        //{ begin: "slur" },
        { show: "note", pitch: "G4", length: "eighth" },
        { show: "note", pitch: "F4", length: "eighth" },
        { show: "note", pitch: "E4", length: "eighth" },
        { show: "note", pitch: "D4", length: "eighth" },
        { show: "note", pitch: "C4", length: "eighth" },
        { show: "note", pitch: "B4", length: "eighth" },
        { show: "note", pitch: "A4", length: "eighth" },
        //{ end: "slur" },

        //{ begin: "slur" },
        { show: "measure" },
        { show: "note", pitch: "A4", length: "eighth" },
        { show: "note", pitch: "B4", length: "eighth" },
        { show: "note", pitch: "C4", length: "eighth" },
        { show: "note", pitch: "D4", length: "eighth" },
        { show: "note", pitch: "E4", length: "eighth" },
        { show: "note", pitch: "F4", length: "eighth" },
        { show: "note", pitch: "G4", length: "eighth" },
        { show: "measure" },


        { break: 'line' },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "measure" },
        //{ end: "slur" },

        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "measure" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { end: 'tuplet' },

        { show: "measure" },
                                                          
        { show: "note", pitch: "B5", length: "quarter" },
        { show: "note", pitch: "A5", length: "quarter" },
        { show: "note", pitch: "G4", length: "half" },
        { show: "measure" },
        */
    ];

    // Lay out the tree to fill the window horizontally
    var width = window.innerWidth - 20;

    var tree = Notate.layout(doc, width);
    tree.calcBounds();

    // Resize the canvas to match
    var canvas = document.getElementById('testCanvas');
    var ctx = canvas.getContext('2d');

    var ratio = 1.0;
    if (window.devicePixelRatio) {
        ratio = window.devicePixelRatio;
    }

    var w = width;
    var h = tree.height();

    canvas.width = w * ratio;
    canvas.height = h * ratio;

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    ctx.scale(ratio, ratio);

    // Render to the canvas
    Notate.render(canvas, ctx, tree);
}

function debug() {
    window.onresize = redraw;
    redraw();
}

