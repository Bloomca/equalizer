define([
  'jquery', 'underscore', 'backbone', 'settings', 'jqueryui'
], function ($, _, Backbone, settings) {

  var ControlsView = Backbone.View.extend({

    el: $('#control-panel'),

    initialize: function () {

      this.render();

      $('<div class="slider">').slider({
        step: 0.1,
        max: 1,
        min: 0,
        value: 1,
        slide: function(e, ui) {
          settings.volume.gain.value = ui.value;
        }
      }).appendTo(this.$('#volume'));

      var timer, rewind,
          self = this,
          $progress = this.$('#progress'),
          $bar = $progress.find('div'),
          $duration = this.$('#duration'),
          suspend = false;

      this.$duration = $duration;

      settings.on("change:duration", function () {
        clearInterval(timer);
        var duration = settings.duration,
            start = Date.now(),
            time = humTime(duration),
            period = 50,
            shift = 0;

        timer = setInterval(function () {
          if (suspend) {
            start += period;
            return;
          }

          if (!settings.view.audio) {
            $duration.html("");
            clearInterval(timer);
            return;
          }

          if (rewind !== undefined) {
            shift = duration * rewind * 1000 - Date.now() + start;
            settings.view.audio.currentTime = duration * rewind;
            rewind = undefined;
          }

          var res = (Date.now() - start + shift)/(10*duration);

          if (res >= 100) {
            clearInterval(timer);
            $bar.css({
              width: '100%'
            });
            $duration.html(time + ' / ' + time);
            shift = 0;
            self.playNext();
          } else {
            $bar.css({
              width: res + '%'
            });
            $duration.html(humTime(duration*res/100) + ' / ' + time);

          }
        }, period);
      });

      settings.on('rewind', function (amount) {
        rewind = amount;
      });

      settings.on('play:pause', function () {
        suspend = true;
      });

      settings.on('play:resume', function () {
        suspend = false;
      });

      settings.on('start:app', function () {
        self.$el.fadeIn(1500);
      });

      function humTime (time) {
        return Math.floor(time/60) + ':' + (time % 60 > 10 ? Math.floor(time % 60) : '0' + Math.floor(time % 60));
      }
    },

    events: {
      "click .prev": "playPrevious",
      "click .next": "playNext",
      "click .play": "togglePlay",
      "click #progress": "rewind",
      "click .stop": "stop",
      "click .volume": "toggleVolume"
    },

    template: _.template( $('#control-panel-tmpl').html() ),

    render: function () {
      this.$el.html(this.template());
    },

    playPrevious: function () {
      if (settings.view && settings.view.audio.currentTime > 10) {
        settings.trigger('rewind', 0);
      } else {
        this.collection.trigger('play:prev');
      }
      settings.trigger('play:resume');
    },

    playNext: function () {
      this.collection.trigger('play:next');
      settings.trigger('play:resume');
    },

    togglePlay: function () {
      settings.view.$('.play').click();
    },

    rewind: function (e) {
      settings.trigger('rewind', e.offsetX/$(e.target).width());
    },

    stop: function () {
      settings.trigger('rewind', 0);
      settings.view.trigger('stop');
    },

    toggleVolume: function () {
      if (this.oldVolume) {
        this.$('.volume').attr('src','img/sound-on.jpg');
        settings.volume.gain.value = this.oldVolume;
        this.oldVolume = undefined;
        $(".slider").slider( "option", "disabled", false );
      } else {
        this.$('.volume').attr('src','img/sound-off.jpg');
        this.oldVolume = settings.volume.gain.value;
        settings.volume.gain.value = 0;
        this.$(".slider").slider( "option", "disabled", true );
      }
    }

  });

  return ControlsView;
});