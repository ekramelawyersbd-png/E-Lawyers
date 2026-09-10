/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { Article } from './pages/Article';
import { Community } from './pages/Community';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import { Glossary } from './pages/Glossary';
import { TaxCalculator } from './pages/TaxCalculator';
import { CorporateTaxPlanner } from './pages/CorporateTaxPlanner';
import { TaxPolicyAnalysis } from './pages/TaxPolicyAnalysis';
import { ToolsHub } from './pages/ToolsHub';
import { TrainingHub } from './pages/TrainingHub';
import { Team } from './pages/Team';
import { VatGuide } from './pages/VatGuide';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { FaqPage } from './pages/FaqPage';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="category/:id" element={<Category />} />
            <Route path="article/:id" element={<Article />} />
            <Route path="community" element={<Community />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tools" element={<ToolsHub />} />
            <Route path="training" element={<TrainingHub />} />
            <Route path="search" element={<Search />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="tax-calculator" element={<TaxCalculator />} />
            <Route path="corporate-planner" element={<CorporateTaxPlanner />} />
            <Route path="policy-analysis" element={<TaxPolicyAnalysis />} />
            <Route path="team" element={<Team />} />
            <Route path="vat-guide" element={<VatGuide />} />
            <Route path="contact" element={<Contact />} />
            <Route path="auth" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
