// Version shown in the footer. Also read by the service worker (sw.js) to name its cache,
// so changing this number makes every installed copy fetch the new files.
self.TT_VERSION = {
  version: '0.2.0-alpha',
  date: '2026-11-09 19:10',  // set the date and time when publishing
  build: 'f9f4dfb'            // filled in by tools/build-pages.sh (commit), so every build is seen as an update
};
