import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Dashboard from "./pages/Dashboard/Dashboard";
import Clients from "./pages/Clients/Clients";
import Factures from "./pages/Factures/Factures";
import Proformas from "./pages/Proformas/Proformas";
import Parametres from "./pages/Parametres/Parametres";
import Produits from "./pages/Produits/Produits";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/profile/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import EmailSent from "./pages/EmailSent";
import ResetPassword from "./pages/ResetPassword";
import PasswordChanged from "./pages/PasswordChanged";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-sent" element={<EmailSent />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-changed" element={<PasswordChanged />} />

        {/* Routes protégées (pour l'instant sans authentification) */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {" "}
                <Dashboard />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                {" "}
                <Clients />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/factures"
            element={
              <ProtectedRoute>
                {" "}
                <Factures />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/proformas"
            element={
              <ProtectedRoute>
                {" "}
                <Proformas />{" "}
              </ProtectedRoute>
            }
          />

          <Route path="/parametres" element={<Parametres />} />

          <Route path="/produits" element={<Produits />} />

          <Route path="/profil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
