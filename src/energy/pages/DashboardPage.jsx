import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  const chartData = [
    { name: "Generated", value: data.kpis.totalEnergyGenerated },
    { name: "Consumed", value: data.kpis.totalEnergyConsumed },
    { name: "Revenue", value: data.kpis.totalRevenue },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Projects" value={data.projects.length} />
        <Card title="Active Users" value={data.kpis.activeUsers} />
        <Card title="Energy Generated (kWh)" value={data.kpis.totalEnergyGenerated} />
        <Card title="Revenue" value={`$${data.kpis.totalRevenue.toFixed(2)}`} />
      </div>
      <div className="h-72 rounded-lg bg-slate-900 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <section>
        <h2 className="mb-2 text-lg font-medium">Open Alerts</h2>
        <div className="space-y-2">
          {data.alerts.map((alert) => (
            <div key={alert.id} className="rounded bg-slate-900 p-3">
              <p className="font-medium">{alert.type}</p>
              <p className="text-sm text-slate-300">{alert.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-lg bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
