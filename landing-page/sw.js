const staticCacheName = "landing-page-v1";
const dynamicCacheName = "landing-page-v1";
const assets = [
  "/", // 유저가 '/'로 요청을 보내면 요청에서 받은 응답을 캐쉬한다
  "/index.html",
  "/index.js",
  "/js/ui.js",
  "/styles.css",
  "/public/backgroundimg.jpeg",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "/pages/fallback.html",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install event
self.addEventListener("install", (evt) => {
  // staticCacheName가 있으면 열고, 없으면 만든다
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  // 현재 버전과 다른 캐시를 전부 삭제한다
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", (evt) => {
  // 요청이 주어졌을 때 캐시가 있는지 확인하고
  // 캐시가 있으면 캐시를 리턴하고
  // 없으면 요청을 보낸다
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("/pages/fallback.html");
        }
      })
  );
});
