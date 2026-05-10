import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import Members from "./pages/Members";
import Instructors from "./pages/Instructors";
import Schedule from "./pages/Schedule";
import Types from "./pages/Types";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Sync auth with localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsAuth(!!token);
      setLoading(false);
    };

    checkAuth();

    // Optional: listen for storage changes (multi-tab support)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
            isAuth ? <Dashboard /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/classes"
          element={
            isAuth ? <Classes /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/members"
          element={
            isAuth ? <Members /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/instructors"
          element={
            isAuth ? <Instructors /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/schedule"
          element={
            isAuth ? <Schedule /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/types"
          element={
            isAuth ? <Types /> : <Navigate to="/" replace />
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