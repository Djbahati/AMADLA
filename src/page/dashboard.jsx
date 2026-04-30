import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, User, Wrench } from 'lucide-react';
import StatsGrid from '../component/dashboard/statsgrid';
import EnergyCharts from '../component/dashboard/energychat';
import TeamChat from '../component/dashboard/teamchat';
import NotificationsPanel from '../component/dashboard/notificationpanel';

const roleBadges = {
  ADMIN: { icon: Shield, label: 'Administrator', color: 'bg-accent/10 text-accent' },
  OPERATOR: { icon: Wrench, label: 'Operator', color: 'bg-energy-blue/10 text-energy-blue' },
  USER: { icon: User, label: 'User', color: 'bg-energy-green/10 text-energy-green' },
};

export default function Dashboard() {
  const { user } = useAuth();

  const role = user?.role || 'USER';
  const badge = roleBadges[role] || roleBadges.USER;
  const BadgeIcon = badge.icon;

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold">
                Welcome back{user?.fullName ? `, ${user.fullName}` : ''}
              </h1>
              <p className="text-muted-foreground mt-1">Energy monitoring dashboard — real-time analytics</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${badge.color} w-fit`}>
              <BadgeIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-8">
          <StatsGrid />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <EnergyCharts />
        </div>

        {/* Chat & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamChat />
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
}

