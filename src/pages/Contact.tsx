import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Calendar, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { redirectToAppointment, APPOINTMENT_BASE_URL } from '../utils/appointmentRedirect';

export function Contact() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Corporate Law & Registration');
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    redirectToAppointment({
      name: fullName,
      email,
      phone,
      service,
      notes: message,
      source: 'Contact Page Inquiry'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]} />
      
      <div className="text-center max-w-2xl mx-auto mb-10 mt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Get in Touch</h1>
        <p className="text-lg text-slate-600 mb-8">
          Need legal advice or tax consultation? Our team of certified lawyers and tax experts is available for scheduled consultations.
        </p>

        {/* Direct Appointment Portal Action */}
        <a
          href={APPOINTMENT_BASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Calendar className="w-5 h-5 text-emerald-100" />
          <span>Schedule Online Consultation via Appointment Portal</span>
          <ExternalLink className="w-4 h-4 text-emerald-200" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="bg-emerald-50 rounded-3xl p-8 md:p-10 border border-emerald-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Phone Inquiry</h3>
                  <p className="text-slate-600">+880 1234 567890 / +880 9876 543210</p>
                  <a
                    href={APPOINTMENT_BASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-1 underline"
                  >
                    <span>Request phone callback via appointment portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">Email & Legal Briefs</h3>
                  <p className="text-slate-600">consult@accounticca.com</p>
                  <a
                    href={APPOINTMENT_BASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-1 underline"
                  >
                    <span>Submit consultation brief online</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Office Location</h3>
                  <p className="text-slate-600 leading-relaxed">
                    E-Lawyers Bangladesh<br />
                    Level 5, Corporate Tower<br />
                    Gulshan Avenue, Dhaka-1212<br />
                    Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Appointment Platform</h3>
                  <p className="text-slate-600 mb-2">Book a confirmed slot directly with our lawyers and tax practitioners.</p>
                  <a
                    href={APPOINTMENT_BASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
                  >
                    <span>Go to appointment.accounticca.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Send Us an Inquiry</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Lawyer Transfer
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Fill out your inquiry details below. Upon submission, you will be automatically redirected to our central appointment scheduling portal (<span className="text-emerald-700 font-semibold">appointment.accounticca.com</span>) with your details preserved.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="+880 1712-345678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Service Required</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                >
                  <option value="Corporate Law & Registration">Corporate Law & Registration</option>
                  <option value="Income Tax & Return Filing">Income Tax & Return Filing</option>
                  <option value="VAT, Customs & VDS Compliance">VAT, Customs & VDS Compliance</option>
                  <option value="Business Documentation & Contracts">Business Documentation & Contracts</option>
                  <option value="Litigation & Legal Opinion">Litigation & Legal Opinion</option>
                  <option value="Other Legal Advisory">Other Legal Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Your Message / Legal Brief *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 resize-none"
                  placeholder="How can we help your business navigate legal or tax requirements?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-6 py-3.5 font-bold transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Continue to Appointment Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Direct booking without filling form: </span>
                <a
                  href={APPOINTMENT_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
                >
                  <span>Open appointment.accounticca.com directly</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
