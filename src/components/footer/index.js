import xs from 'xstream';
import { footer, div, a } from '@cycle/dom';

export default function Footer() {
  const vtree$ = xs.of(1)
    .map(_ =>
      footer([
        div('.mui-container.mui--text-center..mui--appbar-height', [
          'Made with ♥ by ',
          a({ attrs: { href: 'https://github.com/Bloomca' } }, [
            'Seva Zaikov'
          ]),
          ' using ',
          a({ attrs: { href: 'http://cycle.js.org/' }}, [
            'cycle.js'
          ])
        ])
      ])
    );

  const sinks = {
    DOM: vtree$
  };

  return sinks;
}
