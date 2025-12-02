import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Navbar from "./navbar";
import bmkg from "../API/bmkg.js"

export default function Leaflet(){
    
    const FlyToLocation = ({ coords }) => {
        const map = useMap(); // Mengambil instance peta

        useEffect(() => {
            if (coords) {
            // flyTo(koordinat, zoomLevel, options)
            map.flyTo(coords, 10, {
                duration: 2 // Durasi animasi terbang (detik)
            });
            }
        }, [coords, map]);

        return null; // Komponen ini tidak merender visual apa-apa
    };

    const { data: gempaAuto, loading, error } = bmkg('list');

    const [selectedPosition, setSelectedPosition] = useState(null);

    const handleGempaClick = (coordinateString) => {
        // Parse string "-7.1,110.5" menjadi array [-7.1, 110.5]
        const coords = coordinateString.split(',').map(parseFloat);
        setSelectedPosition(coords);
    };

    if (loading) return <p>Sedang memuat...</p>;
    if (error) return <p>Error: {error}</p>;
    // Koordinat Pusat Indonesia
    const centerPosition = [-2.5489, 118.0149]; 
    // Dummy
    const monasPosition = [-6.1754, 106.8272];
    
    return (
        <div className="relative h-screen w-full border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full z-1000 pointer-events-none">
                <Navbar />
            </div>
            <div className="absolute w-full h-full right-0 z-999 pointer-events-none">
                <div className="flex justify-end h-full items-center">
                    <div className="bg-black h-[8%] w-[1%] pointer-events-auto rounded-l-2xl">
                        
                    </div>
                    <div className="bg-white/80 w-1/6 h-screen overflow-y-auto pointer-events-auto">
                        {gempaAuto.map((gempa, idx) => (
                            <div key={idx} onClick={() => handleGempaClick(gempa.Coordinates)} className="p-4 border-b border-gray-300 text-sm cursor-pointer hover:bg-blue-100 transition">
                                <h2 className="font-bold text-gray-800">{gempa.Wilayah}</h2>
                                <p>Mag: <span className="text-red-500 font-bold">{gempa.Magnitude}</span></p>
                                <p className="text-xs text-gray-500">{gempa.Jam} | {gempa.Tanggal}</p>
                            </div>
                        ))}
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
            </MapContainer>
            <div className="absolute bottom-0 left-0 z-1000 pointer-events-none">
                <div className="bg-white border mb-5 ml-5 rounded-2xl pointer-events-auto">
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7.90039 8.07954C7.90039 3.30678 15.4004 3.30682 15.4004 8.07955C15.4004 11.4886 11.9913 10.8067 11.9913 14.8976" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 19.01L12.01 18.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
            </div> 
        </div>
    );
}