import re

content = open('src/pages/Contact.tsx').read()

# 1. Update imports
if 'useMemo' not in content:
    content = content.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect, useMemo } from 'react';"
    )

if 'AlertCircle,' not in content:
    content = content.replace(
        "  CheckCircle2, \n",
        "  CheckCircle2, \n  AlertCircle, \n"
    )

# 2. Update state and submit handler
old_submit = """  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };"""

new_validation_logic = """  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formAttempted, setFormAttempted] = useState(false);

  const getFieldError = (name: string, value: string): string | null => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required.';
        if (value.trim().length < 2) return 'First name must be at least 2 characters.';
        return null;
      case 'lastName':
        if (!value.trim()) return 'Last name is required.';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters.';
        return null;
      case 'email':
        if (!value.trim()) return 'Corporate email is required.';
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value.trim())) return 'Please enter a valid corporate email (e.g. name@company.com).';
        return null;
      case 'phone':
        if (!value.trim()) return 'Phone or WhatsApp number is required.';
        if (!/^[\\d\\+\\-\\s\\(\\)]{8,20}$/.test(value.trim())) return 'Please enter a valid phone number (at least 8 digits, e.g. +880 1712-345678).';
        return null;
      case 'companyName':
        if (value.trim() && value.trim().length < 2) return 'Company name must be at least 2 characters if provided.';
        return null;
      case 'message':
        if (!value.trim()) return 'Matter description or legal brief is required.';
        if (value.trim().length < 15) return `Brief description must be at least 15 characters (currently ${value.trim().length}/15).`;
        return null;
      default:
        return null;
    }
  };

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    const fnErr = getFieldError('firstName', firstName);
    if (fnErr) errs.firstName = fnErr;

    const lnErr = getFieldError('lastName', lastName);
    if (lnErr) errs.lastName = lnErr;

    const emailErr = getFieldError('email', email);
    if (emailErr) errs.email = emailErr;

    const phoneErr = getFieldError('phone', phone);
    if (phoneErr) errs.phone = phoneErr;

    const compErr = getFieldError('companyName', companyName);
    if (compErr) errs.companyName = compErr;

    const msgErr = getFieldError('message', message);
    if (msgErr) errs.message = msgErr;

    return errs;
  }, [firstName, lastName, email, phone, companyName, message]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAttempted(true);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      companyName: true,
      message: true,
    });

    if (Object.keys(errors).length === 0) {
      setSubmitted(true);
    }
  };"""

content = content.replace(old_submit, new_validation_logic)

# 3. Replace the form structure
old_form_body = """                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="given-name"
                        id="contact-first-name"
                        autoComplete="given-name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                        placeholder="e.g. Mahfuz"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="family-name"
                        id="contact-last-name"
                        autoComplete="family-name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                        placeholder="e.g. Rahman"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                        placeholder="name@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="tel"
                        id="contact-phone"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                        placeholder="+880 1712-XXXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company / Entity Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                        placeholder="Company or Venture Ltd."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Practice Service Area *
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                      >
                        <option value="Corporate Law & RJSC Compliance">Corporate Law &amp; RJSC Compliance (E-Lawyers)</option>
                        <option value="Corporate Tax, VAT & Statutory Audit">Corporate Tax, VAT &amp; Statutory Audit (Accounticca)</option>
                        <option value="Fractional CFO & Financial Modeling">Fractional CFO &amp; Financial Modeling (Accounticca)</option>
                        <option value="BIDA Approvals & Foreign Direct Investment">BIDA Approvals &amp; FDI Services (E-Lawyers)</option>
                        <option value="Commercial Contracts & IP Protection">Commercial Contracts &amp; IP Protection (E-Lawyers)</option>
                        <option value="Business Process Optimization & Automation">Business Process Optimization &amp; Automation (Accounticca)</option>
                        <option value="Integrated Joint Ecosystem Consultation">Integrated Joint Ecosystem Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Matter Description / Legal Brief *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 resize-none leading-relaxed"
                      placeholder="Outline your requirements (e.g. corporate structuring, tax notice defense, contract review, or audit planning)..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-6 py-4 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <span>Submit Inquiry to Advisory Desk</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>"""

new_form_body = """                <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-first-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          First Name *
                        </label>
                        {touched.firstName && !errors.firstName && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="given-name"
                        id="contact-first-name"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (!touched.firstName) setTouched(prev => ({ ...prev, firstName: true }));
                        }}
                        onBlur={() => handleBlur('firstName')}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-slate-900 ${
                          (touched.firstName || formAttempted) && errors.firstName
                            ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30 bg-rose-50/20'
                            : touched.firstName && !errors.firstName
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/10'
                            : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
                        }`}
                        placeholder="e.g. Mahfuz"
                      />
                      {(touched.firstName || formAttempted) && errors.firstName && (
                        <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.firstName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-last-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Last Name *
                        </label>
                        {touched.lastName && !errors.lastName && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="family-name"
                        id="contact-last-name"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (!touched.lastName) setTouched(prev => ({ ...prev, lastName: true }));
                        }}
                        onBlur={() => handleBlur('lastName')}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-slate-900 ${
                          (touched.lastName || formAttempted) && errors.lastName
                            ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30 bg-rose-50/20'
                            : touched.lastName && !errors.lastName
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/10'
                            : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
                        }`}
                        placeholder="e.g. Rahman"
                      />
                      {(touched.lastName || formAttempted) && errors.lastName && (
                        <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.lastName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Corporate Email *
                        </label>
                        {touched.email && !errors.email && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (!touched.email) setTouched(prev => ({ ...prev, email: true }));
                        }}
                        onBlur={() => handleBlur('email')}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-slate-900 ${
                          (touched.email || formAttempted) && errors.email
                            ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30 bg-rose-50/20'
                            : touched.email && !errors.email
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/10'
                            : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
                        }`}
                        placeholder="name@company.com"
                      />
                      {(touched.email || formAttempted) && errors.email && (
                        <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Phone / WhatsApp *
                        </label>
                        {touched.phone && !errors.phone && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="tel"
                        id="contact-phone"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (!touched.phone) setTouched(prev => ({ ...prev, phone: true }));
                        }}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-slate-900 font-mono ${
                          (touched.phone || formAttempted) && errors.phone
                            ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30 bg-rose-50/20'
                            : touched.phone && !errors.phone
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/10'
                            : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
                        }`}
                        placeholder="+880 1712-XXXXXX"
                      />
                      {(touched.phone || formAttempted) && errors.phone && (
                        <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-company-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Company / Entity Name
                        </label>
                        {companyName.trim() && touched.companyName && !errors.companyName && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        id="contact-company-name"
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          if (!touched.companyName) setTouched(prev => ({ ...prev, companyName: true }));
                        }}
                        onBlur={() => handleBlur('companyName')}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-slate-900 ${
                          (touched.companyName || formAttempted) && errors.companyName
                            ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30 bg-rose-50/20'
                            : companyName.trim() && touched.companyName && !errors.companyName
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/10'
                            : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
                        }`}
                        placeholder="Company or Venture Ltd."
                      />
                      {(touched.companyName || formAttempted) && errors.companyName && (
                        <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.companyName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Practice Service Area *
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                      >
                        <option value="Corporate Law & RJSC Compliance">Corporate Law &amp; RJSC Compliance (E-Lawyers)</option>
                        <option value="Corporate Tax, VAT & Statutory Audit">Corporate Tax, VAT &amp; Statutory Audit (Accounticca)</option>
                        <option value="Fractional CFO & Financial Modeling">Fractional CFO &amp; Financial Modeling (Accounticca)</option>
                        <option value="BIDA Approvals & Foreign Direct Investment">BIDA Approvals &amp; FDI Services (E-Lawyers)</option>
                        <option value="Commercial Contracts & IP Protection">Commercial Contracts &amp; IP Protection (E-Lawyers)</option>
                        <option value="Business Process Optimization & Automation">Business Process Optimization &amp; Automation (Accounticca)</option>
                        <option value="Integrated Joint Ecosystem Consultation">Integrated Joint Ecosystem Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Matter Description / Legal Brief *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold ${message.trim().length >= 15 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {message.trim().length}/15 chars min
                        </span>
                        {touched.message && !errors.message && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                          </span>
                        )}
                      </div>
                    </div>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (!touched.message) setTouched(prev => ({ ...prev, message: true }));
                      }}
                      onBlur={() => handleBlur('message')}
                      className={`w-full bg-slate-50 border rounded-xl p-3.5 text-sm focus:outline-none transition-all text-slate-900 resize-none leading-relaxed ${
                        (touched.message || formAttempted) && errors.message
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30 bg-rose-50/20'
                          : touched.message && !errors.message
                          ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/10'
                          : 'border-slate-200 focus:ring-2 focus:ring-emerald-500'
                      }`}
                      placeholder="Outline your requirements (e.g. corporate structuring, tax notice defense, contract review, or audit planning)..."
                    />
                    {(touched.message || formAttempted) && errors.message && (
                      <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Validation Summary Notification Bar */}
                  {(formAttempted || Object.keys(touched).length > 0) && (
                    <div className="animate-in fade-in duration-200">
                      {Object.keys(errors).length > 0 ? (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Please fix {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} with validation errors before submitting.</span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>All required inputs verified cleanly. Ready to submit to Senior Advisory Desk.</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-6 py-4 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <span>Submit Inquiry to Advisory Desk</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>"""

content = content.replace(old_form_body, new_form_body)

open('src/pages/Contact.tsx', 'w').write(content)
print('Successfully updated Contact.tsx!')
