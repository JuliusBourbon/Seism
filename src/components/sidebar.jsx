import { useState } from "react";

export default function Sidebar({dataGempa, loadingCuaca, allCuaca, onLocationSelect}){
    const [ sideBar, setSideBar ] = useState('gempa')
    const [ activeSideBar, setActiveSideBar ] = useState(true)

    const handleGempaClick = (coordinateString) => {
        const coords = coordinateString.split(',').map(parseFloat);
        onLocationSelect(coords);
    };
    const handleSideBar = (tab) => {
        setSideBar(tab)
    }
    const handleCuacaClick = (lat, lon) => {
        onLocationSelect([lat, lon]);
    };
    return (
        <div className="flex justify-end h-full items-center">
            <div onClick={() => setActiveSideBar(!activeSideBar)} className={`hover:bg-gray-200 transition-colors cursor-pointer bg-white h-[10%] w-[1.5%] pointer-events-auto rounded-l-2xl flex justify-center items-center`}>
                <svg className={`transition-all duration-300 ${activeSideBar ? '' : 'rotate-180'}`} width="28px" height="28px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                    <path d="M9 6L15 12L9 18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
            <div className={`bg-white/80 h-screen overflow-y-auto pointer-events-auto transition-all duration-500 ${activeSideBar ? 'w-1/6' : 'w-[0.1%]'}`}>
                <div className="flex text-center justify-between">
                    <div className={`w-full p-3 cursor-pointer font-bold text-sm ${sideBar === 'gempa' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => handleSideBar('gempa')}>
                        Gempa
                    </div>
                    <div className={`w-full p-3 cursor-pointer font-bold text-sm ${sideBar === 'cuaca' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => handleSideBar('cuaca')}>
                        Cuaca
                    </div>
                </div>
                {sideBar === 'gempa' && (
                    <div>
                        {dataGempa.map((gempa, idx) => (
                            <div key={idx} onClick={() => handleGempaClick(gempa.Coordinates)} className="p-4 border-b border-gray-200 text-sm cursor-pointer hover:bg-blue-50 transition">
                                <h2 className="font-bold text-gray-800">{gempa.Wilayah}</h2>
                                <div className="flex justify-between mt-2">
                                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">Mag: {gempa.Magnitude}</span>
                                    <span className="text-xs text-gray-500">{gempa.Jam}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {sideBar === 'cuaca' && (
                    <div>
                        {loadingCuaca ? (
                            <p className="p-4 text-center text-gray-500">Memuat data cuaca...</p>
                        ) : (
                            allCuaca.map((item) => (
                                <div key={item.id} onClick={() => handleCuacaClick(item.lokasi.lat, item.lokasi.lon)} 
                                className="p-4 border-b border-gray-200 text-sm cursor-pointer hover:bg-blue-50 transition flex flex-col gap-3">
                                    <div>
                                        <h1 className="font-semibold">{item.lokasi.kotkab} <br/> Kecamatan {item.lokasi.kecamatan}</h1>
                                    </div>
                                    <div className="w-full flex justify-between">
                                        {item.current && item.current.slice(0, 4).map((cuaca, index) => (
                                            <div key={index} className={`flex-1 text-center flex flex-col px-1 ${index !== 3 ? 'border-r border-gray-300' : ''}`}>
                                                <h1 className="text-xs text-gray-500 mb-1">
                                                    {cuaca.local_datetime.split(' ')[1].slice(0, 5)}
                                                </h1>
                                                
                                                <h1 className="font-bold text-blue-600 text-lg">
                                                    {cuaca.t}°C
                                                </h1>
                                                
                                                <h1 className="text-xs text-gray-400">
                                                    {cuaca.weather_desc}
                                                </h1>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}