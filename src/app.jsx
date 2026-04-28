import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./energy/context/AuthContext";
import ProtectedRoute from "./energy/components/ProtectedRoute";
import Layout from "./energy/components/Layout";
import LoginPage from "./energy/pages/LoginPage";
import RegisterPage from "./energy/pages/RegisterPage";
import DashboardPage from "./energy/pages/DashboardPage";
import ProjectsPage from "./energy/pages/ProjectsPage";
import UsagePage from "./energy/pages/UsagePage";
import BillingPage from "./energy/pages/BillingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/usage" element={<UsagePage />} />
            <Route path="/billing" element={<BillingPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


