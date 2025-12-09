import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Drawing() {
  const { users, drawingComplete, performDraw, getCurrentUser, getDrawnUser, resetDrawing } = useApp();
  const currentUser = getCurrentUser();
  const drawnUser = getDrawnUser();
  const [showWishlist, setShowWishlist] = useState(false);

  if (!currentUser) return null;

  const canDraw = users.length >= 2 && !drawingComplete;

  const handleDraw = () => {
    const success = performDraw();
    if (!success) {
      alert('Drawing failed. Make sure there are at least 2 participants.');
    }
  };

  return (
    <div className="drawing-section">
      <h2>Gift Exchange Drawing</h2>

      {!drawingComplete ? (
        <div className="pre-draw">
          <p>
            {users.length < 2
              ? `Need at least 2 participants to draw. Currently: ${users.length}`
              : `${users.length} participants are ready!`}
          </p>
          <button
            onClick={handleDraw}
            disabled={!canDraw}
            className="draw-btn"
          >
            🎲 Start the Drawing!
          </button>
          <p className="draw-warning">
            ⚠️ Once drawing starts, all participants will be randomly assigned someone to buy a gift for.
          </p>
        </div>
      ) : (
        <div className="post-draw">
          {drawnUser ? (
            <div className="drawn-result">
              <div className="drawn-card">
                <p className="drawn-label">You are buying a gift for:</p>
                <p className="drawn-name">🎁 {drawnUser.name}</p>

                <button
                  onClick={() => setShowWishlist(!showWishlist)}
                  className="toggle-wishlist-btn"
                >
                  {showWishlist ? 'Hide' : 'View'} their Wishlist
                </button>

                {showWishlist && (
                  <div className="drawn-wishlist">
                    {drawnUser.wishlist.length === 0 ? (
                      <p className="empty-wishlist">
                        They haven't added any items to their wishlist yet.
                      </p>
                    ) : (
                      <ul>
                        {drawnUser.wishlist.map((item) => (
                          <li key={item.id}>
                            <strong>{item.name}</strong>
                            {item.description && <p>{item.description}</p>}
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                View Item →
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>Drawing complete! Log in to see who you got.</p>
          )}

          <button onClick={resetDrawing} className="reset-btn">
            🔄 Reset Drawing (Start Over)
          </button>
        </div>
      )}
    </div>
  );
}
