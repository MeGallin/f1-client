import './styles/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import F1DataDisplayJotai from './components/F1DataDisplayJotai.jsx';
import LoadingIndicator from './components/LoadingIndicator.jsx';
import { APP_CONFIG } from './config';

function App() {
  return (
    <div className="App">
      <LoadingIndicator />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          {' '}
          <a className="navbar-brand" href="/">
            🏎️ {APP_CONFIG.name}
          </a>
          <span className="navbar-text text-muted">
            v{APP_CONFIG.version} - Powered by Jotai
          </span>
        </div>
      </nav>
      <main className="container py-4">
        <F1DataDisplayJotai />
      </main>{' '}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-1">
            © {new Date().getFullYear()} {APP_CONFIG.name}
          </p>
          <p className="mb-0 small text-muted">
            Built with React, Vite, Bootstrap & Jotai
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
