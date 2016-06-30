// cycle declaration
import xs from 'xstream';
import {div, button, input, h3, img, p, a} from '@cycle/dom';

// utils declaration
import { formatDuration } from '../../utils/dates';

// style declaration
import styles from './style.css.json';
import './style.css';

export default function Controls(sources) {
  const play$ = sources.DOM.select('.play').events('click');
  const pause$ = sources.DOM.select('.pause').events('click');
  const prev$ = sources.DOM.select('.prev').events('click');
  const next$ = sources.DOM.select('.next').events('click');

  const progressSelector = sources.DOM.select(`.${styles.progressContainer}`);
  const progressClicks$ = progressSelector.events('click');
  const progressEl$ = progressSelector.elements();

  const seek$ = progressClicks$;

  const vdom$ = sources.player$
    .map((state) => {
      const tracks = state.playlist || [];
      const currentIndex = state.track
        ? tracks.findIndex(x => x.id === state.track.id) : -2;

      const volume$ = sources.DOM.select(`.${styles.volume}`)
        .events('input')
        .map(ev => ev.target.value);

      const volumeValue = state.volume.gain.value * 100;

      const res$ = xs.merge(
        play$.mapTo(state.track),
        pause$.mapTo(state.track),
        next$.map(x => tracks[currentIndex + 1]),
        prev$.map(x => tracks[currentIndex - 1])
      );

      if (!state.track) {
        return {
          DOM: xs.of(1)
            .map(_ =>
              div(`.mui--text-dark-hint.${styles.noContent}`, [
                'Nothing is playing!'
              ])),
          play: res$
        };
      }

      return {
        DOM: xs.of(volumeValue)
          .map(value => {
            const playButton = button('.play.mui-btn.mui-btn--danger', [
              'PLAY'
            ]);
            const pauseButton = button('.pause.mui-btn.mui-btn--danger', [
              'PAUSE'
            ]);
            const nextTrack = tracks[currentIndex + 1];
            const nextTrackMarkup = nextTrack
              ? div(`.mui--text-dark-hint`, [
                'Next: ',
                nextTrack.title
              ]) : null;
            const durationMarkup = state.duration
              ? div(`.${styles.duration}`, [
                  formatDuration(state.time / 1000, state.duration),
                  ' / ',
                  formatDuration(state.duration)
              ]) : null;

            const progress = state.duration ? state.time / 1000 / state.duration : 0;
            const imageURL = state.track.artwork_url || state.track.user.avatar_url;
            const imgMarkup = imageURL
              ? img(`.${styles.logo}`, { attrs: { src: imageURL } })
              : null;
            return div(`.${styles.container}.mui--divider-bottom`, [
              div(`.${styles.background}`, { style: { backgroundImage: `url(${state.track.waveform_url})`} }),
              div(`.${styles.firstRow}`, [
                div(`.${styles.logoContainer}`, [
                  imgMarkup
                ]),
                div(`.${styles.infoContainer}`, [
                  h3(`.${styles.title}`, [
                    state.track.title,
                    a(`.${styles.itemLink}`, { attrs: { target: '_blank', href: state.track.permalink_url } }, [
                      'SoundCloud'
                    ])
                  ]),
                  p(`.${styles.description}`, [
                    state.track.description
                  ]),
                  div(`.mui--text-dark-hint`, [
                    'Uploaded by ',
                    a(`.link`, { attrs: { target: '_blank', href: state.track.user.permalink_url} }, [
                      state.track.user.username
                    ])
                  ]),
                  durationMarkup
                ]),
              ]),
              div(`.${styles.buttonsContainer}`, [
                div(`.${styles.buttons}`, [
                  button('.prev.mui-btn.mui-btn--primary', [
                    'PREV'
                  ]),
                  state.paused ? playButton : pauseButton,
                  button('.next.mui-btn.mui-btn--primary', [
                    'NEXT'
                  ]),
                  nextTrackMarkup
                ]),
                div(`.${styles.volumeContainer}`, [
                  div(`.${styles.volumeTitle}.mui--text-dark-hint`, [
                    'Volume: '
                  ]),
                  input(`.${styles.volume}`, { attrs: { type: 'range', min: 0, max: 100, value } })
                ])
              ]),
              div(`.${styles.progressContainer}`, [
                div(`.${styles.progressGray}`),
                div(`.${styles.progress}`, { style: { width: `${progress * 100}%` } })
              ])
            ])
          }),
        play: xs.merge(
          res$.map(x => ({ type: 'play_track', track: x })),
          volume$.map(x => ({ type: 'volume', value: x })),
          seek$.map(x => ({ type: 'seek', value: x }))
        )
      };
    })
  const sinks = {
    DOM: vdom$.map(({ DOM }) => DOM).flatten(),
    play: vdom$.map(({ play }) => play).flatten()
  };

  return sinks;
}
