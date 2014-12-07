# Equalizer in js

Simple equalizer project – you can actually [run it](http://bloomca.github.io/equalizer/).
App is quite raw, though it should work.

It uses SoundCloud as stream service to get various music (you have to search first – you can even leave it blank),
and therefore this app has several problems:
- low quality of upstream (128 kbits)
- a lot of remixes in queries
- and messy description.

Though, it's just prototype of working equalizer written in javascript.
It is lowshelf and highshelf filters with several peaking filters in between.
There is a spectrogram in canvas (web audio api has several another cool features) in bottom of the page,
so you can change filters and see some differences.

Again, quality of streamed audio is extremely low,
so only first filters'll have decent impact on spectrogram.
Spectrogram is expanded by 1.5 times (it has width of 1200, but all frequencies should contain 1536 – so, you can see
issue there).
Anyway, it's possible to see that first filters have quite impact on it.