import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Navbar from "./navbar";
import bmkg from "../API/bmkg.js"
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
import ReportPopup from "./reportPopup.jsx";
import { getCategoryIcon } from "../assets/iconUtils.js";
import { useNotification } from "./notificationContext.jsx";

const FlyToLocation = ({ coords }) => {
    const map = useMap();

    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 16, { duration: 2 });
            map.eachLayer((layer) => {
                if (layer.getLatLng && layer.openPopup) {
                    const markerLoc = layer.getLatLng();
                    const targetLoc = L.latLng(coords[0], coords[1]);

                    if (markerLoc.distanceTo(targetLoc) < 1) { 
                        layer.openPopup();
                    }
                }
            });
        }
    }, [coords, map]);

    return null;
};

export default function Map({ currentUser, onLoginSuccess, onLogout }){
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('home')
    const handleCloseTab = () => {
        setActiveTab('home');
    };

    const markerData = [
        { id: 'gempa', label: 'Gempa' }, 
        { id: 'banjir', label: 'Banjir' }, 
        { id: 'kebakaran', label: 'Kebakaran' }, 
        { id: 'longsor', label: 'Longsor' }, 
        { id: 'akses tertutup', label: 'Akses Tertutup' }, 
        { id: 'lainnya', label: 'Lainnya' }, 
    ];

    const [filterState, setFilterState] = useState({
        banjir: true,
        kebakaran: true,
        gempa: true,
        longsor: true,
        'akses tertutup': true,
        lainnya: true
    });

    const handleToggleFilter = (id) => {
        setFilterState(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const centerPosition = [-2.5489, 118.0149]; 
    const { data: dataGempa, loading, error } = bmkg();
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [reports, setReports] = useState([]);
    const mapRef = useRef(null);

    const handleReportSuccess = (newReport) => {
        setReports(prevReports => [newReport, ...prevReports]);
        setActiveTab(null);

        if (mapRef.current) {
            const map = mapRef.current;
            map.flyTo([newReport.lat, newReport.lon], 16, {
                duration: 2
            });
        }
        
        showNotification(
            "Laporan berhasil dikirim",
            "",
            "success",
            "Tutup"
        );
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/reports'); 
                
                if (!response.ok) {
                    throw new Error("Gagal mengambil data");
                }
                const data = await response.json();
                console.log("Data Laporan dari DB:", data); 
                setReports(data); 

            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return (
        <div className="relative h-screen w-full border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <nav className="absolute top-0 left-0 w-full z-1001 pointer-events-none">
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab}/>
            </nav>
            <div className="absolute w-full h-full right-0 z-999 pointer-events-none">
                <Sidebar dataGempa={dataGempa} dataReports={reports} onLocationSelect={setSelectedPosition}/>
            </div>
            <div className="absolute w-full h-full left-0 z-999 pointer-events-none">
                <LegendsBar markers={markerData} isCheck={filterState} toggleMarker={handleToggleFilter}/>
            </div>
            <MapContainer ref={mapRef} selectedPosition={selectedPosition} center={centerPosition} zoom={6} zoomControl={false} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <FlyToLocation coords={selectedPosition} />

                {dataGempa.filter(() => filterState['gempa'] === true).map((gempa, idx) => {
                    const coordinatesArray = gempa.Coordinates.split(',').map(parseFloat);
                    return (
                        <Marker key={idx} position={coordinatesArray} icon={getCategoryIcon('Gempa')} >
                            <Popup>
                                <div className="justify-center items-center flex flex-col gap-3">
                                    <h1 className="font-bold text-lg text-center">{gempa.Wilayah}</h1>
                                    <h1 className="bg-blue-200 w-fit px-3 py-1 rounded-md text-blue-600 font-bold">Sumber: BMKG</h1>
                                    <h1 className="text-sm">{gempa.Tanggal} {gempa.Jam}</h1>
                                    <h1 className="text-sm">Kedalaman: {gempa.Kedalaman} | Mag: <span className="text-red-600 font-bold">{gempa.Magnitude}</span></h1>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
                {reports
                    .filter((item) => {
                        const typeKey = item.type ? item.type.toLowerCase() : 'lainnya';
                        return filterState[typeKey] === true;
                    })
                    .map((item) => (
                        <Marker 
                            key={`report-${item.id}`} 
                            position={[item.lat, item.lon]}
                            icon={getCategoryIcon(item.type)}
                        >
                            <Popup className="request-popup">
                                <ReportPopup report={item} currentUser={currentUser} />
                            </Popup>
                        </Marker>
                ))}
            </MapContainer>
            <div className="absolute bottom-0 left-0 z-1000 pointer-events-none">
                <div className="bg-white border mb-5 ml-5 rounded-2xl pointer-events-auto">
                    <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7.90039 8.07954C7.90039 3.30678 15.4004 3.30682 15.4004 8.07955C15.4004 11.4886 11.9913 10.8067 11.9913 14.8976" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 19.01L12.01 18.9989" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
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
                        <Form  currentUser={currentUser} onClose={handleCloseTab} onSuccess={handleReportSuccess}/>
                    )}
                </div>
            </div>
            <div className="absolute w-full h-full top-0 z-1000 pointer-events-none">
                <div className={`justify-center items-center h-full bg-black/20 backdrop-blur-[1px] pointer-events-auto transition-all duration-300 ${activeTab === 'profile' ? 'flex' : 'hidden'}`}>
                    {activeTab === 'profile' && (
                        <Profile onClose={handleCloseTab} currentUser={currentUser} onAuthSuccess={onLoginSuccess} onLogout={onLogout}/>
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