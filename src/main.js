// cycle declaration
import xs from 'xstream';
import {run} from '@cycle/xstream-run';

// drivers declaration
import {div, label, input, hr, h1, h3, makeDOMDriver} from '@cycle/dom';
import { playDriver } from './drivers/play';
import { tracksDriver } from './drivers/tracks';

// components declaration
import Header from './components/header';
import Footer from './components/footer';
import Tabs from './components/tabs';
import Search from './components/search';
import Tracks from './components/tracks';
import Controls from './components/controls';
import Slider from './components/slider';

// style declaration
import './common.css';

function main(sources) {
  const mouseMove$ = sources.DOM.select('.root').events('mousemove');
  const mouseUp$ = sources.DOM.select('.root').events('mouseup');
  const globalEvents = { mouseMove$, mouseUp$ };

  const headerComponent = Header();
  const footerComponent = Footer();
  const player$ = sources.player.getState();
  const tabsComponent = Tabs({ DOM: sources.DOM, player$, data: sources.data, player$ });
  const searchComponent = Search(sources);
  const tracks$ = tabsComponent.tracks$;
  const controlsComponent = Controls({ DOM: sources.DOM, player$, tracks$, play: sources.player.play });
  const sliderComponent = Slider({ DOM: sources.DOM, globalEvents });

  const sinks = {
    DOM: xs.combine(
      controlsComponent.DOM,
      sliderComponent.DOM,
      headerComponent.DOM,
      footerComponent.DOM,
      tabsComponent.DOM
    ).map(([controlsDOM, sliderDOM, headerDOM, footerDOM, tabsDOM]) => {
        return div('.root', [
          headerDOM,
          div('.mui-container', [
            controlsDOM,
            tabsDOM
          ]),
          footerDOM
        ])
      }),
    player: xs.merge(
      tabsComponent.play,
      controlsComponent.play
    )
  };
  return sinks;
}

export default function runApplication(id) {
  const drivers = {
    DOM: makeDOMDriver(`#${id}`),
    player: playDriver,
    data: tracksDriver
  };

  run(main, drivers);
}
