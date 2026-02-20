import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Ensure CSS is imported

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Register the Kill Switch Service Worker so older devices fetch it,
// execute its self-destruct sequence, and purge their broken caches.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Kill Switch SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('Kill Switch SW registration failed: ', registrationError);
            });
    });
}
