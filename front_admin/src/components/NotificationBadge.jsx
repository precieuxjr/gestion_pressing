// src/components/NotificationBadge.jsx
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBadge() {
  const { unreadCount } = useNotifications();
  if (unreadCount === 0) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}