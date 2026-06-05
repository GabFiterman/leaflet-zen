/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectPointOfInterest, clearPointOfInterest } from '../../redux/slices/pointsOfInterest';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';
import { setSelectAreaOfInterest, clearAreaOfInterest } from '../../redux/slices/areasOfInterest';
import { setSelectPerimeterAttention, clearPerimetersAttention } from '../../redux/slices/perimetersAttention';
import { setFormType } from '../../redux/slices/formType';

(L as any).drawLocal = {
    draw: {
        toolbar: {
            actions: {
                title: 'Cancelar desenho',
                text: 'Cancelar',
            },
            finish: {
                title: 'Finalizar desenho',
                text: 'Finalizar',
            },
            undo: {
                title: 'Deletar último ponto desenhado',
                text: 'Deletar último ponto',
            },
            buttons: {
                polyline: 'Desenhar uma linha',
                polygon: 'Desenhar um polígono',
                rectangle: 'Desenhar uma área',
                circle: 'Desenhar um perímetro',
                marker: 'Desenhar um ponto',
                circlemarker: 'Desenhar um marcador circular',
            },
        },
        handlers: {
            circle: {
                tooltip: {
                    start: 'Clique e arraste para desenhar o perímetro.',
                },
                radius: 'Raio',
            },
            circlemarker: {
                tooltip: {
                    start: 'Clique no mapa para posicionar o perímetro.',
                },
            },
            marker: {
                tooltip: {
                    start: 'Clique no mapa para posicionar o ponto.',
                },
            },
            polygon: {
                tooltip: {
                    start: 'Clique para começar a desenhar a forma.',
                    cont: 'Clique para continuar desenhando a forma.',
                    end: 'Clique no primeiro ponto para fechar esta forma.',
                },
            },
            polyline: {
                error: '<strong>Erro:</strong> as linhas não podem se cruzar!',
                tooltip: {
                    start: 'Clique para começar a desenhar a linha.',
                    cont: 'Clique para continuar desenhando a linha.',
                    end: 'Clique no último ponto para finalizar a linha.',
                },
            },
            rectangle: {
                tooltip: {
                    start: 'Clique e arraste para desenhar a área.',
                },
            },
            simpleshape: {
                tooltip: {
                    end: 'Solte o mouse para finalizar o desenho.',
                },
            },
        },
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: 'Salvar alterações',
                    text: 'Salvar',
                },
                cancel: {
                    title: 'Descartar alterações',
                    text: 'Cancelar',
                },
                clearAll: {
                    title: 'Limpar todos os elementos',
                    text: 'Limpar tudo',
                },
            },
            buttons: {
                edit: 'Editar camadas',
                editDisabled: 'Nenhuma camada para editar',
                remove: 'Deletar camadas',
                removeDisabled: 'Nenhuma camada para deletar',
            },
        },
        handlers: {
            edit: {
                tooltip: {
                    text: 'Arraste as alças ou marcadores para editar as formas.',
                    subtext: 'Clique em cancelar para descartar as alterações.',
                },
            },
            remove: {
                tooltip: {
                    text: 'Clique em uma forma para removê-la.',
                },
            },
        },
    },
};

const mapPointMarkerIcon = L.divIcon({
    html: `<div style="font-size: 28px; text-shadow: 0 1px 3px rgba(0,0,0,0.3); transform: translate(-3px, -14px);">📍</div>`,
    className: 'custom-pin-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

const mapPointSelectedMarkerIcon = L.divIcon({
    html: `<div class="animate-marker-blink" style="font-size: 28px; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">📍</div>`,
    className: 'custom-pin-marker-selected',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

const Map: React.FC = () => {
    const [map, setMap] = useState<L.Map | null>(null);
    const activeDrawHandler = useRef<any>(null);
    const previewLayerRef = useRef<any>(null);

    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);
    const formType = useSelector((state: any) => state.formType.currentForm);

    const pointsOfInterestList = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const areasOfInterestList = useSelector((state: any) => state.areasOfInterest.areasOfInterest);
    const perimetersAttentionList = useSelector((state: any) => state.perimetersAttention.perimetersAttention);

    const hiddenPoints = useSelector((state: any) => state.pointsOfInterest.hiddenPoints || []);
    const hiddenAreas = useSelector((state: any) => state.areasOfInterest.hiddenAreas || []);
    const hiddenPerimeters = useSelector((state: any) => state.perimetersAttention.hiddenPerimeters || []);

    const { showPointOfInterest, selectedPointOfInterest } = useSelector((state: any) => state.pointsOfInterest);
    const { showAreaOfInterest, selectedAreaOfInterest } = useSelector((state: any) => state.areasOfInterest);
    const { showPerimeterAttention, selectedPerimeterAttention } = useSelector(
        (state: any) => state.perimetersAttention,
    );
    const dispatch = useDispatch();

    const isEditingPoint = !!selectedPointOfInterest?.id;
    const isEditingArea = !!selectedAreaOfInterest?.id;
    const isEditingPerimeter = !!selectedPerimeterAttention?.id;

    const pointsGroupRef = useRef<L.FeatureGroup | null>(null);
    const areasGroupRef = useRef<L.FeatureGroup | null>(null);
    const perimetersGroupRef = useRef<L.FeatureGroup | null>(null);

    const handleMoveEnd = (e: any) => {
        const activeMap = e.target;
        if (activeMap) {
            const newCenter = activeMap.getCenter();
            const newZoomLevel = activeMap.getZoom();
            const newPosition = {
                latitude: parseFloat(newCenter.lat.toFixed(6)),
                longitude: parseFloat(newCenter.lng.toFixed(6)),
                zoomLevel: newZoomLevel,
            };
            dispatch(updateCurrentPosition(newPosition));
        }
    };

    useEffect(() => {
        if (map && (formType === 'InitialForm' || !formType)) {
            if (previewLayerRef.current) {
                map.removeLayer(previewLayerRef.current);
                previewLayerRef.current = null;
            }
        }
    }, [map, formType]);

    useEffect(() => {
        if (!map) return;

        if (formType === 'AddPointForm') {
            if (previewLayerRef.current) {
                map.removeLayer(previewLayerRef.current);
                previewLayerRef.current = null;
            }
            if (selectedPointOfInterest && !selectedPointOfInterest.id) {
                const { latitude, longitude } = selectedPointOfInterest;
                if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
                    previewLayerRef.current = L.marker([latitude, longitude], { icon: mapPointMarkerIcon }).addTo(map);
                }
            }
        } else if (formType === 'AddAreaForm') {
            if (previewLayerRef.current) {
                map.removeLayer(previewLayerRef.current);
                previewLayerRef.current = null;
            }
            if (selectedAreaOfInterest && !selectedAreaOfInterest.id) {
                const { topLeft, bottomRight } = selectedAreaOfInterest;
                if (
                    topLeft &&
                    bottomRight &&
                    !isNaN(topLeft.latitude) &&
                    !isNaN(topLeft.longitude) &&
                    !isNaN(bottomRight.latitude) &&
                    !isNaN(bottomRight.longitude)
                ) {
                    const bounds = L.latLngBounds(
                        L.latLng(topLeft.latitude, topLeft.longitude),
                        L.latLng(bottomRight.latitude, bottomRight.longitude),
                    );
                    previewLayerRef.current = L.rectangle(bounds, {
                        color: '#16a34a',
                        fillColor: '#16a34a',
                        fillOpacity: 0.15,
                        weight: 4,
                    }).addTo(map);
                }
            }
        } else if (formType === 'AddPerimeterForm') {
            if (previewLayerRef.current) {
                map.removeLayer(previewLayerRef.current);
                previewLayerRef.current = null;
            }
            if (selectedPerimeterAttention && !selectedPerimeterAttention.id) {
                const { center, radius } = selectedPerimeterAttention;
                if (
                    center &&
                    radius !== undefined &&
                    !isNaN(center.latitude) &&
                    !isNaN(center.longitude) &&
                    !isNaN(radius)
                ) {
                    previewLayerRef.current = L.circle([center.latitude, center.longitude], {
                        color: '#104e8b',
                        fillColor: '#104e8b',
                        fillOpacity: 0.35,
                        radius: radius,
                        weight: 4,
                    }).addTo(map);
                }
            }
        }
    }, [map, formType, selectedPointOfInterest, selectedAreaOfInterest, selectedPerimeterAttention]);

    useEffect(() => {
        const handleFlyToInitial = () => {
            if (map && initialPosition.latitude !== null && initialPosition.longitude !== null) {
                map.flyTo([initialPosition.latitude, initialPosition.longitude], initialPosition.zoomLevel || 13, {
                    duration: 0.25,
                });
            }
        };
        window.addEventListener('fly-to-initial-position', handleFlyToInitial);
        return () => {
            window.removeEventListener('fly-to-initial-position', handleFlyToInitial);
        };
    }, [map, initialPosition]);

    useEffect(() => {
        if (!map) return;

        if (!pointsGroupRef.current) {
            pointsGroupRef.current = new L.FeatureGroup().addTo(map);
        }
        if (!areasGroupRef.current) {
            areasGroupRef.current = new L.FeatureGroup().addTo(map);
        }
        if (!perimetersGroupRef.current) {
            perimetersGroupRef.current = new L.FeatureGroup().addTo(map);
        }

        pointsGroupRef.current.clearLayers();
        areasGroupRef.current.clearLayers();
        perimetersGroupRef.current.clearLayers();
        pointsOfInterestList.forEach((point: any) => {
            if (hiddenPoints.includes(point.id)) return; // Skip if hidden!

            if (pointsGroupRef.current) {
                const isSelected = selectedPointOfInterest && String(selectedPointOfInterest.id) === String(point.id);
                const activePoint = isSelected ? selectedPointOfInterest : point;

                const marker = L.marker([activePoint.latitude, activePoint.longitude], {
                    icon: isSelected ? mapPointSelectedMarkerIcon : mapPointMarkerIcon,
                    draggable: isSelected, // Dragging enabled when selected!
                    interactive: isSelected || !(formType === 'AddPointForm' && isEditingPoint),
                });

                marker.bindPopup(`<b>Ponto:</b> ${activePoint.description}`);
                marker.addTo(pointsGroupRef.current);

                if (isSelected) {
                    L.circle([activePoint.latitude, activePoint.longitude], {
                        color: '#104e8b',
                        fillColor: '#104e8b',
                        fillOpacity: 0.25,
                        radius: 150,
                        weight: 3,
                    }).addTo(pointsGroupRef.current);

                    marker.on('dragend', () => {
                        const position = marker.getLatLng();
                        dispatch(
                            setSelectPointOfInterest({
                                ...activePoint,
                                latitude: position.lat,
                                longitude: position.lng,
                            }),
                        );
                    });
                }
            }
        });

        areasOfInterestList.forEach((area: any) => {
            if (hiddenAreas.includes(area.id)) return;

            if (area.topLeft && area.bottomRight && areasGroupRef.current) {
                const isSelected = selectedAreaOfInterest && String(selectedAreaOfInterest.id) === String(area.id);
                const activeArea = isSelected ? selectedAreaOfInterest : area;

                const bounds = L.latLngBounds(
                    L.latLng(activeArea.topLeft.latitude, activeArea.topLeft.longitude),
                    L.latLng(activeArea.bottomRight.latitude, activeArea.bottomRight.longitude),
                );

                const layer = L.rectangle(bounds, {
                    color: '#16a34a',
                    weight: isSelected ? 4 : 1.5,
                    dashArray: isSelected ? '' : '5, 3',
                    fillColor: '#16a34a',
                    fillOpacity: isSelected ? 0.15 : 0.1,
                    interactive: !(formType === 'AddPointForm' && isEditingPoint),
                });

                layer.bindPopup(`<b>Area:</b> ${activeArea.description}`);
                layer.addTo(areasGroupRef.current);

                if (isSelected) {
                    if ((layer as any).editing) {
                        (layer as any).editing.enable();
                    }
                    layer.on('edit', () => {
                        const newBounds = layer.getBounds();
                        dispatch(
                            setSelectAreaOfInterest({
                                ...activeArea,
                                topLeft: {
                                    latitude: newBounds.getNorthWest().lat,
                                    longitude: newBounds.getNorthWest().lng,
                                },
                                bottomRight: {
                                    latitude: newBounds.getSouthEast().lat,
                                    longitude: newBounds.getSouthEast().lng,
                                },
                            }),
                        );
                    });
                }
            }
        });

        perimetersAttentionList.forEach((perimeter: any) => {
            if (hiddenPerimeters.includes(perimeter.id)) return;

            if (perimeter.center && perimetersGroupRef.current) {
                const isSelected =
                    selectedPerimeterAttention && String(selectedPerimeterAttention.id) === String(perimeter.id);
                const activePerimeter = isSelected ? selectedPerimeterAttention : perimeter;

                const layer = L.circle([activePerimeter.center.latitude, activePerimeter.center.longitude], {
                    color: '#104e8b',
                    fillColor: '#104e8b',
                    fillOpacity: isSelected ? 0.35 : 0.1,
                    radius: activePerimeter.radius,
                    weight: isSelected ? 4 : 1.5,
                    dashArray: isSelected ? '' : '5, 5',
                    interactive: !(formType === 'AddPointForm' && isEditingPoint),
                });

                layer.bindPopup(
                    `<b>Perímetro:</b> ${activePerimeter.description}<br/>Raio: ${activePerimeter.radius.toFixed(0)}m`,
                );
                layer.addTo(perimetersGroupRef.current);

                if (isSelected) {
                    if ((layer as any).editing) {
                        (layer as any).editing.enable();
                    }
                    layer.on('edit', () => {
                        const center = layer.getLatLng();
                        const radius = layer.getRadius();
                        dispatch(
                            setSelectPerimeterAttention({
                                ...activePerimeter,
                                center: { latitude: center.lat, longitude: center.lng },
                                radius,
                            }),
                        );
                    });
                }
            }
        });
    }, [
        map,
        pointsOfInterestList,
        areasOfInterestList,
        perimetersAttentionList,
        hiddenPoints,
        hiddenAreas,
        hiddenPerimeters,
        showPointOfInterest,
        showAreaOfInterest,
        showPerimeterAttention,
        selectedPointOfInterest,
        selectedAreaOfInterest,
        selectedPerimeterAttention,
    ]);

    useEffect(() => {
        if (map && showPointOfInterest) {
            map.flyTo(
                [showPointOfInterest.latitude, showPointOfInterest.longitude],
                showPointOfInterest.zoomLevel || 13,
                { duration: 0.33 },
            );
        }
    }, [map, showPointOfInterest]);

    useEffect(() => {
        if (map && showAreaOfInterest) {
            const { topLeft, bottomRight } = showAreaOfInterest;
            const bounds = L.latLngBounds(
                L.latLng(topLeft.latitude, topLeft.longitude),
                L.latLng(bottomRight.latitude, bottomRight.longitude),
            );
            map.flyToBounds(bounds, { duration: 0.25, maxZoom: 14 });
        }
    }, [map, showAreaOfInterest]);

    useEffect(() => {
        if (map && showPerimeterAttention) {
            const { center, radius } = showPerimeterAttention;
            const centerLatLng = L.latLng(center.latitude, center.longitude);
            const tempCircle = L.circle(centerLatLng, { radius }).addTo(map);
            const bounds = tempCircle.getBounds();
            tempCircle.remove();
            map.flyToBounds(bounds, { duration: 0.33, maxZoom: 14 });
        }
    }, [map, showPerimeterAttention]);

    useEffect(() => {
        if (map) {
            map.off('click');
            map.off('mousemove');
            if (activeDrawHandler.current) {
                activeDrawHandler.current.disable();
                activeDrawHandler.current = null;
            }

            const mapPointMarkerIcon = L.divIcon({
                html: `<div style="font-size: 28px; text-shadow: 0 1px 3px rgba(0,0,0,0.3); transform: translate(-3px, -14px);">📍</div>`,
                className: 'custom-pin-marker',
                iconSize: [28, 28],
                iconAnchor: [14, 28],
            });

            if (formType === 'AddPointForm') {
                const tooltip = new (L as any).Draw.Tooltip(map);
                tooltip.updateContent({
                    text: isEditingPoint
                        ? 'Clique no mapa para alterar a localização do ponto.'
                        : 'Clique no mapa para posicionar o ponto.',
                });

                const handleMouseMove = (e: any) => {
                    tooltip.updatePosition(e.latlng);
                };

                map.on('mousemove', handleMouseMove);

                map.on('click', function (e) {
                    const { lat, lng } = e.latlng;
                    dispatch(
                        setSelectPointOfInterest({
                            ...selectedPointOfInterest,
                            latitude: lat,
                            longitude: lng,
                            zoomLevel: map.getZoom() || currentPosition.zoomLevel,
                        }),
                    );

                    if (!isEditingPoint) {
                        if (previewLayerRef.current) {
                            map.removeLayer(previewLayerRef.current);
                        }
                        const marker = L.marker([lat, lng], { icon: mapPointMarkerIcon }).addTo(map);
                        previewLayerRef.current = marker;
                    }
                });

                return () => {
                    map.off('mousemove', handleMouseMove);
                    map.off('click');
                    tooltip.dispose();
                };
            } else if (formType === 'AddAreaForm' && !isEditingArea) {
                const handler = new L.Draw.Rectangle(map as any, {
                    shapeOptions: {
                        color: '#16a34a',
                        weight: 2,
                        dashArray: '5, 5',
                        fillColor: '#16a34a',
                        fillOpacity: 0.1,
                    },
                });
                activeDrawHandler.current = handler;
                handler.enable();
            } else if (formType === 'AddPerimeterForm' && !isEditingPerimeter) {
                const handler = new L.Draw.Circle(map as any, {
                    shapeOptions: {
                        color: '#104e8b',
                        fillColor: '#104e8b',
                        fillOpacity: 0.15,
                    },
                });
                activeDrawHandler.current = handler;
                handler.enable();
            }
        }
    }, [map, formType, isEditingPoint, isEditingArea, isEditingPerimeter, dispatch]);

    // Initial map setup
    useEffect(() => {
        const position =
            currentPosition.latitude !== null && currentPosition.longitude !== null ? currentPosition : initialPosition;

        if (!map) {
            const mapInstance = L.map('map', { zoomControl: false }).setView(
                [position.latitude, position.longitude],
                position.zoomLevel,
            );
            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© GabFiterman',
            }).addTo(mapInstance);

            setMap(mapInstance);

            dispatch(
                updateCurrentPosition({
                    latitude: position.latitude,
                    longitude: position.longitude,
                    zoomLevel: position.zoomLevel,
                }),
            );

            mapInstance.on('moveend', handleMoveEnd);

            mapInstance.on(L.Draw.Event.CREATED, function (e: any) {
                const type = e.layerType;
                const layer = e.layer;

                if (previewLayerRef.current) {
                    mapInstance.removeLayer(previewLayerRef.current);
                }

                previewLayerRef.current = layer;
                layer.addTo(mapInstance);

                if (type === 'rectangle') {
                    if ((layer as any).editing) {
                        (layer as any).editing.enable();
                    }
                    const updateCoords = () => {
                        const bounds = layer.getBounds();
                        dispatch(
                            setSelectAreaOfInterest({
                                topLeft: { latitude: bounds.getNorthWest().lat, longitude: bounds.getNorthWest().lng },
                                bottomRight: {
                                    latitude: bounds.getSouthEast().lat,
                                    longitude: bounds.getSouthEast().lng,
                                },
                            }),
                        );
                    };
                    updateCoords();
                    layer.on('edit', updateCoords);
                } else if (type === 'circle') {
                    if ((layer as any).editing) {
                        (layer as any).editing.enable();
                    }
                    const updateCoords = () => {
                        const center = layer.getLatLng();
                        const radius = layer.getRadius();
                        dispatch(
                            setSelectPerimeterAttention({
                                center: { latitude: center.lat, longitude: center.lng },
                                radius,
                            }),
                        );
                    };
                    updateCoords();
                    layer.on('edit', updateCoords);
                }
            });
        }
    }, [dispatch]);

    const handleStartDrawing = (type: any) => {
        dispatch(clearPointOfInterest());
        dispatch(setSelectPointOfInterest(null as any));
        dispatch(clearAreaOfInterest());
        dispatch(setSelectAreaOfInterest(null as any));
        dispatch(clearPerimetersAttention());
        dispatch(setSelectPerimeterAttention(null as any));

        dispatch(setFormType(type));
    };

    return (
        <div className="relative w-full h-full min-h-[400px]">
            <div id="map" className="h-full w-full rounded-lg shadow-md" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-row items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-200 max-w-[90vw] overflow-x-auto">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap hidden sm:inline border-r pr-2 mr-1">
                    Desenhar:
                </span>
                <button
                    onClick={() => handleStartDrawing('AddPointForm')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition font-semibold border whitespace-nowrap ${formType === 'AddPointForm' && !isEditingPoint
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                >
                    <span>📍</span> Ponto
                </button>
                <button
                    onClick={() => handleStartDrawing('AddAreaForm')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition font-semibold border whitespace-nowrap ${formType === 'AddAreaForm' && !isEditingArea
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                >
                    <span>🟩</span> Área
                </button>
                <button
                    onClick={() => handleStartDrawing('AddPerimeterForm')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition font-semibold border whitespace-nowrap ${formType === 'AddPerimeterForm' && !isEditingPerimeter
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                >
                    <span>🔵</span> Perímetro
                </button>
            </div>
        </div>
    );
};

export default Map;
