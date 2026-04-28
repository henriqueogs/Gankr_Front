import { useState, useRef, useEffect } from "react";
import { useNotifications, Notification } from "../../services/useNotifications";
import { Link } from "react-router-dom";

export function NotificationsDropdown() {
  const { notifications, unreadCount, markRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-midnight-700 bg-midnight-800 p-2 text-slate-400 transition hover:text-white"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-glow-red">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-midnight-700 bg-midnight-900 shadow-xl backdrop-blur-xl z-50">
          <div className="border-b border-midnight-800 p-4">
            <h3 className="font-semibold text-white">Notificações</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markRead(notification.id)}
                />
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                Nenhuma notificação nova.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: () => void }) {
  return (
    <div
      onClick={onRead}
      className={`border-b border-midnight-800 p-4 transition hover:bg-midnight-800/50 cursor-pointer ${
        !notification.read ? "bg-midnight-800/20" : ""
      }`}
    >
      <div className="flex gap-3">
        <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!notification.read ? 'bg-indigo-500' : 'bg-slate-700'}`} />
        <div className="flex-1 space-y-1">
          <p className="text-sm text-slate-300">{notification.content}</p>
          <div className="flex justify-between items-center text-xs text-slate-500">
             <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
             {notification.link && (
                 <Link to={notification.link} className="text-indigo-400 hover:underline">
                     Ver
                 </Link>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M12 2C10.3431 2 9 3.34315 9 5V6.16998C6.96 6.81998 5.5 8.76998 5.5 11V17L4.5 18H19.5L18.5 17V11C18.5 8.76998 17.04 6.81998 15 6.16998V5C15 3.34315 13.6569 2 12 2Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 21C10 22.1046 10.8954 23 12 23C13.1046 23 14 22.1046 14 21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
