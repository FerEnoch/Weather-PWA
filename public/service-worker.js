const CACHE_NAME = 'version-1';
const cacheURLs = [
    './index.html',
    './offline.html'
];

const self = this;
// Install SW
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache!');
                return cache.addAll(cacheURLs);
            })
            .catch(err => console.error('[Service Worker] Something went wrong retrieving the cache: ', err))
    );
});

// Listen for rquests
/**
 * Para este proyecto no se necesita ir guardando en el cache la data que se recibe, porque se trata de una API de clima, por ende, cuando no hay datos, se debe mostrar el offline.html, y no archivo de cache (salvo los pre-cacheados);
 */
self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        caches.match(evt.request)
            .then(async () => {
                return await fetch(evt.request)
                    .catch(() => caches.match('offline.html'));
            })
    )
});

// Activate SW
self.addEventListener('activate', (evt) => {
    // Remove previous caches
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    evt.waitUntil(
        caches.keys()
            .then(cacheNames => {
                Promise.all(cacheNames.map(cacheRescource => {
                    if (!cacheWhitelist.includes(cacheRescource)) {
                        return caches.delete(cacheRescource);
                    }
                }))
            })
    )
});

