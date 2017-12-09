// cycle declaration
import xs from "xstream";
import { div, input } from "@cycle/dom";

// utils declaration
import { formatFrequency } from "../../utils/frequencies";

// style declaration
import styles from "./style.css.json";
import "./style.css";

export default function(sources) {
  const streams$ = sources.player$.map(player => {
    const sliders = (player.filters || []).map(({ frequency, gain }) => {
      const customClass = `slider-${frequency.value}`;
      const gain$ = sources.DOM.select(`.${customClass}`)
        .events("input")
        .map(ev => ({
          type: "frequency",
          value: ev.target.value,
          frequency: frequency.value
        }));

      const sliderAttrs = {
        orient: "vertical",
        type: "range",
        min: -10,
        max: 10,
        value: gain.value
      };
      return {
        DOM: div(`.${styles.sliderContainer}`, [
          input(`.${styles.slider}.${customClass}`, { attrs: sliderAttrs }),
          div(`.${styles.sliderFrequency}`, [formatFrequency(frequency.value)])
        ]),
        gain$
      };
    });
    const slidersDOM = sliders.map(({ DOM }) => DOM);
    const slidersGain = sliders.map(({ gain$ }) => gain$);
    return {
      DOM: div(`.${styles.container}`, slidersDOM),
      gain$: xs.merge(...slidersGain)
    };
  });
  const sinks = {
    DOM: streams$.map(({ DOM }) => DOM),
    gain$: streams$.map(({ gain$ }) => gain$).flatten()
  };
  return sinks;
}
