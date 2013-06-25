
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

function debugLayout(canvas, ctx) {
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
        { title: "Hot Cross Buns (Dubstep Remix)" },
        { composer: "notate.js" },
                                                          
        { clef: "treble" },
                                                          
        { show: "clef", type: "treble" },
        { show: "timesig", over: 4, under: 4 },
        { show: "keysig", key: "C major" },
                                                          
        { show: "note", pitch: "B5", length: "quarter" },
        { show: "note", pitch: "A5", length: "quarter" },
        { show: "note", pitch: "G4", length: "half" },
        { show: "measure" },
                                                          
        { show: "note", pitch: "B5", length: "quarter" },
        { show: "note", pitch: "A5", length: "quarter" },
        { show: "note", pitch: "G4", length: "half" },
        { show: "measure" },
                                                          
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

        { break: 'line' },

        { begin: "slur" },
        { show: "note", pitch: "G4", length: "eighth" },
        { show: "measure" },
        { show: "note", pitch: "A5", length: "eighth" },

        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { show: "note", pitch: "A5", length: "eighth" },
        { end: "slur" },
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
    ];

    Notate.render(canvas, ctx, Notate.layout(doc));
}

function debug() {
    var canvas = document.getElementById('testCanvas');
    var ctx = canvas.getContext('2d');
    enableRetina(canvas, ctx);

    renderBackground(canvas, ctx);

    debugLayout(canvas, ctx);
}

