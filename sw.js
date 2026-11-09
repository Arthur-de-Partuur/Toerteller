// Service worker: keeps Toerteller working offline. The cache name follows the app version,
// so publishing a new version (js/version.js) replaces the cached files.
importScripts('js/version.js');
const CACHE = 'toerteller-' + self.TT_VERSION.version;
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'css/style.css', 'js/version.js', 'js/i18n.js', 'js/templates.js', 'js/store.js', 'js/app.js',
  'icons/icon.svg', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Cache first (works offline); the page offers a refresh when a new version is installed.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
