// Version shown in the footer. Also read by the service worker (sw.js) to name its cache,
// so changing this number makes every installed copy fetch the new files.
self.TT_VERSION = {
  version: '0.2.1-dev',
  date: 'unreleased',  // set the date and time when publishing
  build: '4eeb6e6'            // filled in by tools/build-pages.sh (commit), so every build is seen as an update
};
