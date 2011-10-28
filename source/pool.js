/*
 * Pool.js
 * Copyright 2011 John Driscoll
 */

// Pool
gal.aq(
  function(ap) {
    var pool =
      gal.pool = window.pool = Raphael("pool", gal.ts, gal.ts);
    pool.cir = [];
    pool.line = [];
    pool.color = function() {
      var co = this.cir[2].color();
      for (var i = 0; i < pool.cir.length; i++) {
        pool.cir[i].animate({ fill: co, stroke: co }, 200);
      }
    };
    var d = 0, db,
    t,
    st = t = -Math.PI / 2 + gal.rand() * Math.PI,
    r, rb,
    ra = r = gal.ts / 5,
    numLines = 30, // number of lines over the inkdrops
    // sig color controller
    blobOver = gal.color,
    // Hover action
    lineOver = function() {
      var co = this.color();
      this.animate({ fill: co }, 200);
      this.animate({ translation: [ 5, 0 ] }, 100, function() {
                     this.animate({ translation: [ -5, 0 ] }, 100);
                   });
    },
    // Inkdrop renderer
    blob = function(t, d, r, i) {
      var cx = gal.ts/2 + d * Math.cos(t),
      cy = gal.ts/2 + d * Math.sin(t),
      cir = pool.circle(cx, cy, 0);
      cir.co = 1;
      cir.color = gal.nextColor;
      co = cir.color();
      cir.attr({ fill: co,
	         stroke: "transparent",
	         "stroke-width": 0 });
      pool.cir.push(cir);
      setTimeout(
	function() {
	  pool.cir[i].animate({ r: r }, 200);
	}, 100 * i);
    },
    // Line helper
    _line = function(x, w, t, r, ofx, ofy) {
      var y1 = x,
      x1 = r * Math.cos(Math.asin(y1 / r)),
      y2 = y1 + w,
      x2 = r * Math.cos(Math.asin(y2 / r));
      y1 -= ofy;
      y2 -= ofy;
      var x1r = gal.hts + (x1 + ofx) * Math.cos(t)
	- y1 * Math.sin(t),
      y1r = gal.ts/2 + (x1 + ofx) * Math.sin(t) + y1 * Math.cos(t),
      x4r = gal.ts/2 - (x1 - ofx) * Math.cos(t) - y1 * Math.sin(t),
      y4r = gal.ts/2 - (x1 - ofx) * Math.sin(t) + y1 * Math.cos(t),
      x2r = gal.ts/2 + (x2 + ofx) * Math.cos(t) - y2 * Math.sin(t),
      y2r = gal.ts/2 + (x2 + ofx) * Math.sin(t) + y2 * Math.cos(t),
      x3r = gal.ts/2 - (x2 - ofx) * Math.cos(t) - y2 * Math.sin(t),
      y3r = gal.ts/2 - (x2 - ofx) * Math.sin(t) + y2 * Math.cos(t);
      return [
	"M " +
	  x1r + "," + y1r + " " +
	  x2r + "," + y2r + " " +
	  x3r + "," + y3r + " " +
	  x4r + "," + y4r + " z",
	"M " +
	  x1r + "," + y1r + " " +
	  x4r + "," + y4r + " z" ];
    },
    // Line renderer
    line = function(t, ra, rb, w, i, p, ofx, ofy) {
      setTimeout(
	function() {
          var path;
	  if (w * i < ra) {
	    path = _line(
	      ra - 2 * w * i,
	      w, t, ra, ofx, ofy);
	  } else {
	    path = _line(
	      rb - (2 * w * i - 2 * ra),
	      w, t, rb, ofx, ofy + ra + p + 6 * w);
	  }
	  var obj = pool.path(path[1]);
          obj.co = 1;
          obj.color = gal.nextColor;
          var co = obj.color();
          obj.attr({ fill: co,
	             stroke: "transparent",
	             "stroke-width": 0 })
	    .animate({ path: path[0] }, 300, ">",
		     function() {
		       this.mouseover(lineOver);
		     });
	  obj.num = i;
	  pool.line.push(obj);
	}, 5 * i);
    };
    // Draw inkdrops
    for (var i = 0; i < 3; i++) {
      blob(t, d, r, i);
      if (!i) {
	db = d = r * 1.4;
	r *= .5;
	rb = r;
      } else {
	r *= i / 2;
	if (Math.round(gal.rand()))
	  t += 0.7 + gal.rand() * 0.7;
	else
	  t -= 0.7 + gal.rand() * 0.7;
	d += ra / 5;
      }
    }
    // Blob color control
    pool.cir[2].mouseover(blobOver);
    pool.canvas.ontouchstart = blobOver;
    pool.canvas.ontouchmove = function() {
      return false;
    };
    // Draw lines
    st += Math.PI / 2 + gal.rand() * 0.05 + 0.05;
    var p = 10;
    ra += p;
    rb += p;
    var len = ra * 2 + rb * 2,
    w = len / (2 * numLines - 1),
    ofx = -5 + gal.rand(5),
    ofy = -15 + gal.rand(5);
    for (i = 1; i < numLines; i++)
      line(st, ra, rb, w, i, p, ofx, ofy);
    setTimeout(ap, 500);
    var el = document.getElementById('pool'),
    moved = null;
    el.ontouchstart = function() {
      moved = false;
      return false;
    };
    el.ontouchmove = function() {
      moved = true;
    };
    el.ontouchend = function() {
      if (moved === false) {
        window.location = el.href;
      }
    };
  });