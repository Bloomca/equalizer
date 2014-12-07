define([
  'jquery', 'underscore', 'backbone','models/track', 'settings'
], function ($, _, Backbone, Track, settings) {

  var Tracks = Backbone.Collection.extend({

    initialize: function () {
      var self = this;

      this.on("play:next", function () {
        var model = settings.view.model,
            index = self.findIndex(model);

        if (index !== self.length - 1) {
          self.at(index).trigger('play');
          self.at(index + 1).trigger('play');
        }

      });

      this.on("play:prev", function () {
        var model = settings.view.model,
          index = self.findIndex(model);

        if (index) {
          self.at(index).trigger('play');
          self.at(index - 1).trigger('play');
        }

      });

    },

    findIndex: function (model) {
      var index;

      this.some(function(e, i){
        if (e.cid === model.cid) {
          index = i;
          return true;
        }
      });

      return index;
    },

    model: Track

  });

  return Tracks;
});