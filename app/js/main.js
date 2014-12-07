require.config({
  paths: {
    jquery: '../vendor/jquery.min',
    backbone: '../vendor/backbone',
    underscore: '../vendor/underscore-min',
    soundcloud: '../vendor/soundcloud',
    jqueryui: '../vendor/jquery-ui.min'
  }
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['app']);