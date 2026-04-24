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

// Version check system removed as requested

createRoot(document.getElementById("root")!).render(<App />);
