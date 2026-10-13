import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickLoginBanner from './components/QuickLoginBanner';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AuthPage from './pages/AuthPage';
import OwnerDashboard from './pages/OwnerDashboard';
import VetPortal from './pages/VetPortal';
import ProviderPortal from './pages/ProviderPortal';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { isLoggedIn, user } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'services', 'dashboard', 'auth-login', 'auth-register'

  // Route to the appropriate role-based dashboard
  const renderDashboard = () => {
    if (!isLoggedIn) {
      return <AuthPage defaultMode="login" onAuthSuccess={() => setCurrentView('dashboard')} />;
    }

    switch (user?.role) {
      case 'ROLE_VETERINARIAN':
        return <VetPortal />;
      case 'ROLE_SERVICE_PROVIDER':
        return <ProviderPortal />;
      case 'ROLE_ADMIN':
        return <AdminDashboard />;
      case 'ROLE_PET_OWNER':
      default:
        return <OwnerDashboard />;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage setCurrentView={setCurrentView} />;
      case 'services':
        return <ServicesPage setCurrentView={setCurrentView} />;
      case 'dashboard':
        return renderDashboard();
      case 'auth-login':
        return <AuthPage defaultMode="login" onAuthSuccess={() => setCurrentView('dashboard')} />;
      case 'auth-register':
        return <AuthPage defaultMode="register" onAuthSuccess={() => setCurrentView('dashboard')} />;
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      {/* Quick Credentials Top Banner */}
      <QuickLoginBanner onLoginSuccess={() => setCurrentView('dashboard')} />

      {/* Main Clinical Navigation Bar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Area */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Clinical Telemetry Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
