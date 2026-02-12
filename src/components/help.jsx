import React, { useState } from 'react';

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
  water: <Icon path={<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>} />,
  mountain: <Icon path={<path d="M8 3l4 8 5-5 5 15H2L8 3z"/>} />,
  barrier: <Icon path={<path d="M4 10h16M4 14h16M4 18h16M10 6v4m4-4v4"/>} />,
  alert: <Icon path={<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>} />,
  gavel: <Icon path={<path d="M14 13l-6.5 6.5a2.12 2.12 0 1 1-3-3L11 10m6.5 2L12 17.5m5.5-5.5L21 8.5a2.12 2.12 0 0 0-3-3L11.5 12"/>} />
};

export default function Help({ onClose }) {
  const [activeTab, setActiveTab] = useState('emergency');

  const emergencyContacts = [
    { name: 'Panggilan Darurat', desc: 'Semua Keadaan Darurat', number: '112', color: 'border-red-200 text-red-700 bg-red-50' },
    { name: 'Ambulans (PSC)', desc: 'Kecelakaan & Medis', number: '118', color: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
    { name: 'Pemadam Kebakaran', desc: 'Kebakaran & Penyelamatan', number: '113', color: 'border-orange-200 text-orange-700 bg-orange-50' },
    { name: 'Kepolisian', desc: 'Tindak Kriminal', number: '110', color: 'border-blue-200 text-blue-700 bg-blue-50' },
    { name: 'Basarnas (SAR)', desc: 'Evakuasi Bencana Alam', number: '115', color: 'border-cyan-200 text-cyan-700 bg-cyan-50' },
    { name: 'PLN', desc: 'Gangguan Listrik', number: '123', color: 'border-yellow-200 text-yellow-700 bg-yellow-50' },
  ];

  const mitigationGuides = [
    {
      id: 'banjir',
      title: 'Banjir',
      icon: ICONS.water,
      color: 'text-blue-500',
      steps: [
        'Matikan aliran listrik dan gas di rumah.',
        'Amankan dokumen penting di tempat tinggi/kedap air.',
        'Jangan berjalan atau berkendara melewati arus air deras.',
        'Pantau informasi tinggi muka air resmi dari BPBD/BMKG.'
      ]
    },
    {
      id: 'gempa',
      title: 'Gempa Bumi',
      icon: ICONS.activity,
      color: 'text-purple-500',
      steps: [
        'DROP (Jatuhkan diri), COVER (Lindungi kepala), HOLD ON (Berpegangan).',
        'Jauhi kaca, lemari, dan benda gantung.',
        'Jika di luar, hindari gedung tinggi, tiang listrik, dan pohon.',
        'Jangan gunakan lift saat evakuasi.'
      ]
    },
    {
      id: 'kebakaran',
      title: 'Kebakaran',
      icon: ICONS.flame,
      color: 'text-orange-500',
      steps: [
        'Jangan panik, segera bunyikan alarm atau teriak "KEBAKARAN".',
        'Merangkak rendah di bawah asap untuk menghindari keracunan CO2.',
        'Tutup hidung dengan kain basah.',
        'Jika baju terbakar: Berhenti, Jatuhkan diri, Berguling (Stop, Drop, Roll).'
      ]
    },
    {
      id: 'longsor',
      title: 'Tanah Longsor',
      icon: ICONS.mountain,
      color: 'text-amber-700',
      steps: [
        'Waspada suara gemuruh atau retakan tanah setelah hujan deras.',
        'Lari ke arah samping menjauhi jalur longsoran (jangan lari ke bawah).',
        'Melungkar dan lindungi kepala jika terjebak.',
        'Jauhi area tebing curam.'
      ]
    },
    {
      id: 'akses',
      title: 'Akses Tertutup',
      icon: ICONS.barrier,
      color: 'text-gray-600',
      steps: [
        'Jangan memaksakan kendaraan melewati jalan yang amblas/tertutup.',
        'Cari rute alternatif yang aman.',
        'Berikan tanda peringatan sederhana bagi pengguna jalan lain.',
        'Lapor segera agar petugas bisa membawa alat berat.'
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl w-[80%] h-[80vh] relative shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 grid grid-cols-3 items-center sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-slate-800 hidden md:block text-left">Pusat Bantuan</h1>
          <div className="flex justify-center">
            <div className="flex bg-white rounded-lg p-1 border border-gray-300 shadow-sm">
              {[
                { id: 'emergency', label: 'Kontak Darurat', icon: ICONS.phone },
                { id: 'guide', label: 'Panduan Penyelematan', icon: ICONS.shield },
                { id: 'rules', label: 'Aturan & Sanksi', icon: ICONS.gavel },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 flex cursor-pointer gap-2 rounded-md text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className='flex justify-end'>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer font-bold shadow-sm">
              ✕
            </button>
          </div>
        </div>

        

      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
        
        

        {activeTab === 'emergency' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-xl text-center font-bold mb-4">
                Nomor Telepon Darurat
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <a 
                  key={idx} 
                  href={`tel:${contact.number}`} 
                  className={`group relative flex items-center p-4 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 ${contact.color}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    {ICONS.phone}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm uppercase text-black tracking-wider font-semibold opacity-70 mb-0.5">{contact.desc}</p>
                    <p className="text-lg texbla font-semibold leading-none">{contact.name}</p>
                    <p className="text-xl font-bold mt-1 tracking-tight">{contact.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-xl text-center font-bold mb-4">
                Panduan langkah-langkah penyelamatan awal Bencana
            </p>
            
            {mitigationGuides.map((guide) => (
                <details key={guide.id} className="group border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all open:ring-2 open:ring-blue-100 open:border-blue-300">
                    <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-slate-50 list-none select-none">
                        <div className="flex items-center gap-4">
                            <div className={`${guide.color} bg-slate-50 p-2 rounded-lg`}>{guide.icon}</div>
                            <span className="font-semibold text-slate-800 text-lg">{guide.title}</span>
                        </div>
                        <Icon path={<polyline points="6 9 12 15 18 9"/>} className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-5 pb-6 pt-2 bg-white">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <ul className="space-y-3">
                                {guide.steps.map((step, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                                        <span className="shrink-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-semibold text-slate-500 shadow-sm">
                                            {idx + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </details>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-xl text-center font-bold mb-4">
                Kebijakan Sistem
            </p>
            
            <section className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Wajib Login & Verifikasi
                </h3>
                <p className="text-blue-800 leading-relaxed">
                    Demi menjaga akurasi data, semua pengguna wajib mendaftar dan login untuk membuat laporan atau melakukan voting. Ini memastikan setiap informasi memiliki penanggung jawab yang jelas.
                </p>
            </section>

            <section className=''>
                <h3 className="text-lg px-5 font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Sistem Validasi Berdasarkan Vote
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-green-200 bg-green-50 p-4 rounded-xl">
                        <div className="font-semibold text-green-700 mb-1 flex text-lg items-center gap-2">Laporan Valid</div>
                        <p className="text-green-800 mb-2">Laporan dianggap valid jika:</p>
                        <h1 className="block bg-white/50 p-2 rounded text-green-900 border border-green-200">
                            (UpVote + DownVote &gt; 10) DAN (UpVote &ge; 2x DownVote)
                        </h1>
                    </div>
                    <div className="border border-red-200 bg-red-50 p-4 rounded-xl">
                        <div className="font-semibold text-red-700 mb-1 flex items-center gap-2 text-lg">Laporan Invalid</div>
                        <p className="text-red-800 mb-2">Laporan dianggap Invalid jika:</p>
                        <h1 className="block bg-white/50 p-2 rounded text-red-900 border border-red-200">
                            (UpVote - DownVote &le; -10)
                        </h1>
                    </div>
                </div>
            </section>

            <section className="px-5">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                    Hukuman
                </h3>
                <p className="text-slate-600 mb-4">
                    Jika laporan Anda ditandai sebagai <strong>INVALID</strong>, poin pelanggaran Anda akan bertambah. Akun akan <strong>dibekukan (Suspend)</strong> secara otomatis berdasarkan jumlah pelanggaran:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="text-2xl font-black text-slate-400 mb-1">3x</div>
                        <div className="text-xs font-semibold uppercase text-slate-500">Pelanggaran</div>
                        <div className="mt-2 py-1 px-3 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold inline-block">
                            Suspend 1 Minggu
                        </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="text-2xl font-black text-orange-400 mb-1">5x</div>
                        <div className="text-xs font-semibold uppercase text-orange-500">Pelanggaran</div>
                        <div className="mt-2 py-1 px-3 bg-orange-200 text-orange-800 rounded-full text-xs font-semibold inline-block">
                            Suspend 1 Bulan
                        </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="text-2xl font-black text-red-500 mb-1">7x</div>
                        <div className="text-xs font-semibold uppercase text-red-600">Pelanggaran</div>
                        <div className="mt-2 py-1 px-3 bg-red-200 text-red-800 rounded-full text-xs font-semibold inline-block">
                            Suspend 1 Tahun
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-slate-600 italic text-center">
                    *Akun yang ter-suspend bisa melihat waktu hukuman yang tersisa dengan cara melakukan login.
                </p>
            </section>

            <section className="rounded-xl p-5 border border-blue-50 bg-white shadow-sm mb-4">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-3">
                  <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">4</span>
                  Aturan Tampilan Peta Interaktif
              </h3>
              <div className="pl-10">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                      Agar peta tetap relevan, bersih, dan akurat, laporan akan <b>otomatis disembunyikan</b> dari peta utama setelah melewati batas waktu berikut:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      <div className="p-3 bg-green-50 rounded-lg border border-green-100 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-[12px] font-bold px-2 py-0.5 bg-green-200 text-green-800 rounded-full uppercase">
                                  Valid
                              </span>
                              <span className="font-semibold text-green-700">
                                  7 HARI
                              </span>
                          </div>
                          <p className="text-gray-600">
                            Laporan yang terbukti benar adalah informasi vital. Data ini harus bertahan paling lama di peta agar warga tetap waspada terhadap bahaya di lokasi tersebut.
                          </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-[12px] font-bold px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full uppercase">
                                  Pending
                              </span>
                              <span className="font-semibold text-gray-700">
                                  48 JAM
                              </span>
                          </div>
                          <p className="text-gray-600">
                              Memberikan waktu yang cukup bagi komunitas untuk melihat dan melakukan voting (memvalidasi) laporan baru. Jika dalam 2 hari tidak ada kepastian, laporan dianggap kadaluarsa agar tidak memenuhi peta.
                          </p>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-[12px] font-bold px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full uppercase">
                                  Resolved
                              </span>
                              <span className="font-semibold text-blue-700">
                                  24 JAM
                              </span>
                          </div>
                          <p className="text-gray-600">
                              Data ditampilkan untuk menginfokan masalah sudah selesai.
                          </p>
                      </div>

                      <div className="p-3 bg-red-50 rounded-lg border border-red-100 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-[12px] font-bold px-2 py-0.5 bg-red-200 text-red-800 rounded-full uppercase">
                                  Invalid
                              </span>
                              <span className="font-semibold text-red-700">
                                  12 JAM
                              </span>
                          </div>
                          <p className="text-gray-600">
                              Laporan palsu harus secepat mungkin hilang dari map untuk mencegah penyebaran disinformasi, namun tetap ditampilkan sebentar agar user tahu bahwa itu sudah ditandai sebagai invalid report.
                          </p>
                      </div>

                  </div>

                  <div className="mt-4 flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="text-gray-500 italic">
                          Data yang sudah lewat waktu akan hilang dari Peta, namun tetap tersimpan abadi dan bisa dilihat kembali melalui menu <b>"Data Historis"</b> (Ikon Tabel).
                      </p>
                  </div>
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}