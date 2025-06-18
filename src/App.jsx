import './styles/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import LoadingIndicator from './components/LoadingIndicator.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { APP_CONFIG } from './config';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <LoadingIndicator />
        <Navigation />
        <main className="flex-grow-1">
          <Outlet />
        </main>

        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container text-center">
            <p className="mb-1">
              © {new Date().getFullYear()} {APP_CONFIG.name}
            </p>
            <p className="mb-0 small text-muted">
              Built with React, Vite, Bootstrap, Jotai & Router
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
