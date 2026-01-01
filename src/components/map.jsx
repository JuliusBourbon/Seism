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
import { blueMarker, redMarker, cloudMarker } from "../assets/markerIcon.js";
import blueLegend from 'leaflet/dist/images/marker-icon.png';
import Profile from "./profile.jsx";
import Help from "./help.jsx";

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
        { 
            id: 'gempa', 
            label: 'Gempa Bumi', 
            icon: blueMarker, 
            legend: <img src={blueLegend} alt="marker" className="w-5 h-8" /> 
        },
        { 
            id: 'cuaca', 
            label: 'Cuaca', 
            icon: cloudMarker, 
            legend: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" class="icon icon-tabler icons-tabler-filled icon-tabler-cloud"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z" /></svg>
            ) 
        },
        { 
            id: 'reports', 
            label: 'Laporan Warga', 
            icon: redMarker,
            legend: <img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' alt="marker" className="w-5 h-8" /> 
        },
    ];

    const toggleMarker = (markerId) => {
        setIsCheck(prev => ({
            ...prev,
            [markerId]: !prev[markerId]
        }));
    };
    
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
                <Sidebar dataGempa={dataGempa} dataReports={reports} loadingCuaca={loadingCuaca} allCuaca={allCuaca} onLocationSelect={setSelectedPosition}/>
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
                        <Marker key={idx} position={coordinatesArray} icon={blueMarker}>
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
                        icon={cloudMarker}
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
                        position={[report.lat, report.lon]}
                        icon={redMarker}>
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
            <div className="absolute w-full h-full top-0 z-1000 pointer-events-none">
                <div className={`justify-center items-center h-full bg-black/20 backdrop-blur-[1px] pointer-events-auto transition-all duration-300 ${activeTab === 'profile' ? 'flex' : 'hidden'}`}>
                    {activeTab === 'profile' && (
                        <Profile onClose={handleCloseTab}/>
                    )}
                </div>
            </div>
            <div className="absolute w-full h-full top-0 z-1000 pointer-events-none">
                <div className={`justify-center items-center h-full bg-black/20 backdrop-blur-[1px] pointer-events-auto transition-all duration-300 ${activeTab === 'help' ? 'flex' : 'hidden'}`}>
                    {activeTab === 'help' && (
                        <Help onClose={handleCloseTab}/>
                    )}
                </div>
            </div>
        </div>
    );
}