// =======================================================
// Kedai Titik Nol POS
// Service Worker v1.0
// =======================================================

const CACHE_NAME = "kedaititiknol-pos-v1.0.0";

const APP_SHELL = [
  "/kedaititiknol1/",
  "/kedaititiknol1/index.html",
  "/kedaititiknol1/manifest.json",

  "/kedaititiknol1/icons/icon-72.png",
  "/kedaititiknol1/icons/icon-96.png",
  "/kedaititiknol1/icons/icon-128.png",
  "/kedaititiknol1/icons/icon-144.png",
  "/kedaititiknol1/icons/icon-152.png",
  "/kedaititiknol1/icons/icon-192.png",
  "/kedaititiknol1/icons/icon-384.png",
  "/kedaititiknol1/icons/icon-512.png"
];

// =============================
// Install
// =============================
self.addEventListener("install", (event) => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(APP_SHELL))

    );

});

// =============================
// Activate
// =============================
self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

// =============================
// Fetch
// =============================
self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if (response) {

                return response;

            }

            return fetch(event.request)

                .then(networkResponse => {

                    const clone = networkResponse.clone();

                    caches.open(CACHE_NAME)

                        .then(cache => {

                            cache.put(event.request, clone);

                        });

                    return networkResponse;

                })

                .catch(() => {

                    return caches.match("/kedaititiknol1/index.html");

                });

        })

    );

});
