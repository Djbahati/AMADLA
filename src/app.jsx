import { useEffect } from 'react'
import { Toaster } from "@/component/ui/toaster"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClientInstance } from "@/lib/query-client"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import { AuthProvider, useAuth } from "@/libs/authcontext"
import UserNotRegisteredError from "@/component/UserNotRegisteredError"
import Layout from "./component/layout/layout"

import Home from "./page/home"
import About from "./page/about"
import EnergySystems from "./page/energysystems"
import Dashboard from "./page/dashboard"
import Partners from "./page/partner"
import Contact from "./page/contact"
import EnergySupport from "./page/energysupport"
import PageNotFound from "./libs/PageNotFound"

const AuthenticatedApp = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
  } = useAuth()

  // ✅ Redirects must happen in an effect, not during render
  useEffect(() => {
    if (authError?.type === "auth_required") {
      navigateToLogin()
    }
  }, [authError, navigateToLogin])

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    )
  }

  if (authError?.type === "user_not_registered") {
    return <UserNotRegisteredError />
  }

  if (authError?.type === "auth_required") {
    return null
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/energy-systems" element={<EnergySystems />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<EnergySupport />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App


