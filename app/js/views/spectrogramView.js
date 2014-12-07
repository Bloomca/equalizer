define(['jquery', 'underscore', 'backbone', 'settings'], function ($, _, Backbone, settings) {

  var SpectrogramView = Backbone.View.extend({

    el: "#spectrogram-container",

    initialize: function () {
      this.canvas = this.el.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;

      var self = this;

      settings.on('start:app', function () {
        setInterval(function(){
          self.drawSpectrogram();
        }, 33);
      });

    },

    drawSpectrogram: function () {
      var freqData = new Uint8Array(settings.analyser.frequencyBinCount);

      settings.analyser.getByteFrequencyData(freqData);

      this.ctx.clearRect(0, 0, this.width, this.height);

      for (var i = 0; i < freqData.length; i++ ) {
        var magnitude = freqData[i];
        this.ctx.fillRect(i*1.5, this.height, 1, -magnitude * 2);
      }
    }

  });

  return SpectrogramView;

});