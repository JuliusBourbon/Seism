import React, { useState } from 'react';

// Reusable Icon Component for cleaner code
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {path}
  </svg>
);

const ICONS = {
  phone: <Icon path={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>} />,
  shield: <Icon path={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>} />,
  info: <Icon path={<div><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></div>} />,
  flame: <Icon path={<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>} />,
  activity: <Icon path={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>} />,
  check: <Icon path={<polyline points="20 6 9 17 4 12"/>} className="w-4 h-4" />,
  clock: <Icon path={<div><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></div>} className="w-4 h-4"/>
};

export default function Help({ onClose }) {
  const [activeTab, setActiveTab] = useState('emergency');

  const emergencyContacts = [
    { name: 'Panggilan Darurat', number: '112', color: 'border-red-200 text-red-700 bg-red-50' },
    { name: 'Ambulans (PSC)', number: '118', color: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
    { name: 'Pemadam Kebakaran', number: '113', color: 'border-orange-200 text-orange-700 bg-orange-50' },
    { name: 'Kepolisian', number: '110', color: 'border-blue-200 text-blue-700 bg-blue-50' },
    { name: 'Basarnas (SAR)', number: '115', color: 'border-cyan-200 text-cyan-700 bg-cyan-50' },
    { name: 'Gangguan Listrik', number: '123', color: 'border-yellow-200 text-yellow-700 bg-yellow-50' },
  ];

  return (
    <div className="bg-white rounded-3xl w-[95%] max-w-4xl h-[85%] relative pointer-events-auto shadow-2xl flex flex-col overflow-hidden border border-gray-100">
      
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pusat Bantuan</h1>
          <p className="text-sm text-slate-500">Informasi keselamatan dan kontak darurat</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
          <Icon path={<div><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></div>} />
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex px-8 gap-6 border-b border-gray-50 bg-slate-50/50">
        {[
          { id: 'emergency', label: 'Kontak Darurat', icon: ICONS.phone },
          { id: 'guide', label: 'Panduan Mitigasi', icon: ICONS.shield },
          { id: 'about', label: 'Tentang App', icon: ICONS.info },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-8">
        
        {/* TAB: EMERGENCY */}
        {activeTab === 'emergency' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <a 
                  key={idx} 
                  href={`tel:${contact.number}`} 
                  className={`group flex items-center p-4 rounded-2xl border-2 transition-all hover:shadow-md ${contact.color}`}
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    {ICONS.phone}
                  </div>
                  <div className="ml-4">
                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">{contact.name}</p>
                    <p className="text-xl font-black">{contact.number}</p>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate-400 italic">
              *Klik pada nomor untuk melakukan panggilan langsung
            </p>
          </div>
        )}

        {/* TAB: GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <details className="group border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-slate-50 list-none">
                <div className="flex items-center gap-3 font-semibold text-slate-800">
                   <div className="text-blue-500">{ICONS.activity}</div>
                   Gempa Bumi
                </div>
                <Icon path={<polyline points="6 9 12 15 18 9"/>} className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="font-bold text-slate-800 mb-2">Saat Terjadi:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Drop: Berlutut rendah.</li>
                    <li>Cover: Lindungi kepala dan leher.</li>
                    <li>Hold on: Berpegangan sampai guncangan berhenti.</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="font-bold text-slate-800 mb-2">Hindari:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Lift atau eskalator.</li>
                    <li>Benda gantung dan kaca.</li>
                  </ul>
                </div>
              </div>
            </details>

            <details className="group border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-slate-50 list-none">
                <div className="flex items-center gap-3 font-semibold text-slate-800">
                   <div className="text-orange-500">{ICONS.flame}</div>
                   Kebakaran
                </div>
                <Icon path={<polyline points="6 9 12 15 18 9"/>} className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex gap-3 items-start p-3 bg-orange-50 rounded-lg text-orange-800">
                        <span className="font-bold">1.</span>
                        <p>Tutup hidung dengan kain basah untuk menyaring asap beracun.</p>
                    </div>
                    <div className="flex gap-3 items-start p-3 bg-orange-50 rounded-lg text-orange-800">
                        <span className="font-bold">2.</span>
                        <p>Merangkak di lantai; udara bersih berada di level bawah.</p>
                    </div>
                    <div className="flex gap-3 items-start p-3 bg-orange-50 rounded-lg text-orange-800">
                        <span className="font-bold">3.</span>
                        <p>Sentuh pintu sebelum dibuka; jika panas, cari jalur keluar lain.</p>
                    </div>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* TAB: ABOUT */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto text-center">
            <div className="mb-6 inline-flex p-4 bg-blue-50 rounded-3xl text-blue-600">
                <Icon path={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>} className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Tentang Seism</h2>
            <p className="text-slate-600 mb-8">
              Seism adalah sistem pelaporan bencana berbasis komunitas. Kami percaya bahwa informasi yang cepat dan akurat dari warga dapat menyelamatkan lebih banyak nyawa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                    {ICONS.clock}
                    <span className="text-xs font-bold uppercase">Status Pending</span>
                </div>
                <p className="text-sm text-slate-600">Laporan Anda sedang menunggu verifikasi dari sistem atau pengguna lain di sekitar lokasi.</p>
              </div>
              <div className="p-4 border border-emerald-100 rounded-2xl bg-emerald-50">
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                    {ICONS.check}
                    <span className="text-xs font-bold uppercase">Status Valid</span>
                </div>
                <p className="text-sm text-slate-600">Laporan telah dikonfirmasi oleh minimal 5 orang. Informasi ini diprioritaskan untuk tim penolong.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-8 py-4 bg-slate-50 border-t border-gray-100 flex justify-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
          Seism v1.0 • Disaster Response System
        </p>
      </div>
    </div>
  );
}