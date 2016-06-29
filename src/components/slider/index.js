import {div} from '@cycle/dom';

export default function Slider(sources) {
  const dnd$ = sources.DOM.select('.cursor').events('mousedown')
    .map(x => {
      console.log('!!!!!!!!');

      const mousemove$ = sources.globalEvents.mouseMove$;
      const mouseup$ = sources.globalEvents.mouseUp$;
      return mousemove$.endWhen(mouseup$);
    })
    .flatten()
    .startWith(0);

  const vtree$ = dnd$.map(x => {
    console.log(x);
    return div('.slider', [
      div('.cursor', [
        '!!!!!!!!!!!!!!!!!'
      ])
    ]);
  });

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
