# Equalizer in js

It is proof of concept application written in [cycle.js](http://cycle.js.org/), basically I was interested in playing with Web Audio API and getting to know streams better. I am not an expert in cycle.js, I just wanted to explore this interesting framework and to build something working and not so artificially sandbox. I used latest (at the moment) version of cycle.js with [xstreams](https://github.com/staltz/xstream) under the hood.

So this project is web audio player with equalizer (which uses [BiquadFilter](https://developer.mozilla.org/en/docs/Web/API/BiquadFilterNode)), which is built with [lowshelf/highshelf](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) filters at the ends and with [peaking](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type) filters in between. You can watch spectrogram during the play; it is better to use latest Chrome, but in Firefox and Safari it should work too. Also I have to admit that due to low quality (I think it is 128 kbits per second) edge filters are not very important, but filters around 4–6 kHz are pretty noticeable, both in sound and spectrogram.

I get tracks from SoundCloud, which are searched by query and filtered by [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/legalcode) license, and then I just stream them through [WebAudioApi](https://developer.mozilla.org/en/docs/Web/API/HTMLMediaElement).
Currently player supports playlists, which means that it remember list from which you took your playing track and will continue to play next one.

# TODO

- add tests (it was created like proof of concept without deep knowing of )
- add responsive support
- refactor to [MVI](http://cycle.js.org/model-view-intent.html) concept
- performance issues; think about playDriver
- add filters to search
- add router and ability to explore content more broadly

# License

MIT
