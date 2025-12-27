import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Navbar from "./navbar";
import bmkg from "../API/bmkg.js"
import Cuaca from "../API/cuaca.js";
import Form from "./form.jsx";
import Table from "./table.jsx";
import Reports from "../API/reports.js";
import Sidebar from "./sidebar.jsx";
import LegendsBar from "./legendsBar.jsx";
import L from 'leaflet';

const FlyToLocation = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 10, {duration: 2});
        }
    }, [coords, map]);

    return null;
};

export default function Map({ currentUser }){
    const [isCheck, setIsCheck] = useState({
        gempa: true,
        cuaca: true,
        reports: true
    });
    const [activeTab, setActiveTab] = useState('home')
    const handleCloseTab = () => {
        setActiveTab('home');
    };

    const markerData = [
        { id: 'gempa', label: 'Gempa Bumi', icon: '🌋' },
        { id: 'cuaca', label: 'Cuaca', icon: '⛅' },
        { id: 'reports', label: 'Laporan Warga', icon: '📢' },
    ];

    const toggleMarker = (markerId) => {
        setIsCheck(prev => ({
            ...prev,
            [markerId]: !prev[markerId]
        }));
    };

    const cloudIcon = new L.DivIcon({
        html: '<div style="font-size: 24px;">⛅</div>',
        className: 'bg-transparent',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const centerPosition = [-2.5489, 118.0149]; 
    const { data: dataGempa, loading, error } = bmkg();
    const { allCuaca, loadingCuaca } = Cuaca();
    const [selectedPosition, setSelectedPosition] = useState(null);
   
    const { reports, loading: loadingReports } = Reports();

    if (loading) 
        return <p>Loading...</p>;
    if (error) 
        return <p>Error: {error}</p>;
    
    return (
        <div className="relative h-screen w-full border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <nav className="absolute top-0 left-0 w-full z-1001 pointer-events-none">
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab}/>
            </nav>
            <div className="absolute w-full h-full right-0 z-999 pointer-events-none">
                <Sidebar dataGempa={dataGempa} loadingCuaca={loadingCuaca} allCuaca={allCuaca} onLocationSelect={setSelectedPosition}/>
            </div>
            <div className="absolute w-full h-full left-0 z-999 pointer-events-none">
                <LegendsBar markers={markerData} isCheck={isCheck} toggleMarker={toggleMarker}/>
            </div>
            <MapContainer selectedPosition={selectedPosition} center={centerPosition} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <FlyToLocation coords={selectedPosition} />

                {isCheck.gempa && dataGempa.map((gempa, idx) => {
                    const coordinatesArray = gempa.Coordinates.split(',').map(parseFloat);
                    return (
                        <Marker key={idx} position={coordinatesArray}>
                            <Popup>
                                <div className="text-center flex flex-col gap-3">
                                    <h1 className="font-bold text-lg">{gempa.Wilayah}</h1>
                                    <h1 className="text-sm">{gempa.Tanggal} {gempa.Jam}</h1>
                                    <h1 className="text-sm">Kedalaman: {gempa.Kedalaman} | Mag: <span className="text-red-600 font-bold">{gempa.Magnitude}</span></h1>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
                {isCheck.cuaca && !loadingCuaca && allCuaca.map((item) => (
                    <Marker 
                        key={`cuaca-${item.id}`}
                        position={[item.lokasi.lat, item.lokasi.lon]}
                        icon={cloudIcon}
                    > 
                        <Popup>
                            <div className="flex flex-col text-center gap-3 min-w-[100px]">
                                <div>
                                    <h1 className="font-semibold">{item.lokasi.kotkab} <br/> Kecamatan {item.lokasi.kecamatan}</h1>
                                </div>
                                <div className="w-full flex justify-between">
                                    {item.current && item.current.slice(0, 4).map((cuaca, index) => (
                                        <div key={index} className={`flex-1 text-center flex flex-col px-1 ${index !== 3 ? 'border-r border-gray-300' : ''}`}>
                                            <h1 className="text-xs mb-1">
                                                {cuaca.local_datetime.split(' ')[1].slice(0, 5)}
                                            </h1>
                                            
                                            <h1 className="font-bold text-blue-600 text-lg">
                                                {cuaca.t}°C
                                            </h1>
                                            
                                            <h1 className="text-xs">
                                                {cuaca.weather_desc}
                                            </h1>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {isCheck.reports && reports && reports.map((report) => (
                    <Marker 
                        key={`report-${report.id}`}
                        position={[report.lat, report.lon]}>
                        <Popup>
                            <div className="max-w-xs">
                                <h3 className="font-bold text-red-600 uppercase text-sm mb-1">
                                    🚨 report Warga: {report.type}
                                </h3>
                                <h4 className="font-bold text-base">{report.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">"{report.description}"</p>
                                
                                <div className="mt-2 text-xs text-gray-400">
                                    📍 {report.location_name} <br/>
                                    👍 {report.upvotes} Validasi
                                </div>
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
            <div className="absolute w-full h-full top-0 z-1000 pointer-events-none">
                <div className={`justify-center items-center h-full bg-black/20 backdrop-blur-[1px] pointer-events-auto transition-all duration-300 ${activeTab === 'data' ? 'flex' : 'hidden'}`}>
                    {activeTab === 'data' && (
                        <Table onClose={handleCloseTab}/>
                    )}
                </div>
            </div>
            <div className="absolute w-full h-full top-0 z-1000 pointer-events-none">
                <div className={`justify-center items-center h-full bg-black/20 backdrop-blur-[1px] pointer-events-auto transition-all duration-300 ${activeTab === 'form' ? 'flex' : 'hidden'}`}>
                    {activeTab === 'form' && (
                        <Form currentUser={currentUser} onClose={handleCloseTab}/>
                    )}
                </div>
            </div>
        </div>
    );
}