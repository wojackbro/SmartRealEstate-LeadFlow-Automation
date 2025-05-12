import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LeadCapture } from './components/Leads/LeadCapture';
import { CRM as CRMComponent } from './components/AIChat/CRM';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIBots } from './components/AIChat/AIBots';

function HomePage() {
  useEffect(() => {
    document.title = 'LeadChase | AI-Powered Real Estate Lead Generation';
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = 'data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text y=\".9em\" font-size=\"90\">🏠</text></svg>';
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <ErrorBoundary>
        <LeadCapture onLeadCaptured={(leadId) => console.log('Lead captured:', leadId)} />
      </ErrorBoundary>
    </div>
  );
}

function CRMPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'CRM Dashboard | LeadChase';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>
          <CRMComponent />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crm" element={<CRMPage />} />
      </Routes>
      <AIBots />
    </Router>
  );
}

export default App;