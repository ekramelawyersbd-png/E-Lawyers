import { teamMembers } from '../data/teamData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Linkedin, Facebook, Youtube, MessageCircle, Mail, Phone } from 'lucide-react';

export function Team() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Our Team' }]} />
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Professional Team</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Meet the dedicated legal, tax, and corporate experts at E-Lawyers committed to delivering excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="p-6 flex flex-col items-center border-b border-slate-100 bg-slate-50">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-white">
                <img 
                  src={member.imgSrc} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=047857&color=fff&size=200`;
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center">{member.name}</h3>
              <p className="text-emerald-700 font-bold text-sm text-center mb-2">{member.position}</p>
              <div className="inline-block bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full text-center">
                {member.expertise}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-4 hover:line-clamp-none transition-all">
                {member.bio}
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-auto pt-4 border-t border-slate-100">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:bg-[#0077b5] hover:text-white rounded-full transition-colors" title="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:bg-[#1877f2] hover:text-white rounded-full transition-colors" title="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {member.youtube && (
                  <a href={member.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:bg-[#ff0000] hover:text-white rounded-full transition-colors" title="YouTube">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {member.whatsapp && (
                  <a href={member.whatsapp.replace('WhatsApp Chat: ', '')} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:bg-[#25d366] hover:text-white rounded-full transition-colors" title="WhatsApp">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="p-2 bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white rounded-full transition-colors" title="Email">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`} className="p-2 bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white rounded-full transition-colors" title="Phone">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
