import { Bell } from 'lucide-react';

export default function NotificationIcon() {
  const unreadCount = 3;

  return (
    <div className="relative">
      <Bell className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}