/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPointOfInterest,
    updatePointOfInterest,
    setSelectPointOfInterest,
    clearPointOfInterest,
} from '../../redux/slices/pointsOfInterest';
import { setFormType } from '../../redux/slices/formType';
import { Input } from '../atoms';
import axiosInstance from 'axios';
import { useDialog } from '../../context/DialogContext';

const AddPointForm: React.FC = () => {
    const dispatch = useDispatch();
    const { alertDialog } = useDialog();
    const selectedPointOfInterest = useSelector((state: any) => state.pointsOfInterest.selectedPointOfInterest);
    const pointsOfInterestList = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const descriptionRef = useRef<HTMLInputElement>(null);

    const [localDescription, setLocalDescription] = useState('');
    const [localLatitude, setLocalLatitude] = useState(selectedPointOfInterest?.latitude?.toString() || '');
    const [localLongitude, setLocalLongitude] = useState(selectedPointOfInterest?.longitude?.toString() || '');
    const [localZoomLevel, setLocalZoomLevel] = useState(selectedPointOfInterest?.zoomLevel?.toString() || '');

    const isEditMode = !!selectedPointOfInterest?.id;
    const originalItem = pointsOfInterestList.find((p: any) => String(p.id) === String(selectedPointOfInterest?.id));

    useEffect(() => {
        if (selectedPointOfInterest) {
            setLocalDescription(selectedPointOfInterest.description || '');

            const parsedLat = parseFloat(localLatitude);
            if (isNaN(parsedLat) || parsedLat !== selectedPointOfInterest.latitude) {
                setLocalLatitude(selectedPointOfInterest.latitude?.toString() || '');
            }

            const parsedLng = parseFloat(localLongitude);
            if (isNaN(parsedLng) || parsedLng !== selectedPointOfInterest.longitude) {
                setLocalLongitude(selectedPointOfInterest.longitude?.toString() || '');
            }

            const parsedZoom = parseInt(localZoomLevel);
            if (isNaN(parsedZoom) || parsedZoom !== selectedPointOfInterest.zoomLevel) {
                setLocalZoomLevel(selectedPointOfInterest.zoomLevel?.toString() || '');
            }

            if ((!isEditMode || !selectedPointOfInterest.description) && descriptionRef.current) {
                setTimeout(() => {
                    descriptionRef.current?.focus();
                }, 50);
            }
        }
    }, [selectedPointOfInterest, isEditMode]);

    const handleDescriptionChange = (val: string) => {
        setLocalDescription(val);
        dispatch(
            setSelectPointOfInterest({
                ...selectedPointOfInterest,
                description: val,
            }),
        );
    };

    const handleLatitudeChange = (val: string) => {
        setLocalLatitude(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectPointOfInterest({
                    ...selectedPointOfInterest,
                    latitude: parsed,
                }),
            );
        }
    };

    const handleLongitudeChange = (val: string) => {
        setLocalLongitude(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectPointOfInterest({
                    ...selectedPointOfInterest,
                    longitude: parsed,
                }),
            );
        }
    };

    const handleZoomChange = (val: string) => {
        setLocalZoomLevel(val);
        const parsed = parseInt(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectPointOfInterest({
                    ...selectedPointOfInterest,
                    zoomLevel: parsed,
                }),
            );
        }
    };

    const handleSavePointOfInterest = async () => {
        if (localLatitude.trim() !== '' && localLongitude.trim() !== '' && localZoomLevel.trim() !== '') {
            try {
                if (isEditMode) {
                    const updatedItem = {
                        id: selectedPointOfInterest.id,
                        description: localDescription,
                        latitude: parseFloat(localLatitude),
                        longitude: parseFloat(localLongitude),
                        zoomLevel: parseInt(localZoomLevel),
                        type: 'pointOfInterest',
                    };
                    await axiosInstance.put(
                        `http://${window.location.hostname}:3001/pointsOfInterest/${selectedPointOfInterest.id}`,
                        updatedItem,
                    );
                    dispatch(updatePointOfInterest(updatedItem));
                    alertDialog('Ponto atualizado com sucesso!');
                } else {
                    const newItem = {
                        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 100).toString()),
                        description: localDescription,
                        latitude: parseFloat(localLatitude),
                        longitude: parseFloat(localLongitude),
                        zoomLevel: parseInt(localZoomLevel),
                        type: 'pointOfInterest',
                    };
                    await axiosInstance.post(`http://${window.location.hostname}:3001/pointsOfInterest`, newItem);
                    dispatch(addPointOfInterest(newItem));
                    alertDialog('Novo ponto adicionado com sucesso!');
                    setLocalDescription('');
                    setLocalLatitude('');
                    setLocalLongitude('');
                    setLocalZoomLevel('');
                }
            } catch (error) {
                console.error('Error saving item:', error);
            }
        }
    };

    const handleCancel = () => {
        dispatch(clearPointOfInterest());
        dispatch(setSelectPointOfInterest(null as any));
        dispatch(setFormType('InitialForm'));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSavePointOfInterest();
        }
    };

    const isSaveEnabled = isEditMode
        ? originalItem &&
          (localDescription !== (originalItem.description || '') ||
              parseFloat(localLatitude) !== originalItem.latitude ||
              parseFloat(localLongitude) !== originalItem.longitude ||
              parseInt(localZoomLevel) !== originalItem.zoomLevel)
        : localDescription.trim() !== '' &&
          localLatitude.trim() !== '' &&
          localLongitude.trim() !== '' &&
          localZoomLevel.trim() !== '';

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-800">
                    {isEditMode ? 'Editar Ponto' : 'Adicionar Ponto de Interesse'}
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleCancel}
                        className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl border bg-white hover:bg-slate-50 border-slate-300 text-slate-700 transition cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSavePointOfInterest}
                        disabled={!isSaveEnabled}
                        className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl shadow-sm border transition ${
                            isSaveEnabled
                                ? 'bg-primary border-primary text-white hover:bg-primary/95 cursor-pointer'
                                : 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Salvar
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Descrição:</span>
                    <Input
                        ref={descriptionRef}
                        value={localDescription}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ex: Centro"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Latitude:</span>
                    <Input
                        value={localLatitude}
                        onChange={(e) => handleLatitudeChange(e.target.value)}
                        placeholder="Latitude"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Longitude:</span>
                    <Input
                        value={localLongitude}
                        onChange={(e) => handleLongitudeChange(e.target.value)}
                        placeholder="Longitude"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Zoom:</span>
                    <Input
                        value={localZoomLevel}
                        onChange={(e) => handleZoomChange(e.target.value)}
                        placeholder="Zoom"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddPointForm;
