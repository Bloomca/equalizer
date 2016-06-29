import xs from 'xstream';
import {div, label, input, hr, h3, button, p} from '@cycle/dom';

export default function Track(sources) {
  const streams$ = xs.of(sources.track)
    .map(track => {
      const x = track;
      const customClass = `track-${track.id}`;
      const clicks$ = sources.DOM.select(`.track.${customClass}`).events('click');
      return {
        DOM: div(`.track.${customClass}`, [
          h3([x.title])
        ]),
        play: clicks$.mapTo(track)
      };
    });

  const sinks = {
    DOM: streams$.map(({ DOM }) => DOM),
    play: streams$.map(({ play }) => play).flatten()
  };
  return sinks;
}
