import './styles/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import LoadingIndicator from './components/LoadingIndicator.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

/**
 * Main App Component
 *
 * Serves as the entry point for the application.
 * The actual layout structure is defined in router/index.jsx
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <LoadingIndicator />
        <Outlet />
      </div>
    </ErrorBoundary>
  );
}

export default App;
