/*
 * Flower.js
 * Copyright 2011 John Driscoll
 */

// Flower
gal.aq(
  function(ap) {
    var flower =
      window.flower =
      gal.flower = Raphael("flower", gal.ts, gal.ts),
    t = 0, p, l,
    sp = 3000,
    fps = 25,
    dur = 15000,
    fdur = parseInt(fps / 2),
    st = 1 / (fps * sp / 1000), i = 0, count = fps * dur / 1000,
    o, so = o = 0.5, xf = Math.sqrt(so), yf = Math.sqrt(so),
    w = 0.15,
    hw = w / 2,
    mo = 1 - hw,
    opd = 4,
    opv = opd;
    flower.paths = [];
    flower.co = 3;
    flower._color = gal.nextColor;
    flower.color = function() {
      var hsv = gal.hexToHsv(this._color());
      if (this.co === 1) hsv = [ this.fhsv[0], 0, 1 ];
      this.fhsv = this.fhsv || hsv;
      this.ft = 0;
      this.s = [
        ((hsv[0] < this.fhsv[0] ? 1 : 0) + hsv[0] - this.fhsv[0]) / fdur,
        (hsv[1] - this.fhsv[1]) / fdur,
        (hsv[2] - this.fhsv[2]) / fdur
      ];
      this.tohsv = hsv;
      // change frozen color
      var co = gal.hsvToHex(hsv);
      if (flower.paths) {
        for (var i = flower.paths.length - 1; i >= 0; i--) {
          if (!flower.paths[i].frozen) break;
          flower.paths[i].animate({ fill: co, stroke: co  }, 200);
        }
      }
    };
    flower.fadeColor = function() {
      if (this.ft < fdur) {
        for (var i = 0; i < 3; i++) {
          this.fhsv[i] += this.s[i];
        }
        // cycle hue
        if (this.fhsv[0] < 0 || this.fhsv[0] > 1) {
          this.fhsv[0] -= Math.floor(this.fhsv[0]);
        }
        if (this.fhsv[1] < 0) this.fhsv[1] = 0;
        else if (this.fhsv[1] > 1) this.fhsv[1] = 1;
        if (this.fhsv[2] < 0) this.fhsv[2] = 0;
        else if (this.fhsv[2] > 1) this.fhsv[2] = 1;
        this.ft++;
      }
      return gal.hsvToHex(this.fhsv);
    };
    flower.color();
    function drawLinePath(path, str, fade) {
      path.fading = true;
      var co = flower.fadeColor();
      path
        .stop()
        .attr({ path: str,
		fill: co,
		stroke: co,
                "stroke-width": 1,
                opacity: (opv < opd ? 0 : 1)  })
	.toFront();
      if (fade !== false) {
        if (opv >= opd) {
          fadePath(path);
        } else {
          path.fading = false;
        }
      } else {
        path.frozen = true;
      }
      if (opv < opd) { opv ++; }
    }
    function fadePath(path) {
      path.animate(
        { fill: "#000",
          stroke: "#000" },
        dur / 3,
        function() {
          setTimeout(
            function() {
              path.animate(
                { fill: "#FFF",
                  stroke: "#FFF" },
                dur / 3,
                function() {
                  path.attr('opacity', 0);
                  path.fading = false;
                });
            },
            dur / 3);
        });
    }
    /**
     *  @returns The point along the for value t
     */
    function f(t, o) {
      return [ Math.cos(t * Math.PI * 2) * o,
	       Math.sin(t * Math.PI * 2) * o ];
    }
    /**
     *  @returns The increment value to adjust orbit
     */
    function creep() {
      return (fval() - o) / 4;
    }
    /**
     *  @returns The user orbit level
     */
    function fval() {
      return omin(xf * yf);
    }
    function omin(o) {
      return Math.max(Math.abs(o), w) * (Math.abs(o) / (o || 1) || 1);
    }
    /**
     * @returns the two stroke points tangent to line formed
     * from points t and pa
     */
    function p2(t, pa) {
      var x2 = t, x3 = t + st,
      pb = f(x2, o), pc = f(x3, o + creep()),
      lA = Math.sqrt(Math.pow((pb[0] - pa[0]) || 0.00001, 2) +
                     Math.pow((pb[1] - pa[1]) || 0.00001, 2)),
      lB = Math.sqrt(Math.pow((pb[0] - pc[0]) || 0.00001, 2) +
                     Math.pow((pb[1] - pc[1]) || 0.00001, 2)),
      lC = Math.sqrt(Math.pow((pa[0] - pc[0]) || 0.00001, 2) +
                     Math.pow((pa[1] - pc[1]) || 0.00001, 2)),
      C = Math.acos(
        (Math.pow(lA, 2) +
         Math.pow(lB, 2) -
         Math.pow(lC, 2)) /
          (2 * lA * lB)),
      s1 = ((pb[1] - pa[1]) || 0.00001) / ((pb[0] - pa[0]) || 0.00001),
      s = Math.atan(s1),
      r1 = s - C / 2,
      r2 = s + (2 * Math.PI - C) / 2,
      ra = [ gal.hts + gal.hts * (hw * Math.sin(r1) + pb[1]),
             gal.hts + gal.hts * -(hw * Math.cos(r1) + pb[0]) ],
      rb = [ gal.hts + gal.hts * (hw * Math.sin(r2) + pb[1]),
             gal.hts + gal.hts * -(hw * Math.cos(r2) + pb[0]) ];
      if (pa[0] >= pb[0]) return [ rb, ra, pb ];
      return [ ra, rb, pb ];
    }
    function drawLine(fade) {
      t += st;
      if (t > 1) t -= 1;
      if (!l) {
        l = p2(t - st, f(t - st * 2, o));
      }
      p = p2(t, l[2]);
      var str = "M " +
	l[0][0] + "," + l[0][1] + " " +
	l[1][0] + "," + l[1][1] + " " +
	p[1][0] + "," + p[1][1] + " " +
	p[0][0] + "," + p[0][1] + " z";
      if (!flower.paths[0] || flower.paths[0].fading) {
        flower.paths.push(flower.path());
      } else {
        flower.paths.push(flower.paths.shift());
      }
      drawLinePath(flower.paths[flower.paths.length - 1], str, fade);
      l = p;
      o += creep();
    }
    var co = flower.fadeColor(),
    interval = false,
    loaded = false, triggered = false, eid = 0,
    el = document.getElementById("flower");
    function zeroInput(e) {
      adjustInput(e);
      o = fval();
      l = p2(t - st, f(t - st * 2, o));
    }
    // loading circle
    var finished = false;
    function startLine(last) {
      return function() {
        drawLine(false);
        if (last && !eid) {
          finished = true;
          opv = 0;
        }
      };
    }
    for (var j = 0; j < fps * sp / 1000; j++) {
      setTimeout(startLine((j+1) >= fps * sp / 1000), j * 2);
    }
    setTimeout(function() {
                 loaded = true;
                 if (triggered) {
                   startFlower();
                 }
               }, (j + 1) * 2);
    // Mouse interactions
    var moved = null; // mobile device support
    function adjustInput(e) {
      if (moved === false)
        moved = true;
      e = gal.mouseOffset(this, e);
      if (loaded && typeof e.offsetX !== 'undefine') {
        xf = mo * (1 - Math.pow((e.offsetX - gal.hts) / gal.hts, 2));
        yf = mo * (1 - Math.pow((e.offsetY - gal.hts) / gal.hts, 2));
        if (e.offsetX >= gal.hts) xf *= -1;
      } else {
        triggered = true;
      }
      return false;
    }
    function startFlower(e,fadeIn) {
      if (loaded && interval === false) {
        eid++;
        flower.ft = fdur;
        flower.fhsv = flower.tohsv;
        interval = setInterval(drawLine, 1000 / fps);
        if (finished) {
          // made it through a complete stopCircle
          zeroInput(e);
        }
        // Fade any frozen path pieces
        for (var i = flower.paths.length - 1; i >= 0; i--) {
          if (!flower.paths[i].frozen) break;
          fadePath(flower.paths[i]);
          delete flower.paths[i].frozen;
        }
      }
    }
    function stopFlower(e) {
      if (loaded) {
        clearInterval(interval);
        interval = false;
        finished = false;
        function leaveLine(fade, myid, last) {
          return function() {
            if (eid === myid) {
              drawLine(fade);
              if (last) {
                finished = true;
                opv = 0;
              }
            }
          };
        }
        xf = yf = Math.sqrt(so);
        var id = ++eid;
        for (var i = 0; i < 1.75 * fps * sp / 1000; i++) {
          setTimeout(leaveLine(i < 0.75 * fps * sp / 1000, id,
                               (i + 1) >= 1.75 * fps * sp / 1000), i * 2);
        }
      } else {
        triggered = false;
      }
    }
    el.onmousemove = adjustInput;
    el.ontouchmove = adjustInput;
    $(el).mouseenter(startFlower);
    el.ontouchstart = function(e) {
      startFlower(e,true);
      moved = false;
      return false;
    };
    $(el).mouseleave(stopFlower);
    el.ontouchend = function(e) {
      stopFlower(e);
      if (moved === false) {
        window.location = el.href;
      }
    };
    setTimeout(ap, count * 3 / 4);
  });