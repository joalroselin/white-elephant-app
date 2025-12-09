import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { WishlistItem } from '../types';

export function Wishlist() {
  const { getCurrentUser, addWishlistItem, removeWishlistItem, updateWishlistItem } = useApp();
  const currentUser = getCurrentUser();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<WishlistItem, 'id'>>({ name: '' });

  if (!currentUser) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addWishlistItem({
      name: name.trim(),
      description: description.trim() || undefined,
      link: link.trim() || undefined,
    });

    setName('');
    setDescription('');
    setLink('');
  };

  const startEdit = (item: WishlistItem) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      description: item.description || '',
      link: item.link || '',
    });
  };

  const saveEdit = () => {
    if (editingId && editForm.name.trim()) {
      updateWishlistItem(editingId, {
        name: editForm.name.trim(),
        description: editForm.description?.trim() || undefined,
        link: editForm.link?.trim() || undefined,
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="wishlist-section">
      <h2>My Wishlist</h2>

      <form onSubmit={handleAdd} className="wishlist-form">
        <div className="form-group">
          <label htmlFor="item-name">Item Name *</label>
          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What would you like?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="item-description">Description (optional)</label>
          <textarea
            id="item-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Size, color, or other details..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="item-link">Link (optional)</label>
          <input
            id="item-link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <button type="submit" className="add-btn">
          Add to Wishlist
        </button>
      </form>

      {currentUser.wishlist.length === 0 ? (
        <p className="empty-list">Your wishlist is empty. Add some items!</p>
      ) : (
        <ul className="wishlist-items">
          {currentUser.wishlist.map((item) => (
            <li key={item.id} className="wishlist-item">
              {editingId === item.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Item name"
                  />
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                  />
                  <input
                    type="url"
                    value={editForm.link || ''}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    placeholder="Link"
                  />
                  <div className="edit-actions">
                    <button onClick={saveEdit} className="save-btn">Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="item-content">
                    <strong>{item.name}</strong>
                    {item.description && <p>{item.description}</p>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        View Item →
                      </a>
                    )}
                  </div>
                  <div className="item-actions">
                    <button onClick={() => startEdit(item)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => removeWishlistItem(item.id)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
