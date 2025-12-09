import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const { currentUserId } = useApp();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !currentUserId) {
    return <Login />;
  }

  return (
    <div className="app">
      <Header />
      <Dashboard />
    </div>
  );
}

function AppWithAuth() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}

export default App;
