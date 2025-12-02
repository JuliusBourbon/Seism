import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Navbar from "./navbar";
import bmkg from "../API/bmkg.js"
import Cuaca from "../API/cuaca.js";

export default function Leaflet(){
    const cloudIcon = new L.DivIcon({
        html: '<div style="font-size: 24px;">⛅</div>',
        className: 'bg-transparent',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    const FlyToLocation = ({ coords }) => {
        const map = useMap();
        useEffect(() => {
            if (coords) {
                map.flyTo(coords, 10, {duration: 2});
            }
        }, [coords, map]);

        return null;
    };
    
    const centerPosition = [-2.5489, 118.0149]; 
    const monasPosition = [-6.1754, 106.8272];
    const { data: gempaAuto, loading, error } = bmkg('list');
    const { allCuaca, loadingCuaca } = Cuaca();
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [ sideBar, setSideBar ] = useState('gempa')
    const [ activeSideBar, setActiveSideBar ] = useState(true)

    const handleGempaClick = (coordinateString) => {
        const coords = coordinateString.split(',').map(parseFloat);
        setSelectedPosition(coords);
    };
    const handleSideBar = (tab) => {
        setSideBar(tab)
    }
    const handleCuacaClick = (lat, lon) => {
        setSelectedPosition([lat, lon]);
    };
    // const handleActiveClick = () => {
    //     setActiveSideBar()
    // }

    if (loading) return <p>Sedang memuat...</p>;
    if (error) return <p>Error: {error}</p>;

    
    return (
        <div className="relative h-screen w-full border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full z-1000 pointer-events-none">
                <Navbar />
            </div>
                <div className="absolute w-full h-full right-0 z-999 pointer-events-none">
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
                                    {gempaAuto.map((gempa, idx) => (
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
                                            <div key={item.id} onClick={() => handleCuacaClick(item.lokasi.lat, item.lokasi.lon)} className="p-4 border-b border-gray-200 text-sm cursor-pointer hover:bg-blue-50 transition flex justify-between items-center">
                                                <div>
                                                    <h2 className="font-bold text-gray-800">{item.lokasi.kelurahan}</h2>
                                                    <p className="text-xs text-gray-500">{item.lokasi.kecamatan}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-blue-600 block">{item.current.t}°C</span>
                                                    <span className="text-xs text-gray-500">{item.current.weather_desc}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            <MapContainer gempaList={gempaAuto} selectedPosition={selectedPosition} center={centerPosition} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <FlyToLocation coords={selectedPosition} />
                <Marker position={monasPosition}>
                    <Popup>
                        <div className="text-center">
                            <b className="text-lg">Monas (Jakarta)</b> <br />
                            Ini adalah marker contoh. <br />
                            Saya belum terhubung API.
                        </div>
                    </Popup>
                </Marker>
                {gempaAuto.map((gempa, idx) => {
                    const coordinatesArray = gempa.Coordinates.split(',').map(parseFloat);
                    return (
                        <Marker key={idx} position={coordinatesArray}>
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold text-sm">{gempa.Wilayah}</h3>
                                    <p>Mag: <span className="text-red-600 font-bold">{gempa.Magnitude}</span></p>
                                    <p className="text-xs">Kedalaman: {gempa.Kedalaman}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
                {!loadingCuaca && allCuaca.map((item) => (
                    <Marker 
                        key={`cuaca-${item.id}`}
                        position={[item.lokasi.lat, item.lokasi.lon]}
                        icon={cloudIcon}
                    >
                        <Popup>
                            <div className="text-center min-w-[100px]">
                                <b className="text-blue-600 block mb-1">{item.lokasi.kelurahan}</b>
                                <div className="flex justify-center items-center gap-2">
                                    <span className="text-2xl">⛅</span>
                                    <span className="text-xl font-bold">{item.current.t}°C</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{item.current.weather_desc}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div className="absolute bottom-0 left-0 z-1000 pointer-events-none">
                <div className="bg-white border mb-5 ml-5 rounded-2xl pointer-events-auto">
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7.90039 8.07954C7.90039 3.30678 15.4004 3.30682 15.4004 8.07955C15.4004 11.4886 11.9913 10.8067 11.9913 14.8976" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 19.01L12.01 18.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
            </div> 
        </div>
    );
}