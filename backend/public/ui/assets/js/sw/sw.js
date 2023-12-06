
// self fetch listener
self.addEventListener('fetch', (event) => {

  // console.log('event', event);

  event.respondWith(fetch(event.request));
});
