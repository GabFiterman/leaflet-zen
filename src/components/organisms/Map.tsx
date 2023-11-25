/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectPointOfInterest } from '../../redux/slices/pointsOfInterest';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';
import { setSelectAreaOfInterest } from '../../redux/slices/areasOfInterest';
import { setSelectPerimeterAttention } from '../../redux/slices/perimetersAttention';
import mapPointMarker from '../atoms/MapMarker.svg';

const Map: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);

    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);
    const formType = useSelector((state: any) => state.formType.currentForm);
    const { showPointOfInterest } = useSelector((state: any) => state.pointsOfInterest);
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

    const drawControl = useRef<L.Control.Draw | null>(null);

    // Crie uma referência para armazenar o marcador
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (showPointOfInterest) {
            const mapMarkerIcon = L.icon({
                iconUrl: mapPointMarker,
                iconSize: [38, 95],
                popupAnchor: [-3, -76],
            });
            if (mapRef.current) {
                // Adicione o marcador ao mapa e armazene a referência na variável marker
                markerRef.current = L.marker([showPointOfInterest.latitude, showPointOfInterest.longitude], {
                    icon: mapMarkerIcon,
                }).addTo(mapRef.current);
            }
        } else if (markerRef.current) {
            // Se showPointOfInterest é null e o marcador existe, remova o marcador do mapa
            markerRef.current.remove();
            markerRef.current = null;
        }
    }, [showPointOfInterest]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.off('moveend');
            mapRef.current.setView([currentPosition.latitude, currentPosition.longitude], currentPosition.zoomLevel);
            mapRef.current.on('moveend', handleMoveEnd);

            if (formType === 'AddPointForm') {
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
            } else if (formType === 'AddAreaForm') {
                const drawnItems = new L.FeatureGroup();
                mapRef.current.addLayer(drawnItems);

                if (drawControl.current) {
                    mapRef.current.removeControl(drawControl.current);
                }

                drawControl.current = new L.Control.Draw({
                    draw: {
                        rectangle: {},
                        polygon: false,
                        polyline: false,
                        circle: false,
                        marker: false,
                        circlemarker: false,
                    },
                    position: 'topleft',
                });
                L.drawLocal.draw.toolbar.buttons.rectangle = 'Criar Área';

                mapRef.current.addControl(drawControl.current);

                mapRef.current.off('click');

                mapRef.current.on(L.Draw.Event.CREATED, function (e: any) {
                    const type = e.layerType;
                    const layer = e.layer;

                    drawnItems.clearLayers();

                    if (type === 'rectangle') {
                        const bounds = layer.getBounds();
                        const topLeft = { latitude: bounds.getNorthWest().lat, longitude: bounds.getNorthWest().lng };
                        const bottomRight = {
                            latitude: bounds.getSouthEast().lat,
                            longitude: bounds.getSouthEast().lng,
                        };
                        dispatch(setSelectAreaOfInterest({ topLeft, bottomRight }));
                    }

                    drawnItems.addLayer(layer);
                });
            } else if (formType === 'AddPerimeterForm') {
                const drawnItems = new L.FeatureGroup();
                mapRef.current.addLayer(drawnItems);

                if (drawControl.current) {
                    mapRef.current.removeControl(drawControl.current);
                }
                drawControl.current = new L.Control.Draw({
                    draw: {
                        rectangle: false,
                        polygon: false,
                        polyline: false,
                        circle: { shapeOptions: { color: '#4daf4a' } },
                        marker: false,
                        circlemarker: false,
                    },
                    position: 'topleft',
                });
                L.drawLocal.draw.toolbar.buttons.circle = 'Criar Perímetro';

                mapRef.current.addControl(drawControl.current);

                mapRef.current.off('click');

                mapRef.current.on(L.Draw.Event.CREATED, function (e: any) {
                    const type = e.layerType;
                    const layer = e.layer;

                    drawnItems.clearLayers();

                    if (type === 'circle') {
                        const center = layer.getLatLng();
                        const radius = layer.getRadius();
                        const centerSimple = { latitude: center.lat, longitude: center.lng };
                        dispatch(setSelectPerimeterAttention({ center: centerSimple, radius }));
                    }

                    drawnItems.addLayer(layer);
                });
            } else if (formType !== 'AddAreaForm') {
                mapRef.current.off('draw:created');
            }
        }
    }, [currentPosition, formType, showPointOfInterest]);

    useEffect(() => {
        const position =
            currentPosition.latitude !== null && currentPosition.longitude !== null ? currentPosition : initialPosition;

        if (!mapRef.current) {
            const map = L.map('map').setView([position.latitude, position.longitude], position.zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© GabFiterman',
            }).addTo(map);

            mapRef.current = map;

            map.on('moveend', handleMoveEnd);
        }
    }, [currentPosition, initialPosition, dispatch]);

    return <div id="map" className="h-5/6" />;
};

export default Map;
