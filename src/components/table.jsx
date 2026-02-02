import React, { useState, useEffect } from 'react';

export default function Table({ onClose }) {
    const [activeTab, setActiveTab] = useState('reports');
    const [dataReports, setDataReports] = useState([]);
    const [dataDisasters, setDataDisasters] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filterDate, setFilterDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, filterDate]);

    useEffect(() => {
        setLoading(true);
        if (activeTab === 'reports') {
            fetch('http://localhost:3000/api/reports/report_history')
                .then(res => res.json())
                .then(data => {
                    setDataReports(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            fetch('http://localhost:3000/api/disaster_history')
                .then(res => res.json())
                .then(data => {
                    setDataDisasters(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [activeTab]);

    const getFilteredData = () => {
        const sourceData = activeTab === 'reports' ? dataReports : dataDisasters;

        if (!filterDate) {
            return sourceData;
        }

        return sourceData.filter(item => {
            const dateString = activeTab === 'reports' 
                ? item.created_at 
                : (item.created_at);
            
            if (!dateString) return false;

            const itemDate = new Date(dateString).toISOString().split('T')[0];
            return itemDate === filterDate;
        });
    };

    const processedData = getFilteredData();
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);

    const formatDate = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            valid: 'bg-green-100 text-green-500 border-green-200',
            invalid: 'bg-red-100 text-red-500 border-red-200',
            pending: 'bg-gray-100 text-gray-500 border-gray-200',
            resolved: 'bg-blue-100 text-blue-500 border-blue-200',
        };
        const labels = {
            valid: 'Valid',
            invalid: 'Invalid',
            pending: 'Pending',
            resolved: 'Resolved',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl w-[80%] h-[80vh] relative shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
                <h1 className="text-2xl font-bold text-slate-800 hidden md:block">Data Historis</h1>
                <div className="flex bg-white rounded-lg p-1 border border-gray-300 shadow-sm">
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-4 py-1.5 cursor-pointer rounded-md text-sm font-bold transition-all ${
                            activeTab === 'reports' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        Laporan Warga
                    </button>
                    <button
                        onClick={() => setActiveTab('disasters')}
                        className={`px-4 py-1.5 cursor-pointer rounded-md text-sm font-bold transition-all ${
                            activeTab === 'disasters' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        Gempa BMKG
                    </button>
                </div>

                <div className="flex gap-3 items-center w-full md:w-auto justify-end">
                    <div className="relative">
                        <input 
                            type="date" 
                            className="pl-3 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {filterDate && (
                            <button 
                                onClick={() => setFilterDate('')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center hover:bg-red-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer font-bold shadow-sm"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-6 bg-white">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="animate-spin h-8 w-8 mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm font-semibold">Mengambil data...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        {activeTab === 'reports' ? (
                            <>
                                <thead className="bg-slate-50 sticky top-0 z-0 shadow-sm">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pelapor</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Judul</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Votes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-400">Belum ada laporan tercatat.</td></tr>
                                    ) : currentItems.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                               { index + 1 }
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-700">{item.user_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-blue-600 uppercase mb-0.5">{item.type}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-900 font-medium line-clamp-1">{item.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={item.location_name}>
                                                {item.location_name || `${item.lat}, ${item.lon}`}
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-3 text-xs font-bold">
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        ▲ {item.upvotes}
                                                    </span>
                                                    <span className="text-red-600 flex items-center gap-1">
                                                        ▼ {item.downvotes}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        ) : (
                            <>
                                <thead className="bg-slate-50 sticky top-0 z-0 shadow-sm">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu Gempa</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Magnitude</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kedalaman</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Wilayah</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Koordinat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-400">Tidak ada data gempa tersimpan.</td></tr>
                                    ) : currentItems.map((gempa, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                                {idx + 1}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                                {gempa.datetime} <br/>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded font-bold text-xs ${
                                                    parseFloat(gempa.magnitude) >= 5.0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {gempa.magnitude} SR
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-700 font-mono">
                                                {gempa.depth}
                                            </td>
                                            <td className="p-4 text-sm text-gray-900 font-medium">
                                                {gempa.location}
                                            </td>
                                            <td className="p-4 text-xs text-gray-500 font-mono">
                                                {gempa.coordinates}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}
                    </table>
                )}
            </div>
            
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3">
                <div className="font-medium">
                    Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, processedData.length)} dari {processedData.length} data
                    {filterDate && <span className="text-blue-600 ml-1">(Difilter)</span>}
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    
                    <span className="font-bold text-slate-700">
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}