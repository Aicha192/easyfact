import {
  Bell,
  Check,
  Trash2,
  User,
  FileText,
  FileBadge,
  Package,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { timeAgo } from "../../utils/timeAgo";
import { useNotificationStore } from "../../store/notificationStore";
import { useEffect, useState } from "react";

export default function NotificationDropdown() {
    const [now, setNow] = useState(Date.now());

  const notifications =
    useNotificationStore(
      (state) => state.notifications
    );

  const markAsRead =
    useNotificationStore(
      (state) => state.markAsRead
    );

  const markAllAsRead =
    useNotificationStore(
      (state) => state.markAllAsRead
    );

  const deleteNotification =
    useNotificationStore(
      (state) => state.deleteNotification
    );

    useEffect(() => {

  const interval = setInterval(() => {

    setNow(Date.now());

  }, 60000); 


  return () => clearInterval(interval);

}, []);

    function getNotificationIcon(type: string) {
  switch (type) {
    case "client":
      return <User size={18} className="text-blue-600" />;

    case "facture":
      return <FileText size={18} className="text-emerald-600" />;

    case "proforma":
      return <FileBadge size={18} className="text-orange-500" />;

    case "produit":
      return <Package size={18} className="text-purple-600" />;

    case "profil":
      return <Settings size={18} className="text-slate-600" />;

    case "auth":
      return <ShieldCheck size={18} className="text-indigo-600" />;

    default:
      return <Bell size={18} className="text-slate-500" />;
  }
}

  return (

    <div  onClick={(e) => e.stopPropagation()}
      className="
        absolute
        right-0
        top-16
        z-50
        w-96
        rounded-2xl
        border
        bg-white
        shadow-2xl
      "
    >

      {/* En-tête */}

      <div className="flex items-center justify-between border-b p-4">

        <h2 className="text-lg font-semibold">

          Notifications

        </h2>

        {notifications.length > 0 && (

          <button
  onClick={(e) => {
    e.stopPropagation();
    markAllAsRead();
  }}
  className="text-sm text-emerald-600 hover:underline"
>
  Tout lire
</button>

        )}

      </div>

      {/* Liste */}

      <div className="max-h-96 overflow-y-auto">

        {notifications.length === 0 ? (

          <div className="p-8 text-center text-slate-500">

            <Bell
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />

            Aucune notification.

          </div>

        ) : (

          notifications.map((notification) => (

            <div
              key={notification.id}
              className={`
                border-b
                p-4
                transition
                hover:bg-slate-50
                ${
                  !notification.read
                    ? "bg-emerald-50"
                    : ""
                }
              `}
            >

              <div className="flex items-start justify-between">

               <div className="flex gap-3">

  <div className="mt-1">
    {getNotificationIcon(notification.type)}
  </div>

  <div>

    <h3 className="font-semibold">
      {notification.title}
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      {notification.message}
    </p>

    <p className="mt-2 text-xs text-slate-400">
     {now && timeAgo(notification.createdAt)}
    </p>

  </div>

</div>

                <div className="flex gap-2">

                  {!notification.read && (

                    <button
  onClick={(e) => {
    e.stopPropagation();
    markAsRead(notification.id);
  }}
>
  <Check
    size={18}
    className="text-emerald-600"
  />
</button>

                  )}

                  <button
  onClick={(e) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  }}
>
  <Trash2
    size={18}
    className="text-red-500"
  />
</button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}