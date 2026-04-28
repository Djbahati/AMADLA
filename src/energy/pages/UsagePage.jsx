import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function UsagePage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    projectId: "",
    usageDate: new Date().toISOString(),
    consumedKwh: 0,
    producedKwh: 0,
  });
  const [projects, setProjects] = useState([]);

  async function load() {
    const [usageData, projectData] = await Promise.all([api.usage(), api.projects()]);
    setUsage(usageData);
    setProjects(projectData);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    await api.recordUsage({
      ...form,
      consumedKwh: Number(form.consumedKwh),
      producedKwh: Number(form.producedKwh),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">Energy Usage</h1>
      {(user.role === "ADMIN" || user.role === "OPERATOR") && (
        <form className="grid gap-2 rounded bg-slate-900 p-4 md:grid-cols-3" onSubmit={submit}>
          <input className="rounded bg-slate-800 p-2" placeholder="User ID" value={form.userId} onChange={(e) => setForm((p) => ({ ...p, userId: e.target.value }))} />
          <select className="rounded bg-slate-800 p-2" value={form.projectId} onChange={(e) => setForm((p) => ({ ...p, projectId: e.target.value }))}>
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <input className="rounded bg-slate-800 p-2" type="datetime-local" onChange={(e) => setForm((p) => ({ ...p, usageDate: new Date(e.target.value).toISOString() }))} />
          <input className="rounded bg-slate-800 p-2" placeholder="Consumed kWh" value={form.consumedKwh} onChange={(e) => setForm((p) => ({ ...p, consumedKwh: e.target.value }))} />
          <input className="rounded bg-slate-800 p-2" placeholder="Produced kWh" value={form.producedKwh} onChange={(e) => setForm((p) => ({ ...p, producedKwh: e.target.value }))} />
          <button className="rounded bg-amber-500 px-3 py-2 font-semibold text-slate-900">Record Usage</button>
        </form>
      )}
      <div className="space-y-2">
        {usage.map((item) => (
          <div key={item.id} className="rounded bg-slate-900 p-3">
            <p className="font-medium">{item.project.name} - {item.user.fullName}</p>
            <p className="text-sm">Consumed: {Number(item.consumedKwh)} kWh | Produced: {Number(item.producedKwh)} kWh</p>
          </div>
        ))}
      </div>
    </div>
  );
}
