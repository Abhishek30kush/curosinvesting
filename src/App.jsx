import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Disclaimer } from './pages/Disclaimer';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Calculators } from './pages/Calculators';
import { AdminLayout } from './components/layout/AdminLayout';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ManageArticles } from './pages/admin/ManageArticles';
import { CreateArticle } from './pages/admin/CreateArticle';
import { TeamManagement } from './pages/admin/TeamManagement';
import { AINewsAssistant } from './pages/admin/AINewsAssistant';
import { Subscribers } from './pages/admin/Subscribers';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ManageArticles />} />
            <Route path="articles/create" element={<CreateArticle />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="ai-assistant" element={<AINewsAssistant />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}



export default App;
