const CACHE_NAME = "premier-league";
var urlsToCache = [
  "/",
  "/index.html",
  "/nav.html",
  "/team.html",
  "/manifest.json",
  "/pages/home.html",
  "/pages/team-favorite.html",
  "/css/icon.css",
  "/css/materialize.css",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/api.js",
  "/js/date.js",
  "/js/db.js",
  "/js/idb.js",
  "/js/materialize.js",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/reg-sw.js",
  "/font/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "/img/lap.jpg",
  "/img/premierleague.png",
  "/img/logo/icon-192x192.png",
  "/img/logo/icon-512x512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  var base_url = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches
      .match(event.request, {
        ignoreSearch: true
      })
      .then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }

  var options = {
    body: body,
    badge: "/img/logo/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});