import { create } from 'zustand';

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
