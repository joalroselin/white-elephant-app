import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { getCurrentUser } = useApp();
  const { logout } = useAuth();
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Error handled in context
    }
  };

  return (
    <header className="header">
      <h1>🎁 White Elephant</h1>
      <div className="header-user">
        {currentUser.photoURL && (
          <img
            src={currentUser.photoURL}
            alt={currentUser.name}
            className="user-avatar"
          />
        )}
        <span>Welcome, {currentUser.name}</span>
        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </div>
    </header>
  );
}
