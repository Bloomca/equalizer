let duration = 0;
let audio = null;
let qValues = [];
let filters = [];
let filterValues = [500, 2500, 4500, 6500, 8500, 11000, 14000, 17000];

filterValues.forEach(function (freq, i, arr) {
  if (!i || (i === arr.length - 1)) {
    qValues.push(null);
  } else {
    qValues.push(2 * freq / Math.abs(arr[i + 1] - arr[i - 1]));
  }
});

function createFilterNodes (oldGainFrom, lastInChainFrom) {
  var lastInChain = lastInChainFrom,
      oldGain = oldGainFrom || [];
  filterValues.forEach(function (freq, i, arr) {
    var biquadFilter = audioContext.createBiquadFilter();
    biquadFilter.type = 'peaking';
    biquadFilter.frequency.value = freq;
    biquadFilter.gain.value = oldGain[i] || 0;
    if (!i || (i === arr.length - 1)) {
      biquadFilter.type = i ? "highshelf" : "lowshelf";
    } else {
      biquadFilter.Q.value = qValues[i];
    }

    if (lastInChain) lastInChain.connect(biquadFilter);

    lastInChain = biquadFilter;

    filters.push(biquadFilter);
  });

  return lastInChain;
}

function getAudioContext () {
  return (typeof AudioContext !== 'undefined') ? new AudioContext() : new webkitAudioContext();
}

let audioContext = getAudioContext();
let volume = audioContext.createGain();
let analyser;

function createAudio(track) {
  audio = document.createElement('audio');
  audio.crossOrigin = "anonymous";
  // from here -- http://stackoverflow.com/questions/31308679/mediaelementaudiosource-outputs-zeros-due-to-cors-access-restrictions-local-mp3
  audio.src = track.stream_url + '?client_id=129995c68429621b69af9121acc1c116';

  sendDuration();

  function sendDuration () {
    if (audio && audio.duration) {
      duration = audio.duration;
    } else {
      if (audio) {
        setTimeout(function () {
          sendDuration();
        }, 1000);
      }
    }
  }

  const source = audioContext.createMediaElementSource(audio);
  const old = volume.gain.value;

  volume = audioContext.createGain();

  analyser = audioContext.createAnalyser();

  volume.gain.value = old;

  source.connect(volume);

  var lastInChain = volume;
  var oldGain = [];

  filters.forEach(function(e) {
    oldGain.push(e.gain.value);
  });

  filters = [];

  lastInChain = createFilterNodes(oldGain, lastInChain);

  lastInChain.connect(analyser);

  analyser.connect(audioContext.destination);

  return { volume, analyser };
}

export function startPlay(track) {
  const params = createAudio(track);
  audio.play();

  return params;
}

export function pause() {
  audio.pause();
}

export function unpause() {
  audio.play();
}

export function changeTrack(track) {
  audio.pause();
  audio = null;
  return startPlay(track);
}
