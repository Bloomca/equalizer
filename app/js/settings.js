define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
  var settings = _.extend({
    qValues:  [],
    filters: [],
    filterValues: [500, 2500, 4500, 6500, 8500, 11000, 14000, 17000]
  }, Backbone.Events);

  settings.audioContext = getAudioContext();
  settings.volume = settings.audioContext.createGain();

  settings.filterValues.forEach(function (freq, i, arr) {
    if (!i || (i === arr.length - 1)) {
      settings.qValues.push(null);
    } else {
      settings.qValues.push(2 * freq / Math.abs(arr[i + 1] - arr[i - 1]));
    }
  });

  return settings;

  function getAudioContext () {
    return (typeof AudioContext !== "undefined") ? new AudioContext() : new webkitAudioContext();
  }

});

