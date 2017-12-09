import xs from "xstream";
import { header, h2, div } from "@cycle/dom";

export default function Header() {
  const vtree$ = xs
    .of(1)
    .map(_ =>
      header(".mui-appbar.mui--z1", [
        div(".mui--appbar-height.mui-container", [
          h2(".mui--text-title.mui--appbar-line-height", ["Equalizer.js"])
        ])
      ])
    );
  const sinks = {
    DOM: vtree$
  };

  return sinks;
}
