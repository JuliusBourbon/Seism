import { useState } from "react";

export default function Sidebar({ dataGempa, loadingCuaca, allCuaca, onLocationSelect }) {
    const [sideBar, setSideBar] = useState('gempa');
    const [activeSideBar, setActiveSideBar] = useState(true);

    const handleGempaClick = (coordinateString) => {
        const coords = coordinateString.split(',').map(parseFloat);
        onLocationSelect(coords);
    };

    const handleSideBar = (tab) => {
        setSideBar(tab);
    };

    const handleCuacaClick = (lat, lon) => {
        onLocationSelect([lat, lon]);
    };

    const magClassName = (magnitude) => {
        const mag = parseFloat(magnitude);
        if(mag > 5) {
            return 'bg-red-100 text-red-600 border-red-200'
        } else {
            return 'bg-blue-100 text-blue-600 border-blue-200'
        }
    }

    return (
        <div className="flex h-screen relative">
            <div className={`fixed top-4 right-4 h-[90%] flex items-center z-50 transition-transform duration-300 ease-in-out ${activeSideBar ? 'translate-x-0' : 'translate-x-[calc(102%-40px)]'}`}>
                <button onClick={() => setActiveSideBar(!activeSideBar)} className="mt-6 -mr-1 bg-white shadow-md border border-gray-100 h-20 w-10 rounded-l-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 active:scale-95 transition-all pointer-events-auto">
                    <svg className={`transition-transform duration-300 ${activeSideBar ? 'rotate-0' : 'rotate-180'}`} 
                        width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </button>
                <div className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 h-full w-80 rounded-2xl flex flex-col overflow-hidden pointer-events-auto">
                    <div className="bg-gray-50/80 p-2 border-b border-gray-100">
                        <div className="flex bg-gray-200/50 p-1 rounded-lg">
                            <button 
                                className={`flex-1 py-1.5 text-sm font-semibold rounded-md cursor-pointer transition-all duration-200 ${
                                    sideBar === 'gempa' 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`} 
                                onClick={() => handleSideBar('gempa')}
                            >
                                Gempa
                            </button>
                            <button 
                                className={`flex-1 py-1.5 text-sm font-semibold rounded-md cursor-pointer transition-all duration-200 ${
                                    sideBar === 'cuaca' 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`} 
                                onClick={() => handleSideBar('cuaca')}
                            >
                                Cuaca
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {sideBar === 'gempa' && (
                            <div className="divide-y divide-gray-100">
                                {dataGempa.map((gempa, idx) => (
                                    <div key={idx} onClick={() => handleGempaClick(gempa.Coordinates)} className="p-4 hover:bg-blue-50/80 cursor-pointer transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h2 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-700 transition-colors w-2/3">
                                                {gempa.Wilayah}
                                            </h2>
                                            <span className={`border px-2 py-0.5 rounded text-[12px] font-bold whitespace-nowrap ${magClassName(gempa.Magnitude)}`}>
                                                Mag: {gempa.Magnitude}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                            {gempa.Jam}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {sideBar === 'cuaca' && (
                            <div className="divide-y divide-gray-100">
                                {loadingCuaca ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                                        <svg className="animate-spin h-6 w-6 mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Memuat data cuaca...
                                    </div>
                                ) : (
                                    allCuaca.map((item) => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => handleCuacaClick(item.lokasi.lat, item.lokasi.lon)} 
                                            className="p-4 hover:bg-blue-50/80 cursor-pointer transition-colors"
                                        >
                                            <div className="mb-3 border-b border-gray-100 pb-2">
                                                <h1 className="font-bold text-gray-800 text-sm">{item.lokasi.kotkab}</h1>
                                                <p className="text-xs text-gray-500">Kec. {item.lokasi.kecamatan}</p>
                                            </div>
                                            <div className="grid grid-cols-4 gap-1">
                                                {item.current && item.current.slice(0, 4).map((cuaca, index) => (
                                                    <div 
                                                        key={index} 
                                                        className={`flex flex-col items-center text-center ${
                                                            index !== 3 ? 'border-r border-gray-100' : ''
                                                        }`}
                                                    >
                                                        <span className="text-[10px] text-gray-400 font-medium mb-1">
                                                            {cuaca.local_datetime.split(' ')[1].slice(0, 5)}
                                                        </span>
                                                        <span className="font-bold text-blue-600 text-base my-0.5">
                                                            {cuaca.t}°
                                                        </span>
                                                        <span className="text-[9px] text-gray-500 leading-none px-1 line-clamp-2">
                                                            {cuaca.weather_desc}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                         <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}