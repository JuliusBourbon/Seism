import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Leaflet(){
    // Koordinat Pusat Indonesia
    const centerPosition = [-2.5489, 118.0149]; 

    // Koordinat Dummy untuk Marker (Contoh: Monas, Jakarta)
    const monasPosition = [-6.1754, 106.8272];

    return (
        <div className="p-4 border-2 border-gray-200 rounded-xl shadow-lg">
            <MapContainer center={centerPosition} zoom={5} scrollWheelZoom={true} className="h-screen w-full rounded-lg z-0">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={monasPosition}>
                    <Popup>
                        <div className="text-center">
                            <b className="text-lg">Monas (Jakarta)</b> <br />
                            Ini adalah marker contoh. <br />
                            Saya belum terhubung API.
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
  );
}