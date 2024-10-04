// src/isOnline.js

let idleTimeout;
let isIdle = false; // Flag to track if the user is in idle mode
let second = 20000

export async function isOnline() {
  try {
    if (!navigator.onLine) return false; // If the browser says we're offline, return false immediately
    const request = new URL(import.meta.env.VITE_BACKEND_BASEURL + 'network-check'); // Use your backend URL
    request.searchParams.set('rand', Date.now().toString()); // Prevent caching by adding a random query
    const response = await fetch(request.toString(), { method: 'HEAD' }); // Perform a lightweight request
    return response.ok; // If the response is OK, we're online
  } catch {
    return false; // If any error occurs, assume we're offline
  }
}

export function listenForNetworkStatusChanges(callback) {
  const updateNetworkStatus = async () => {
    const online = await isOnline(); // Check the actual connectivity status
    callback(online); // Pass the result (true/false) to the callback
  };

  const enterIdleMode = () => {
    if (!isIdle) { // Only log and check if entering idle mode
      console.log("Entering idle mode: Checking network status after "+ second +" seconds of inactivity...");
      isIdle = true; // Set flag to idle
    }
    idleTimeout = setTimeout(updateNetworkStatus, second); // Set timer for x seconds of inactivity
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimeout); // Clear the previous timer
    if (isIdle) { // If user was idle, log that they're active again
      console.log("User is active again, resetting idle timer.");
    }
    isIdle = false; // Reset the idle flag
    idleTimeout = setTimeout(enterIdleMode, second); // Start a new x second timer to enter idle mode
  };

  // Listen for user activities (mouse movement, key press, or touch events)
  window.addEventListener('mousemove', resetIdleTimer); // Mouse movement
  window.addEventListener('keydown', resetIdleTimer);   // Key press
  window.addEventListener('touchstart', resetIdleTimer); // Touchscreen interaction

  // Listen for browser-detected network changes
  window.addEventListener('online', updateNetworkStatus);   // Fires when network connection is restored
  window.addEventListener('offline', updateNetworkStatus);  // Fires when network connection is lost

  // Perform an initial check to determine the network status
  updateNetworkStatus();

  // Optionally return a function to clean up event listeners and clear the timeout
  return () => {
    clearTimeout(idleTimeout);
    window.removeEventListener('mousemove', resetIdleTimer);
    window.removeEventListener('keydown', resetIdleTimer);
    window.removeEventListener('touchstart', resetIdleTimer);
    window.removeEventListener('online', updateNetworkStatus);
    window.removeEventListener('offline', updateNetworkStatus);
  };
}







// // src/isOnline.js
// export async function isOnline() {
//   try {
//     if (!navigator.onLine) return false; // If the browser says we're offline, return false immediately
//     const request = new URL(import.meta.env.VITE_BACKEND_BASEURL + 'network-check'); // Use your backend URL
//     request.searchParams.set('rand', Date.now().toString()); // Prevent caching by adding a random query
//     const response = await fetch(request.toString(), { method: 'HEAD' }); // Perform a lightweight request
//     return response.ok; // If the response is OK, we're online
//   } catch {
//     return false; // If any error occurs, assume we're offline
//   }
// }

// export function listenForNetworkStatusChanges(callback) {
//   const updateNetworkStatus = async () => {
//     const online = await isOnline(); // Check the actual connectivity status
//     callback(online); // Pass the result (true/false) to the callback
//   };

//   // Listen for browser-detected network changes
//   window.addEventListener('online', updateNetworkStatus);   // Fires when network connection is restored
//   window.addEventListener('offline', updateNetworkStatus);  // Fires when network connection is lost

//   // Perform periodic checks for internet connectivity every X seconds
//   const checkInterval = setInterval(updateNetworkStatus, 30000); // Check every 5 seconds

//   // Run an initial check to determine the network status
//   updateNetworkStatus();

//   // Optionally return a function to stop the interval and event listeners
//   return () => clearInterval(checkInterval);
// }

