import { Breadcrumbs } from '../components/Breadcrumbs';
import { FAQ } from '../components/FAQ';

export function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Legal & Tax FAQs' }]} />
      </div>
      <FAQ />
    </div>
  );
}
