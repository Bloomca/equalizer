import xs from "xstream";
import { startPlay, pause, unpause, changeTrack, seek } from "../player/index";

const getDefaultState = () => ({
  track: null,
  playing: false,
  paused: false,
  duration: null,
  time: 0,
  volume: { gain: { value: 1 } },
  analyser: null,
  playlist: null,
  filters: null
});

export function playDriver(res$) {
  const result = {};
  let intervalId;
  let startingMoment;
  let lastTime = 0;
  let status = getDefaultState();
  const statusProvider = {};
  res$.addListener({
    next: ({ type, track, value, playlist: newPlaylist, frequency }) => {
      switch (type) {
        case "play_track":
          if (newPlaylist) {
            statusProvider.updateStatus({
              playlist: newPlaylist
            });
          }
          result.play(track);
          break;
        case "volume":
          result.setVolume(value);
          break;
        case "frequency":
          result.setFilterGain({ value, frequency });
          break;
        case "seek":
          const { clientX, currentTarget } = value;
          const { left, width } = currentTarget.getBoundingClientRect();
          const seekPercentage = (clientX - left) / width;
          const seekValue = seekPercentage * status.duration;

          seek(seekValue);
          statusProvider.updateStatus({
            time: seekValue * 1000
          });
          startingMoment = Date.now();
          lastTime = seekValue * 1000;
          break;
        default:
          break;
      }
    },
    error: error => console.log(error),
    complete: _ => _
  });
  Object.assign(statusProvider, {
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
  });

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
  result.setVolume = value => {
    status.volume.gain.value = value / 100;
  };

  result.setFilterGain = ({ value, frequency }) => {
    const isUpdated = status.filters.some(filter => {
      if (filter.frequency.value === frequency) {
        filter.gain.value = Number(value);
        return true;
      }
    });
    if (isUpdated) {
      statusProvider.updateStatus();
    }
  };

  result.playNext = () => {
    result.pausePlaying();
    if (status.playlist) {
      const { id: currentId } = status.track || {};

      const currentIndex = currentId
        ? status.playlist.findIndex(({ id }) => currentId === id)
        : -1;

      const nextIndex = currentIndex + 1;
      const nextTrack = status.playlist[nextIndex];

      if (nextTrack) {
        result.play(nextTrack);
      } else {
        statusProvider.updateStatus({
          playing: false,
          track: null
        });
      }
    }
  };
  result.play = track => {
    const newStatus = { track };

    const playParams = {
      track,
      start: result.startPlaying,
      pause: result.pausePlaying,
      updateDuration: result.updateDuration,
      onEnd: result.playNext
    };
    if (!status.track && track && track.id) {
      lastTime = 0;
      const { volume, analyser, playPromise, filters } = startPlay(playParams);
      newStatus.playing = true;
      newStatus.paused = false;
      newStatus.volume = volume;
      newStatus.analyser = analyser;
      newStatus.time = 0;
      newStatus.duration = null;
      newStatus.filters = filters;
      if (playPromise && playPromise.then) {
        playPromise.then(result.startPlaying);
      } else {
        result.startPlaying();
      }
    } else if (track && status.track.id !== track.id) {
      lastTime = 0;
      const { volume, analyser, playPromise, filters } = changeTrack(
        playParams
      );
      newStatus.playing = true;
      newStatus.paused = false;
      newStatus.volume = volume;
      newStatus.analyser = analyser;
      newStatus.time = 0;
      newStatus.duration = null;
      newStatus.filters = filters;
      if (playPromise && playPromise.then) {
        playPromise.then(result.startPlaying);
      } else {
        result.startPlaying();
      }
    } else if (status.playing && status.paused === false) {
      pause();
      newStatus.playing = true;
      newStatus.paused = true;
      result.pausePlaying();
    } else if (status.playing && status.paused === true) {
      const { playPromise } = unpause();
      newStatus.playing = true;
      newStatus.paused = false;
      if (playPromise && playPromise.then) {
        playPromise.then(result.startPlaying);
      } else {
        result.startPlaying();
      }
    }

    statusProvider.updateStatus(newStatus);
  };

  result.updateDuration = duration => {
    statusProvider.updateStatus({ duration });
  };

  result.startPlaying = () => {
    clearInterval(intervalId);
    startingMoment = Date.now();
    intervalId = setInterval(() => {
      const newTime = lastTime + Date.now() - startingMoment;
      statusProvider.updateStatus({ time: newTime });
    }, 300);
  };

  result.pausePlaying = () => {
    clearInterval(intervalId);
    const newTime = lastTime + Date.now() - startingMoment;
    lastTime = newTime;
    statusProvider.updateStatus({ time: newTime });
  };

  return result;
}
