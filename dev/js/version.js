// Version shown in the footer. Also read by the service worker (sw.js) to name its cache,
// so changing this number makes every installed copy fetch the new files.
self.TT_VERSION = {
  version: '0.3.0-alpha',
  date: '2026-11-09 22:25',  // set the date and time when publishing
  build: '6df105a'            // filled in by tools/build-pages.sh (commit), so every build is seen as an update
};
