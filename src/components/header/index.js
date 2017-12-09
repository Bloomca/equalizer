import xs from "xstream";
import { header, h2, div, h } from "@cycle/dom";

const imgSrc =
  "https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67";
export default function Header() {
  const vtree$ = xs.of(1).map(() =>
    header(".mui-appbar.mui--z1", [
      h(
        "a",
        {
          attrs: {
            href: "https://github.com/Bloomca/equalizer"
          }
        },
        [
          h(
            "img",
            {
              attrs: {
                style: "position: absolute; top: 0; right: 0; border: 0;",
                src: imgSrc,
                alt: "fork me on github"
              }
            },
            []
          )
        ]
      ),
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
