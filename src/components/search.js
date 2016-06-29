import {div, label, input, hr, h1} from '@cycle/dom';

export default function Search(sources) {
  const domSource = sources.DOM;

  const state$ = domSource.select('.field').events('input')
    .map(ev => ev.target.value)
    .startWith('');

  const vdom$ = state$
    .map(name =>
      div([
        label('SEARCH:'),
        input('.field', {attrs: {type: 'text'}}),
      ])
    );

  const sinks = {
    DOM: vdom$,
    value: state$
  };
  return sinks;
}
