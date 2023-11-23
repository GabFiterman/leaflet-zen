/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectPointOfInterest } from '../../redux/slices/pointsOfInterest';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';
import mapPointMarker from '../atoms/MapMarker.svg';

const Map: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);

    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);
    const formType = useSelector((state: any) => state.formType.currentForm);

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
        console.log(formType);
        if (mapRef.current) {
            mapRef.current.off('moveend');
            mapRef.current.setView([currentPosition.latitude, currentPosition.longitude], currentPosition.zoomLevel);
            mapRef.current.on('moveend', handleMoveEnd);

            if (formType == 'AddPointForm') {
                let marker: L.Marker | null = null;
                mapRef.current.on('click', function (e) {
                    const { lat, lng } = e.latlng;
                    dispatch(
                        setSelectPointOfInterest({
                            latitude: lat,
                            longitude: lng,
                            zoomLevel: currentPosition.zoomLevel,
                        }),
                    );
                    if (mapRef.current) {
                        if (marker) {
                            mapRef.current.removeLayer(marker);
                        }
                        const mapMarkerIcon = L.icon({
                            iconUrl: mapPointMarker,
                            iconSize: [38, 95],
                            popupAnchor: [-3, -76],
                        });
                        marker = L.marker([lat, lng], { icon: mapMarkerIcon }).addTo(mapRef.current);
                    }
                });
            }
        }
    }, [currentPosition, formType]);

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
