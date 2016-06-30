// cycle declaration
import xs from 'xstream';
import { footer, div, a } from '@cycle/dom';

// style declaration
import styles from './style.css.json';
import './style.css';

export default function Footer() {
  const vtree$ = xs.of(1)
    .map(_ =>
      footer(`.${styles.container}`, [
        div(`.mui-container.mui--text-center`, [
          'Made by ',
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
