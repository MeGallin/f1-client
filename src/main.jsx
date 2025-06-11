import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom styles
import './styles/custom.css';

console.log('🏁 F1 MCP Client starting...');
console.log('Environment:', import.meta.env.MODE);
console.log(
  'LangGraph Agents URL:',
  import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL ||
    'http://localhost:3000 (default)',
);
console.log('MCP Server URL:', import.meta.env.VITE_F1_MCP_SERVER_URL);
console.log('API Proxy URL:', import.meta.env.VITE_F1_API_PROXY_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
