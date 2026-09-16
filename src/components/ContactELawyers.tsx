import React from 'react';

export function ContactELawyers() {
  return (
    <section className="py-[40px] sm:py-[70px] px-[15px] sm:px-[20px] bg-gradient-to-br from-[#f8fafc] to-[#ffffff] font-sans text-[#333] my-12 rounded-3xl border border-slate-200">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-[45px]">
          <h2 className="text-[28px] sm:text-[38px] font-bold text-[#12345b] mb-[15px]">
            Contact <span className="text-[#b08b35]">E-Lawyers</span>
          </h2>
          <p className="max-w-[750px] mx-auto text-[17px] leading-[1.8] text-[#555]">
            Get professional legal assistance and expert consultation from our experienced
            legal team. We are committed to providing reliable, accessible, and convenient
            legal solutions.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
          
          {/* Card 1 */}
          <div className="bg-white p-[30px_25px] rounded-[18px] shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-[#eee] transition-all duration-300 hover:-translate-y-2 flex gap-5 items-start">
            <div className="w-[55px] h-[55px] shrink-0 flex items-center justify-center bg-[#12345b] text-white rounded-full text-[25px]">
              📍
            </div>
            <div>
              <h4 className="text-[20px] font-bold text-[#12345b] mb-[8px]">Office Address</h4>
              <p className="text-[15px] leading-[1.7] text-[#555]">
                G-5, BTI Centara Grand,<br />
                144-144/1 Green Road,<br />
                Panthapath, Dhaka-1205
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-[30px_25px] rounded-[18px] shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-[#eee] transition-all duration-300 hover:-translate-y-2 flex gap-5 items-start">
            <div className="w-[55px] h-[55px] shrink-0 flex items-center justify-center bg-[#12345b] text-white rounded-full text-[25px]">
              ☎
            </div>
            <div>
              <h4 className="text-[20px] font-bold text-[#12345b] mb-[8px]">Phone</h4>
              <p className="text-[15px] leading-[1.7] text-[#555]">
                <a href="tel:+8801335230170" className="text-[#b08b35] font-semibold hover:underline">
                  +88 01335 230170-81
                </a>
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-[30px_25px] rounded-[18px] shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-[#eee] transition-all duration-300 hover:-translate-y-2 flex gap-5 items-start">
            <div className="w-[55px] h-[55px] shrink-0 flex items-center justify-center bg-[#12345b] text-white rounded-full text-[25px]">
              ✉
            </div>
            <div>
              <h4 className="text-[20px] font-bold text-[#12345b] mb-[8px]">Email</h4>
              <p className="text-[15px] leading-[1.7] text-[#555]">
                <a href="mailto:info@elawyersbd.com" className="text-[#b08b35] font-semibold hover:underline">
                  info@elawyersbd.com
                </a>
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-[30px_25px] rounded-[18px] shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-[#eee] transition-all duration-300 hover:-translate-y-2 flex gap-5 items-start">
            <div className="w-[55px] h-[55px] shrink-0 flex items-center justify-center bg-[#12345b] text-white rounded-full text-[25px]">
              ⚖
            </div>
            <div className="flex flex-col h-full">
              <h4 className="text-[20px] font-bold text-[#12345b] mb-[8px]">Book Appointment</h4>
              <p className="text-[15px] leading-[1.7] text-[#555] mb-[15px] flex-grow">
                Schedule a consultation with our legal experts.
              </p>
              <a 
                href="https://appointment.accounticca.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-auto bg-[#12345b] text-white px-[28px] py-[10px] rounded-[30px] font-medium hover:bg-[#b08b35] transition-colors duration-300 self-start text-sm"
              >
                Book Now
              </a>
            </div>
          </div>

        </div>

        {/* Social Section */}
        <div className="text-center mt-[70px]">
          <h2 className="text-[28px] sm:text-[38px] font-bold text-[#12345b] mb-[15px]">
            Follow E-Lawyers
          </h2>
          <p className="max-w-[750px] mx-auto text-[17px] leading-[1.8] text-[#555]">
            Stay updated with legal insights, expert advice, service updates, and important
            announcements through our official social media channels.
          </p>

          <div className="flex justify-center flex-wrap gap-[15px] my-[30px]">
            {[
              { name: 'X', url: 'https://x.com/elawyerssbd' },
              { name: 'Facebook', url: 'https://www.facebook.com/elawyerssbd' },
              { name: 'LinkedIn', url: 'https://linkedin.com/company/elawyersbd' },
              { name: 'Instagram', url: 'https://www.instagram.com/elawyerssbd' },
              { name: 'YouTube', url: 'https://www.youtube.com/@elawyerssbd' },
            ].map(social => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#12345b] text-white px-[25px] py-[12px] rounded-[30px] decoration-none transition-all duration-300 hover:bg-[#b08b35] hover:-translate-y-[3px]"
              >
                {social.name}
              </a>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-[45px] p-[30px_20px] sm:p-[40px] rounded-[20px] bg-[#12345b] text-white text-center">
            <h3 className="text-[28px] font-bold mb-[10px]">Need Legal Support?</h3>
            <p className="mb-[25px] text-[#e2e8f0]">
              Connect with E-Lawyers today and get trusted legal guidance from professionals.
            </p>
            <a 
              href="https://appointment.accounticca.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#b08b35] text-white px-[35px] py-[14px] rounded-[30px] font-semibold hover:bg-[#9a782a] transition-colors"
            >
              Schedule Consultation
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
