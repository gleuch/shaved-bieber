/*
  SHAVED BIEBER
  Bookmarklet, Firefox extension, and inline code to clean up those lower regions
  of websites from Bieber mentions.

  by Greg Leuch <http://www.gleuch.com>
 
  ------------------------------------------------------------------------------------
 
*/


Array.prototype.in_array = function(p_val, sensitive) {for(var i = 0, l = this.length; i < l; i++) {if ((sensitive && this[i] == p_val) || (!sensitive && this[i].toLowerCase() == p_val.toLowerCase())) {return true;}} return false;};
function rgb2hex(rgb) {rgb = rgb.replace(/\s/g, "").replace(/^(rgb\()(\d+),(\d+),(\d+)(\))$/, "$2|$3|$4").split("|"); return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);} 
function hex(x) {var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8","9", "A", "B", "C", "D", "E", "F"); return isNaN(x) ? "00" : hexDigits[(x-x%16)/16] + hexDigits[x%16];}

var $_ = false, $shaved_bieber = document.createElement('script'), local = true;
$shaved_bieber.src = 'http://assets.gleuch.com/jquery-latest.js';
$shaved_bieber.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild($shaved_bieber);


function shaved_bieber_wait() {
  if ((local && typeof(jQuery) == 'undefined') || (!local && typeof(unsafeWindow.jQuery) == 'undefined')) {
    window.setTimeout(shaved_bieber_wait,100);
  } else {
    shaved_bieber_start(local ? jQuery : unsafeWindow.jQuery);
  }
}

function shaved_bieber_start($_) {
  $_.fn.reverse = function(){return this.pushStack(this.get().reverse(), arguments);};

  (function($_) {
    $_.shaved_bieber = function(data, c) {
      if (!$_.shaved_bieber.settings.finish) $_.shaved_bieber.init();
      $_(data).shaved_bieber(c);
      if (!$_.shaved_bieber.settings.finish) $_.shaved_bieber.finish();
    };
 
    $_.fn.shaved_bieber = function(c) {
      return this.filter(function() {return $_.shaved_bieber.filter(this);}).each(function() {$_.shaved_bieber.shave(this, c);});
    };

    $_.extend($_.shaved_bieber, {
      settings : {hide_bg : true, search: /(justin)(\s)?(drew\s)?(bieber|beiber)/img, replace: '<span class="shaved_bieber">SHAVED BIEBER</span>', starred: '****** ******', init : false, finish : false},

      filter : function(self) {
        if (self.nodeType == 1) {
          var tag = self.tagName.toLowerCase();
          return !(self.className.match('shaved_bieber') || tag == 'head' || tag == 'img' || tag == 'script');
        } else {
          return true;
        }
      },

      shave : function(self, c) {
        $_(self).css({'text-shadow' : 'none'});

        if (self.nodeType == 3) {
          if (self.nodeValue.replace(/\s/ig, '') != '') {
            if (!c) c = $_(self).parent() ? $_(self).parent().css('color') : '#000000';
            text = self.nodeValue.replace($_.shaved_bieber.settings.search, '<span class="shaved_bieber" style="color: '+ c +'; background-color:'+c+';">$1$2$3</span>')
            $_(self).after(text);
            self.nodeValue = '';
          }
        } else if (self.nodeType == 1) {
          c = rgb2hex($_(self).css('color'));
          if ($_(self).children().length > 0) {
            $_.shaved_bieber($_(self).contents(), c);
          } else if ($_(self).children().length == 0) {
            text = $_(self).html().replace($_.shaved_bieber.settings.search, '<span class="shaved_bieber" style="color: '+ c +'; background-color:'+c+';">$1$2$3$4</span>');
            $_(self).html(text);
          }
        }
      },

      init : function() {
        $_.shaved_bieber.settings.init = true;
      },

      finish : function() {
        $_(document).each(function() {
          this.title = this.title.replace($_.shaved_bieber.settings.search, $_.shaved_bieber.settings.starred)
        });

        // setTimeout(function() {
        //   $_('object,embed,iframe').each(function() {
        //     var r = $_(this);
        //     r.wrap(document.createElement('div'));
        //     var s = $_(this).parent();
        //     s.css({width: r.width(), height: r.height()}).addClass('shaved_bieber');
        //     r.remove();
        //   });
        // }, 1000);

        // $_('img, input[type=image]').each(function() {
        //   var r = $_(this), w = r.width(), h = r.height();
        //   r.css({width: r.width(), height: r.height()}).attr('src', 'http://assets.gleuch.com/blank.png').width(w).height(h);
        // });

        var s = document.createElement("style");
        s.innerHTML = ".shaved_bieber {font-size: inherit !important; "+ ($_.shaved_bieber.settings.hide_bg ? "background-image: none !important;" : "") +"} .bg_shaved_bieber {"+ ($_.shaved_bieber.settings.hide_bg ? "background-image: none !important;" : "") +"} select, input, textarea, object, embed, img, button, hr {background: #000 !important; color: #000 !important; border-color: #000 !important;}";
        $_('head').append(s);

        /*if ($_.shaved_bieber.settings.hide_bg) $_('body *, body, html').each(function() {$_(this).addClass('bg_shaved_bieber');});*/

        $_.shaved_bieber.settings.finish = true;
      }
    });
  })($_);
  
  /* $(window).ready(function() { */
    /* Remove some shitty ads */
    $('iframe, a[href~=atdmt], script[src~=doubleclick]').remove();
  /* }); */
  /* $_(document).ready(function() { */
    $_.shaved_bieber('html', '#000000');

    /* setTimeout(function() {
      if ($_.shaved_bieber.settings.md5 != $('*').size()) {
        $_.shaved_bieber('html', '#000000');
        $_.shaved_bieber.settings.md5 = $('*').size();
      }
    }, 2000); */
  /* }); */
}


shaved_bieber_wait();