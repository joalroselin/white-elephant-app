import { useApp } from '../context/AppContext';

export function Participants() {
  const { users, drawingComplete, getUserById, currentUserId } = useApp();

  return (
    <div className="participants-section">
      <h2>Participants ({users.length})</h2>

      {users.length === 0 ? (
        <p className="empty-list">No participants yet.</p>
      ) : (
        <ul className="participants-list">
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const drawnUser = drawingComplete && user.drawnUserId
              ? getUserById(user.drawnUserId)
              : null;

            return (
              <li key={user.id} className={`participant ${isCurrentUser ? 'current' : ''}`}>
                <span className="participant-name">
                  {user.name}
                  {isCurrentUser && <span className="you-badge"> (You)</span>}
                </span>
                <span className="participant-status">
                  {drawingComplete ? (
                    isCurrentUser && drawnUser ? (
                      <span className="drawn-for">→ {drawnUser.name}</span>
                    ) : (
                      <span className="has-drawn">✓ Drew a name</span>
                    )
                  ) : (
                    <span className="wishlist-count">
                      {user.wishlist.length} item{user.wishlist.length !== 1 ? 's' : ''} on wishlist
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
