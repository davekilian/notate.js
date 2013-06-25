
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

    var drawArc = function(ctx, Ax, Ay, Bx, By, theta, backward) {
        var dx       = Bx - Ax,
            dy       = By - Ay,
            dist     = Math.sqrt(dx * dx + dy * dy),
            halfDist = dist / 2,
            radius   = halfDist / Math.sin(theta / 2);

        var phiC  = Math.PI / 2 - theta / 2,
            phiAB = Math.atan2(dy, dx),
            phi   = phiAB + phiC,
            Cx    = Ax + radius * Math.cos(phi),
            Cy    = Ay + radius * Math.sin(phi);

        var startAngle = Math.atan2(Ay - Cy, Ax - Cx);
        var endAngle   = Math.atan2(By - Cy, Bx - Cx);

        if (backward) {
            ctx.arc(Cx, Cy, radius, endAngle, startAngle, true);
        }
        else {
            ctx.arc(Cx, Cy, radius, startAngle, endAngle, false);
        }
    }

    Slur.prototype.render = function(canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        var e = this.endpoint;
        var theta = Math.PI * 1 / 2;
        drawArc(ctx, this.x, this.y, this.x + e.x, this.y + e.y, theta, false);
        drawArc(ctx, this.x, this.y, this.x + e.x, this.y + e.y, .87 * theta, true);

        ctx.fill();

        // TODO
        // This looks fine when we slur two notes together, but not when we
        // slur a bunch. There are two problems:
        //
        // - The thickness of the slur is proportional to the number of targets
        // - The angle of the slur is not proportional
        //
        // The solution might be:
        // - Compute theta such that we maintain a maximum distance from the
        //   notes (or, as a simplification, a fixed distance below the AB
        //   line)
        // - Compute the second radius+center so that we maintain an exact
        //   thickness in the center of the slur
        //
        // Not sure how to do the first though. 
        //
        // We also might want to rethink how this works. Maybe there's some way
        // to fit a curve to the notes?
    }

})(Notate);

