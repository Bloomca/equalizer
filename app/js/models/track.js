define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

  var Track = Backbone.Model.extend({
    defaults: {
      link: "",
      name: "",
      src: "",
      play: false
    },

    initialize: function () {

    }

  });

  return Track;
});