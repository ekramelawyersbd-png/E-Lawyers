import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]} />
      
      <div className="text-center max-w-2xl mx-auto mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Get in Touch</h1>
        <p className="text-lg text-slate-600">
          Need legal advice or tax consultation? Our team of experts is here to help you navigate your business compliance needs.
        </p>
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
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                  <p className="text-slate-600">+880 1234 567890</p>
                  <p className="text-slate-600">+880 9876 543210</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">info@e-lawyers.com.bd</p>
                  <p className="text-slate-600">consult@e-lawyers.com.bd</p>
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
            </div>
          </div>
        </div>

        <div>
          <form className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send Us a Message</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="john@company.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Service Required</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600">
                  <option>Corporate Law & Registration</option>
                  <option>Income Tax & Return</option>
                  <option>VAT & Customs</option>
                  <option>Business Documentation</option>
                  <option>Other Legal Advice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button type="button" className="w-full bg-emerald-600 text-white rounded-xl px-6 py-4 font-bold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-md">
                <Send className="w-5 h-5" /> Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
