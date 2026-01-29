import { useState, useEffect } from "react";

export default function Table({ onClose }) {
    const [activeTab, setActiveTab] = useState('reports');
    const [reports, setReports] = useState([]);
    const [quakes, setQuakes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const reportRes = await fetch('http://localhost:3000/api/reports');
                const reportData = await reportRes.json();
                setReports(reportData);

                const bmkgRes = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
                const bmkgData = await bmkgRes.json();
                setQuakes(bmkgData.Infogempa.gempa);

            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Format Tanggal agar enak dibaca
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="bg-white rounded-2xl w-[95%] h-[85%] relative pointer-events-auto shadow-2xl mt-15 flex flex-col overflow-hidden">
            
            <div className="absolute top-0 right-0 z-10 p-5">
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors font-bold">✕</button>
            </div>

            <div className="pt-8 pb-4 flex flex-col items-center shrink-0">
                <h1 className="text-3xl font-bold text-[#00165D] mb-6">Table</h1>
                
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('reports')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'reports' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Laporan Warga
                    </button>
                    <button 
                        onClick={() => setActiveTab('bmkg')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'bmkg' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Data BMKG (Gempa)
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full px-8 pb-8 overflow-hidden">
                <div className="w-full h-full border border-gray-200 rounded-2xl overflow-hidden flex flex-col bg-white shadow-inner">
                    
                    <div className="overflow-x-auto overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    {activeTab === 'reports' ? (
                                        <>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Waktu</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Pelapor</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Kejadian</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Lokasi</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b text-center">Status</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Waktu & Tanggal</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Magnitudo</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Kedalaman</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Lokasi</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Potensi</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-gray-400">
                                            Sedang memuat data...
                                        </td>
                                    </tr>
                                ) : (
                                    activeTab === 'reports' ? (
                                        reports.length > 0 ? reports.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="p-4 text-sm font-medium text-gray-800">
                                                    {item.reporter_name || "Anonim"}
                                                    <div className="text-[10px] text-gray-400 font-mono">{item.user_identifier?.substring(0,8)}...</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                                        ${item.type === 'Banjir' ? 'bg-blue-100 text-blue-600' : 
                                                          item.type === 'Kebakaran' ? 'bg-red-100 text-red-600' :
                                                          'bg-orange-100 text-orange-600'}`}>
                                                        {item.type}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{item.title}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600 truncate max-w-[150px]" title={item.location_name}>
                                                    {item.location_name}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold text-green-600">+{item.upvotes}</span>
                                                        <span className="text-[10px] text-gray-400">Validasi</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="p-8 text-center text-gray-400">Belum ada laporan masuk</td></tr>
                                        )
                                    ) : (
                                        quakes.length > 0 ? quakes.map((gempa, index) => (
                                            <tr key={index} className="hover:bg-orange-50/50 transition-colors">
                                                <td className="p-4 text-sm text-gray-600">
                                                    <div className="font-bold">{gempa.Jam}</div>
                                                    <div className="text-xs text-gray-400">{gempa.Tanggal}</div>
                                                </td>
                                                <td className="p-4 text-sm font-bold text-gray-800">
                                                    <span className={`px-2 py-1 rounded ${parseFloat(gempa.Magnitude) >= 5.0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                        {gempa.Magnitude} SR
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">{gempa.Kedalaman}</td>
                                                <td className="p-4 text-sm text-gray-600 font-medium">{gempa.Wilayah}</td>
                                                <td className="p-4 text-sm text-gray-500 italic">{gempa.Potensi}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="p-8 text-center text-gray-400">Gagal memuat data BMKG</td></tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}