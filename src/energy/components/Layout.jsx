import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link className="text-lg font-semibold text-amber-400" to="/">
            Amadla Energy System
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className="hover:text-amber-300">
              Dashboard
            </NavLink>
            <NavLink to="/projects" className="hover:text-amber-300">
              Projects
            </NavLink>
            <NavLink to="/usage" className="hover:text-amber-300">
              Usage
            </NavLink>
            <NavLink to="/billing" className="hover:text-amber-300">
              Billing
            </NavLink>
            <button className="rounded bg-red-600 px-3 py-1 hover:bg-red-500" onClick={logout}>
              Logout ({user?.role})
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
