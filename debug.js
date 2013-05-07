
function renderBackground(canvas, ctx) { 
    ctx.fillStyle = 'rgb(255, 255, 255)';
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

function debugRenderer(canvas, ctx) {
    var doc = new Notate.Glyph("document");
    var staff = new Notate.Glyph("staff");
    var measure = new Notate.Glyph("measure");
    var fill = new Notate.Glyph("measure");

    var MARGINX = 50;
    var MARGINY = 50;
    var ratio = window.devicePixelRatio; 
    var w = canvas.width / ratio;
    var h = canvas.height / ratio;

    doc.top = 0;
    doc.bottom = h;
    doc.left = 0;
    doc.right = w;

    staff.x = MARGINX;
    staff.y = MARGINY;
    staff.top = 0;
    staff.bottom = 32;
    staff.left = 0;
    staff.right = doc.width() - 2 * MARGINX;
    staff.numLines = 5;

    measure.top = 0;
    measure.left = 0;
    measure.right = 180;
    measure.bottom = staff.height();

    fill.x = measure.width();
    fill.y = 0;
    fill.top = 0;
    fill.bottom = measure.height();
    fill.left = 0;
    fill.right = staff.width() - measure.width();

    var denom = 1;
    for (var i = 0; i < 6; ++i) {
        var note = new Notate.Glyph("note");
        note.x = 15 + 23 * i;
        note.y = 24.5;
        note.top = -10;
        note.bottom = 10;
        note.left = -10;
        note.right = 10;
        note.length = "1/" + denom;
        denom *= 2;

        if (i > 0) {
            var s = Notate.settings;
            
            var stem = new Notate.Glyph("stem");
            stem.x = s.STEM_OFFSET;
            stem.y = 0;
            stem.top = -30;
            stem.bottom = 0;
            stem.left = -.5;
            stem.right = .5;

            for (var j = 0; j < i - 2; ++j) {
                var flags = new Notate.Glyph("flags");
                flags.x = 0;
                flags.y = -stem.height();
                flags.top = 0;
                flags.bottom = 21.5;
                flags.left = 0;
                flags.right = 11.2;
                flags.count = j + 1;

                stem.children.push(flags);
            }

            note.children.push(stem);
        }

        measure.children.push(note);
    }

    doc.children.push(staff);
    staff.children.push(measure);
    staff.children.push(fill);
    
    Notate.render(canvas, ctx, doc);
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

    Notate.render(canvas, ctx, Notate.layout(doc));
}

function debugBarring(canvas, ctx) {
    var beg = { x: 172.7, y: 76.5 };
    var end = { x: 195.8, y: 72.5 };
    var HEIGHT = 4;

    for (var i = 0; i < 2; ++i) {
        ctx.beginPath();

        ctx.moveTo(beg.x, beg.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(end.x, end.y + HEIGHT);
        ctx.lineTo(beg.x, beg.y + HEIGHT);

        ctx.fill();

        beg.y += 1.6 * HEIGHT;
        end.y += 1.6 * HEIGHT;
    }
}

function debug() {
    var canvas = document.getElementById('testCanvas');
    var ctx = canvas.getContext('2d');
    enableRetina(canvas, ctx);

    renderBackground(canvas, ctx);

    //debugRenderer(canvas, ctx);
    debugLayout(canvas, ctx);

//    debugBarring(canvas, ctx);
}

