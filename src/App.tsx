import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Composants synchrones
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword';
import EmailSent from './pages/EmailSent';
import ResetPassword from './pages/ResetPassword';
import PasswordChanged from './pages/PasswordChanged';

// Lazy loading des pages de l'application
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Clients = lazy(() => import('./pages/Clients/Clients'));
const Factures = lazy(() => import('./pages/Factures/Factures'));
const Proformas = lazy(() => import('./pages/Proformas/Proformas'));
const Parametres = lazy(() => import('./pages/Parametres/Parametres'));
const Produits = lazy(() => import('./pages/Produits/Produits'));
const Profile = lazy(() => import('./pages/profile/Profile'));

const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    Chargement...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ROUTES PUBLIQUES */}

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/email-sent" element={<EmailSent />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/password-changed" element={<PasswordChanged />} />

          {/* ROUTES PROTÉGÉES */}

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/clients" element={<Clients />} />

            <Route path="/factures" element={<Factures />} />

            <Route path="/proformas" element={<Proformas />} />

            <Route path="/parametres" element={<Parametres />} />

            <Route path="/produits" element={<Produits />} />

            <Route path="/profil" element={<Profile />} />
          </Route>

          {/* PAGE 404 */}

          <Route
            path="*"
            element={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  height: '100vh',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h1>404 - Page Introuvable</h1>

                <a href="/dashboard">Retour au tableau de bord</a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
