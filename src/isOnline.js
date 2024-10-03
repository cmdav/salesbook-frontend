// src/isOnline.js


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

  // Listen for browser-detected network changes
  window.addEventListener('online', updateNetworkStatus);   // Fires when network connection is restored
  window.addEventListener('offline', updateNetworkStatus);  // Fires when network connection is lost

  // Perform periodic checks for internet connectivity every X seconds
  const checkInterval = setInterval(updateNetworkStatus, 30000); // Check every 5 seconds

  // Run an initial check to determine the network status
  updateNetworkStatus();

  // Optionally return a function to stop the interval and event listeners
  return () => clearInterval(checkInterval);
}

