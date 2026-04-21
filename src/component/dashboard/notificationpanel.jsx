import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const typeIcons = {
  alert: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const typeColors = {
  alert: 'text-energy-red bg-energy-red/10',
  warning: 'text-energy-amber bg-energy-amber/10',
  info: 'text-energy-blue bg-energy-blue/10',
  success: 'text-energy-green bg-energy-green/10',
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const notifs = await base44.entities.Notification.list('-created_date', 20);
      setNotifications(notifs);
      setLoading(false);
    }
    load();
  }, []);

  const markRead = async (id) => {
    await base44.entities.Notification.update(id, { is_read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div className="bg-card rounded-2xl border border-border/50 h-[400px] flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Bell className="h-5 w-5 text-accent" />
         <h2 className="font-heading font-semibold text-lg">Notifications</h2>
         {unread > 0 && <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{unread}
            </span>}
        </div>
        <div className="p-4 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No notifications to display.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {notifications.map((n) => {
                  const Icon = typeIcons[n.type];
                  return (
                    <li key={n.id} className={`p-4 rounded-lg ${typeColors[n.type]}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg">{n.title}</h3>
                          <p className="text-sm text-muted-foreground">{n.description}</p>
                        </div>
                        {!n.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markRead(n.id)}
                            className="ml-auto"
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
    );
}