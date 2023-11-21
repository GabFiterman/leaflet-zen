/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSelector } from 'react-redux';

const Map: React.FC = () => {
    const mapRef = useRef({});
    console.log(mapRef);

    const initialData = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest[0]);

    useEffect(() => {
        if (mapRef.current && initialData) {
            const { latitude, longitude, zoomLevel } = initialData;
            if (latitude && longitude && zoomLevel) {
                const map = L.map('map').setView([latitude, longitude], zoomLevel);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                }).addTo(map);
                mapRef.current = map;
            }
        }
    }, [initialData]);

    return <div id="map" className="h-5/6" />;
};

export default Map;
