
// Sync event listener for offline sales
console.log('background sync')
self.addEventListener('sync', function (event) {
  console.log(event);
  
});

// Optional: Handle service worker lifecycle events
// self.addEventListener('install', (event) => {
//   console.log(event)
//   console.log('Service worker installed.');
//   self.skipWaiting(); // Immediately activate new service worker
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim()); // Claim clients to control immediately
//   console.log('Service worker activated.');
// });