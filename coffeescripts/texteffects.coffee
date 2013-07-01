###
Text Effects
Text Effects is a sci-fi style awesome effect made with jQuery. As a jQuery plugin, you can simply implement the effect on your website with only one line of script.

Release under MIT License by Fourdesire, 2013
http://fourdesire.com
###

$.fn.extend
  textEffectLoop: (options) ->
    settings =
      fps: 20
      repeat: 10
      debug: false
      reverse: false
      possibleChar: "ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+-=[];;><0123456789"
      startTime: 0

    loopSettings =
      timeout: 5000
      loop: "infinite"

    isForward = false

    # Merge default settings with options.
    settings = $.extend settings, loopSettings, options

    return @each () ->

      ticker = 0
      parent = $(@)
      parent.children().each -> $(@).hide()
      parent.children().first().textEffect settings
      parent.trigger('texteffectloopstart')

      parent.children().off('texteffectend').on('texteffectend', ->
        isForward = !isForward
        self = $(@)
        if isForward is true
          setTimeout ( ->
            self.textEffect
              fps: settings.fps / 4
              repeat: settings.repeat / 2
              debug: settings.debug
              reverse: !settings.reverse
              possibleChar: settings.possibleChar
              startTime: settings.startTime
          ), settings.timeout
        else
          if self.next().length
            self.next().textEffect settings
          else
            ticker++
            if settings.loop is "infinite" or ticker < settings.loop
              parent.children().first().textEffect settings
            else
              parent.trigger('texteffectloopend')
      )

  textEffect: (options) ->
    settings =
      fps: 20
      repeat: 10
      debug: false
      reverse: false
      possibleChar: "ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+-=[];;><0123456789"
      startTime: 0
    timer = settings.startTime # in microsecond

    # Merge default settings with options.
    settings = $.extend settings, options

    # simple logger.
    log = (msg) ->
      console?.log msg if settings.debug

    # class method
    getRandomChar = ->
      settings.possibleChar.charAt(Math.floor(Math.random() * settings.possibleChar.length))

    return @each ()->
      self = @
      text = $(@).text()

      timer = 0 # in microsecond
      ticker = 1
      currentFrameNum = totalFrameNum = 0
      tickerFromMiddle = parseInt(text.length / 2 + 1, 10)
      outputs = []

      $(@).html("").show()

      # ------------
      # object method
      # ------------
      animate = (output) ->
        log "[rendering at #{timer}]: #{output}"
        totalFrameNum++
        setTimeout render,
                   timer+=settings.fps,
                   output, self

      render = (output) ->
        $(self).html(output)

        # handle event
        if ++currentFrameNum == totalFrameNum
          if settings.reverse
            $(self).html(text).hide()
          $(self).trigger("texteffectend")

      # --
      # print out settings
      log "[init] fps: #{settings.fps}"
      log "[init] text: #{text}"
      log "[init] effect: sequence"

      # handle event
      $(@).trigger("texteffectstart")

      for indexer in [1..text.length]
        break if ticker > text.length

        for x in [1..settings.repeat]
          output = ''
          for y in [0..ticker-1]
            if y < (ticker-1) / 2
              output += text[y]
            else
              output += getRandomChar()
          # call animation
          outputs.push output

        break if ticker == text.length

        ticker *= 2
        ticker = text.length if ticker > text.length

      for indexer in [parseInt(text.length/2, 10)..text.length-1]
        output = text[0..text.length/2]

        for x in [parseInt(text.length/2+1, 10)..text.length-1]
          if x < tickerFromMiddle
            output += text[x]
          else
            output += getRandomChar()
        tickerFromMiddle++

        # Call Animation
        outputs.push output

      if settings.reverse
        outputs.reverse()

      for output in outputs
        animate output, @