define([
  'jquery', 'underscore', 'backbone', 'settings', 'jqueryui'
], function ($, _, Backbone, settings) {

  var EqualizerView = Backbone.View.extend({

    el: $('#equalizer'),

    initialize: function () {
      this.render();

      var self = this,
          filters = this.model.get('filters'),
          $sliders = this.$('.filters');

      filters.forEach(function (freq, i) {
        $('<div class="slider">').slider({
          step: 1,
          max: 10,
          min: -10,
          orientation: "vertical",
          value: 0,
          slide: function( event, ui ) {
            settings.filters[i].gain.value = ui.value;
          }
        })
          .append($('<div>').css({
              position: "absolute",
              bottom: "-33px",
              width: "50px",
              left: "-17px",
              textAlign: "center",
              fontSize: "80%"
            })
            .text(humFreq(freq))
          )
          .appendTo($sliders);
      });
    },

    template: _.template( $('#equalizer-tmpl').html() ),

    render: function () {
      this.$el.append(this.template());
    }
  });

  return EqualizerView;

  // print frequency in readable way
  function humFreq (freq) {
    var f = (freq / 1000).toString().slice(0,3);

    return f + ' kHz';
  }
});