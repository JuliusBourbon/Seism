import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const pinIcon = new L.DivIcon({
    html: '<div style="font-size: 30px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">📍</div>',
    className: 'bg-transparent',
    iconSize: [30, 30],
    iconAnchor: [15, 30] 
});

// Helper Recenter map
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

export default function LocationPicker({ onLocationChange }){
    const [position, setPosition] = useState({ lat: -6.2000, lng: 106.8166 });
    const [isGPSActive, setIsGPSActive] = useState(false);

    // Location Detector
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not available in your browser");
            return;
        }

        setIsGPSActive(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                setPosition(newPos);
                onLocationChange(newPos); 
                setIsGPSActive(false);
            },
            (err) => {
                alert("Failed to fetch position: " + err.message);
                setIsGPSActive(false);
            }
        );
    };

    // Draggable Pin
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    onLocationChange({ lat: newPos.lat, lng: newPos.lng });
                }
            },
        }),
        [onLocationChange],
    );

    return (
        <div className="space-y-3">
               
            <div className="h-64 w-full rounded-lg border-2 border-gray-300 overflow-hidden relative z-0">
                <MapContainer center={position} zoom={13} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterAutomatically lat={position.lat} lng={position.lng} />
                    <div className='absolute z-1000 w-full pointer-events-none'>
                        <div className='flex w-full justify-end'>
                            <button type="button" onClick={handleGetLocation} className="bg-white font-bold py-2 px-3 rounded flex items-center justify-center hover:bg-blue-100 transition cursor-pointer m-2 pointer-events-auto">
                                {isGPSActive ? <svg width="24px" height="24px" stroke-width="2.4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                        <path d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M12 19V21" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 12H3" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M12 5V3" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 12H21" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg> : <svg width="24px" height="24px" stroke-width="2.4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                        <path d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M12 19V21" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 12H3" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M12 5V3" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 12H21" stroke="#000000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                }
                            </button>
                        </div>
                    </div>
                    <Marker
                        draggable={true}
                        eventHandlers={eventHandlers}
                        position={position}
                        ref={markerRef}
                        icon={pinIcon}
                    >
                        <Popup>Geser pin ini ke titik kejadian!</Popup>
                    </Marker>
                </MapContainer>
            </div>

            <p className="text-sm text-gray-700 text-center">
                Koordinat terpilih: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </p>
        </div>
    );
}