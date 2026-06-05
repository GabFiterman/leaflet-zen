/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPerimeterAttention,
    updatePerimeterAttention,
    setSelectPerimeterAttention,
    clearPerimetersAttention,
} from '../../redux/slices/perimetersAttention';
import { setFormType } from '../../redux/slices/formType';
import { Input } from '../atoms';
import axiosInstance from 'axios';
import { useDialog } from '../../context/DialogContext';

const AddPerimeterForm: React.FC = () => {
    const dispatch = useDispatch();
    const { alertDialog } = useDialog();
    const descriptionRef = useRef<HTMLInputElement>(null);

    const selectedPerimeterAttention = useSelector((state: any) =>
        state.perimetersAttention ? state.perimetersAttention.selectedPerimeterAttention || {} : {},
    );
    const perimetersAttentionList = useSelector((state: any) => state.perimetersAttention.perimetersAttention);

    const [localDescription, setLocalDescription] = useState('');
    const [localLatitude, setLocalLatitude] = useState(
        selectedPerimeterAttention?.center?.latitude !== undefined
            ? selectedPerimeterAttention.center.latitude.toString()
            : '',
    );
    const [localLongitude, setLocalLongitude] = useState(
        selectedPerimeterAttention?.center?.longitude !== undefined
            ? selectedPerimeterAttention.center.longitude.toString()
            : '',
    );
    const [localRadius, setLocalRadius] = useState(
        selectedPerimeterAttention?.radius !== undefined ? selectedPerimeterAttention.radius.toString() : '',
    );

    const isEditMode = !!selectedPerimeterAttention?.id;
    const originalItem = perimetersAttentionList.find(
        (p: any) => String(p.id) === String(selectedPerimeterAttention?.id),
    );

    useEffect(() => {
        if (selectedPerimeterAttention && selectedPerimeterAttention.center && selectedPerimeterAttention.radius) {
            const { latitude, longitude } = selectedPerimeterAttention.center;
            setLocalDescription(selectedPerimeterAttention.description || '');

            const parsedLat = parseFloat(localLatitude);
            if (isNaN(parsedLat) || parsedLat !== latitude) {
                setLocalLatitude(latitude.toString());
            }

            const parsedLng = parseFloat(localLongitude);
            if (isNaN(parsedLng) || parsedLng !== longitude) {
                setLocalLongitude(longitude.toString());
            }

            const parsedRadius = parseFloat(localRadius);
            if (isNaN(parsedRadius) || parsedRadius !== selectedPerimeterAttention.radius) {
                setLocalRadius(selectedPerimeterAttention.radius.toString());
            }

            if ((!isEditMode || !selectedPerimeterAttention.description) && descriptionRef.current) {
                setTimeout(() => {
                    descriptionRef.current?.focus();
                }, 50);
            }
        }
    }, [selectedPerimeterAttention, isEditMode]);

    const handleDescriptionChange = (val: string) => {
        setLocalDescription(val);
        dispatch(
            setSelectPerimeterAttention({
                ...selectedPerimeterAttention,
                description: val,
            }),
        );
    };

    const handleLatitudeChange = (val: string) => {
        setLocalLatitude(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectPerimeterAttention({
                    ...selectedPerimeterAttention,
                    center: {
                        ...selectedPerimeterAttention.center,
                        latitude: parsed,
                    },
                }),
            );
        }
    };

    const handleLongitudeChange = (val: string) => {
        setLocalLongitude(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectPerimeterAttention({
                    ...selectedPerimeterAttention,
                    center: {
                        ...selectedPerimeterAttention.center,
                        longitude: parsed,
                    },
                }),
            );
        }
    };

    const handleRadiusChange = (val: string) => {
        setLocalRadius(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectPerimeterAttention({
                    ...selectedPerimeterAttention,
                    radius: parsed,
                }),
            );
        }
    };

    const handleSavePerimeterAttention = async () => {
        if (localLatitude.trim() !== '' && localLongitude.trim() !== '' && localRadius.trim() !== '') {
            try {
                if (isEditMode) {
                    const updatedItem = {
                        id: selectedPerimeterAttention.id,
                        description: localDescription,
                        center: {
                            latitude: parseFloat(localLatitude),
                            longitude: parseFloat(localLongitude),
                        },
                        radius: parseFloat(localRadius),
                        type: 'perimeterAttention',
                    };
                    await axiosInstance.put(
                        `http://${window.location.hostname}:3001/perimetersAttention/${selectedPerimeterAttention.id}`,
                        updatedItem,
                    );
                    dispatch(updatePerimeterAttention(updatedItem));
                    alertDialog('Perímetro atualizado com sucesso!');
                } else {
                    const newPerimeterAttention = {
                        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 100).toString()),
                        description: localDescription,
                        center: {
                            latitude: parseFloat(localLatitude),
                            longitude: parseFloat(localLongitude),
                        },
                        radius: parseFloat(localRadius),
                        type: 'perimeterAttention',
                    };
                    await axiosInstance.post(
                        `http://${window.location.hostname}:3001/perimetersAttention`,
                        newPerimeterAttention,
                    );
                    dispatch(addPerimeterAttention(newPerimeterAttention));
                    alertDialog('Novo perímetro adicionado com sucesso!');
                    setLocalDescription('');
                    setLocalLatitude('');
                    setLocalLongitude('');
                    setLocalRadius('');
                }
            } catch (error) {
                console.error('Error saving item:', error);
            }
        }
    };

    const handleCancel = () => {
        dispatch(clearPerimetersAttention());
        dispatch(setSelectPerimeterAttention(null as any));
        dispatch(setFormType('InitialForm'));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSavePerimeterAttention();
        }
    };

    const isSaveEnabled = isEditMode
        ? originalItem &&
          (localDescription !== (originalItem.description || '') ||
              parseFloat(localLatitude) !== originalItem.center?.latitude ||
              parseFloat(localLongitude) !== originalItem.center?.longitude ||
              parseFloat(localRadius) !== originalItem.radius)
        : localDescription.trim() !== '' &&
          localLatitude.trim() !== '' &&
          localLongitude.trim() !== '' &&
          localRadius.trim() !== '';

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-800">
                    {isEditMode ? 'Editar Perímetro' : 'Novo Perímetro'}
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleCancel}
                        className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl border bg-white hover:bg-slate-50 border-slate-300 text-slate-700 transition cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSavePerimeterAttention}
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
                        placeholder="Ex: Perimeter 1"
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
                    <span className="text-xs font-semibold text-slate-600">Raio (m):</span>
                    <Input
                        value={localRadius}
                        onChange={(e) => handleRadiusChange(e.target.value)}
                        placeholder="Raio"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddPerimeterForm;
