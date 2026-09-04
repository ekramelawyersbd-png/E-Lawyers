import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Briefcase, FileText, Gavel, FileCheck, MonitorPlay, Award } from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { EnrollmentModal } from '../components/training/EnrollmentModal';
import { CertificateModal } from '../components/training/CertificateModal';
import { TrainingFAQ } from '../components/training/TrainingFAQ';
import { CareerPathways } from '../components/training/CareerPathways';

export function TrainingHub() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{id: string, title: string, description: string, price: string} | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certCourse, setCertCourse] = useState<{title: string, id: string} | null>(null);

  const trainingIds = ['400', '401', '402', '403', '404', '405', '406'];
  const trainingArticles = mockArticles.filter(a => trainingIds.includes(a.id));

  const icons: Record<string, React.ReactNode> = {
    '400': <FileCheck className="w-8 h-8" />,     // VAT
    '401': <FileText className="w-8 h-8" />,      // Income Tax
    '402': <Briefcase className="w-8 h-8" />,     // RJSC
    '403': <Gavel className="w-8 h-8" />,         // Bar Council
    '404': <BookOpen className="w-8 h-8" />,      // High Court
    '405': <GraduationCap className="w-8 h-8" />, // Practical Accounting
    '406': <MonitorPlay className="w-8 h-8" />,   // MS Office
  };

  const colors: Record<string, string> = {
    '400': 'bg-blue-100 text-blue-700 hover:border-blue-200',
    '401': 'bg-emerald-100 text-emerald-700 hover:border-emerald-200',
    '402': 'bg-purple-100 text-purple-700 hover:border-purple-200',
    '403': 'bg-amber-100 text-amber-700 hover:border-amber-200',
    '404': 'bg-rose-100 text-rose-700 hover:border-rose-200',
    '405': 'bg-cyan-100 text-cyan-700 hover:border-cyan-200',
    '406': 'bg-indigo-100 text-indigo-700 hover:border-indigo-200',
  };

  const prices: Record<string, string> = {
    '400': 'BDT 50,000 - 150,000',
    '401': 'BDT 10,000 - 20,000',
    '402': 'BDT 500 - 3,000',
    '403': 'BDT 10,000 - 20,000',
    '404': 'BDT 5,000 - 10,000',
    '405': 'BDT 500 - 5,000',
    '406': 'Free - BDT 5,000',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Training Hub</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Explore our comprehensive training programs designed to enhance your professional skills in taxation, legal compliance, and accounting.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {trainingArticles.map((article) => {
          const colorClass = colors[article.id] || 'bg-slate-100 text-slate-700 hover:border-slate-200';
          const icon = icons[article.id] || <BookOpen className="w-8 h-8" />;
          const price = prices[article.id] || 'Price upon request';
          
          return (
            <div 
              key={article.id}
              className={`group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 ${colorClass.split(' ').find(c => c.startsWith('hover:'))}`}
            >
              <Link to={`/article/${article.id}`} className="contents">
                <div className={`p-5 rounded-3xl shrink-0 ${colorClass.split(' ').slice(0, 2).join(' ')}`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
              <div className="w-full mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSelectedCourse({ id: article.id, title: article.title, description: article.excerpt, price });
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium transition-colors text-sm"
                >
                  Enroll Now
                </button>
                <button
                  onClick={() => {
                    setCertCourse({ title: article.title, id: article.id });
                    setIsCertModalOpen(true);
                  }}
                  className="w-full py-2 px-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl font-semibold transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  Get Certificate (PDF)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-8 border-b border-slate-200 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">Comparison of All Training Programs</h2>
          <p className="text-slate-500 mt-2">A quick overview of durations, levels, and prerequisites.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-slate-200 font-medium">Training</th>
                <th className="px-6 py-4 border-b border-slate-200 font-medium">Duration</th>
                <th className="px-6 py-4 border-b border-slate-200 font-medium">Level</th>
                <th className="px-6 py-4 border-b border-slate-200 font-medium">Prerequisites</th>
                <th className="px-6 py-4 border-b border-slate-200 font-medium">Certification</th>
                <th className="px-6 py-4 border-b border-slate-200 font-medium">Cost Range (BDT)</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">VAT Training</td>
                <td className="px-6 py-4">~360 hours</td>
                <td className="px-6 py-4">Advanced professional</td>
                <td className="px-6 py-4">Bachelor’s in accounting/law, basic tax knowledge</td>
                <td className="px-6 py-4">Course completion certificate</td>
                <td className="px-6 py-4">50,000–150,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">Income Tax Training</td>
                <td className="px-6 py-4">~30 hours (5 days)</td>
                <td className="px-6 py-4">Intermediate/pro</td>
                <td className="px-6 py-4">Bachelor’s or commerce background</td>
                <td className="px-6 py-4">Course completion certificate</td>
                <td className="px-6 py-4">10,000–20,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">RJSC Training</td>
                <td className="px-6 py-4">~6 hours (1–2 days)</td>
                <td className="px-6 py-4">Intermediate</td>
                <td className="px-6 py-4">Basic legal/business awareness</td>
                <td className="px-6 py-4">Course certificate (non-statutory)</td>
                <td className="px-6 py-4">500–3,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">Bar Council Prep</td>
                <td className="px-6 py-4">~50–100 hrs</td>
                <td className="px-6 py-4">Professional (Law grads)</td>
                <td className="px-6 py-4">LLB degree</td>
                <td className="px-6 py-4">Enrollment certificate</td>
                <td className="px-6 py-4">10,000–20,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">High Court Prep</td>
                <td className="px-6 py-4">Variable (short courses)</td>
                <td className="px-6 py-4">Advanced (Seasoned lawyers)</td>
                <td className="px-6 py-4">Advocate license (2+ yrs)</td>
                <td className="px-6 py-4">Practice license (on approval)</td>
                <td className="px-6 py-4">5,000–10,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">Practical Accounting</td>
                <td className="px-6 py-4">4–20 hours</td>
                <td className="px-6 py-4">Beginner/Intermediate</td>
                <td className="px-6 py-4">None (basic numeracy)</td>
                <td className="px-6 py-4">Course completion certificate</td>
                <td className="px-6 py-4">500–5,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">MS Office Training</td>
                <td className="px-6 py-4">~48 hours</td>
                <td className="px-6 py-4">Beginner/Intermediate</td>
                <td className="px-6 py-4">None (12th grade)</td>
                <td className="px-6 py-4">Course completion certificate</td>
                <td className="px-6 py-4">0–5,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          *Assumptions: Content is focused on Bangladesh; courses are in English. Costs are approximate ranges in BDT.
        </div>
      </div>
      
      <CareerPathways />

      <TrainingFAQ />

      {selectedCourse && (
        <EnrollmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedCourse.title}
          description={selectedCourse.description}
          price={selectedCourse.price}
        />
      )}

      {certCourse && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          moduleTitle={certCourse.title}
          courseId={certCourse.id}
        />
      )}
    </div>
  );
}
