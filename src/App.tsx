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
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { AdminShop } from './pages/AdminShop';
import { ShopAdminLogin } from './pages/ShopAdminLogin';
import { ShopAdminRouteGuard } from './components/auth/ShopAdminRouteGuard';
import { ResourceLibraryPage } from './pages/ResourceLibraryPage';
import { AuthProvider } from './contexts/AuthContext';
import { ShopAuthProvider } from './contexts/ShopAuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { CartProvider } from './contexts/CartContext';
import { BookmarkNotificationToast } from './components/BookmarkNotificationToast';
import { ScrollManager } from './components/layout/ScrollManager';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ShopAuthProvider>
          <BookmarkProvider>
            <CartProvider>
              <BrowserRouter>
                <ScrollManager />
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    
                    {/* Admin Authentication Login Pages */}
                    <Route path="admin/login" element={<ShopAdminLogin />} />
                    <Route path="shop/login" element={<Navigate to="/admin/login" replace />} />

                    {/* Public Shop Pages (Open to All Visitors, Displays Published Catalog) */}
                    <Route path="shop" element={<Shop />} />
                    <Route path="shop/:slug" element={<ProductDetail />} />
                    <Route path="shop/product/:slug" element={<ProductDetail />} />
                    
                    {/* Admin Shop Catalog Desk (Protected by Authorized Credentials: hmekram@gmail.com) */}
                    <Route path="admin/shop" element={<ShopAdminRouteGuard><AdminShop /></ShopAdminRouteGuard>} />
                    <Route path="admin/products" element={<Navigate to="/admin/shop" replace />} />
                    <Route path="admin" element={<ShopAdminRouteGuard><AdminShop /></ShopAdminRouteGuard>} />
                    
                    <Route path="store" element={<Navigate to="/shop" replace />} />
                    <Route path="products" element={<Navigate to="/shop" replace />} />
                    <Route path="resource-library" element={<ResourceLibraryPage />} />
                  <Route path="resources" element={<Navigate to="/resource-library" replace />} />
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
                <Route path="corporate-tax-planner" element={<Navigate to="/corporate-planner" replace />} />
                <Route path="policy-analysis" element={<TaxPolicyAnalysis />} />
                <Route path="team" element={<Team />} />
                <Route path="vat-guide" element={<VatGuide />} />
                <Route path="tds-guide" element={<TdsReference />} />
                <Route path="tds-reference" element={<Navigate to="/tds-guide" replace />} />
                <Route path="contact" element={<Contact />} />
                <Route path="auth" element={<Auth />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsConditions />} />
                <Route path="company-reg" element={<Navigate to="/article/company-reg" replace />} />
                <Route path="tax-return-guide" element={<Navigate to="/article/tax-return-guide" replace />} />
                <Route path="rjsc-guide" element={<Navigate to="/article/rjsc-guide" replace />} />
                <Route path="startup-legal-checklist" element={<Navigate to="/article/startup-legal-checklist" replace />} />
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
                <Route path="total-income-calculation-bangladesh-2026-2027" element={<Navigate to="/article/total-income-calculation-bangladesh-2026-2027" replace />} />
                <Route path="agricultural-tax-calculator" element={<Navigate to="/tools#agri-tax-tool" replace />} />
                <Route path="agricultural-income-tax-calculator" element={<Navigate to="/tools#agri-tax-tool" replace />} />
                <Route path="turnover-tax-calculator" element={<Navigate to="/tools#minimum-turnover-tax-tool" replace />} />
                <Route path="minimum-turnover-tax-calculator" element={<Navigate to="/tools#minimum-turnover-tax-tool" replace />} />
                <Route path="minimum-turnover-tax-bangladesh-2026-2027" element={<Navigate to="/article/minimum-turnover-tax-slabs-bangladesh-2026-2027" replace />} />
                <Route path="tax-rebate-ceiling-bangladesh-finance-act-2026" element={<Navigate to="/article/tax-rebate-ceiling-bangladesh-finance-act-2026" replace />} />
                <Route path="tax-rebate-ceiling-2026" element={<Navigate to="/article/tax-rebate-ceiling-bangladesh-finance-act-2026" replace />} />
                <Route path="investment-rebate-calculator" element={<Navigate to="/tools#investment-rebate-calculator-tool" replace />} />
                <Route path="investment-based-tax-rebate-calculator" element={<Navigate to="/tools#investment-rebate-calculator-tool" replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <BookmarkNotificationToast />
          </BrowserRouter>
          </CartProvider>
        </BookmarkProvider>
        </ShopAuthProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
