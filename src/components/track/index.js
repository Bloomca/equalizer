import xs from 'xstream';
import {div, label, input, hr, h4, button, p} from '@cycle/dom';

// utils declaration
import { formatDuration } from '../../utils/dates';

// style declaration
import styles from './style.css.json';
import './style.css';

export default function Track(sources) {
  const streams$ = xs.of(sources.track)
    .map(track => {
      const x = track;
      const customClass = `track-${track.id}`;
      const clicks$ = sources.DOM.select(`.track.${customClass}`).events('click');
      const duration = x.duration
        ? div(`.${styles.duration}`, [
          formatDuration(x.duration / 1000)
        ]) : null;
      return {
        DOM: div(`.track.${customClass}.mui--divider-bottom.${styles.container}.${x.id === sources.active ? styles.active : ''}`, [
          h4(`.${styles.title}`, [x.title]),
          duration
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
