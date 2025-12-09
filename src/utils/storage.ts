import type { AppState, User } from '../types';

const STORAGE_KEY = 'white-elephant-app';

const defaultState: AppState = {
  users: [],
  currentUserId: null,
  drawingComplete: false,
};

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
  return defaultState;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Perform the random drawing - ensures no one draws themselves
export function performDrawing(users: User[]): User[] {
  if (users.length < 2) {
    throw new Error('Need at least 2 participants to draw');
  }

  const userIds = users.map(u => u.id);
  let assignments: Map<string, string>;
  let valid = false;

  // Keep trying until we get a valid derangement (no one draws themselves)
  while (!valid) {
    assignments = new Map();
    const available = [...userIds];

    // Shuffle the available pool
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }

    valid = true;
    for (let i = 0; i < userIds.length; i++) {
      if (userIds[i] === available[i]) {
        valid = false;
        break;
      }
      assignments.set(userIds[i], available[i]);
    }
  }

  return users.map(user => ({
    ...user,
    drawnUserId: assignments!.get(user.id),
  }));
}
