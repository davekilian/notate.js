
function renderBackground(canvas, ctx) { 
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function enableRetina(canvas, ctx) {
    if (window.devicePixelRatio) {
        var ratio = window.devicePixelRatio;

        var w = canvas.width;
        var h = canvas.height;

        canvas.width = w * ratio;
        canvas.height = h * ratio;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        ctx.scale(ratio, ratio);
    }
}

function debugLayout(canvas, ctx, documentWidth) {
    doc = (function() {
        var ret = [ ];

        var incrPitch = function(pitch) {
            var octave = parseInt(pitch[1]);

            var note = String.fromCharCode(pitch.charCodeAt(0) + 1);
            if (note == 'H') {
                note = 'A';
                ++octave;
            }

            return note + octave;
        }

        for (var iter = 0; iter < 3; ++iter) {
            var denom = 1;
            var pitch = 'C3';

            for (var i = 0; i < 5; ++i) {
                var length = '1/' + denom;

                for (var j = 0; j < denom; ++j) {
                    ret.push({ show: 'note', length: length, pitch: pitch });
                    pitch = incrPitch(pitch);
                }

                ret.push({ show: 'measure' });
                denom *= 2;
            }
        }

        return ret;
    })();

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
        { show: "note", pitch: "D4", length: "1/8" },
        { show: "note", pitch: "E4", length: "1/14" },
        { show: "note", pitch: "F4", length: "1/32" },
        { show: "note", pitch: "G4", length: "1/64" },

        { show: "note", pitch: "A5", length: "1/1" },
        { show: "note", pitch: "B5", length: "1/2" },
        { show: "note", pitch: "C5", length: "1/5" },
        { show: "note", pitch: "D5", length: "1/8" },
        { show: "note", pitch: "E5", length: "1/15" },
        { show: "note", pitch: "F5", length: "1/32" },
        { show: "note", pitch: "G5", length: "1/65" },

        { show: "note", pitch: "A6", length: "1/1" },
        { show: "note", pitch: "B6", length: "1/2" },
        { show: "note", pitch: "C6", length: "1/6" },
        { show: "note", pitch: "D6", length: "1/8" },
        { show: "note", pitch: "E6", length: "1/16" },
        { show: "note", pitch: "F6", length: "1/32" },
        { show: "note", pitch: "G6", length: "1/66" },

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

    var tree = Notate.layout(doc, documentWidth);
    console.log(tree);
    Notate.render(canvas, ctx, tree);
}

function debug() {
    var canvas = document.getElementById('testCanvas');
    var ctx = canvas.getContext('2d');
    
    var width = canvas.width;
    enableRetina(canvas, ctx);

    renderBackground(canvas, ctx);

    debugLayout(canvas, ctx, width);
}

