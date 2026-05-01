import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { apiClient } from '@/utils/apiClient';

const typeMap = {
  LOW_PRODUCTION: { icon: AlertTriangle, color: 'text-energy-amber bg-energy-amber/10', label: 'Low Production' },
  OVERUSE: { icon: XCircle, color: 'text-energy-red bg-energy-red/10', label: 'Overuse' },
  PAYMENT_DUE: { icon: Info, color: 'text-energy-blue bg-energy-blue/10', label: 'Payment Due' },
  alert: { icon: XCircle, color: 'text-energy-red bg-energy-red/10', label: 'Alert' },
  warning: { icon: AlertTriangle, color: 'text-energy-amber bg-energy-amber/10', label: 'Warning' },
  info: { icon: Info, color: 'text-energy-blue bg-energy-blue/10', label: 'Info' },
  success: { icon: CheckCircle, color: 'text-energy-green bg-energy-green/10', label: 'Success' },
};

const FALLBACK = [
  { id: 'f1', type: 'success', title: 'System Online', message: 'All energy systems are operational.', isResolved: true },
  { id: 'f2', type: 'info', title: 'Dashboard Ready', message: 'Connect to backend to see live alerts.', isResolved: false },
];

export default function NotificationsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiClient.get('/alerts')
      .then((res) => setAlerts(res.data || []))
      .catch(() => setAlerts(FALLBACK))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resolve = (id) => {
    apiClient.patch(`/alerts/${id}/resolve`, {})
      .then(() => setAlerts(prev => prev.map(a => a.id === id ? { ...a, isResolved: true } : a)))
      .catch(() => setAlerts(prev => prev.map(a => a.id === id ? { ...a, isResolved: true } : a)));
  };

  const unread = alerts.filter(a => !a.isResolved).length;

  return (
    <div className="bg-card rounded-2xl border border-border/50 h-[400px] flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Bell className="h-5 w-5 text-accent" />
        <h2 className="font-heading font-semibold text-lg">Alerts</h2>
        {unread > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-energy-red text-white">
            {unread}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={load} className="ml-auto h-7 w-7 rounded-lg">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />
          ))
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <CheckCircle className="h-8 w-8 text-energy-green" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const meta = typeMap[alert.type] || typeMap.info;
            const Icon = meta.icon;
            return (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl ${meta.color} ${alert.isResolved ? 'opacity-50' : ''}`}>
                <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{alert.title || meta.label}</p>
                  <p className="text-xs mt-0.5 opacity-80 line-clamp-2">{alert.message}</p>
                </div>
                {!alert.isResolved && (
                  <button onClick={() => resolve(alert.id)}
                    className="text-xs shrink-0 underline opacity-70 hover:opacity-100 transition-opacity">
                    Resolve
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
