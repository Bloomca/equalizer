# Equalizer in js

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[http://bloomca.github.io/equalizer/](http://bloomca.github.io/equalizer/)

Audioplayer with equalizer, streaming music from SoundCloud. Equalizer uses [BiquadFilter](https://developer.mozilla.org/en/docs/Web/API/BiquadFilterNode)) – I use lowshelf/highshelf for filtering at the ends of the range, and peaking type filters in between. You can read about all available types in the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type).

![Screenshot](https://raw.githubusercontent.com/cyclejs-community/built-with-cycle/master/data/images/equalizer.png)

## Technologies

- [cycle.js](http://cycle.js.org/)
- [xstreams](https://github.com/staltz/xstream)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [webpack](https://webpack.js.org/)

Tracks from SoundCloud are filtered by [CC BY-SA license](https://creativecommons.org/licenses/by-sa/4.0/legalcode).

## Run

```shell
npm install
npm start # start a development server
npm build # build a production code
```

# License

MIT
