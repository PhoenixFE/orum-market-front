import { create } from 'zustand';
import {
  ICartItem,
  ICartStore,
  ISearchState,
  IProduct,
  IRecentlyViewedStore,
} from '../type';
import { persist } from 'zustand/middleware';

// 로그인 상태 관리 store
let tokenTimeoutId: NodeJS.Timeout;
export const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ isLoggedIn: true });

        if (tokenTimeoutId) {
          clearTimeout(tokenTimeoutId);
        }
        tokenTimeoutId = setTimeout(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ isLoggedIn: false });
        }, 7200000);
      },
      logOut: () => {
        clearTimeout(tokenTimeoutId);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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

export const useSearchStore = create<ISearchState>((set) => ({
  searchQuery: '',
  searchResult: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResult: (result) => set({ searchResult: result }),
}));

// 최근 본 상품 store
export const useRecentViewProductStore = create(
  persist(
    (set) => ({
      viewItems: [],
      addRecentViewProduct: (recentlyItem: IProduct) => {
        set((state: IRecentlyViewedStore) => {
          const checkingSameIndex = state.viewItems.findIndex(
            (item) => item._id === recentlyItem._id,
          );
          if (checkingSameIndex !== -1) {
            return state;
          } else {
            const recentlyUpdateViewItems = [
              recentlyItem,
              ...state.viewItems.slice(0, 9),
            ];
            return {
              viewItems: recentlyUpdateViewItems,
            };
          }
        });
      },
    }),
    {
      name: 'recentlyViewed',
    },
  ),
);
