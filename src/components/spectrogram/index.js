// cycle declaration
import xs from "xstream";
import { canvas } from "@cycle/dom";

// style declaration
import styles from "./style.css.json";
import "./style.css";

export default function Spectrogram(sources) {
  const canvas$ = sources.DOM.select(`.${styles.spectrogram}`).elements();
  const state$ = sources.state$;

  xs.combine(canvas$, state$, xs.periodic(16)).addListener({
    next: ([canvasArray, state]) => {
      if (canvasArray && canvasArray.length > 0) {
        const canvas = canvasArray[0];
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        if (state.track && state.analyser) {
          const freqData = new Uint8Array(state.analyser.frequencyBinCount);

          state.analyser.getByteFrequencyData(freqData);
          freqData.map((magnitude, i) => {
            const rectX = i * 1.5;
            const rectY = height;
            const rectWidth = 1;
            const rectHeigth = -magnitude * 2;
            ctx.fillRect(rectX, rectY, rectWidth, rectHeigth);
          });
        }
      }
    },
    error: _ => _,
    complete: _ => _
  });

  const vtree$ = xs.of(1).map(() => {
    return canvas(
      `.${styles.spectrogram}`,
      { attrs: { width: "800", height: "400" } },
      ["sorry, your browser doesn't support canvas"]
    );
  });

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
