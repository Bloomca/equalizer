import { div } from "@cycle/dom";

export default function Slider(sources) {
  const bodyElement = sources.DOM.select("body");
  const mousemove$ = bodyElement.events("mousemove");
  const mouseup$ = bodyElement.events("mouseup");

  const dnd$ = sources.DOM.select(".cursor")
    .events("mousedown")
    .map(() => mousemove$.endWhen(mouseup$))
    .flatten()
    .startWith(0);

  const vtree$ = dnd$.map(() => {
    return div(".slider", [div(".cursor", ["!!!!!!!!!!!!!!!!!"])]);
  });

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
