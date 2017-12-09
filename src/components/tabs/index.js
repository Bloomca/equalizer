import xs from "xstream";
import { div, h1, h3, ul, li } from "@cycle/dom";

// components declaration
import Search from "../search";
import Tracks from "../tracks";
import Spectrogram from "../spectrogram";
import Equalizer from "../equalizer";

// style declaration
import styles from "./style.sass";

export default function Tabs(sources) {
  const eq$ = sources.DOM.select(".tab-eq").events("click");
  const songs$ = sources.DOM.select(".tab-songs").events("click");

  const state$ = xs
    .merge(eq$.map(_ => "equalizer"), songs$.map(_ => "songs"))
    .startWith("equalizer");

  const container$ = sources.DOM.select(
    `.${styles.spectrogramInnerContainer}`
  ).elements();

  const searchComponent = Search(sources);
  const tracks$ = sources.data.getTracks(
    searchComponent.value.map(x => ({ q: x }))
  );
  const tracksComponent = Tracks({
    DOM: sources.DOM,
    tracks: tracks$,
    player: sources.player$
  });
  const spectrogramComponent = Spectrogram({
    DOM: sources.DOM,
    state$: sources.player$,
    container$
  });
  const equalizerComponent = Equalizer({
    DOM: sources.DOM,
    player$: sources.player$
  });
  const vtree$ = xs
    .combine(
      sources.player$,
      state$,
      searchComponent.value,
      searchComponent.DOM,
      tracksComponent.DOM,
      spectrogramComponent.DOM,
      equalizerComponent.DOM
    )
    .map(
      (
        [
          player,
          state,
          value,
          searchDOM,
          tracksDOM,
          spectrogramDOM,
          equalizerDOM
        ]
      ) => {
        const tabs = player.playing
          ? div(`.${styles.tabsContainer}`, [
              ul(`.mui-tabs__bar.${styles.tabs}`, [
                li(
                  `.tab-eq.${state === "equalizer" ? "mui--is-active" : ""}.${
                    styles.tab
                  }`,
                  ["Equalizer"]
                ),
                li(
                  `.tab-songs.${state === "songs" ? "mui--is-active" : ""}.${
                    styles.tab
                  }`,
                  ["Playlist"]
                )
              ])
            ])
          : null;
        let content;
        if (state === "equalizer" && player.playing) {
          content = div(".my-content", [
            div(`.${styles.dataContainer}`, [
              div(`.${styles.spectrogramContainer}`, [
                div(`.${styles.spectrogramInnerContainer}`, [spectrogramDOM])
              ]),
              div(`.${styles.equalizerContainer}`, [equalizerDOM])
            ])
          ]);
        }

        if (state === "songs" || player.playing === false) {
          const titleMarkup = value
            ? h1(".mui--text-center", ["Results for: " + value])
            : h3(".mui--text-dark-secondary.mui--text-center", [
                "Random songs"
              ]);
          content = div(".my-content", [titleMarkup, searchDOM, tracksDOM]);
        }

        return div([tabs, content]);
      }
    );

  const sinks = {
    DOM: vtree$,
    tracks$,
    play: xs.merge(tracksComponent.play, equalizerComponent.gain$)
  };
  return sinks;
}
