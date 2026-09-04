import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

const glossaryTerms = [
  { term: "AIT (Advance Income Tax)", definition: "Tax collected in advance by the government at the time of import, supply of goods, or execution of contracts." },
  { term: "Assessment Year", definition: "The period of twelve months commencing on the 1st day of July every year in which income is assessed." },
  { term: "BIN (Business Identification Number)", definition: "A unique 13-digit number issued by NBR to a registered business for VAT purposes." },
  { term: "Income Year", definition: "The financial year immediately preceding the assessment year during which the income is earned." },
  { term: "Mushak", definition: "The Bengali term for Value Added Tax (VAT) forms and challans used in Bangladesh." },
  { term: "NBR (National Board of Revenue)", definition: "The central authority for tax administration in Bangladesh." },
  { term: "Return", definition: "A formal declaration of income, sales, or other details by a taxpayer to the tax authorities." },
  { term: "SD (Supplementary Duty)", definition: "An additional duty imposed on luxury goods, non-essential items, or socially undesirable goods." },
  { term: "TDS (Tax Deduction at Source)", definition: "A mechanism where tax is deducted by the payer at the time of making payments like salary, rent, or commission." },
  { term: "TIN (Taxpayer Identification Number)", definition: "A unique 12-digit number used to identify individual and corporate taxpayers in Bangladesh." },
  { term: "VAT (Value Added Tax)", definition: "An indirect tax levied on the value added to goods and services at each stage of production or distribution." },
  { term: "VDS (VAT Deduction at Source)", definition: "The deduction of VAT by a withholding entity at the time of making payment to a supplier." }
];

export function Glossary() {
  const [query, setQuery] = useState("");

  const filteredTerms = glossaryTerms.filter(item => 
    item.term.toLowerCase().includes(query.toLowerCase()) || 
    item.definition.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Glossary' }]} />
      
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Accounting & Legal Glossary</h1>
        </div>
        <p className="text-slate-600 text-lg mb-8 max-w-2xl">
          Quick reference for common Bangladesh tax, VAT, and legal terminology.
        </p>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search terms or definitions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-slate-900 text-lg"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">{item.term}</h3>
              <p className="text-slate-700 leading-relaxed">{item.definition}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-lg font-bold">No terms found for "{query}"</p>
            <p className="text-slate-400 mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
