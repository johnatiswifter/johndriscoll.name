/*
 * Signature.js
 * Copyright 2011 John Driscoll
 */
gal.aq(
  function (ap) {

    var scale = 0.5,
    sp = 50,
    sig = window.sig = gal.sig = Raphael("sig", 640 * scale, 160 * scale),
    solid = {
      fill: "#000",
      stroke: "#000",
      "stroke-width": 1,
      "stroke-linecap": "round"
    },
    penstroke = {
      fill: "#000",
      stroke: "#000",
      "stroke-width": 1,
      "stroke-linecap": "round"
    },
    mask = {
      fill: "#FFF",
      stroke: "transparent",
      "stroke-width": 0,
      "stroke-linecap": "round"
    },
    sigPath,
    sigStop,
    surfPath;
    sig.scale = scale;

    sig.paths = [];
    sig._color = gal.nextColor;
    sig.co = 1;
    sig.color = function() {
      var co = this._color();
      penstroke.fill = penstroke.stroke =
        solid.fill = solid.stroke = co;
      for (i = 0; i < sig.paths.length; i++) {
        sig.paths[i].animate({ fill: co, stroke: co }, 200);
      }
    };

    sig.ontouchstart = function() {
      sig.color();
    };

    /**
     * This gets called every time the points along path a and b are animated
     * independently. Take the coordinates of points a and b and add them to
     * path c for each step.
     */
    function fill(a, b, c, s, dur) {
      return function() {
        s[0].push(a.attr('cx') + ',' + a.attr('cy'));
        s[1].unshift(b.attr('cx') + ',' + b.attr('cy'));
        c.attr({ path: "M " + s[0].join(" ") + " " + s[1].join(" ") + " z" });
      };
    };

    /**
     * Draw a penstroke where pa and pb are the sides of the stroke,
     * dur is the duration of the discovery animations
     * backa or backb should be set if the path nodes are reversed
     */
    function stroke(pa, pb, pc, dur, backa, backb) {
      var dura = dur, durb;
      if (typeof(backa) === "number") {
        durb = backa;
        backa = backb;
        backb = arguments[6];
      } else {
        durb = dur;
      }
      var cax, cay, cbx, cby, spa, spb;
      // Get start coordinates
      if (backa) {
        co = pa[pa.length - 1].replace(/^[a-zA-Z]\s/, "").split(",");
        cax = parseFloat(co[0]);
        cay = parseFloat(co[1]);
      } else {
        co = pa[0].replace(/^[a-zA-Z]\s/, "").split(",");
        cax = parseFloat(co[0]);
        cay = parseFloat(co[1]);
      }
      if (backb) {
        co = pb[pb.length - 1].replace(/^[a-zA-Z]\s/, "").split(",");
        cbx = parseFloat(co[0]);
        cby = parseFloat(co[1]);
      } else {
        co = pb[0].replace(/^[a-zA-Z]\s/, "").split(",");
        cbx = parseFloat(co[0]);
        cby = parseFloat(co[1]);
      }

      var pae = sig.path("M " + pa.join(" ")).hide(), // Path a element
      pbe = sig.path("M " + pb.join(" ")).hide(), // Path b element
      a = sig.circle(cax, cay, 1)
        .hide(), // Point element to animate along a path
      b = sig.circle(cbx, cby, 1)
        .hide(), // Point element to animate along b path
      c = sig.path("M " + cax + "," + cay + " " + cbx + "," + cby)
        .hide()
        .insertAfter(sigStop)
        .attr(penstroke), // Path that gets reshaped to form penstroke
      s = [ [ cax + "," + cay ],
	    [ cbx + "," + cby ] ]; // Point stack used for penstroke path
      sig.paths.push(c);
      c.node.onmouseover = function() { sig.color(); };
      gal.aq(function(ap) {
	       var myap = function() { // Finished callback
	         // Draw the actual path
	         var detail = sig.path("M " + pc.join(" ") + " z")
	           .insertAfter(sigStop)
	           .attr({ opacity: 0 })
	           .attr(penstroke)
	           .animate({ opacity: 1 }, 100,
		            function() {
			      detail.attr('opacity', 1);
			      c.stop().animate({ opacity: 0 }, 100, null,
					       function() {
					         c.hide();
					       });
		            });
                 detail.node.onmouseover = function() { sig.color(); };
	         //sig.paths.pop();
	         sig.paths.push(detail);
	         ap();
	       },
	       drawLine = function() {
	         // Approximate path by using Raphael's animation stepping
	         c.show(); // Show the path we're animating
	         f = fill(a, b, c, s); // Generate the fill procedure using
	         // the elements we generated
	         // Animate points along paths
	         if (backa)
	           a.animateAlongBack(pae, dura);
	         else
	           a.animateAlong(pae, dura);
	         if (backb)
	           b.animateAlongBack(pbe, durb);
	         else
	           b.animateAlong(pbe, durb);
	         a.onAnimation(f);
	         b.onAnimation(f);
	       };
	       // Start this animation
	       setTimeout(drawLine);
	       var dur = Math.max(dura, durb);
	       setTimeout(myap, dur);
             });
    }

    // scale paths
    var strings = [ "jDrop", "iDrop", "sigStr", "a01j", "b01j", "c01j", "a02j",
                    "b02j", "c02j", "a03o", "b03o", "c03o", "a04h", "b04h",
                    "c04h", "a05h", "b05h", "c05h", "a06hn", "b06hn", "c06hn",
                    "a07n", "b07n", "c07n", "a08d", "b08d", "c08d", "a09d",
                    "b09d", "c09d", "a10r", "b10r", "c10r", "a11ris", "b11ris",
                    "c11ris", "a12sc", "b12sc", "c12sc", "a13c", "b13c",
                    "c13c", "a14co", "b14co", "c14co", "a15o", "b15o", "c15o",
                    "a16ol", "b16ol", "c16ol", "a17l", "b17l", "c17l", "a18ll",
                    "b18ll", "c18ll", "a19l", "b19l", "c19l" ];
    for (var i = 0; i < strings.length; i++) {
      var s = strings[i];
      eval([ "for (var j = 0; j < " + s + ".length; j++) {",
             "var m = " + s + "[j].match(/-?[0-9\.]+/g);",
             "for (var k = 0; k < m.length; k++) {",
             s + "[j] = " + s + "[j].replace(m[k],",
             "parseFloat(m[k])*sig.scale);",
             "} }" ].join(""));
    }

    sigPath = sig.path(sigStr.join(" ")).attr(mask);
    sigStop = sig.path(surfStr.join(" ")).insertBefore(sigPath).hide();

    // The J inkdrop
    gal.aq(function(ap) {
             var a = sig.path(jDrop.join(" "))
	       .insertAfter(sigStop)
	       .scale(0.001, 0.001)
	       .attr(penstroke)
	       .animate({ scale: [ 1, 1 ] }, 5.00 * sp, ">");
             a.node.onmouseover = function() { sig.color(); };
             sig.paths.push(a);
             setTimeout(ap, 2.00 * sp);
           });

    // John
    stroke(a01j, b01j, c01j, 1.50 * sp, true);
    stroke(a02j, b02j, c02j, 1.50 * sp);
    stroke(a03o, b03o, c03o, 5.00 * sp, false, true);
    stroke(a04h, b04h, c04h, 3.00 * sp, true);
    gal.wait(1.50 * sp);
    stroke(a05h, b05h, c05h, 0.50 * sp, false, true);
    stroke(a06hn, b06hn, c06hn, 9.00 * sp, false, true);
    stroke(a07n, b07n, c07n, 1.00 * sp, false, true);

    gal.wait(1.50 * sp);

    // Driscoll
    stroke(a08d, b08d, c08d, 3.00 * sp, false, true);
    gal.wait(1.00 * sp);
    stroke(a09d, b09d, c09d, 4.00 * sp, false, true);
    gal.wait(1.50 * sp);
    stroke(a10r, b10r, c10r, 2.00 * sp, false, true);
    stroke(a11ris, b11ris, c11ris, 8.00 * sp, 9.00 * sp, false, true);
    stroke(a12sc, b12sc, c12sc, 6.00 * sp, 5.00 * sp, false, true);
    gal.wait(1.00 * sp);
    stroke(a13c, b13c, c13c, 0.75 * sp, false, true);
    gal.wait(1.00 * sp);
    stroke(a14co, b14co, c14co, 2.00 * sp, false, true);
    gal.wait(1.50 * sp);
    stroke(a15o, b15o, c15o, 1.50 * sp, false, true);
    gal.wait(1.00 * sp);
    stroke(a16ol, b16ol, c16ol, 2.00 * sp, true);
    gal.wait(1.50 * sp);
    stroke(a17l, b17l, c17l, 2.00 * sp, false, true);
    gal.wait(2.00 * sp);
    stroke(a18ll, b18ll, c18ll, 4.00 * sp, true);
    gal.wait(3.00 * sp);
    stroke(a19l, b19l, c19l, 1.00 * sp, false, true);
    gal.wait(5.00 * sp);

    // The dot over the "i"
    gal.aq(function(ap) {
             var a = sig.path(iDrop.join(" "))
	       .insertAfter(sigStop)
	       .scale(0.001, 0.001)
	       .attr(penstroke)
	       .animate({ scale: [ 1, 1 ] }, 3.00 * sp, ">", ap);
             a.node.onmouseover = function() { sig.color(); };
             sig.paths.push(a);
           });

    // Replace bits & pieces with full path
    /*gal.aq(function(ap) {
     surfPath = sig.path(surfStr.join(" "))
     .attr(solid)
     .insertAfter(sigStop)
     .show();
     for (var i = 0; i < sig.paths.length; i++) {
     sig.paths[i].hide();
     }
     sig.paths.push(surfPath);
     });*/

    ap();

  });