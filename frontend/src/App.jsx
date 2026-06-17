import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Core layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIWidget from './components/AIWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Team from './pages/Team';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import FaqList from './pages/FaqList';
import BookConsultation from './pages/BookConsultation';
import CostCalculator from './pages/CostCalculator';
import PatentChecker from './pages/PatentChecker';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Portals
import ClientDashboard from './client/ClientDashboard';
import AdminDashboard from './admin/AdminDashboard';
import SEOManager from './components/SEOManager';

function App() {
  return (
    <Router>
      <SEOManager />
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* Header Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/team" element={<Team />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/faqs" element={<FaqList />} />
                <Route path="/book-consultation" element={<BookConsultation />} />
                <Route path="/calculator" element={<CostCalculator />} />
                <Route path="/cost-estimator" element={<CostCalculator />} />
                <Route path="/patent-checker" element={<PatentChecker />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />

                {/* Client Portal Dashboard */}
                <Route
                  path="/client"
                  element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin CMS Panel */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {/* Footer layout */}
            <Footer />

            {/* AI Assistant widget */}
            <AIWidget />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
