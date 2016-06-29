import xs from 'xstream';

export function tracksDriver() {
  return {
    getTracks(params$) {
      const tracksProducer = {
        start(listener) {
          this.listener = listener;
        },
        stop() {
          this.listener = null;
        },
        updateTracks(tracks) {
          if (this.listener) {
            this.listener.next(tracks);
          }
        }
      };

      params$.addListener({
        next: params => {
          console.group('tracks driver');
          console.log('!!!!!!!!!!!', params);
          console.groupEnd();
          SC.get('/tracks', { q: params.q, license: 'cc-by-sa' }, (tracks) => tracksProducer.updateTracks(tracks));
        },
        error: _ => _,
        complete: _ => _
      });

      return xs.create(tracksProducer);
    }
  };
}
