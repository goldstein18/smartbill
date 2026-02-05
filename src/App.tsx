import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupabaseLoginPage from './pages/SupabaseLoginPage';
import SupabaseRegisterPage from './pages/SupabaseRegisterPage';
import HomePage from './pages/HomePage';
import Index from './pages/Index';
import ActivitiesPage from './pages/ActivitiesPage';
import ClientsPage from './pages/ClientsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import NotFound from './pages/NotFound';
import { SupabaseAuthProvider } from './hooks/useSupabaseAuth';
import SmartProtectedRoute from './components/auth/SmartProtectedRoute';
import OnboardingProtectedRoute from './components/auth/OnboardingProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { SupabaseAppProvider } from './context/SupabaseAppProvider';
import PricingPage from './pages/PricingPage';
import PartnerContactPage from './pages/PartnerContactPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import InvoicesPage from './pages/InvoicesPage';
import { SettingsPage } from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AdminRoute } from './components/admin/AdminRoute';
import { LanguageProvider } from './context/LanguageContext';
import { DemoProvider } from './context/DemoContext';

function App() {
  return (
    <LanguageProvider>
      <DemoProvider>
        <Router>
          <SupabaseAuthProvider>
            <SupabaseAppProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/login" element={<SupabaseLoginPage />} />
                <Route path="/register" element={<SupabaseRegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/partner-contact" element={<PartnerContactPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                
                <Route path="/onboarding" element={<OnboardingProtectedRoute><OnboardingPage /></OnboardingProtectedRoute>} />
                
                <Route path="/dashboard" element={<SmartProtectedRoute><AppLayout><Index /></AppLayout></SmartProtectedRoute>} />
                <Route path="/activities" element={<SmartProtectedRoute><AppLayout><ActivitiesPage /></AppLayout></SmartProtectedRoute>} />
                <Route path="/clients" element={<SmartProtectedRoute><AppLayout><ClientsPage /></AppLayout></SmartProtectedRoute>} />
                <Route path="/analytics" element={<SmartProtectedRoute><AppLayout><AnalyticsPage /></AppLayout></SmartProtectedRoute>} />
                <Route path="/invoices" element={<SmartProtectedRoute><AppLayout><InvoicesPage /></AppLayout></SmartProtectedRoute>} />
                <Route path="/settings" element={<SmartProtectedRoute><AppLayout><SettingsPage /></AppLayout></SmartProtectedRoute>} />
                <Route path="/profile" element={<SmartProtectedRoute><AppLayout><ProfilePage /></AppLayout></SmartProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute requireSuperAdmin><AppLayout><AdminDashboardPage /></AppLayout></AdminRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SupabaseAppProvider>
          </SupabaseAuthProvider>
        </Router>
      </DemoProvider>
    </LanguageProvider>
  );
}

export default App;
