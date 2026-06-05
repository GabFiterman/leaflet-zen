/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';
import { updateInitialPosition } from '../../redux/slices/initialPosition';
import { Input } from './../atoms';
import axios from 'axios';
import { useDialog } from '../../context/DialogContext';

const InitialForm: React.FC = () => {
    const dispatch = useDispatch();
    const { alertDialog } = useDialog();
    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);

    const [localLatitude, setLocalLatitude] = useState(initialPosition?.latitude?.toString() || '');
    const [localLongitude, setLocalLongitude] = useState(initialPosition?.longitude?.toString() || '');
    const [localZoomLevel, setLocalZoomLevel] = useState(initialPosition?.zoomLevel?.toString() || '');

    useEffect(() => {
        if (
            initialPosition.latitude !== null &&
            initialPosition.longitude !== null &&
            initialPosition.zoomLevel !== null
        ) {
            setLocalLatitude(initialPosition.latitude.toString());
            setLocalLongitude(initialPosition.longitude.toString());
            setLocalZoomLevel(initialPosition.zoomLevel.toString());
        }
    }, [initialPosition]);

    const handleSetCurrent = () => {
        if (
            currentPosition.latitude !== null &&
            currentPosition.longitude !== null &&
            currentPosition.zoomLevel !== null
        ) {
            setLocalLatitude(currentPosition.latitude.toFixed(6));
            setLocalLongitude(currentPosition.longitude.toFixed(6));
            setLocalZoomLevel(currentPosition.zoomLevel.toString());
        }
    };

    const handleCancel = () => {
        if (
            initialPosition.latitude !== null &&
            initialPosition.longitude !== null &&
            initialPosition.zoomLevel !== null
        ) {
            setLocalLatitude(initialPosition.latitude.toString());
            setLocalLongitude(initialPosition.longitude.toString());
            setLocalZoomLevel(initialPosition.zoomLevel.toString());
        }
    };

    const handleUpdateInitialPosition = async () => {
        if (localLatitude.trim() !== '' && localLongitude.trim() !== '' && localZoomLevel.trim() !== '') {
            const newItem = {
                latitude: parseFloat(localLatitude),
                longitude: parseFloat(localLongitude),
                zoomLevel: parseInt(localZoomLevel),
            };

            dispatch(updateInitialPosition(newItem));
            alertDialog('Posição inicial atualizada com sucesso!');

            try {
                const endpoint = '/initialPosition';
                await axios.post(`http://${window.location.hostname}:3001${endpoint}`, newItem);
            } catch (error) {
                console.warn('API is offline, data saved only in LocalStorage.', error);
            }
        }
    };

    const isSaveEnabled =
        localLatitude !== (initialPosition.latitude?.toString() || '') ||
        localLongitude !== (initialPosition.longitude?.toString() || '') ||
        localZoomLevel !== (initialPosition.zoomLevel?.toString() || '');

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-800">Ponto e Zoom Iniciais</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleSetCurrent}
                        className="px-3 py-2 text-xs font-bold rounded-xl border bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition cursor-pointer"
                        title="Definir atual"
                    >
                        Atual
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={!isSaveEnabled}
                        className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition border ${
                            isSaveEnabled
                                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 cursor-pointer'
                                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpdateInitialPosition}
                        disabled={!isSaveEnabled}
                        className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition shadow-sm border ${
                            isSaveEnabled
                                ? 'bg-primary border-primary text-white hover:bg-primary/95 cursor-pointer'
                                : 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Salvar
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Latitude:</span>
                    <Input
                        value={localLatitude}
                        onChange={(e) => setLocalLatitude(e.target.value)}
                        onBlur={() => {
                            dispatch(updateCurrentPosition({ latitude: parseFloat(localLatitude) }));
                        }}
                        placeholder="Latitude"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Longitude:</span>
                    <Input
                        value={localLongitude}
                        onChange={(e) => setLocalLongitude(e.target.value)}
                        onBlur={() => {
                            dispatch(updateCurrentPosition({ longitude: parseFloat(localLongitude) }));
                        }}
                        placeholder="Longitude"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Zoom:</span>
                    <Input
                        value={localZoomLevel}
                        onChange={(e) => setLocalZoomLevel(e.target.value)}
                        onBlur={() => {
                            dispatch(updateCurrentPosition({ zoomLevel: parseInt(localZoomLevel) }));
                        }}
                        placeholder="Zoom"
                    />
                </div>
            </div>
        </div>
    );
};

export default InitialForm;
