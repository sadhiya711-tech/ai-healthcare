import React, { useState } from 'react';
import { Menu, X, Shield, BookOpen, Sparkles, Type } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  onOpenApp: () => void;
  easyRead: boolean;
  onToggleEasyRead: () => void;
  onOpenSafetyModal: () => void;
  isInDashboard?: boolean;
  currentUser?: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApp,
  easyRead,
  onToggleEasyRead,
  onOpenSafetyModal,
  isInDashboard = false,
  currentUser = null,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand wordmark (single text element) */}
          <a
            href="#home"
            onClick={(e) => {
              if (!isInDashboard) {
                e.preventDefault();
                scrollToSection('home');
              }
            }}
            className="flex items-center gap-2 text-slate-900 font-extrabold text-lg sm:text-xl tracking-tight select-none focus:outline-hidden focus:ring-2 focus:ring-teal-500 rounded-lg px-1"
          >
            <span className="text-xl">🩺</span>
            <span className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-800 bg-clip-text text-transparent">
              MediGuide AI
            </span>
          </a>

          {/* Zone 2: Navigation Links (desktop) */}
          {!isInDashboard && (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('home');
                }}
                className="hover:text-slate-900 transition-colors py-1"
              >
                Home
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('how-it-works');
                }}
                className="hover:text-slate-900 transition-colors py-1"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('features');
                }}
                className="hover:text-slate-900 transition-colors py-1"
              >
                Features
              </a>
              <button
                onClick={onOpenSafetyModal}
                className="hover:text-slate-900 transition-colors py-1 text-slate-600 inline-flex items-center gap-1 cursor-pointer"
              >
                Safety
              </button>
            </nav>
          )}

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Easy Read Mode Toggle for Accessibility */}
            <button
              onClick={onToggleEasyRead}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                easyRead
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Easy Read Mode with larger fonts and higher readability"
              aria-label="Toggle Easy Read Mode"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Easy Read</span>
              <span className={`text-[10px] px-1 rounded-sm uppercase ${easyRead ? 'bg-amber-300 font-bold' : 'text-slate-400'}`}>
                {easyRead ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Main CTA */}
            <button
              onClick={onOpenApp}
              className="px-4 py-2 bg-gradient-to-r from-blue-900 to-teal-800 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-blue-950 hover:to-teal-900 shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              {isInDashboard ? 'Open New Report' : currentUser ? 'Go to Dashboard' : 'Sign In to Portal'}
            </button>

            {/* Mobile Hamburger toggle */}
            {!isInDashboard && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {!isInDashboard && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <button
            onClick={() => scrollToSection('home')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Features
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSafetyModal();
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
          >
            <span>Safety Guidelines</span>
            <Shield className="w-4 h-4 text-teal-600" />
          </button>
        </div>
      )}
    </header>
  );
};
