import React, { useState } from 'react';
import { X, Upload, Send, CheckCircle2, FileText, Sparkles, AlertCircle } from 'lucide-react';

interface AccountantApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountantApplicationModal({ isOpen, onClose }: AccountantApplicationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State across 5 sections
  // Section 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [cvLink, setCvLink] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Section 2: Educational Qualification
  const [highestDegree, setHighestDegree] = useState('B.Com');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [cgpa, setCgpa] = useState('');

  // Section 3: Accounting Skills
  const [bookkeeping, setBookkeeping] = useState('Yes');
  const [generalLedger, setGeneralLedger] = useState('Yes');
  const [apAr, setApAr] = useState('Yes');
  const [bankRecon, setBankRecon] = useState('Yes');
  const [taxVat, setTaxVat] = useState('Yes');
  const [softwareList, setSoftwareList] = useState<string[]>(['QuickBooks']);
  const [excelSkill, setExcelSkill] = useState('Intermediate');

  // Section 4: Work Experience
  const [hasExperience, setHasExperience] = useState('Yes');
  const [totalExperience, setTotalExperience] = useState('1–2 Years');
  const [expDescription, setExpDescription] = useState('');

  // Section 5: Availability & Declaration
  const [fullTime, setFullTime] = useState('Yes');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [joinTime, setJoinTime] = useState('');
  const [suitability, setSuitability] = useState('');
  const [declaration, setDeclaration] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) {
      setErrorMessage('Please confirm the declaration before submitting your application.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
      setCvLink(file.name);
    }
  };

  return (
    <div className="min-h-[85vh] max-w-4xl mx-auto my-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Accounts Division
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Accountant Job Application Form
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>← Back to Job Details</span>
        </button>
      </div>

        {submitted ? (
          <div className="py-8 px-4 text-center space-y-6 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 rounded-3xl border border-emerald-200 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl shadow-md">
              🎉
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Application Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to <strong className="text-slate-900">E-Lawyers Legal &amp; Business Consultancy Firm</strong> for the Accountant position. Your application is securely registered.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 text-left space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span>🚀 Next Steps &amp; Computer-Based Test (CBT) Details</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span><strong>Profile Screening:</strong> Our HR &amp; Accounts Division review committee will evaluate your academic credentials and accounting skills within 2–3 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span><strong>CBT Invitation Email:</strong> Shortlisted candidates will receive a secure email invitation with login credentials for the <strong className="text-slate-900">Computer-Based Test (CBT)</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span><strong>CBT Assessment Scope:</strong> The test will cover practical bookkeeping scenarios, financial statement analysis, Bank Reconciliation, VAT calculation, and MS Excel problem-solving.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Close &amp; Return to Career Hub
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> E-Lawyers Accounts Division
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Accountant Job Application Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Please complete all required fields carefully. Shortlisted or eligible candidates will proceed to the Computer-Based Test (CBT).
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Personal Information */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>📌 Section 1: Personal Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="accountant-fullname"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Md. Tanvir Hossain"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      id="accountant-email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tanvir@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                    <input
                      type="tel"
                      name="tel"
                      id="accountant-phone"
                      autoComplete="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+880 1700 000000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Present Address *</label>
                  <input
                    type="text"
                    required
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    placeholder="House / Road / Area, Dhaka"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile (Optional)</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CV/Resume Link or File *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cvLink}
                        onChange={(e) => setCvLink(e.target.value)}
                        placeholder="Google Drive link or upload file"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                      <label className="absolute right-2.5 top-2.5 cursor-pointer text-slate-500 hover:text-emerald-700">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Educational Qualification */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>🎓 Section 2: Educational Qualification</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Highest Educational Qualification *</label>
                  <select
                    value={highestDegree}
                    onChange={(e) => setHighestDegree(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="B.Com">B.Com</option>
                    <option value="BBA (Accounting/Finance)">BBA (Accounting/Finance)</option>
                    <option value="M.Com">M.Com</option>
                    <option value="MBA (Accounting/Finance)">MBA (Accounting/Finance)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Name of University/Institution *</label>
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. University of Dhaka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Major/Department *</label>
                    <input
                      type="text"
                      required
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="Accounting / Finance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year of Graduation / Expected Year *</label>
                    <input
                      type="text"
                      required
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      placeholder="2025 / 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CGPA/Result *</label>
                    <input
                      type="text"
                      required
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 3.45 / 4.00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Accounting Skills */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>📊 Section 3: Accounting Skills</span>
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Practical knowledge of bookkeeping? *</label>
                    <select value={bookkeeping} onChange={(e) => setBookkeeping(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Familiar with General Ledger & Statements? *</label>
                    <select value={generalLedger} onChange={(e) => setGeneralLedger(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Understand AP and AR? *</label>
                    <select value={apAr} onChange={(e) => setApAr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Knowledge of Bank Reconciliation? *</label>
                    <select value={bankRecon} onChange={(e) => setBankRecon(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Knowledge of Tax and VAT? *</label>
                    <select value={taxVat} onChange={(e) => setTaxVat(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rate your Microsoft Excel skills. *</label>
                    <select value={excelSkill} onChange={(e) => setExcelSkill(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Which accounting software can you use?</label>
                  <div className="flex flex-wrap gap-3">
                    {['QuickBooks', 'Xero', 'Tally', 'Other', 'None'].map((soft) => (
                      <label key={soft} className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        <input
                          type="checkbox"
                          checked={softwareList.includes(soft)}
                          onChange={(e) => {
                            if (e.target.checked) setSoftwareList([...softwareList, soft]);
                            else setSoftwareList(softwareList.filter(s => s !== soft));
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{soft}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Work Experience */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>💼 Section 4: Work Experience</span>
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Previous accounting experience? *</label>
                    <select value={hasExperience} onChange={(e) => setHasExperience(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No — Fresh Graduate">No — Fresh Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Relevant Work Experience *</label>
                    <select value={totalExperience} onChange={(e) => setTotalExperience(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="No Experience">No Experience</option>
                      <option value="Less than 1 Year">Less than 1 Year</option>
                      <option value="1–2 Years">1–2 Years</option>
                      <option value="3+ Years">3+ Years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Briefly describe your accounting experience (if applicable).</label>
                  <textarea
                    rows={2}
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    placeholder="Mention past firms, responsibilities, or software used..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Availability & Declaration */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>⏱️ Section 5: Availability &amp; Declaration</span>
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full-time employment? *</label>
                    <select value={fullTime} onChange={(e) => setFullTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expected monthly salary? *</label>
                    <input
                      type="text"
                      required
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      placeholder="e.g. BDT 30,000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">When can you join? *</label>
                    <input
                      type="text"
                      required
                      value={joinTime}
                      onChange={(e) => setJoinTime(e.target.value)}
                      placeholder="Immediately / 1 Week"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Why do you think you are suitable for this Accountant position? *</label>
                  <textarea
                    rows={3}
                    required
                    value={suitability}
                    onChange={(e) => setSuitability(e.target.value)}
                    placeholder="Explain your motivation and qualifications..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white resize-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer bg-white p-3.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={declaration}
                      onChange={(e) => setDeclaration(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      I confirm that the information provided is true and accurate. *
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
    </div>
  );
}
