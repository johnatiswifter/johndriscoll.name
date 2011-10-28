/*
 * Info
 * Copyright 2011 John Driscoll
 */

gal.aq(
  function(ap) {
    var $info = $('#info'),
    $ps = $info.children('p'),
    order = {},
    ps = $.makeArray($ps),
    $words = $('<p class="infowords" style="display: block;">')
      .appendTo($info);
    // Find sentences
    for (var i = 0; i < $ps.length; i++) {
      var p = $ps[i];
      // wrap words
      for (var j = 0; j < p.childNodes.length; j++) {
        var c = p.childNodes[j];
        if (c.nodeType === 3) {
          if (c.nodeValue.match(/^\s*$/)) {
            p.removeChild(c);
          } else {
            var words = c.nodeValue.split(/\s+/), l = 0;
            for (var k = 0; k < words.length; k++) {
              var word = words[k].replace(/^\s+|\s+$/, '');
              if (!word.length) continue;
              p.insertBefore($('<span>' + words[k] + '</span>')[0], c);
            }
            p.removeChild(c);
          }
          j--;
          continue;
        }
        $(c)
          .addClass('infoword')
          .addClass('infoword-' + $(p).attr('id').slice(1));
//          .append(document.createTextNode(' '));
        // wrap punctuation
        function wrapPunct(el) {
          for (var i = 0; i < el.childNodes.length; i++) {
            var c = el.childNodes[i];
            if (c.nodeType === 3) {
              if (c.nodeValue.match(/^\s*$/)) {
                continue;
              } else {
                el.replaceChild(
                  $('<span>' +
                    c.nodeValue.replace(
                        /([\.\,\;\:])/g,'<span class="infopunct">$1</span>') +
                    '</span>')[0], c);
              }
            } else {
              wrapPunct(c);
            }
          }
        }
        wrapPunct(c);
      }
      order[$(p).attr('id').slice(1)] = $.makeArray($(p).children());
      $words.append($(p).children());
      $(p).css('display', 'none');
    }

    // Set up for animations
    var l = $words.children().length,
    o = 0;
    $words.children().css('color', '#DDD');
    $words.find('.infopunct').css('opacity', 0);
    for (i = 0; i < l; i++) {
      var $w = $words.children().eq(i), pos = $w.position();
      $w.css({ top: pos.top + o, left: pos.left  });
    }

    var top = 0;

    function animate(id) {
      // record current location
      top++;
      var h = $words.height();
      $words.height('auto');
      $words.children().stop().css('position', 'static');
      $words.prepend(order[id]);
      var h2 = $words.height(),
      j = 0;
      function done() {
        if (++j === l + 1) {
          $words.height('auto');
          $words.children().css('position', 'static');
        }
      }
      for (i = l - 1; i >= 0; i--) {
        var $w = $words.children().eq(i),
        pos = $w.position(),
        a = { top: pos.top + o, left: pos.left };
        if ($w.is('.infoword-' + id)) {
          a.color = '#000';
          $w.css('zIndex', top);
          $w.find('.infopunct').stop().animate({ opacity: 1 }, 500);
        } else {
          a.color = '#DDD';
          $w.find('.infopunct').stop().animate({ opacity: 0 }, 500);
        }
        $w.stop()
          .css({ position: 'absolute' })
          .animate(a, 500, done);
      }
      $words.stop().height(h).animate({ height: h2 }, 500, done);
    }

    $('#rsig a,#projects a')
      .mouseenter(
        function() {
          animate($(this).attr('id'));
        });

    ap();

  });