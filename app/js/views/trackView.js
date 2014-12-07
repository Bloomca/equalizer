define(['jquery', 'underscore', 'backbone','settings'], function ($, _, Backbone, settings) {

  var TrackView = Backbone.View.extend({

    tagName: 'li',

    initialize: function () {
      var self = this;

      this.on('stopMusic', this.playMusic);
      this.listenTo(this.model,'play', this.playMusic);
      this.on('stop', function () {
        self.playMusic();
        self.audio = null;
      });
    },

    events: {
      'click .play': "clickOnPlay"
    },

    template: _.template( $('#track-tmpl').html() ),

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    },

    clickOnPlay: function () {
      if (!settings.startApp) {
        settings.trigger('start:app');
        settings.startApp = true;
      }

      if (this.model.get('play')) {
        settings.trigger('play:pause');
      } else {
        settings.trigger('play:resume');
      }

      this.playMusic();
    },

    playMusic: function () {
      if (this.model.get('play')) {
        this.audio.pause();
        this.model.set({
          play: false
        });
      } else {
        if (settings.view && settings.view !== this) {
          if (settings.view.model.get('play')) {
            settings.view.trigger('stopMusic');
          }
          this.createAudio();
        }

        if (!this.audio) this.createAudio();

        this.audio.play();
        this.model.set({
          play: true
        });

        settings.view = this;
      }

      this.render();
    },

    createAudio: function () {

      this.audio = document.createElement('audio');
      this.audio.src = this.model.get('src');

      var self = this;

      sendDuration();

      function sendDuration () {
        if (self.audio.duration) {
          settings.duration = self.audio.duration;
          settings.trigger('change:duration');
        } else {
          setTimeout(function () {
            sendDuration();
          }, 1000);
        }
      }

      var source = settings.audioContext.createMediaElementSource(this.audio),
          old = settings.volume.gain.value;

      settings.volume = settings.audioContext.createGain();

      settings.analyser = settings.audioContext.createAnalyser();

      settings.volume.gain.value = old;

      source.connect(settings.volume);

      var lastInChain = settings.volume;

      var oldGain = [];

      settings.filters.forEach(function(e){
        oldGain.push(e.gain.value);
      });

      console.log(oldGain);

      settings.filters = [];

      lastInChain = createFilterNodes(oldGain, lastInChain);

      lastInChain.connect(settings.analyser);

      settings.analyser.connect(settings.audioContext.destination);

      //lastInChain.connect(settings.audioContext.destination);
    }

  });

  createFilterNodes();

  return TrackView;

  function createFilterNodes (oldGainFrom, lastInChainFrom) {
    var lastInChain = lastInChainFrom,
        oldGain = oldGainFrom || [];
    settings.filterValues.forEach(function (freq, i, arr) {
      var biquadFilter = settings.audioContext.createBiquadFilter();
      biquadFilter.type = "peaking";
      biquadFilter.frequency.value = freq;
      biquadFilter.gain.value = oldGain[i] || 0;
      if (!i || (i === arr.length - 1)) {
        biquadFilter.type = i ? "highshelf" : "lowshelf";
      } else {
        biquadFilter.Q.value = settings.qValues[i];
      }

      if (lastInChain) lastInChain.connect(biquadFilter);

      lastInChain = biquadFilter;

      settings.filters.push(biquadFilter);
    });

    return lastInChain;
  }

});