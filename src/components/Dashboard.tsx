import { useState } from 'react';
import { Wishlist } from './Wishlist';
import { Drawing } from './Drawing';
import { Participants } from './Participants';

type Tab = 'wishlist' | 'drawing' | 'participants';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('wishlist');

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          📝 My Wishlist
        </button>
        <button
          className={`nav-btn ${activeTab === 'drawing' ? 'active' : ''}`}
          onClick={() => setActiveTab('drawing')}
        >
          🎲 Drawing
        </button>
        <button
          className={`nav-btn ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          👥 Participants
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'wishlist' && <Wishlist />}
        {activeTab === 'drawing' && <Drawing />}
        {activeTab === 'participants' && <Participants />}
      </main>
    </div>
  );
}
