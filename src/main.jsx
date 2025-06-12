import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { F1StateProvider } from './state';
import config from './config';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom styles
import './styles/custom.css';

// Validate configuration on startup
const configValidation = config.validateConfig();
if (!configValidation.isValid) {
  console.error(
    '⚠️ Configuration validation failed:',
    configValidation.missing,
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <F1StateProvider>
      <App />
    </F1StateProvider>
  </React.StrictMode>,
);
