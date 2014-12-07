define(['jquery', 'underscore', 'backbone','views/trackView'], function ($, _, Backbone, TrackView) {

  var TracksView = Backbone.View.extend({

    el: "#list",

    initialize: function () {
      this.listenTo(this.collection, 'reset', this.render);
    },

    render: function () {
      console.log(this.collection.length)
      this.$el.empty();

      this.collection.each(function (model) {
        this.addOne(model);
      }.bind(this));

      return this;
    },

    addOne: function (model) {
      var v = new TrackView({ model: model });
      this.$el.append(v.render().$el);
    }

  });

  return TracksView;
});