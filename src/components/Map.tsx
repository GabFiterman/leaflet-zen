/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { updatePosition } from '../redux/slices/currentPosition';

const Map: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);
    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);

    const dispatch = useDispatch();

    function handleMoveEnd() {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            const newZoomLevel = mapRef.current.getZoom();

            dispatch(
                updatePosition({
                    latitude: newCenter.lat,
                    longitude: newCenter.lng,
                    zoomLevel: newZoomLevel,
                }),
            );
        }
    }

    useEffect(() => {
        if (
            currentPosition.latitude !== null &&
            currentPosition.longitude !== null &&
            currentPosition.zoomLevel !== null
        ) {
            const { latitude, longitude, zoomLevel } = currentPosition;

            if (!mapRef.current) {
                const map = L.map('map').setView([latitude, longitude], zoomLevel);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                }).addTo(map);
                mapRef.current = map;
            } else {
                mapRef.current.off('moveend');
                mapRef.current.setView([latitude, longitude], zoomLevel);
                mapRef.current.on('moveend', handleMoveEnd);
            }

            if (mapRef.current) {
                mapRef.current.on('moveend', handleMoveEnd);
            }
        } else if (initialPosition.latitude !== null && initialPosition.longitude !== null) {
            const { latitude, longitude, zoomLevel } = initialPosition;

            if (!mapRef.current) {
                const map = L.map('map').setView([latitude, longitude], zoomLevel);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                }).addTo(map);
                mapRef.current = map;
            } else {
                mapRef.current.off('moveend');
                mapRef.current.setView([latitude, longitude], zoomLevel);
                mapRef.current.on('moveend', handleMoveEnd);
            }

            if (mapRef.current) {
                mapRef.current.on('moveend', handleMoveEnd);
            }
        }
    }, [currentPosition, dispatch]);

    return <div id="map" className="h-5/6" />;
};

export default Map;
