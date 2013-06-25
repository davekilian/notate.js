
//
// slur glyph
//
// Renders a slur line above or below a group of notes. 
//

(function(Notate) {

    var Slur = function() {
        Notate.Glyph.call(this);
    }

    Slur.prototype = new Notate.Glyph();
    Slur.constructor = Slur;
    Notate.beginnable['slur'] = Slur;

    Slur.prototype.parseCommand = function(cmd, ctype) {
    }

    Slur.prototype.minSize = function() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    Slur.prototype.layout = function() {
        var s = Notate.settings;

        // If we don't have enough targets, not much we can do ...
        if (this.targets.length < 2) {
            console.log("Warning: not rendering empty slur");
            return;
        }

        // Place the start/end points under the first/last targets
        var firstTarget = this.targets[0],
            lastTarget  = this.targets[this.targets.length - 1];

        var start = {
            x: firstTarget.x,
            y: firstTarget.y + firstTarget.bottom + s.SLUR_MARGIN
        };

        var end = {
            x: lastTarget.x,
            y: lastTarget.y + lastTarget.bottom + s.SLUR_MARGIN
        };

        // Move the slur down if the slur is too close to any of the targets in
        // between the first and the last
        for (var i = 1; i < this.targets.length - 1; ++i) {
            var target = this.targets[i],
                lerp = (target.x - start.x) / (end.x - start.x),
                slurY = start.y + (end.y - start.y) * lerp,
                dist = slurY - (target.y + target.bottom);

            if (dist < s.SLUR_MARGIN) {
                var delta = s.SLUR_MARGIN - dist;
                start.y += delta;
                end.y += delta;
            }
        }

        // Lay out based on endpoints
        this.moveTo(start.x, start.y);

        this.left = 0;
        this.right = end.x - start.x;

        if (end.y > start.y) {
            this.top = 0;
            this.bottom = end.y - start.y;
        }
        else {
            this.top = start.y - end.y;
            this.bottom = 0;
        }

        this.endpoint = { 
            x: end.x - start.x,
            y: end.y - start.y
        };
    }

    var drawArc = function(ctx, Ax, Ay, Bx, By, h, backward) {
        // This math is a little opaque. The goal is to use ctx.arc() to draw
        // the slur as a section of a circle. To do that, we need to compute
        // - The center of the cricle
        // - The circle's radius
        // - The angles at which to start / end
        //
        // The idea is to start with A and B (the endpoints of this slur) and
        // compute D, which is h units below the midpoint of A and B. Then find
        // the center C and radius R of the circle that passes through A, B and
        // D. See http://en.wikipedia.org/wiki/Circumscribed_circle for
        // derivation.

        var ABx = Bx - Ax,
            ABy = By - Ay,
            magAB = Math.sqrt(ABx * ABx + ABy * ABy);

        var Dx = (Ax + Bx) / 2 + h * (By - Ay) / magAB,
            Dy = (Ay + By) / 2 + h * (Ax - Bx) / magAB;

        var Ax2 = Ax * Ax,
            Ay2 = Ay * Ay,
            Bx2 = Bx * Bx,
            By2 = By * By,
            Dx2 = Dx * Dx,
            Dy2 = Dy * Dy;

        var denom = 2 * (Ax * (By - Dy) + Bx * (Dy - Ay) + Dx * (Ay - By)),
            Cx = ((Ax2 + Ay2) * (By - Dy) + (Bx2 + By2) * (Dy - Ay) + (Dx2 + Dy2) * (Ay - By)) / denom,
            Cy = ((Ax2 + Ay2) * (Dx - Bx) + (Bx2 + By2) * (Ax - Dx) + (Dx2 + Dy2) * (Bx - Ax)) / denom;

        var a = Math.sqrt((Ax - Bx) * (Ax - Bx) + (Ay - By) * (Ay - By)),
            b = Math.sqrt((Dx - Bx) * (Dx - Bx) + (Dy - By) * (Dy - By)),
            c = Math.sqrt((Dx - Ax) * (Dx - Ax) + (Dy - Ay) * (Dy - Ay));

        var radius = a * b * c / Math.sqrt((a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c));

        var startAngle = Math.atan2(Ay - Cy, Ax - Cx),
            endAngle   = Math.atan2(By - Cy, Bx - Cx);

        if (backward) {
            ctx.arc(Cx, Cy, radius, endAngle, startAngle, true);
        }
        else {
            ctx.arc(Cx, Cy, radius, startAngle, endAngle, false);
        }
    }

    Slur.prototype.render = function(canvas, ctx) {
        var s = Notate.settings,
            Ax = this.x,
            Ay = this.y,
            Bx = this.x + this.endpoint.x,
            By = this.y + this.endpoint.y;

        ctx.beginPath();
        ctx.moveTo(Ax, Ay);

        drawArc(ctx, Ax, Ay, Bx, By, s.SLUR_HEIGHT, false);
        drawArc(ctx, Ax, Ay, Bx, By, s.SLUR_HEIGHT + s.SLUR_THICKNESS, true);

        ctx.fill();
    }

})(Notate);

