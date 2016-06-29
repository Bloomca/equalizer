import xs from 'xstream';
import { startPlay, pause, unpause, changeTrack } from '../player/index';

const getDefaultState = () => ({
  track: null,
  playing: false,
  paused: false,
  duration: null,
  time: 0,
  volume: { gain: { value: 1 } },
  analyser: null
});

export function playDriver(res$) {
  const result = {};
  let intervalId;
  let startingMoment;
  let lastTime = 0;
  res$.addListener({
    next: ({ type, track, value }) => {
      switch (type) {
        case 'play_track':
          result.play(track);
          break;
        case 'volume':
          result.setVolume(value);
          break;
        default:
          break;
      }
    },
    error: _ => _,
    complete: _ => _
  });
  let status = getDefaultState();
  const statusProvider = {
    start(listener) {
      this.listener = listener;
    },
    stop() {
      this.listener = null;
    },
    updateStatus(newStatus) {
      if (this.listener) {
        // console.log('updating status...', newStatus, status);
        const updatedStatus = Object.assign({}, status, newStatus);
        status = updatedStatus;
        this.listener.next(updatedStatus);
      }
    }
  };

  const stream$ = xs.create(statusProvider).startWith(getDefaultState());
  stream$.addListener({
    next: params => {
      // console.log(params);
    },
    error: _ => _,
    complete: _ => _
  });


  result.getState = () => {
    return stream$;
  };
  result.setVolume = (value) => {
    status.volume.gain.value = value / 100;
    statusProvider.updateStatus();
  };
  result.play = (track) => {
    const newStatus = { track };

    const playParams = { track, start: result.startPlaying, pause: result.pausePlaying, updateDuration: result.updateDuration };
    if (!status.track) {
      lastTime = 0;
      const { volume, analyser, playPromise } = startPlay(playParams);
      newStatus.playing = true;
      newStatus.paused = false;
      newStatus.volume = volume;
      newStatus.analyser = analyser;
      newStatus.time = 0;
      newStatus.duration = null;
      playPromise.then(result.startPlaying);
    } else if (status.track.id !== track.id) {
      lastTime = 0;
      const { volume, analyser, playPromise } = changeTrack(playParams);
      newStatus.playing = true;
      newStatus.paused = false;
      newStatus.volume = volume;
      newStatus.analyser = analyser;
      newStatus.time = 0;
      newStatus.duration = null;
      playPromise.then(result.startPlaying);
    } else if (status.playing && status.paused === false) {
      pause();
      newStatus.playing = true;
      newStatus.paused = true;
      result.pausePlaying();
    } else if (status.playing && status.paused === true) {
      const { playPromise } = unpause();
      newStatus.playing = true;
      newStatus.paused = false;
      playPromise.then(result.startPlaying);
    }

    statusProvider.updateStatus(newStatus);
  };

  result.updateDuration = (duration) => {
    statusProvider.updateStatus({ duration });
  };

  result.startPlaying = () => {
    clearInterval(intervalId);
    startingMoment = Date.now();
    intervalId = setInterval(() => {
      const newTime = lastTime + Date.now() - startingMoment;
      statusProvider.updateStatus({ time: newTime });
    }, 100);
  };

  result.pausePlaying = () => {
    clearInterval(intervalId);
    const newTime = lastTime + Date.now() - startingMoment;
    lastTime = newTime;
    statusProvider.updateStatus({ time: newTime });
  };

  return result;
}
