import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '../types/user';

interface AuthStore {
  user: User | null;

  accessToken: string | null;

  login: (user: User, accessToken: string) => void;

  logout: () => void;

  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      accessToken: null,

     login: (user, accessToken) =>
  set({
    user,
    accessToken,
  }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),

      updateUser: (user) =>
        set({
          user,
        }),
    }),

    {
      name: 'easyfact-session',
    },
  ),
);
