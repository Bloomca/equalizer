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
        console.log('updating status...', newStatus, status);
        const updatedStatus = Object.assign({}, status, newStatus);
        status = updatedStatus;
        this.listener.next(updatedStatus);
      }
    }
  };

  const stream$ = xs.create(statusProvider).startWith(getDefaultState());
  stream$.addListener({
    next: params => {
      console.log(params);
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

    if (!status.track) {
      const { volume, analyser } = startPlay(track);
      newStatus.playing = true;
      newStatus.paused = false;
      newStatus.volume = volume;
      newStatus.analyser = analyser;
    } else if (status.track.id !== track.id) {
      const { volume, analyser } = changeTrack(track);
      newStatus.playing = true;
      newStatus.paused = false;
      newStatus.volume = volume;
      newStatus.analyser = analyser;
    } else if (status.playing && status.paused === false) {
      pause();
      newStatus.playing = true;
      newStatus.paused = true;
    } else if (status.playing && status.paused === true) {
      unpause();
      newStatus.playing = true;
      newStatus.paused = false;
    }

    statusProvider.updateStatus(newStatus);
  };

  return result;
}
