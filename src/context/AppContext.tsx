import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, User, WishlistItem } from '../types';
import { loadState, saveState, generateId, performDrawing } from '../utils/storage';
import { useAuth } from './AuthContext';

interface AppContextType extends AppState {
  addWishlistItem: (item: Omit<WishlistItem, 'id'>) => void;
  removeWishlistItem: (itemId: string) => void;
  updateWishlistItem: (itemId: string, item: Partial<Omit<WishlistItem, 'id'>>) => void;
  performDraw: () => boolean;
  getCurrentUser: () => User | null;
  getDrawnUser: () => User | null;
  getUserById: (id: string) => User | undefined;
  resetDrawing: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [state, setState] = useState<AppState>(loadState);

  // Sync auth user with app state
  useEffect(() => {
    if (authUser) {
      setState(prev => {
        // Check if user already exists in our state
        const existingUser = prev.users.find(u => u.id === authUser.uid);

        if (existingUser) {
          // Update existing user's info if changed
          const updatedUsers = prev.users.map(u =>
            u.id === authUser.uid
              ? {
                  ...u,
                  name: authUser.displayName || u.name,
                  email: authUser.email || u.email,
                  photoURL: authUser.photoURL || u.photoURL,
                }
              : u
          );
          return {
            ...prev,
            users: updatedUsers,
            currentUserId: authUser.uid,
          };
        } else {
          // Create new user
          const newUser: User = {
            id: authUser.uid,
            name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            photoURL: authUser.photoURL || undefined,
            wishlist: [],
          };
          return {
            ...prev,
            users: [...prev.users, newUser],
            currentUserId: authUser.uid,
          };
        }
      });
    } else {
      // User logged out
      setState(prev => ({ ...prev, currentUserId: null }));
    }
  }, [authUser]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addWishlistItem = (item: Omit<WishlistItem, 'id'>) => {
    if (!state.currentUserId) return;

    const newItem: WishlistItem = {
      ...item,
      id: generateId(),
    };

    setState(prev => ({
      ...prev,
      users: prev.users.map(user =>
        user.id === prev.currentUserId
          ? { ...user, wishlist: [...user.wishlist, newItem] }
          : user
      ),
    }));
  };

  const removeWishlistItem = (itemId: string) => {
    if (!state.currentUserId) return;

    setState(prev => ({
      ...prev,
      users: prev.users.map(user =>
        user.id === prev.currentUserId
          ? { ...user, wishlist: user.wishlist.filter(item => item.id !== itemId) }
          : user
      ),
    }));
  };

  const updateWishlistItem = (itemId: string, updates: Partial<Omit<WishlistItem, 'id'>>) => {
    if (!state.currentUserId) return;

    setState(prev => ({
      ...prev,
      users: prev.users.map(user =>
        user.id === prev.currentUserId
          ? {
              ...user,
              wishlist: user.wishlist.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : user
      ),
    }));
  };

  const performDraw = (): boolean => {
    if (state.users.length < 2) return false;
    if (state.drawingComplete) return false;

    try {
      const updatedUsers = performDrawing(state.users);
      setState(prev => ({
        ...prev,
        users: updatedUsers,
        drawingComplete: true,
      }));
      return true;
    } catch {
      return false;
    }
  };

  const resetDrawing = () => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(user => ({ ...user, drawnUserId: undefined })),
      drawingComplete: false,
    }));
  };

  const getCurrentUser = (): User | null => {
    return state.users.find(u => u.id === state.currentUserId) || null;
  };

  const getDrawnUser = (): User | null => {
    const currentUser = getCurrentUser();
    if (!currentUser?.drawnUserId) return null;
    return state.users.find(u => u.id === currentUser.drawnUserId) || null;
  };

  const getUserById = (id: string): User | undefined => {
    return state.users.find(u => u.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addWishlistItem,
        removeWishlistItem,
        updateWishlistItem,
        performDraw,
        getCurrentUser,
        getDrawnUser,
        getUserById,
        resetDrawing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
