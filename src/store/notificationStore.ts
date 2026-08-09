import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Notification } from "../types/notification";

interface NotificationStore {

  notifications: Notification[];

  addNotification: (
    notification: Omit<Notification, "id" | "read">
  ) => void;

  markAsRead: (id: number) => void;

  markAllAsRead: () => void;

  deleteNotification: (id: number) => void;

  clearNotifications: () => void;

}

export const useNotificationStore =
  create<NotificationStore>()(
    persist(

      (set) => ({

        notifications: [],

        addNotification: (notification) =>
          set((state) => ({

            notifications: [

              {
                id: Date.now(),

                read: false,

                ...notification,

              },

              ...state.notifications,

            ],

          })),

        markAsRead: (id) =>
          set((state) => ({

            notifications:
              state.notifications.map((notification) =>

                notification.id === id

                  ? {
                      ...notification,
                      read: true,
                    }

                  : notification

              ),

          })),

        markAllAsRead: () =>
          set((state) => ({

            notifications:
              state.notifications.map((notification) => ({

                ...notification,

                read: true,

              })),

          })),

        deleteNotification: (id) =>
          set((state) => ({

            notifications:
              state.notifications.filter(
                (notification) => notification.id !== id
              ),

          })),

        clearNotifications: () =>
          set({

            notifications: [],

          }),

      }),

      {
        name: "easyfact-notifications",
      }

    )
  );