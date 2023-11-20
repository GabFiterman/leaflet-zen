import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Map: React.FC = () => {
    useEffect(() => {
        const map = L.map('map').setView([-16.702990657148366, -49.238985014429765], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);
    }, []);

    return <div id="map" style={{ height: '90vh' }} />;
};

export default Map;
