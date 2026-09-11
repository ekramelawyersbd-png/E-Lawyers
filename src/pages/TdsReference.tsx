import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Percent, FileText, CheckCircle2, ArrowRightLeft, Globe } from 'lucide-react';

type SectionType = 'All' | 'Section 89 (Supply)' | 'Section 90 (Services)' | 'Section 119 (Non-Resident)';

interface TdsEntry {
  id: string;
  category: string;
  subCategory: string;
  section: string;
  rate: string;
  notes?: string;
}

interface TreatyEntry {
  country: string;
  dividend: string;
  interest: string;
  royalty: string;
  technical: string;
}

const treatyData: TreatyEntry[] = [
  { country: 'United Kingdom', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'United States', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'Singapore', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'India', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'Malaysia', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'Canada', dividend: '15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'Japan', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'United Arab Emirates', dividend: '5% / 10%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'China', dividend: '10%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'Netherlands', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'Germany', dividend: '15%', interest: '10%', royalty: '10%', technical: '10%' },
  { country: 'South Korea', dividend: '10% / 15%', interest: '10%', royalty: '10%', technical: '10%' }
];

const tdsData: TdsEntry[] = [
  // Section 89
  { id: '89-1', category: 'General Supply & Manufacturing Contracts', subCategory: 'Processing, Civil Works, Construction, Engineering', section: 'Section 89 (Supply)', rate: '5%' },
  { id: '89-2', category: 'Industrial Raw Materials & Packaging', subCategory: 'Supplies', section: 'Section 89 (Supply)', rate: '3%' },
  { id: '89-3', category: 'Recycled Goods', subCategory: 'Recycling Inputs', section: 'Section 89 (Supply)', rate: '1%' },
  { id: '89-4', category: 'Petroleum & Energy Supply', subCategory: 'Refinery oil supplies', section: 'Section 89 (Supply)', rate: '1%' },
  { id: '89-5', category: 'Petroleum & Energy Supply', subCategory: 'Extra High Voltage Power Cables 33kV–500kV, VCV', section: 'Section 89 (Supply)', rate: '3%' },
  { id: '89-6', category: 'Tobacco Raw Materials', subCategory: 'Supplies', section: 'Section 89 (Supply)', rate: '10%' },
  { id: '89-7', category: 'Unlisted Product Supplies', subCategory: 'General supplies not covered elsewhere', section: 'Section 89 (Supply)', rate: '5%' },
  
  // Section 90
  { id: '90-1', category: 'Advisory & Consultancy Fees', subCategory: 'Non-individual corporate entity', section: 'Section 90 (Services)', rate: '7.5%' },
  { id: '90-2', category: 'Advisory & Consultancy Fees', subCategory: 'Individual service provider', section: 'Section 90 (Services)', rate: '15%' },
  { id: '90-3', category: 'Technical Services & Know-How', subCategory: 'Non-individual entity', section: 'Section 90 (Services)', rate: '10%' },
  { id: '90-4', category: 'Technical Services & Know-How', subCategory: 'Individual service provider', section: 'Section 90 (Services)', rate: '15%' },
  { id: '90-5', category: 'Logistics, Transport & Rental Services', subCategory: 'Transport, vehicle rental, general repair', section: 'Section 90 (Services)', rate: '2%' },
  { id: '90-6', category: 'Catering, Events & Operational Services', subCategory: 'Catering, PR, training workshops, courier', section: 'Section 90 (Services)', rate: '2%' },
  { id: '90-7', category: 'Manpower Supply & Security Agencies', subCategory: 'On total bill amount', section: 'Section 90 (Services)', rate: '1%' },
  { id: '90-8', category: 'Manpower Supply & Security Agencies', subCategory: 'On commission amount only', section: 'Section 90 (Services)', rate: '10%' },
  { id: '90-9', category: 'Equipment Repair & Dockyard Services', subCategory: 'Motor garage, workshop repair', section: 'Section 90 (Services)', rate: '5%' },
  { id: '90-10', category: 'Telecom & Financial Services', subCategory: 'Mobile network operator, credit rating', section: 'Section 90 (Services)', rate: '10%' },
  { id: '90-11', category: 'Honoraria & Meeting Fees', subCategory: 'Meeting fees, Training fees, Honorarium', section: 'Section 90 (Services)', rate: '20%' },

  // Section 119
  { id: '119-1', category: 'Royalties & Intangible Property Payments', subCategory: 'Royalty fees, License fees, IP rights', section: 'Section 119 (Non-Resident)', rate: '20%' },
  { id: '119-2', category: 'Technical Services & Assistance', subCategory: 'Non-individual corporate entity', section: 'Section 119 (Non-Resident)', rate: '10%' },
  { id: '119-3', category: 'Technical Services & Assistance', subCategory: 'Individual person', section: 'Section 119 (Non-Resident)', rate: '20%' },
  { id: '119-4', category: 'Professional Services', subCategory: 'Foreign company/entity', section: 'Section 119 (Non-Resident)', rate: '10%' },
  { id: '119-5', category: 'Professional Services', subCategory: 'Individual professional', section: 'Section 119 (Non-Resident)', rate: '20%' },
  { id: '119-6', category: 'Legal Service Fees', subCategory: 'Foreign lawyers or legal service providers', section: 'Section 119 (Non-Resident)', rate: '20%' },
  { id: '119-7', category: 'Bandwidth Payments', subCategory: 'International internet bandwidth', section: 'Section 119 (Non-Resident)', rate: '10%' },
  { id: '119-8', category: 'Digital Marketing & Advertisement Creation', subCategory: 'Online marketing, ad production', section: 'Section 119 (Non-Resident)', rate: '10%' },
  { id: '119-9', category: 'Advertisement Broadcasting', subCategory: 'Television advertising, media broadcasting', section: 'Section 119 (Non-Resident)', rate: '15%' },
  { id: '119-10', category: 'Satellite, Airtime, Frequency & Channel Rental', subCategory: 'Satellite capacity, channel leasing', section: 'Section 119 (Non-Resident)', rate: '20%' },
  { id: '119-11', category: 'Cross-Border Contractor Contracts', subCategory: 'Manufacturing, processing, civil works', section: 'Section 119 (Non-Resident)', rate: '6%' },
  { id: '119-12', category: 'Foreign Goods Supply Contracts', subCategory: 'Cross-border supply bills', section: 'Section 119 (Non-Resident)', rate: '6%' },
  { id: '119-13', category: 'Equipment & Machinery Rental', subCategory: 'Equipment rental, machinery leasing', section: 'Section 119 (Non-Resident)', rate: '7.5%' },
  { id: '119-14', category: 'Interest Payments', subCategory: 'Foreign loan interest, deposit interest', section: 'Section 119 (Non-Resident)', rate: '10%' },
  { id: '119-15', category: 'Capital Gains', subCategory: 'Sale of shares, disposal of investment assets', section: 'Section 119 (Non-Resident)', rate: '15%' },
  { id: '119-16', category: 'Dividend Payments', subCategory: 'Company, Fund or Trust', section: 'Section 119 (Non-Resident)', rate: '20%' },
  { id: '119-17', category: 'Dividend Payments', subCategory: 'Individual Person', section: 'Section 119 (Non-Resident)', rate: '25%' },
  { id: '119-18', category: 'Other Unspecified Services', subCategory: 'General provision for foreign services', section: 'Section 119 (Non-Resident)', rate: '20%' },
];

export function TdsReference() {
  const [viewMode, setViewMode] = useState<'database' | 'comparator' | 'treaty'>('database');
  const [searchQuery, setSearchQuery] = useState('');
  const [treatySearch, setTreatySearch] = useState('');
  const [activeSection, setActiveSection] = useState<SectionType>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Comparator State
  const [compareId1, setCompareId1] = useState<string>('89-1');
  const [compareId2, setCompareId2] = useState<string>('119-2');

  const compareItem1 = tdsData.find(item => item.id === compareId1);
  const compareItem2 = tdsData.find(item => item.id === compareId2);

  // Extract unique categories for the dropdown, potentially filtered by the active Section
  const availableCategories = useMemo(() => {
    let relevantData = tdsData;
    if (activeSection !== 'All') {
      relevantData = tdsData.filter(item => item.section === activeSection);
    }
    const uniqueCategories = Array.from(new Set(relevantData.map(item => item.category)));
    return ['All', ...uniqueCategories.sort()];
  }, [activeSection]);

  // Reset category if it's no longer valid for the selected section
  useMemo(() => {
    if (activeCategory !== 'All' && !availableCategories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [availableCategories, activeCategory]);

  const filteredData = useMemo(() => {
    return tdsData.filter((item) => {
      const matchesSearch = 
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rate.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSection = activeSection === 'All' || item.section === activeSection;
      
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

      return matchesSearch && matchesSection && matchesCategory;
    });
  }, [searchQuery, activeSection, activeCategory]);

  const filteredTreaties = useMemo(() => {
    if (!treatySearch) return [];
    return treatyData.filter(t => t.country.toLowerCase().includes(treatySearch.toLowerCase()));
  }, [treatySearch]);

  const sections: SectionType[] = ['All', 'Section 89 (Supply)', 'Section 90 (Services)', 'Section 119 (Non-Resident)'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          TDS Reference <span className="text-emerald-600">Guide</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          A comprehensive database of Tax Deducted at Source (TDS) rates covering supply contracts, corporate services, and non-resident remittances under the Income Tax Act 2023.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100 p-1.5 rounded-xl flex-wrap justify-center gap-1">
          <button
            onClick={() => setViewMode('database')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              viewMode === 'database' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Database View
          </button>
          <button
            onClick={() => setViewMode('comparator')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              viewMode === 'comparator' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Comparator Mode
          </button>
          <button
            onClick={() => setViewMode('treaty')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              viewMode === 'treaty' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            DTAA Treaty Finder
          </button>
        </div>
      </div>

      {viewMode === 'database' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          
          <div className="flex flex-col sm:flex-row flex-1 gap-4 w-full md:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search rates or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow text-slate-900"
              />
            </div>
            
            <div className="relative flex-1 sm:max-w-[240px]">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow text-slate-900 appearance-none font-medium truncate"
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Service Types' : cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400 mr-2 hidden sm:block" />
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="py-4 px-6 font-semibold text-sm">Category & Description</th>
                <th className="py-4 px-6 font-semibold text-sm w-48">Tax Section</th>
                <th className="py-4 px-6 font-semibold text-sm text-right w-32">TDS Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 mb-1">{item.category}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {item.subCategory}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        {item.section}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                        {item.rate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-500">
                    No matching TDS rates found for "{searchQuery}". Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <BookOpen className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            <strong>Note:</strong> These rates are applicable according to the Income Tax Act 2023. Double Taxation Avoidance Agreements (DTAA) may provide reduced rates for Section 119 payments if the payee submits a valid Tax Residency Certificate (TRC).
          </p>
        </div>
      </div>
      )}

      {viewMode === 'comparator' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200/60 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Side-by-Side TDS Rate Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-8 relative">
            
            {/* Visual Divider on Desktop */}
            <div className="hidden md:block absolute left-1/2 top-12 bottom-0 w-px bg-slate-200 -translate-x-1/2">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 text-slate-400 border border-slate-200 rounded-full">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>

            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Item 1</label>
                <div className="relative">
                  <select 
                    value={compareId1}
                    onChange={(e) => setCompareId1(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-medium text-slate-900"
                  >
                    {sections.filter(s => s !== 'All').map(section => (
                      <optgroup key={section} label={section}>
                        {tdsData.filter(d => d.section === section).map(item => (
                          <option key={item.id} value={item.id}>
                            {item.category} - {item.subCategory}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {compareItem1 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-800 uppercase bg-emerald-100 rounded-full">
                    {compareItem1.section}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{compareItem1.category}</h3>
                  <p className="text-slate-600 mb-6">{compareItem1.subCategory}</p>
                  
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Applicable Rate</span>
                    <span className="text-3xl font-black text-emerald-600">{compareItem1.rate}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Item 2</label>
                <div className="relative">
                  <select 
                    value={compareId2}
                    onChange={(e) => setCompareId2(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-medium text-slate-900"
                  >
                    {sections.filter(s => s !== 'All').map(section => (
                      <optgroup key={section} label={section}>
                        {tdsData.filter(d => d.section === section).map(item => (
                          <option key={item.id} value={item.id}>
                            {item.category} - {item.subCategory}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {compareItem2 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-slate-700 uppercase bg-slate-200 rounded-full">
                    {compareItem2.section}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{compareItem2.category}</h3>
                  <p className="text-slate-600 mb-6">{compareItem2.subCategory}</p>
                  
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Applicable Rate</span>
                    <span className="text-3xl font-black text-slate-700">{compareItem2.rate}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {viewMode === 'treaty' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 mb-10">
          <div className="flex flex-col md:items-center justify-between gap-6 mb-8">
            <div className="relative w-full max-w-xl mx-auto">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search country name (e.g. United Kingdom, Singapore)..."
                value={treatySearch}
                onChange={(e) => setTreatySearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow text-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="py-4 px-6 font-semibold text-sm">Partner Country</th>
                  <th className="py-4 px-6 font-semibold text-sm">Dividend</th>
                  <th className="py-4 px-6 font-semibold text-sm">Interest</th>
                  <th className="py-4 px-6 font-semibold text-sm">Royalty</th>
                  <th className="py-4 px-6 font-semibold text-sm">Technical Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTreaties.length > 0 ? (
                  filteredTreaties.map((treaty, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {treaty.country}
                      </td>
                      <td className="py-4 px-6 font-medium text-emerald-700">{treaty.dividend}</td>
                      <td className="py-4 px-6 font-medium text-slate-700">{treaty.interest}</td>
                      <td className="py-4 px-6 font-medium text-slate-700">{treaty.royalty}</td>
                      <td className="py-4 px-6 font-medium text-slate-700">{treaty.technical}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      {treatySearch 
                        ? `No Double Taxation Avoidance Agreement (DTAA) records found for "${treatySearch}".`
                        : "Type a country name in the search bar above to view reduced DTAA rates."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <BookOpen className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              <strong>Note:</strong> To avail these reduced rates under Section 119, the non-resident payee must provide a valid Tax Residency Certificate (TRC) from their home country's tax authority.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
