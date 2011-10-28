/*
 * Gallery
 * Copyright 2011 John Driscoll
 */

var gal = window.gal = {

  init: function() {
    gal.hts = gal.ts / 2;
    gal.doColor = gal.color;
    setInterval(function() { if (gal.colorCycle) gal.doColor(); }, 750);
    // Events
    document.onkeyup = function() {
      gal.colorCycle = false;
      clearTimeout(gal.cycleTimeout); // disable delayed cycling
      gal.cycleTimeout = false;
    };
    document.onkeydown = function(e) {
      try {
        keyCode = e.keyCode;
      } catch (x) {
        keyCode = window.event.keyCode;
      }
      switch (keyCode) {
      case 65: case 90:
        gal.doColor = function() {
          if (pool.color) { gal.pool.color(); }
        };
        break;
      case 83: case 115:
        gal.doColor = function() {
          if (flower.color) { gal.flower.color(); }
        };
        break;
      case 68: case 100:
        gal.doColor = function() {
          if (house.color) { gal.house.color(); }
        };
        break;
      case 70: case 102:
        gal.doColor = function() {
          if (sig.color) { gal.sig.color(); }
        };
        break;
      case 32: gal.doColor = gal.color; break;
      default: return;
      }
      if (!gal.colorCycle && gal.cycleTimeout === false) {
        gal.doColor();
        // wait a bit and enable color cycling
        clearTimeout(gal.cycleTimeout);
        gal.cycleTimeout = setTimeout(
          function() {
            gal.colorCycle = true;
          }, 500);
      }
    };
  },
  q: [],
  ts: 250,
  mouseOffset: function(targ, e) {
    var posx = 0, posy = 0;
    e = e || window.event;
    if (!e) return;
    if (typeof(e['touches']) !== 'undefined') {
      posx = e.touches[0].pageX;
      posy = e.touches[0].pageY;
    } else if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) 	{
      posx = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
    var curtop = 0, curleft = 0;
    if (targ.offsetParent) {
      do {
	curleft += targ.offsetLeft;
	curtop += targ.offsetTop;
      } while ((targ = targ.offsetParent));
    }
    return {
      offsetX: Math.max(0, Math.min(gal.ts, posx - curleft)),
      offsetY: Math.max(0, Math.min(gal.ts, posy - curtop))
    };
  },

  /*
   * Animation helpers
   */

  /**
   * Enqueue an animation
   */
  aq: function(func, count) {
    gal.q.push([ func, count || 1 ]);
  },

  /**
   * Add a pause in the animation queue
   */
  wait: function(dur) {
    gal.aq(function() { setTimeout(function() { gal.play(); }, dur); });
  },

  /**
   * Execute first animation and adjust queue
   */
  play: function() {
    // Hide stuff
    if (!gal.q.length) return;
    var func = gal.q[0][0],
    count = gal.q[0][1],
    i = 0,
    ap = function() { if (++i === count) gal.play(); };
    gal.q =  gal.q.slice(1);
    func(ap);
  },

  /**
   * Change colors of objects
   */
  color: function() {
    if (flower && flower.color)
      flower.color();
    if (pool && pool.color)
      pool.color();
    if (house && house.color)
      house.color();
    if (sig.color)
      sig.color();
  },

  colorCycle: false,
  cycleTimeout: false,

  /**
   * Random helper
   */
  rand: function(x) {
    if (typeof(x) === "undefined")
      return Math.random();
    return Math.floor(Math.random() * x);
  },

  nextColor: function() {
    this.co = this.co || gal.palette.length;
    if (++this.co > gal.palette.length) this.co = 1;
    return gal.palette[this.co - 1];
  },

  palette: [
    "#000000",
    "#FF177C",
    "#FFCE2A",
    "#00FF00",
    "#2CA2B5",
    "#5B1281"
  ],

  hexToRgb: function(co) {
    var m = co.match(/#(..)(..)(..)/).slice(1);
    return [ parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16) ];
  },
  rgbToHex: function(m) {
    var r = m[0].toString(16),
    g = m[1].toString(16),
    b = m[2].toString(16);
    if (r.length === 1) r = "0" + r;
    if (g.length === 1) g = "0" + g;
    if (b.length === 1) b = "0" + b;
    return "#" + r + g + b;
  },
  hexToHsv: function(co) {
    co = gal.hexToRgb(co);
    return gal.rgbToHsv(co[0], co[1], co[2]);
  },
  hsvToHex: function(co) {
    co = gal.hsvToRgb(co[0], co[1], co[2]);
    return gal.rgbToHex([ parseInt(co[0]),
                          parseInt(co[1]),
                          parseInt(co[2]) ]);
  },
  rgbToHsv: function(r, g, b) {
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
    h, s, v = max,
    d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max == min) {
      h = 0; // achromatic
    } else {
      switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h, s, v];
  },

  hsvToRgb: function(h, s, v) {
    var r, g, b,
    i = Math.floor(h * 6),
    f = h * 6 - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    }
    return [r * 255, g * 255, b * 255];
  },

  write: function(id, html) {
    gal.writes = gal.writes || [];
    gal.writes.push({ id: id, html: html });
  }

};

gal.init();
$(document).ready(
  function() {
    // Soul_Master custom bug fix for ticket #8052
    if ( jQuery.browser.msie && jQuery.browser.version >= 9 ) {
      jQuery.support.noCloneEvent = true;
    }
    // Detect VML support
    var a = document.body.appendChild(document.createElement('div'));
    a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
    var b = a.firstChild;
    b.style.behavior = "url(#default#VML)";
    var canVML = b ? typeof b.adj == "object": true;
    a.parentNode.removeChild(a);
    // Detect SVG support
    var canSVG = document
      .implementation
      .hasFeature(
        "http://www.w3.org/TR/SVG11/feature#BasicStructure",
        "1.1");
    if (canVML || canSVG) {
      $('head').append($('<style> .hide { display: none; } </style>'));
      for (var i = 0; i < gal.writes.length; i++) {
        $('#' + gal.writes[i].id).replaceWith(gal.writes[i].html);
      }
      gal.play();
    } else {
      // Emulate disabled Javascript
      if ($('noscript').text()) {
        /* This wont work in Safari and Android Webkit because they
         * completely ignore the noscript element content:
         * http://old.nabble.com/getting-contents-of-noscript-element-through-DOM-td25858906.html
         */
        $('noscript').each(
          function() { $(this).replaceWith($(this).text()); });
      } else {
        /* Safari and Android WebKit method:
         * Downloads HTML file and parse in/out manually
         */
        var x = new XMLHttpRequest();
        x.open('GET', window.location.pathname);
        x.onreadystatechange = function() {
          if (x.readyState === 4) {
            var t = x.responseText.replace(/\n/g, '\uffff');
            t = t
              .replace(/<!DOCTYPE html>/, '')
              .replace(/<\/?html>/g, '');
            while (t.match(/<script.*?>/)) {
              t = t.replace(/<script.*?>(.*)/,
                            function(a, b) {
                              return b.slice(b.indexOf('</script>') + 9);
                            });
            }
            while (t.match(/<noscript.*?>/)) {
              t = t.replace(/<noscript.*?>(.*)/,
                            function(a, b) {
                              return b.slice(0, b.indexOf('</noscript>')) +
                                b.slice(b.indexOf('</noscript>') + 11);
                            });
            }
            $('head').html(
              t.match(/<head>(.*)<\/head>/)[1]
                .replace(/\uffff/g,'\n'));
            $('body').html(
              t.match(/<body>(.*)<\/body>/)[1]
                .replace(/\uffff/g,'\n'));
          }
        };
        x.send();
      }
    }
  });