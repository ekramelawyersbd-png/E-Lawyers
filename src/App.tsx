/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { TdsReference } from './pages/TdsReference';
import { TaxPlanner } from './pages/TaxPlanner';
import { TaxRefundGuide } from './pages/TaxRefundGuide';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { BookmarkNotificationToast } from './components/BookmarkNotificationToast';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="category/:id" element={<Category />} />
                <Route path="article/:id" element={<Article />} />
                <Route path="tax-refund-guide" element={<TaxRefundGuide />} />
                <Route path="community" element={<Community />} />
                <Route path="experts" element={<Community initialTab="experts" />} />
                <Route path="discussions" element={<Community initialTab="discussions" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tools" element={<ToolsHub />} />
                <Route path="training" element={<TrainingHub />} />
                <Route path="search" element={<Search />} />
                <Route path="glossary" element={<Glossary />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="tax-calculator" element={<TaxCalculator />} />
                <Route path="tax-planner" element={<TaxPlanner />} />
                <Route path="corporate-planner" element={<CorporateTaxPlanner />} />
                <Route path="policy-analysis" element={<TaxPolicyAnalysis />} />
                <Route path="team" element={<Team />} />
                <Route path="vat-guide" element={<VatGuide />} />
                <Route path="tds-guide" element={<TdsReference />} />
                <Route path="contact" element={<Contact />} />
                <Route path="auth" element={<Auth />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsConditions />} />
                <Route path="outsourced-business-support-accounticca" element={<Navigate to="/article/outsourced-business-support-accounticca" replace />} />
                <Route path="sales-marketing-consultancy-accounticca" element={<Navigate to="/article/sales-marketing-consultancy-accounticca" replace />} />
                <Route path="hr-organizational-consultancy-accounticca" element={<Navigate to="/article/hr-organizational-consultancy-accounticca" replace />} />
                <Route path="business-automation-consultancy-accounticca" element={<Navigate to="/article/business-automation-consultancy-accounticca" replace />} />
                <Route path="business-process-optimization-accounticca" element={<Navigate to="/article/business-process-optimization-accounticca" replace />} />
                <Route path="bookkeeping-services-accounticca" element={<Navigate to="/article/bookkeeping-services-accounticca" replace />} />
                <Route path="accounting-financial-consultancy" element={<Navigate to="/article/accounting-financial-consultancy" replace />} />
                <Route path="business-planning-strategy-consultancy" element={<Navigate to="/article/business-planning-strategy-consultancy" replace />} />
                <Route path="business-startup-consultancy" element={<Navigate to="/article/business-startup-consultancy" replace />} />
                <Route path="corporate-law-services-bangladesh" element={<Navigate to="/article/corporate-law-services-bangladesh" replace />} />
                <Route path="tax-vat-services-bangladesh" element={<Navigate to="/article/tax-vat-services-bangladesh" replace />} />
                <Route path="rjsc-compliance-services-bangladesh" element={<Navigate to="/article/rjsc-compliance-services-bangladesh" replace />} />
                <Route path="blog/accounting-finance-solutions" element={<Navigate to="/article/accounting-finance-solutions" replace />} />
                <Route path="investment-tax-rebate-bangladesh-2026-2027" element={<Navigate to="/article/investment-tax-rebate-bangladesh-2026-2027" replace />} />
              </Route>
            </Routes>
            <BookmarkNotificationToast />
          </BrowserRouter>
        </BookmarkProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
