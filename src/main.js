// cycle declaration
import xs from "xstream";
import { run } from "@cycle/run";

// drivers declaration
import { div, makeDOMDriver } from "@cycle/dom";
import { playDriver } from "./drivers/play";
import { tracksDriver } from "./drivers/tracks";

// components declaration
import Header from "./components/header";
import Footer from "./components/footer";
import Tabs from "./components/tabs";
import Controls from "./components/controls";

// style declaration
import "./common.sass";

function main(sources) {
  const headerComponent = Header();
  const footerComponent = Footer();
  const player$ = sources.player.getState();
  const tabsComponent = Tabs({
    DOM: sources.DOM,
    player$,
    data: sources.data
  });
  const tracks$ = tabsComponent.tracks$;
  const controlsComponent = Controls({
    DOM: sources.DOM,
    player$,
    tracks$,
    play: sources.player.play
  });

  const sinks = {
    DOM: xs
      .combine(
        controlsComponent.DOM,
        headerComponent.DOM,
        footerComponent.DOM,
        tabsComponent.DOM
      )
      .map(([controlsDOM, headerDOM, footerDOM, tabsDOM]) => {
        return div(".root", [
          headerDOM,
          div(".mui-container", [controlsDOM, tabsDOM]),
          footerDOM
        ]);
      }),
    player: xs.merge(tabsComponent.play, controlsComponent.play)
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
