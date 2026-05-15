import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Classes from "./pages/classes";
import Members from "./pages/members";
import Instructors from "./pages/Instructors";
import Schedule from "./pages/schedule";
import Types from "./pages/Types";
import MainLayout from "./components/MainLayout";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsAuth(!!token);
      setLoading(false);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    // Same-tab login/logout does not fire "storage"; use a tiny app event instead.
    window.addEventListener("ocms:auth", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("ocms:auth", checkAuth);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">ClassHub</p>
          <p className="text-xs text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            !isAuth ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/register"
          element={
            !isAuth ? <Register /> : <Navigate to="/dashboard" replace />
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            isAuth ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/classes"
          element={
            isAuth ? (
              <MainLayout>
                <Classes />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/members"
          element={
            isAuth ? (
              <MainLayout>
                <Members />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/instructors"
          element={
            isAuth ? (
              <MainLayout>
                <Instructors />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/schedule"
          element={
            isAuth ? (
              <MainLayout>
                <Schedule />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/types"
          element={
            isAuth ? (
              <MainLayout>
                <Types />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* DEFAULT ROUTE */}
        <Route
          path="*"
          element={
            isAuth ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;