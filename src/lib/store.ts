import { create } from 'zustand';
import { ICartItem, ICartStore } from '../type';
import { persist } from 'zustand/middleware';
import axios, { AxiosResponse } from 'axios';

const isTokenExpired = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return true;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = atob(base64);
    const parsedPayload = JSON.parse(payload);
    const exp = parsedPayload.exp;

    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// 로그인 상태 관리 store
export const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      logIn: async (token: string, refreshToken: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        set({ isLoggedIn: true });

        setInterval(async () => {
          if (isTokenExpired(token)) {
            try {
              const res = (await axios({
                url: `https://localhost/api/users/refresh`,
                method: 'Post',
                headers: {
                  accesstoken: token,
                  refreshToken,
                },
              })) as AxiosResponse<{
                accessToken: string;
                refreshToken: string;
              }>;
              localStorage.setItem('token', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              set({ isLoggedIn: true });
            } catch (error) {
              console.error('Error refreshing token:', error);
              (get as () => { logOut: () => void })().logOut();
            }
          }
        }, 60000);
      },
      logOut: () => {
        localStorage.removeItem('token');
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
