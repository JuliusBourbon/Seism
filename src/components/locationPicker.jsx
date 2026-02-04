import React, { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
});

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], 14, { animate: false });
        }
    }, [lat, lng, map]);
    return null;
};

function DraggableMarker({ position, setPosition, onLocationChange, userPosition }) {
    const markerRef = useRef(null)

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    
                    if (userPosition) {
                        const start = L.latLng(userPosition[0], userPosition[1]);
                    }
                    setPosition(newPos)
                    onLocationChange(newPos)
                }
            },
        }),
        [onLocationChange, userPosition?.[0], userPosition?.[1]],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}>
            <Popup minWidth={90}>
                <span>Geser pin ini ke lokasi kejadian.</span>
            </Popup>
        </Marker>
    )
}

export default function LocationPicker({ onLocationChange, userPosition }) {
    const defaultCenter = [-2.5489, 118.0149]; 
    
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);

    useEffect(() => {
        if (userPosition) {
            const newPos = { lat: userPosition[0], lng: userPosition[1] };
            setMarkerPosition(newPos);
            onLocationChange(newPos); 
        }
    }, [userPosition?.[0], userPosition?.[1]]);
    const centerMap = userPosition ? userPosition : defaultCenter;

    return (
        <div className="h-full w-full relative z-0">
             <MapContainer center={centerMap} zoom={5} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userPosition && (
                    <RecenterAutomatically lat={userPosition[0]} lng={userPosition[1]} />
                )}

                {userPosition && (
                    <Circle 
                        center={userPosition} 
                        radius={10000} 
                        pathOptions={{ color: 'blue', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }} 
                    />
                )}

                <DraggableMarker 
                    position={markerPosition} 
                    setPosition={setMarkerPosition} 
                    onLocationChange={onLocationChange}
                    userPosition={userPosition}
                />
            </MapContainer>
        </div>
    );
}