/*****
Text Effects
Text Effects is a sci-fi style awesome effect made with jQuery. As a jQuery plugin, you can simply implement the effect on your website with only one line of script.

Release under MIT License by Fourdesire, 2013
http://fourdesire.com
*****/

(function() {

  $.fn.extend({
    textEffectLoop: function(options) {
      var isForward, loopSettings, settings;
      settings = {
        fps: 20,
        repeat: 10,
        debug: false,
        reverse: false,
        possibleChar: "ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+-=[];;><0123456789",
        startTime: 0
      };
      loopSettings = {
        timeout: 5000,
        loop: "infinite"
      };
      isForward = false;
      settings = $.extend(settings, loopSettings, options);
      return this.each(function() {
        var parent, ticker;
        ticker = 0;
        parent = $(this);
        parent.children().each(function() {
          return $(this).hide();
        });
        parent.children().first().textEffect(settings);
        parent.trigger('texteffectloopstart');
        return parent.children().off('texteffectend').on('texteffectend', function() {
          var self;
          isForward = !isForward;
          self = $(this);
          if (isForward === true) {
            return setTimeout((function() {
              return self.textEffect({
                fps: settings.fps / 4,
                repeat: settings.repeat / 2,
                debug: settings.debug,
                reverse: !settings.reverse,
                possibleChar: settings.possibleChar,
                startTime: settings.startTime
              });
            }), settings.timeout);
          } else {
            if (self.next().length) {
              return self.next().textEffect(settings);
            } else {
              ticker++;
              if (settings.loop === "infinite" || ticker < settings.loop) {
                return parent.children().first().textEffect(settings);
              } else {
                return parent.trigger('texteffectloopend');
              }
            }
          }
        });
      });
    },
    textEffect: function(options) {
      var getRandomChar, log, settings, timer;
      settings = {
        fps: 20,
        repeat: 10,
        debug: false,
        reverse: false,
        possibleChar: "ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+-=[];;><0123456789",
        startTime: 0
      };
      timer = settings.startTime;
      settings = $.extend(settings, options);
      log = function(msg) {
        if (settings.debug) {
          return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
        }
      };
      getRandomChar = function() {
        return settings.possibleChar.charAt(Math.floor(Math.random() * settings.possibleChar.length));
      };
      return this.each(function() {
        var animate, currentFrameNum, indexer, output, outputs, render, self, text, ticker, tickerFromMiddle, totalFrameNum, x, y, _i, _j, _k, _l, _len, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
        self = this;
        text = $(this).text();
        timer = 0;
        ticker = 1;
        currentFrameNum = totalFrameNum = 0;
        tickerFromMiddle = parseInt(text.length / 2 + 1, 10);
        outputs = [];
        $(this).html("").show();
        animate = function(output) {
          log("[rendering at " + timer + "]: " + output);
          totalFrameNum++;
          return setTimeout(render, timer += settings.fps, output, self);
        };
        render = function(output) {
          $(self).html(output);
          if (++currentFrameNum === totalFrameNum) {
            if (settings.reverse) {
              $(self).html(text).hide();
            }
            return $(self).trigger("texteffectend");
          }
        };
        log("[init] fps: " + settings.fps);
        log("[init] text: " + text);
        log("[init] effect: sequence");
        $(this).trigger("texteffectstart");
        for (indexer = _i = 1, _ref = text.length; 1 <= _ref ? _i <= _ref : _i >= _ref; indexer = 1 <= _ref ? ++_i : --_i) {
          if (ticker > text.length) {
            break;
          }
          for (x = _j = 1, _ref1 = settings.repeat; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 1 <= _ref1 ? ++_j : --_j) {
            output = '';
            for (y = _k = 0, _ref2 = ticker - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
              if (y < (ticker - 1) / 2) {
                output += text[y];
              } else {
                output += getRandomChar();
              }
            }
            outputs.push(output);
          }
          if (ticker === text.length) {
            break;
          }
          ticker *= 2;
          if (ticker > text.length) {
            ticker = text.length;
          }
        }
        for (indexer = _l = _ref3 = parseInt(text.length / 2, 10), _ref4 = text.length - 1; _ref3 <= _ref4 ? _l <= _ref4 : _l >= _ref4; indexer = _ref3 <= _ref4 ? ++_l : --_l) {
          output = text.slice(0, +(text.length / 2) + 1 || 9e9);
          for (x = _m = _ref5 = parseInt(text.length / 2 + 1, 10), _ref6 = text.length - 1; _ref5 <= _ref6 ? _m <= _ref6 : _m >= _ref6; x = _ref5 <= _ref6 ? ++_m : --_m) {
            if (x < tickerFromMiddle) {
              output += text[x];
            } else {
              output += getRandomChar();
            }
          }
          tickerFromMiddle++;
          outputs.push(output);
        }
        if (settings.reverse) {
          outputs.reverse();
        }
        _results = [];
        for (_n = 0, _len = outputs.length; _n < _len; _n++) {
          output = outputs[_n];
          _results.push(animate(output, this));
        }
        return _results;
      });
    }
  });

}).call(this);
