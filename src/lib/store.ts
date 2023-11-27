import { create } from 'zustand';
import { CartStore } from '../type';

export interface UserStore {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}

// 로그인 상태 관리 store
export const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  logIn: () => set({ isLoggedIn: true }),
  logOut: () => set({ isLoggedIn: false }),
}));

// 장바구니 상태 관리 store
export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (newItem) =>
    set((state) => {
      console.log('Adding item to cart:', newItem);
      console.log('Current cart items:', state.items);

      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        return { items: [...state.items] };
      } else {
        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }
    }),
  removeFromCart: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  clearCart: () => set({ items: [] }),
}));
