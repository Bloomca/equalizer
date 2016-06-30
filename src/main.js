import xs from 'xstream';
import {run} from '@cycle/xstream-run';

// drivers declaration
import {div, label, input, hr, h1, h3, makeDOMDriver} from '@cycle/dom';
import { makeCanvasDriver } from 'cycle-canvas';
import { playDriver } from './drivers/play';
import { tracksDriver } from './drivers/tracks';

// components declaration
import Header from './components/header';
import Footer from './components/footer';
import Search from './components/search';
import Tracks from './components/tracks';
import Controls from './components/controls';
import Slider from './components/slider';
import Spectrogram from './components/spectrogram';

function main(sources) {
  const mouseMove$ = sources.DOM.select('.root').events('mousemove');
  const mouseUp$ = sources.DOM.select('.root').events('mouseup');
  const globalEvents = { mouseMove$, mouseUp$ };

  const headerComponent = Header();
  const footerComponent = Footer();
  const searchComponent = Search(sources);
  const tracks$ = sources.data.getTracks(searchComponent.value.map(x => ({ q: x })));
  const player$ = sources.player.getState();
  const tracksComponent = Tracks({ DOM: sources.DOM, tracks: tracks$, player: player$ });
  const controlsComponent = Controls({ DOM: sources.DOM, player$, tracks$, play: sources.player.play });
  const sliderComponent = Slider({ DOM: sources.DOM, globalEvents });
  const spectrogramComponent = Spectrogram({ DOM: sources.DOM, state$: player$ });

  const sinks = {
    DOM: xs.combine(
      searchComponent.value,
      searchComponent.DOM,
      tracksComponent.DOM,
      controlsComponent.DOM,
      sliderComponent.DOM,
      spectrogramComponent.DOM,
      headerComponent.DOM,
      footerComponent.DOM
    ).map(([value, childVDom, tracksDOM, controlsDOM, sliderDOM, spectrogramDOM, headerDOM, footerDOM]) => {
        const titleMarkup = value
          ? h1('.mui--text-center', ['Results for: ' + value])
          : h3('.mui--text-dark-secondary.mui--text-center', [
            'Random songs'
          ]);
        return div('.root', [
          headerDOM,
          div('.mui-container', [
            controlsDOM,
            childVDom,
            titleMarkup,
            tracksDOM,
            spectrogramDOM
          ]),
          footerDOM
        ])
      }),
    player: xs.merge(
      tracksComponent.play,
      controlsComponent.play
    ),
    Canvas: spectrogramComponent.canvas$
  };
  return sinks;
}

export default function runApplication(id) {
  const drivers = {
    DOM: makeDOMDriver(`#${id}`),
    player: playDriver,
    data: tracksDriver,
    // Canvas: makeCanvasDriver('#spectrogram', {width: 1200, height: 500})
  };

  run(main, drivers);
}
