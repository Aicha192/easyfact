import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../types/user";


interface AuthStore {

  user: User | null;

  login: (user: User) => void;

  logout: () => void;

  updateUser: (user: User) => void;

}


export const useAuthStore = create<AuthStore>()(
  persist(

    (set) => ({

      user: null,


      login: (user) =>
        set({
          user,
        }),


      logout: () =>
        set({
          user: null,
        }),

        updateUser: (user) =>
  set({
    user,
  }),

    }),

    {
      name: "easyfact-session",
    }

  )
);