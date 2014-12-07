define(['../../vendor/jquery.min','underscore'], function ($, _) {

  $(function(){

    $.getScript("http://connect.soundcloud.com/sdk.js")
      .then(function(){
        SC.initialize({
          client_id: '129995c68429621b69af9121acc1c116'
        });

        var tmpl = _.template( $('#audio-tmpl').html() );

        SC.get('/tracks', { genres: 'punk', license: 'cc-by-sa' }, function(tracks) {
          console.log(tracks);
          tracks.forEach(function(e) {
            $('<div>').html(tmpl({name: e.permalink})).appendTo('body');
          });

          var tr = tracks[0].uri.match(/\d+$/)[0];

          var audio = document.createElement('audio');
          audio.src = tracks[0].stream_url + "?client_id=129995c68429621b69af9121acc1c116";
          audio.controls = true;

          $('body').prepend(audio);

          var canvas = $('#waveform')[0],
            ctx = canvas.getContext('2d'),
            width = canvas.width,
            height = canvas.height;

          window.context = 123;
          if (typeof AudioContext !== "undefined") {
            context = new AudioContext();
          } else if (typeof webkitAudioContext !== "undefined") {
            context = new webkitAudioContext();
          } else {
            throw new Error('AudioContext not supported. :(');
          }

          var analyzer = context.createAnalyser();

          window.source = context.createMediaElementSource(audio);
          source.connect(analyzer);

          // Create a gain node
          var gainNode = context.createGain();

// Create variables to store mouse pointer Y coordinate
// and HEIGHT of screen
          var CurY;
          var HEIGHT = window.innerHeight;

// Get new mouse pointer coordinates when mouse is moved
// then set new gain value

          document.onmousemove = updatePage;

          function updatePage(e) {
            CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

            gainNode.gain.value = CurY/HEIGHT;
          }
          analyzer.connect(gainNode);

          gainNode.connect(context.destination);

          //SC.stream("/tracks/" + tr, function(sound){
          //  sound.play();
          //});
        });

      });
  });
});

