import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SafetyModal } from './components/SafetyModal';
import { UserProfile } from './types';

export default function App() {
  // First page is Login Page as requested
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'landing'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [dashboardInitialTab, setDashboardInitialTab] = useState<
    'home' | 'upload' | 'results' | 'chat' | 'questions'
  >('home');
  const [easyRead, setEasyRead] = useState<boolean>(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);

  // Sync easy-read class to root/body for accessibility
  useEffect(() => {
    if (easyRead) {
      document.documentElement.classList.add('easy-read-mode');
    } else {
      document.documentElement.classList.remove('easy-read-mode');
    }
  }, [easyRead]);

  // Handle successful login
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setDashboardInitialTab('home');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sign out
  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApp = () => {
    if (!currentUser) {
      setCurrentView('login');
    } else {
      setDashboardInitialTab('home');
      setCurrentView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyzeReport = () => {
    if (!currentUser) {
      // Default to demo patient if entering from landing CTA
      setCurrentUser({
        name: 'Alex Morgan',
        email: 'alex.morgan@patientcare.org',
        patientId: 'PT-94821',
        age: '42 years',
        isDemo: true,
      });
    }
    setDashboardInitialTab('upload');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryDemo = () => {
    if (!currentUser) {
      setCurrentUser({
        name: 'Alex Morgan',
        email: 'alex.morgan@patientcare.org',
        patientId: 'PT-94821',
        age: '42 years',
        isDemo: true,
      });
    }
    setDashboardInitialTab('results');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-800 ${easyRead ? 'text-lg leading-relaxed' : 'text-base'}`}>
      {/* VIEW 1: LOGIN PAGE (FIRST PAGE) */}
      {currentView === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onExploreLanding={() => setCurrentView('landing')}
          easyRead={easyRead}
          onToggleEasyRead={() => setEasyRead(!easyRead)}
          onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        />
      )}

      {/* VIEW 2: DASHBOARD (MAIN LOGGED-IN PORTAL) */}
      {currentView === 'dashboard' && (
        <Dashboard
          user={currentUser}
          onSignOut={handleSignOut}
          onBackToLanding={() => setCurrentView('landing')}
          easyRead={easyRead}
          onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
          initialTab={dashboardInitialTab}
        />
      )}

      {/* VIEW 3: OPTIONAL LANDING TOUR */}
      {currentView === 'landing' && (
        <>
          <Navbar
            onOpenApp={handleOpenApp}
            easyRead={easyRead}
            onToggleEasyRead={() => setEasyRead(!easyRead)}
            onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
            isInDashboard={false}
            currentUser={currentUser}
          />
          <LandingPage
            onAnalyzeReport={handleAnalyzeReport}
            onTryDemo={handleTryDemo}
            onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
            easyRead={easyRead}
          />
        </>
      )}

      {/* Global Safety Modal */}
      {isSafetyModalOpen && (
        <SafetyModal onClose={() => setIsSafetyModalOpen(false)} />
      )}
    </div>
  );
}
