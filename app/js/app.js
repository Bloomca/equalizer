define([
  'jquery',
  'underscore',
  'backbone',
  'soundcloud',
  'views/appView',
  'collections/tracks',
  'views/tracksView',
  'models/equalizer',
  'views/equalizerView',
  'settings',
  'views/controlsView',
  'views/spectrogramView'
], function ($, _, Backbone, SC, AppView, Tracks, TracksView, Equalizer,
             EqualizerView, settings, ControlsView, SpectrogramView) {

  $(function () {

    SC.initialize({
      client_id: '129995c68429621b69af9121acc1c116'
    });

    var tracks = new Tracks();

    var appView = new AppView({ collection: tracks });
    var tracksView = new TracksView({ collection: tracks });
    var equalizer = new Equalizer({ filters: settings.filterValues });
    var equalizerView = new EqualizerView({ model: equalizer });
    var controls = new ControlsView({ collection: tracks });
    var spectrogramView = new SpectrogramView({});
  });

});

