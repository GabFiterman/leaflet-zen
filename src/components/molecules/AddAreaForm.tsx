/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addAreaOfInterest,
    updateAreaOfInterest,
    setSelectAreaOfInterest,
    clearAreaOfInterest,
} from '../../redux/slices/areasOfInterest';
import { setFormType } from '../../redux/slices/formType';
import { Input } from '../atoms';
import axiosInstance from 'axios';
import { useDialog } from '../../context/DialogContext';

const AddAreaForm: React.FC = () => {
    const dispatch = useDispatch();
    const { alertDialog } = useDialog();
    const selectedAreaOfInterest = useSelector((state: any) =>
        state.areasOfInterest ? state.areasOfInterest.selectedAreaOfInterest || {} : {},
    );
    const areasOfInterestList = useSelector((state: any) => state.areasOfInterest.areasOfInterest);
    const descriptionRef = useRef<HTMLInputElement>(null);

    const [localDescription, setLocalDescription] = useState('');
    const [localLatitudeTop, setLocalLatitudeTop] = useState(
        selectedAreaOfInterest?.topLeft?.latitude?.toString() || '',
    );
    const [localLongitudeLeft, setLocalLongitudeLeft] = useState(
        selectedAreaOfInterest?.topLeft?.longitude?.toString() || '',
    );
    const [localLatitudeBottom, setLocalLatitudeBottom] = useState(
        selectedAreaOfInterest?.bottomRight?.latitude?.toString() || '',
    );
    const [localLongitudeRight, setLocalLongitudeRight] = useState(
        selectedAreaOfInterest?.bottomRight?.longitude?.toString() || '',
    );

    const isEditMode = !!selectedAreaOfInterest?.id;
    const originalItem = areasOfInterestList.find((a: any) => String(a.id) === String(selectedAreaOfInterest?.id));

    useEffect(() => {
        if (selectedAreaOfInterest && selectedAreaOfInterest.topLeft && selectedAreaOfInterest.bottomRight) {
            setLocalDescription(selectedAreaOfInterest.description || '');

            const parsedLatTop = parseFloat(localLatitudeTop);
            if (isNaN(parsedLatTop) || parsedLatTop !== selectedAreaOfInterest.topLeft.latitude) {
                setLocalLatitudeTop(selectedAreaOfInterest.topLeft.latitude.toString());
            }

            const parsedLngLeft = parseFloat(localLongitudeLeft);
            if (isNaN(parsedLngLeft) || parsedLngLeft !== selectedAreaOfInterest.topLeft.longitude) {
                setLocalLongitudeLeft(selectedAreaOfInterest.topLeft.longitude.toString());
            }

            const parsedLatBottom = parseFloat(localLatitudeBottom);
            if (isNaN(parsedLatBottom) || parsedLatBottom !== selectedAreaOfInterest.bottomRight.latitude) {
                setLocalLatitudeBottom(selectedAreaOfInterest.bottomRight.latitude.toString());
            }

            const parsedLngRight = parseFloat(localLongitudeRight);
            if (isNaN(parsedLngRight) || parsedLngRight !== selectedAreaOfInterest.bottomRight.longitude) {
                setLocalLongitudeRight(selectedAreaOfInterest.bottomRight.longitude.toString());
            }

            if ((!isEditMode || !selectedAreaOfInterest.description) && descriptionRef.current) {
                setTimeout(() => {
                    descriptionRef.current?.focus();
                }, 50);
            }
        }
    }, [selectedAreaOfInterest, isEditMode]);

    const handleDescriptionChange = (val: string) => {
        setLocalDescription(val);
        dispatch(
            setSelectAreaOfInterest({
                ...selectedAreaOfInterest,
                description: val,
            }),
        );
    };

    const handleLatitudeTopChange = (val: string) => {
        setLocalLatitudeTop(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectAreaOfInterest({
                    ...selectedAreaOfInterest,
                    topLeft: {
                        ...selectedAreaOfInterest.topLeft,
                        latitude: parsed,
                    },
                }),
            );
        }
    };

    const handleLongitudeLeftChange = (val: string) => {
        setLocalLongitudeLeft(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectAreaOfInterest({
                    ...selectedAreaOfInterest,
                    topLeft: {
                        ...selectedAreaOfInterest.topLeft,
                        longitude: parsed,
                    },
                }),
            );
        }
    };

    const handleLatitudeBottomChange = (val: string) => {
        setLocalLatitudeBottom(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectAreaOfInterest({
                    ...selectedAreaOfInterest,
                    bottomRight: {
                        ...selectedAreaOfInterest.bottomRight,
                        latitude: parsed,
                    },
                }),
            );
        }
    };

    const handleLongitudeRightChange = (val: string) => {
        setLocalLongitudeRight(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            dispatch(
                setSelectAreaOfInterest({
                    ...selectedAreaOfInterest,
                    bottomRight: {
                        ...selectedAreaOfInterest.bottomRight,
                        longitude: parsed,
                    },
                }),
            );
        }
    };

    const handleSaveAreaOfInterest = async () => {
        if (
            localLatitudeTop.trim() !== '' &&
            localLongitudeLeft.trim() !== '' &&
            localLatitudeBottom.trim() !== '' &&
            localLongitudeRight.trim() !== ''
        ) {
            try {
                if (isEditMode) {
                    const updatedItem = {
                        id: selectedAreaOfInterest.id,
                        description: localDescription,
                        topLeft: {
                            latitude: parseFloat(localLatitudeTop),
                            longitude: parseFloat(localLongitudeLeft),
                        },
                        bottomRight: {
                            latitude: parseFloat(localLatitudeBottom),
                            longitude: parseFloat(localLongitudeRight),
                        },
                        type: 'areaOfInterest',
                    };
                    await axiosInstance.put(
                        `http://${window.location.hostname}:3001/areasOfInterest/${selectedAreaOfInterest.id}`,
                        updatedItem,
                    );
                    dispatch(updateAreaOfInterest(updatedItem));
                    alertDialog('Área atualizada com sucesso!');
                } else {
                    const newItem = {
                        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 100).toString()),
                        description: localDescription,
                        topLeft: {
                            latitude: parseFloat(localLatitudeTop),
                            longitude: parseFloat(localLongitudeLeft),
                        },
                        bottomRight: {
                            latitude: parseFloat(localLatitudeBottom),
                            longitude: parseFloat(localLongitudeRight),
                        },
                        type: 'areaOfInterest',
                    };
                    await axiosInstance.post(`http://${window.location.hostname}:3001/areasOfInterest`, newItem);
                    dispatch(addAreaOfInterest(newItem));
                    alertDialog('Nova área adicionada com sucesso!');
                    setLocalDescription('');
                    setLocalLatitudeTop('');
                    setLocalLongitudeLeft('');
                    setLocalLatitudeBottom('');
                    setLocalLongitudeRight('');
                }
            } catch (error) {
                console.error('Error saving item:', error);
            }
        }
    };

    const handleCancel = () => {
        dispatch(clearAreaOfInterest());
        dispatch(setSelectAreaOfInterest(null as any));
        dispatch(setFormType('InitialForm'));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveAreaOfInterest();
        }
    };

    const isSaveEnabled = isEditMode
        ? originalItem &&
          (localDescription !== (originalItem.description || '') ||
              parseFloat(localLatitudeTop) !== originalItem.topLeft.latitude ||
              parseFloat(localLongitudeLeft) !== originalItem.topLeft.longitude ||
              parseFloat(localLatitudeBottom) !== originalItem.bottomRight.latitude ||
              parseFloat(localLongitudeRight) !== originalItem.bottomRight.longitude)
        : localDescription.trim() !== '' &&
          localLatitudeTop.trim() !== '' &&
          localLongitudeLeft.trim() !== '' &&
          localLatitudeBottom.trim() !== '' &&
          localLongitudeRight.trim() !== '';

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-800">
                    {isEditMode ? 'Editar Área' : 'Adicionar Área de Interesse'}
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleCancel}
                        className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl border bg-white hover:bg-slate-50 border-slate-300 text-slate-700 transition cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveAreaOfInterest}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Descrição:</span>
                    <Input
                        ref={descriptionRef}
                        required
                        value={localDescription}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ex: Área Norte"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Lat. Superior:</span>
                    <Input
                        value={localLatitudeTop}
                        onChange={(e) => handleLatitudeTopChange(e.target.value)}
                        placeholder="Lat. Sup"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Long. Esquerda:</span>
                    <Input
                        value={localLongitudeLeft}
                        onChange={(e) => handleLongitudeLeftChange(e.target.value)}
                        placeholder="Long. Esq"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Lat. Inferior:</span>
                    <Input
                        value={localLatitudeBottom}
                        onChange={(e) => handleLatitudeBottomChange(e.target.value)}
                        placeholder="Lat. Inf"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold text-slate-600">Long. Direita:</span>
                    <Input
                        value={localLongitudeRight}
                        onChange={(e) => handleLongitudeRightChange(e.target.value)}
                        placeholder="Long. Dir"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddAreaForm;
