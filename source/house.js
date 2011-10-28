/*
 * House.js
 * Copyright 2011 John Driscoll
 */

// House
gal.aq(
  function(ap) {
    var house =
      gal.house =
      window.house = Raphael("house", gal.ts, gal.ts),
    houses = 1, maxHouses = 4;
    function buildHouse(args) {
      var ch = args.ch, cw = args.cw, cd = args.cd, ah = args.ah,
      ad = args.ad, aw = args.aw, ww = args.ww, wo = args.wo,
      w1d = args.w1d, w2d = args.w2d, w1h = args.w1h, w2h = args.w2h,
      tx = args.tx, ty = args.ty, t = args.t,
      s2 = (1 + (args.s || 0)),
      points = [
        [ -cw / 2, -ch / 2, -cd / 2 ], // 0
        [ cw / 2, -ch / 2, -cd / 2 ], // 1
        [ cw / 2, -ch / 2, cd / 2 ], // 2
        [ -cw / 2, -ch / 2, cd / 2 ], // 3
        [ -cw / 2, ch / 2, -cd / 2 ], // 4
        [ cw / 2, ch / 2, -cd / 2 ], // 5
        [ cw / 2, ch / 2, cd / 2 ], // 6
        [ -cw / 2, ch / 2 - ah, -cd / 2 - ad ], // 7
        [ -cw / 2, ch / 2 - ah, -cd / 2 ], // 8
        [ -cw / 2, ch / 2, -cd / 2 - ad ], // 9
        [ -cw / 2 + aw, ch / 2, -cd / 2 - ad ], // 10
        [ -cw / 2 + aw, ch / 2, -cd / 2 ], // 11
        [ (cw / 3) / 2 - ww / 2 - wo, ch / 2, -cd / 2 - w1d ], // 12
        [ (cw / 3) / 2 + ww / 2 - wo, ch / 2, -cd / 2 - w1d ], // 13
        [ (cw / 3) / 2 + ww / 2 - wo, ch / 2, -cd / 2 ], // 14
        [ (cw / 3) / 2 - ww / 2 - wo, ch / 2, -cd / 2 ], // 15
        [ (cw / 3) / 2 + ww / 2 - wo, ch / 2  + w1h, -cd / 2 - w1d ], // 16
        [ (cw / 3) / 2 + ww / 2 - wo, ch / 2  + w1h, -cd / 2 ], // 17
        [ (cw / 3) / 2 - ww / 2 - wo, ch / 2  + w1h, -cd / 2 - w1d ], // 18
        [ (cw / 3) / 2 - ww / 2 - wo, ch / 2  + w1h, -cd / 2 ], // 19
        [ (-cw / 3) / 2 - ww / 2 - wo, ch / 2, -cd / 2 - w2d ], // 20
        [ (-cw / 3) / 2 + ww / 2 - wo, ch / 2, -cd / 2 - w2d ], // 21
        [ (-cw / 3) / 2 + ww / 2 - wo, ch / 2, -cd / 2 ], // 22
        [ (-cw / 3) / 2 - ww / 2 - wo, ch / 2, -cd / 2 ], // 23
        [ (-cw / 3) / 2 + ww / 2 - wo, ch / 2  + w2h, -cd / 2 - w2d ], // 24
        [ (-cw / 3) / 2 + ww / 2 - wo, ch / 2  + w2h, -cd / 2 ], // 25
        [ (-cw / 3) / 2 - ww / 2 - wo, ch / 2  + w2h, -cd / 2 - w2d ], // 26
        [ (-cw / 3) / 2 - ww / 2 - wo, ch / 2  + w2h, -cd / 2 ] // 27
      ],
      objs = [
        {   // Cube
	  faces: [ [ 0, 1, 2, 3, 3, "bottom" ],
		   [ 4, 5, 1, 0, 2, "left" ],
		   [ 1, 2, 6, 5, 4, "right" ] ] },
        {   // Roof
	  faces: [ [ 7, 8, 4, 9, 0, "left" ],
		   [ 9, 10, 11, 4, 1, "top" ] ] },
        {   // Window1
	  faces: [ [ 12, 13, 14, 15, 3, "bottom" ],
		   [ 16, 17, 14, 13, 4, "right" ],
		   [ 16, 16, 17, 17, 0, "top" ],
		   [ 18, 16, 13, 12, 2, "left" ] ] },
        {   // Window2
	  faces: [ [ 20, 21, 22, 23, 3, "bottom" ],
		   [ 24, 25, 22, 21, 4, "right" ],
		   [ 24, 24, 25, 25, 0, "top" ],
		   [ 26, 24, 21, 20, 2, "left" ] ] }
      ];
      for (var i = 0; i < points.length; i++) {
        var p = points[i],
        x = p[0], z = p[2];
        p[0] = x * Math.cos(t) - z * Math.sin(t);
        p[2] = x * Math.sin(t) + z * Math.cos(t);
        p[0] += tx;
        p[1] += ty;
        p[2] += 1;
        p[0] /= p[2];
        p[1] /= p[2];
      }
      // scale across canvas
      var l = 0, r = 0, b = 0, h, w;
      t = 0;
      for (i = 0; i < points.length; i++) {
        var p = points[i];
        if (p[0] < l) l = p[0];
        else if (p[0] > r) r = p[0];
        if (p[1] < b) b = p[1];
        else if (p[1] > t) t = p[1];
      }
      h = t - b;
      w = r - l;
      for (i = 0; i < points.length; i++) {
        var p = points[i],
        x1 = s2 * ((p[0] - l) / w),
        y1 = s2 * ((p[1] - b) / h);
        p[0] = gal.hts + gal.hts * x1 - s2 * gal.hts / 2;
        p[1] = gal.hts - gal.hts * y1 + s2 * gal.hts / 2;
      }
      for (i = 0; i < objs.length; i++) {
        objs[i].quads = [];
        objs[i].lines = [];
        for (var j = 0; j < objs[i].faces.length; j++) {
	  var f = objs[i].faces[j];
	  objs[i].lines.push(
	    "M " + points[f[0]][0] + "," +
	      points[f[0]][1] + " " +
	      points[f[1]][0] + "," +
	      points[f[1]][1] + " " +
	      points[f[1]][0] + "," +
	      points[f[1]][1] + " " +
	      points[f[0]][0] + "," +
	      points[f[0]][1] + " z");
	  objs[i].quads.push(
	    "M " + points[f[0]][0] + "," +
	      points[f[0]][1] + " " +
	      points[f[1]][0] + "," +
	      points[f[1]][1] + " " +
	      points[f[2]][0] + "," +
	      points[f[2]][1] + " " +
	      points[f[3]][0] + "," +
	      points[f[3]][1] + " z");
        }
      }
      return objs;
    }
    function animateFace(path, str) {
      return function() {
        path.show().animate({ path: str, opacity: 1 }, 200);
      };
    }
    function drawHouse(objs, o2, animate, change) {
      var paths = [];
      for (var i = 0; i < objs.length; i++) {
        objs[i].paths = objs[i].paths || [];
        for (var j = 0; j < o2[i].quads.length; j++) {
	  var str, path;
	  if (animate) str = o2[i].lines[j];
	  else str = o2[i].quads[j];
          if (!objs[i].paths[j]) {
            objs[i].paths[j] = [];
            for (var k = 0; k < maxHouses; k++) {
              objs[i].paths[j][k] = house.path();
            }
          } else if (change) {
            objs[i].paths[j].unshift(objs[i].paths[j].pop());
          }
          path = objs[i].paths[j][0];
          path.attr({ path: str,
                      fill: house.colors[o2[i].faces[j][4]],
	              stroke: house.colors[o2[i].faces[j][4]],
	              "stroke-width": 0.5 });
	  if (animate) {
	    path.hide().attr('opacity', 0);
	    setTimeout(animateFace(path, o2[i].quads[j]), i * 25);
	  } else {
            path.attr('opacity', 1);
          }
          if (change) {
            objs[i].paths[j][0].toFront();
            switch (houses) {
            case 4:
              objs[i].paths[j][3].animate(
                { scale: [ 1, 1, gal.ts/2, gal.ts/2 ],
                  opacity: 0 }, 200);
            case 3:
              objs[i].paths[j][2]
                .animate(
                  { scale: [ 1.5, 1.5, gal.ts/2, gal.ts/2 ],
                    fill: "#FFF",
                    stroke: "#000" }, 200);
            case 2:
              objs[i].paths[j][1].animate(
                { scale: [ 1.25, 1.25, gal.ts/2, gal.ts/2 ],
                  opacity: 0.75 }, 200);
            }
          }
        }
      }
    }
    var ch = 0.4 + gal.rand() * 1.0 / 3.0,
    cw = 0.25 + gal.rand() * 1.0 / 3.0,
    cd = 0.25 + gal.rand() * 1.0 / 3.0,
    a = {
      ch: ch,
      cw: cw,
      cd: cd,
      ah: ch / 4 + gal.rand() * ch * 2 / 3,
      aw: cw * 1.2 + gal.rand() * ch / 5,
      ad: 0.5 - cd / 2,
      ww: 0.01 + gal.rand() * 0.01,
      wo: 0.03,
      w1d: 0.5 - cd / 2,
      w2d: 0.5 - cd / 2,
      w1h: 0.5 - ch / 2,
      w2h: 0.5 - ch / 2,
      tx: gal.rand() * 2.0 / 3.0,
      ty: gal.rand() * 2.0 / 3.0,
      t: - Math.PI / 4 - 0.1 - gal.rand() * 0.4
    }, a2;
    function shade(hex) {
      var hsv = gal.hexToHsv(hex);
      house.colors = [
        gal.hsvToHex([ hsv[0], 0.2, 0.4 ]),
        gal.hsvToHex([ hsv[0], 0.2, 0.6 ]),
        gal.hsvToHex([ hsv[0], 0.3, 0.8 ]),
        gal.hsvToHex([ hsv[0], 0.2, 0.9 ]),
        gal.hsvToHex([ hsv[0], 0.1, 1  ])
      ];
    }
    house.color = function() {
      if (houses < maxHouses) houses++;
      shade(this._color());
      drawHouse(house.house, buildHouse(reshape(a)), true, true);
    };
    var ox = 0, oy = 0;
    function reshape(a) {
      var a2 = {};
      for (n in a) {
        a2[n] = a[n];
      }
      for (var i = 0; i < 6; i++) {
        var x = 1 - Math.pow(2 * (ox / gal.ts - 0.5), 2),
	y = 1 - Math.pow(2 * (oy / gal.ts - 0.5), 2),
	c = Math.abs(ox - (gal.ts / 6) * i - (gal.ts / 12)),
	mx = Math.max(y * x * (2 - c / 100), 1);
        a2.s = x * y * 0.25;
	// rescale object based on x
	switch (i) {
	case 0: a2.w1d *= mx; a2.w1h *= mx; break;
	case 1: a2.ad *= mx; break;
	case 2: a2.w2d *= mx; a2.w2h *= mx; break;
	case 3: a2.cw *= mx; break;
	case 4: a2.cd *= mx; break;
        case 5: a2.aw *= mx; break;
	}
      }
      return a2;
    }
    var el = document.getElementById('house'),
    moved = null;
    function adjustInput(e) {
      if (moved === false) {
        moved = true;
      }
      e = gal.mouseOffset(this, e);
      ox = e.offsetX;
      oy = e.offsetY;
      drawHouse(house.house, buildHouse(reshape(a)));
      return false;
    }
    function reset() {
      ox = 0;
      oy = 0;
      drawHouse(house.house, buildHouse(reshape(a)));
    }
    el.ontouchstart = function() {
      moved = false;
      return false;
    };
    el.onmousemove = adjustInput;
    el.ontouchmove = adjustInput;
    $(el).mouseenter(reset);
    el.ontouchend = function() {
      reset();
      if (moved === false) {
        window.location = el.href;
      }
    };
    house.co = 4;
    house._color = gal.nextColor;
    shade(house._color());
    house.house = buildHouse(a);
    drawHouse(house.house, house.house, true);
    setTimeout(ap, 750);
  });