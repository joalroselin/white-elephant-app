export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  link?: string;
}

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  photoURL?: string;
  wishlist: WishlistItem[];
  drawnUserId?: string; // The ID of the user they drew
}

export interface AppState {
  users: User[];
  currentUserId: string | null;
  drawingComplete: boolean;
}
