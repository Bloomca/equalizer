define(['jquery', 'underscore', 'backbone','soundcloud'], function ($, _, Backbone, SC) {

  var AppView = Backbone.View.extend({

    el: '#app',

    initialize: function () {
      this.$query = this.$('#search');
    },

    events: {
      'click #btn-search': 'searchTracks',
      'keyup #search': "onKeyUp"
    },

    searchTracks: function () {
      var self = this;
      SC.get('/tracks', { q: this.$query.val(), license: 'cc-by-sa' }, function(tracks) {
        var tr = self.prepareTracks(tracks);
        self.collection.reset(tr);
      });
    },

    onKeyUp: function (e) {
      if (e.keyCode === 13) {
        this.searchTracks();
        this.$('#search').blur();
      }
    },

    prepareTracks: function (tracks) {
      var res = [];

      tracks.forEach(function(track){
        var o = {};
        o.link = track.permalink_url;
        o.fullName = o.shortName = track.title;
        if (track.title.length > 55) o.shortName = track.title.slice(0,55) + '..'
        o.src = track.stream_url + "?client_id=129995c68429621b69af9121acc1c116";
        res.push(o);
      });

      return res;
    }

  });

  return AppView;
});