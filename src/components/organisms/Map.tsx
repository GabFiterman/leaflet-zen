/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';

const Map: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);
    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);

    const dispatch = useDispatch();

    function handleMoveEnd() {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            const newZoomLevel = mapRef.current.getZoom();

            const newPosition = {
                latitude: newCenter?.lat,
                longitude: newCenter?.lng,
                zoomLevel: newZoomLevel,
            };

            if (
                currentPosition.latitude !== newPosition.latitude ||
                currentPosition.longitude !== newPosition.longitude ||
                currentPosition.zoomLevel !== newPosition.zoomLevel
            ) {
                dispatch(updateCurrentPosition(newPosition));
            }
        }
    }

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.off('moveend');
            mapRef.current.setView([currentPosition.latitude, currentPosition.longitude], currentPosition.zoomLevel);
            mapRef.current.on('moveend', handleMoveEnd);
        }
    }, [currentPosition]);

    useEffect(() => {
        const position =
            currentPosition.latitude !== null && currentPosition.longitude !== null ? currentPosition : initialPosition;

        if (!mapRef.current) {
            const map = L.map('map').setView([position.latitude, position.longitude], position.zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);
            mapRef.current = map;

            map.on('moveend', handleMoveEnd);
        }
    }, [currentPosition, initialPosition, dispatch]);

    return <div id="map" className="h-5/6" />;
};

export default Map;
