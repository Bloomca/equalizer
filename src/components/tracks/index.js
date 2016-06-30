import xs from 'xstream';
import {div, label, input, hr, h1, ul, li} from '@cycle/dom';
import Track from '../track';

export default function Tracks(sources) {
  const domSource = sources.DOM;
  const tracksSource = sources.tracks;
  const playerSource = sources.player;

  const streams$ = xs.combine(tracksSource, playerSource)
    .map(([tracks, player]) => {
      const active = (player.track || {}).id;
      const tracksContent = tracks.map(track => {
        const trackComponent = Track({ DOM: domSource, track, active });
        return { DOM: trackComponent.DOM, play: trackComponent.play };
      });

      const tracksDOM = tracksContent.map(({ DOM }) => DOM);
      const tracksPlay = tracksContent.map(({ play }) => play);

      const play$ = xs.merge(...tracksPlay);

      return {
        DOM: xs.combine(...tracksDOM),
        play: play$.map(x => ({ type: 'play_track', track: x, playlist: tracks }))
      };
    });


  const sinks = {
    DOM: streams$
      .map(({ DOM }) => DOM)
      .flatten()
      .map((elements) => {
        return div([
          ...elements
        ]);
      }),
    play: streams$
      .map(({ play}) => play)
      .flatten()
  };

  return sinks;
}
