/* eslint-disable no-console */

import { register } from 'register-service-worker'

// Use `import.meta.env` instead of `process.env`
if (import.meta.env.MODE === 'production' || import.meta.env.VITE_SW_MODE === 'development') {
  
// if (import.meta.env.MODE === 'production') {
  // register(`${import.meta.env.VITE_BASE_URL}service-worker.js`, {
    register('./customSw.js', {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered(registration) {
      console.log('Service worker has been registered.'+ "=>"+ registration)
      // navigator.serviceWorker.ready.then(() => {
      //   navigator.serviceWorker.controller.postMessage({
      //     type: 'SET_ENCRYPT_KEY',
      //     VITE_ENCRYPT_KEY: import.meta.env.VITE_ENCRYPT_KEY // Pass the encryption key
      //   });
      // });
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    
    error(error) {
      console.error('Error during service worker registration:', error)
    }
    
  })
}
