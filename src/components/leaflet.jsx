import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Navbar from "./navbar";

export default function Leaflet(){
    // Koordinat Pusat Indonesia
    const centerPosition = [-2.5489, 118.0149]; 

    // Koordinat Dummy untuk Marker (Contoh: Monas, Jakarta)
    const monasPosition = [-6.1754, 106.8272];

    return (
        <div className="relative h-screen w-full border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full z-1000 pointer-events-none">
                <Navbar />
            </div>
            <div className="absolute w-full h-full z-999 pointer-events-none">
                <div className="flex w-full h-full items-center">
                    <div className="bg-white/80 w-1/5 h-full pointer-events-auto">
                        <div className="">
                            <h1>SideBar</h1>
                        </div>
                    </div>
                    <div className="bg-black h-[8%] w-[1%] pointer-events-auto rounded-r-2xl">
                        
                    </div>
                </div>
            </div>
            <MapContainer center={centerPosition} zoom={5} scrollWheelZoom={true} className="h-full w-full z-0">
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
            <div className="absolute bottom-0 right-0 z-1000 pointer-events-none">
                <div className="bg-white border mb-5 mr-5 rounded-2xl pointer-events-auto">
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7.90039 8.07954C7.90039 3.30678 15.4004 3.30682 15.4004 8.07955C15.4004 11.4886 11.9913 10.8067 11.9913 14.8976" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 19.01L12.01 18.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
            </div> 
        </div>
  );
}