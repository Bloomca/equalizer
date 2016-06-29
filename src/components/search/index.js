import {div, label, input, hr, h1, form, button} from '@cycle/dom';

export default function Search(sources) {
  const domSource = sources.DOM;

  const state$ = domSource.select('.field').events('input')
    .map(ev => ev.target.value)
    .startWith('');

  const vdom$ = state$
    .map(name =>
      div('.mui-row', [
        form('.mui--text-center.mui-col-md-8.mui-col-md-offset-2', [
          div('.mui-textfield.mui--text-display2', [
            input('.field.mui--text-headline', {attrs: { type: 'text', placeholder: 'Search songs' }}),
          ])
        ])
      ])
    );

  const sinks = {
    DOM: vdom$,
    value: state$
  };
  return sinks;
}