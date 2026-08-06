import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../types/user";
import { users as initialUsers } from "../data/users";

interface UserStore {
  users: User[];

  addUser: (user: User) => void;

  updateUser: (user: User) => void;

  deleteUser: (id: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: initialUsers,

      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
    }),
    {
      name: "easyfact-users",
    }
  )
);