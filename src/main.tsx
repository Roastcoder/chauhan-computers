import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Unregister any service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}

// Clear all caches
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
}

// Force reload on version mismatch
const APP_VERSION = '__BUILD_TIME__';
const storedVersion = localStorage.getItem('app_version');
if (storedVersion && storedVersion !== APP_VERSION) {
  localStorage.setItem('app_version', APP_VERSION);
  window.location.reload();
} else {
  localStorage.setItem('app_version', APP_VERSION);
}

createRoot(document.getElementById("root")!).render(<App />);
