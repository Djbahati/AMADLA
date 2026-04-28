import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      await login(form);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form className="w-full max-w-md space-y-4 rounded-lg bg-slate-900 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold text-amber-400">Login</h1>
        <input
          className="w-full rounded bg-slate-800 p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        />
        <input
          className="w-full rounded bg-slate-800 p-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="w-full rounded bg-amber-500 p-2 font-semibold text-slate-900">Sign In</button>
        <p className="text-sm">
          No account? <Link className="text-amber-300" to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
