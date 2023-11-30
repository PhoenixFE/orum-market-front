import { create } from 'zustand';
import { ICartItem, ICartStore } from '../type';
import { persist } from 'zustand/middleware';

// 로그인 상태 관리 store
export const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: (token: string) => {
        localStorage.setItem('token', token);
        set({ isLoggedIn: true });
      },
      logOut: () => {
        localStorage.removeItem('token');
        set({ isLoggedIn: false });
      },
    }),
    {
      name: 'user',
    },
  ),
);

// 장바구니 상태 관리 store
export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addToCart: (newItem: ICartItem) => {
        set((state: ICartStore) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item._id === newItem._id,
          );
          if (existingItemIndex !== -1) {
            alert('이미 장바구니에 추가된 상품입니다.');
            return state;
          } else {
            return {
              items: [...state.items, { ...newItem, quantity: 1 }],
            };
          }
        });
      },

      removeFromCart: (itemId: number) =>
        set((state: ICartStore) => ({
          items: state.items.filter((item) => item._id !== itemId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart',
    },
  ),
);

export function useCart() {
  const cartStore = useCartStore() as ICartStore;
  return cartStore;
}
