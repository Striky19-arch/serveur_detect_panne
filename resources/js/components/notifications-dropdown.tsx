import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Notification, SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import { read, readAll } from '@/routes/notifications';

export function NotificationsDropdown() {
    const { notifications, unreadNotificationCount } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);

    const markAsRead = (id: string) => {
        router.post(read.url({ id }), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Optimistically update or let Inertia handle it
            }
        });
    };

    const markAllAsRead = () => {
        router.post(readAll.url(), {}, {
            preserveScroll: true,
            onSuccess: () => setIsOpen(false)
        });
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotificationCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-neutral-950" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadNotificationCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No new notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-accent",
                                    !notification.read_at && "bg-accent/50"
                                )}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="font-medium text-sm w-full flex justify-between">
                                    <span>{notification.data.title}</span>
                                    {notification.data.severity === 'critical' && (
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                                            Critical
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.data.message}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-1 w-full text-right">
                                    {new Date(notification.created_at).toLocaleString()}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
