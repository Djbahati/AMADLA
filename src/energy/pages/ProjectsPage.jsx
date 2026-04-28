import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  location: "",
  capacityKwh: 0,
  pricePerUnit: 0,
  type: "SOLAR",
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  async function load() {
    try {
      setProjects(await api.projects());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    await api.createProject({
      ...form,
      capacityKwh: Number(form.capacityKwh),
      pricePerUnit: Number(form.pricePerUnit),
    });
    setForm(initialForm);
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">Projects</h1>
      {error ? <p className="text-red-400">{error}</p> : null}
      {(user.role === "ADMIN" || user.role === "OPERATOR") && (
        <form className="grid gap-2 rounded bg-slate-900 p-4 md:grid-cols-5" onSubmit={create}>
          <input className="rounded bg-slate-800 p-2" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="rounded bg-slate-800 p-2" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          <input className="rounded bg-slate-800 p-2" placeholder="Capacity kWh" value={form.capacityKwh} onChange={(e) => setForm((p) => ({ ...p, capacityKwh: e.target.value }))} />
          <input className="rounded bg-slate-800 p-2" placeholder="Price/unit" value={form.pricePerUnit} onChange={(e) => setForm((p) => ({ ...p, pricePerUnit: e.target.value }))} />
          <select className="rounded bg-slate-800 p-2" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
            <option value="SOLAR">SOLAR</option>
            <option value="GRID">GRID</option>
            <option value="HYBRID">HYBRID</option>
          </select>
          <button className="rounded bg-amber-500 px-3 py-2 font-semibold text-slate-900 md:col-span-5">Create Project</button>
        </form>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="rounded bg-slate-900 p-4">
            <p className="text-lg font-medium">{project.name}</p>
            <p className="text-sm text-slate-300">{project.location}</p>
            <p className="text-sm">Capacity: {Number(project.capacityKwh)} kWh</p>
            <p className="text-sm">Type: {project.type}</p>
            <p className="text-sm">Users Assigned: {project.userLinks.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
