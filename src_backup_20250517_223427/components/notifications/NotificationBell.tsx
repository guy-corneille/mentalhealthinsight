
import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, Notification, NotificationType } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />;
    case 'error':
      return <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />;
    case 'warning':
      return <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />;
  }
};

const NotificationItem: React.FC<{ notification: Notification; onRead: () => void }> = ({ notification, onRead }) => {
  return (
    <DropdownMenuItem 
      className={`flex flex-col items-start p-3 ${notification.read ? 'opacity-70' : ''}`}
      onClick={onRead}
    >
      <div className="flex items-center w-full">
        {getNotificationIcon(notification.type)}
        <span className="font-medium">{notification.title}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </span>
      </div>
      <p className="text-xs text-muted-foreground ml-4 mt-1">{notification.message}</p>
    </DropdownMenuItem>
  );
};

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px]">
              <DropdownMenuGroup>
                {notifications.map((notification) => (
                  <React.Fragment key={notification.id}>
                    <NotificationItem 
                      notification={notification}
                      onRead={() => handleMarkAsRead(notification.id)}
                    />
                    <DropdownMenuSeparator />
                  </React.Fragment>
                ))}
              </DropdownMenuGroup>
            </ScrollArea>
            
            <div className="flex justify-center p-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs" 
                onClick={clearNotifications}
              >
                Clear all
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
