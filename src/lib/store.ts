import { create } from 'zustand';
import { ICartStore, IUserStore } from '../type';

// 로그인 상태 관리 store
export const useUserStore = create<IUserStore>((set) => ({
  isLoggedIn: false,
  logIn: () => set({ isLoggedIn: true }),
  logOut: () => set({ isLoggedIn: false }),
}));

// 장바구니 상태 관리 store
export const useCartStore = create<ICartStore>((set) => ({
  items: [],
  addToCart: (newItem) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === newItem._id,
      );
      if (existingItemIndex !== -1) {
        alert('이미 장바구니에 추가된 상품입니다.');
        return { items: [...state.items] };
      } else {
        return {
          items: [...state.items, { ...newItem, quantity: 1 }],
        };
      }
    });
  },

  removeFromCart: (itemId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item._id !== itemId),
    })),
  clearCart: () => set({ items: [] }),
}));
