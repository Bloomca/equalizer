import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import { makeCanvasDriver } from 'cycle-canvas';
import { playDriver } from './drivers/play';
import { tracksDriver } from './drivers/tracks';
import Search from './components/search';
import Tracks from './components/tracks';
import Controls from './components/controls';
import Slider from './components/slider';
import Spectrogram from './components/spectrogram';
import { togglePlay } from './player/index';

function main(sources) {
  const mouseMove$ = sources.DOM.select('.root').events('mousemove');
  const mouseUp$ = sources.DOM.select('.root').events('mouseup');
  const globalEvents = { mouseMove$, mouseUp$ };

  const searchComponent = Search(sources);
  const tracks$ = sources.data.getTracks(searchComponent.value.map(x => ({ q: x })));
  const tracksComponent = Tracks({ DOM: sources.DOM, tracks: tracks$, player: sources.player });
  const player$ = sources.player.getState();
  const controlsComponent = Controls({ DOM: sources.DOM, player$, tracks$, play: sources.player.play });
  const sliderComponent = Slider({ DOM: sources.DOM, globalEvents });
  const spectrogramComponent = Spectrogram({ DOM: sources.DOM, state$: player$ });

  const sinks = {
    DOM: xs.combine(searchComponent.value, searchComponent.DOM, tracksComponent.DOM, controlsComponent.DOM, sliderComponent.DOM, spectrogramComponent.DOM)
      .map(([value, childVDom, tracksDOM, controlsDOM, sliderDOM, spectrogramDOM]) => {
        return div('.root', [
          childVDom,
          label('Name:'),
          hr(),
          h1('Results for: ' + value),
          controlsDOM,
          sliderDOM,
          tracksDOM,
          spectrogramDOM
        ])
      }),
    player: xs.merge(tracksComponent.play, controlsComponent.play),
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
