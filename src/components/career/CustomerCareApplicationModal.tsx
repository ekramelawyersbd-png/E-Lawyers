import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';

interface CustomerCareApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerCareApplicationModal({ isOpen, onClose }: CustomerCareApplicationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State across 6 sections
  // Section 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [age, setAge] = useState('');
  const [confirmPosition, setConfirmPosition] = useState('Yes');

  // Section 2: Educational Qualification
  const [highestDegree, setHighestDegree] = useState('HSC');
  const [institution, setInstitution] = useState('');
  const [departmentGroup, setDepartmentGroup] = useState('');
  const [passingYear, setPassingYear] = useState('');

  // Section 3: Communication Skills
  const [banglaSkill, setBanglaSkill] = useState('Excellent');
  const [englishSkill, setEnglishSkill] = useState('Good');
  const [customerHandling, setCustomerHandling] = useState('Excellent');
  const [activeListening, setActiveListening] = useState('Excellent');
  const [phoneComfort, setPhoneComfort] = useState('Yes');
  const [computerSkill, setComputerSkill] = useState('Good');

  // Section 4: Work Experience
  const [hasExperience, setHasExperience] = useState('No');
  const [prevCompany, setPrevCompany] = useState('');
  const [totalExp, setTotalExp] = useState('No Experience');
  const [complaintComfort, setComplaintComfort] = useState('Yes');

  // Section 5: Personal Attributes & Availability
  const [teamwork, setTeamwork] = useState('Yes');
  const [angryCustomerHandling, setAngryCustomerHandling] = useState('');
  const [suitability, setSuitability] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [joinTime, setJoinTime] = useState('Immediately');

  // Section 6: Declaration
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

  return (
    <div className="min-h-[85vh] max-w-4xl mx-auto my-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Customer Care Division
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Customer Care Executive (Female) Job Application Form
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
          <div className="py-8 px-6 text-center space-y-6 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 rounded-3xl border border-emerald-200 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl shadow-md">
              🎉
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-slate-900">Application Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                Thank you for applying for the position of <strong className="text-slate-900">Customer Care Executive (Female)</strong>.
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed bg-white p-4 rounded-2xl border border-emerald-100">
                Your application has been submitted successfully. If your qualifications and skills match our requirements, our recruitment team will contact you regarding the next stage of the recruitment process.
              </p>
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
                <Sparkles className="w-3 h-3" /> E-Lawyers Support &amp; Operations Team
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Customer Care Executive (Female) – Job Application Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Please complete all required fields accurately. Candidates who meet the requirements may be invited to the next stage of the recruitment process.
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
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                    <input
                      type="text"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+880 1700 000000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nusrat@example.com"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
                    <input
                      type="text"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Are you applying for the position of Female Customer Care Executive? *</label>
                    <select
                      value={confirmPosition}
                      onChange={(e) => setConfirmPosition(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Yes">Yes</option>
                    </select>
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
                    <option value="HSC">HSC</option>
                    <option value="Bachelor’s Degree">Bachelor’s Degree</option>
                    <option value="Master’s Degree">Master’s Degree</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name of Institution *</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Dhaka College / Eden Mohila College"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department / Group *</label>
                    <input
                      type="text"
                      required
                      value={departmentGroup}
                      onChange={(e) => setDepartmentGroup(e.target.value)}
                      placeholder="Science / Arts / BBA / English"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Passing Year *</label>
                    <input
                      type="text"
                      required
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                      placeholder="2024 / 2025"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Communication Skills */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>🗣️ Section 3: Communication Skills</span>
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bangla communication skills? *</label>
                    <select value={banglaSkill} onChange={(e) => setBanglaSkill(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">English communication skills? *</label>
                    <select value={englishSkill} onChange={(e) => setEnglishSkill(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Customer handling skills? *</label>
                    <select value={customerHandling} onChange={(e) => setCustomerHandling(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Beginner">Beginner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Active listening skills? *</label>
                    <select value={activeListening} onChange={(e) => setActiveListening(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Comfortable communicating over phone? *</label>
                    <select value={phoneComfort} onChange={(e) => setPhoneComfort(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Basic computer skills? *</label>
                    <select value={computerSkill} onChange={(e) => setComputerSkill(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Beginner">Beginner</option>
                    </select>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Previous Call Center / Customer Care experience? *</label>
                    <select value={hasExperience} onChange={(e) => setHasExperience(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Relevant Work Experience *</label>
                    <select value={totalExp} onChange={(e) => setTotalExp(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="No Experience">No Experience</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1–2 years">1–2 years</option>
                      <option value="More than 2 years">More than 2 years</option>
                    </select>
                  </div>
                </div>

                {hasExperience === 'Yes' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Previous company name and designation *</label>
                    <input
                      type="text"
                      required
                      value={prevCompany}
                      onChange={(e) => setPrevCompany(e.target.value)}
                      placeholder="e.g. Grameenphone / Robi Customer Care Agent"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Are you comfortable handling customer complaints and inquiries? *</label>
                  <select value={complaintComfort} onChange={(e) => setComplaintComfort(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Personal Attributes & Availability */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>⏱️ Section 5: Personal Attributes &amp; Availability</span>
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Comfortable working in a team? *</label>
                    <select value={teamwork} onChange={(e) => setTeamwork(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">How soon can you join? *</label>
                    <select value={joinTime} onChange={(e) => setJoinTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Immediately">Immediately</option>
                      <option value="Within 7 days">Within 7 days</option>
                      <option value="Within 15 days">Within 15 days</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">How would you handle an angry customer? *</label>
                  <textarea
                    rows={2}
                    required
                    value={angryCustomerHandling}
                    onChange={(e) => setAngryCustomerHandling(e.target.value)}
                    placeholder="Describe your patience and polite de-escalation approach..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Why do you think you are suitable for this position? *</label>
                  <textarea
                    rows={2}
                    required
                    value={suitability}
                    onChange={(e) => setSuitability(e.target.value)}
                    placeholder="Highlight your communication strengths and positive attitude..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">What is your expected monthly salary? *</label>
                  <input
                    type="text"
                    required
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g. BDT 20,000 - 25,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Declaration */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span>🛡️ Section 6: Declaration</span>
              </h3>
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer bg-white p-3.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    required
                    checked={declaration}
                    onChange={(e) => setDeclaration(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    I confirm that all information provided in this application is true and accurate. * (Yes, I confirm.)
                  </span>
                </label>
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
