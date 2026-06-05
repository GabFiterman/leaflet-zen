/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setFormType } from '../../redux/slices/formType';
import {
    showPointOfInterest,
    clearPointOfInterest,
    setSelectPointOfInterest,
    removePointOfInterest,
    togglePointVisibility,
} from '../../redux/slices/pointsOfInterest';
import {
    showAreaOfInterest,
    clearAreaOfInterest,
    setSelectAreaOfInterest,
    removeAreaOfInterest,
    toggleAreaVisibility,
} from '../../redux/slices/areasOfInterest';
import {
    showPerimetersAttention,
    clearPerimetersAttention,
    setSelectPerimeterAttention,
    removePerimeterAttention,
    togglePerimeterVisibility,
} from '../../redux/slices/perimetersAttention';
import { useDialog } from '../../context/DialogContext';

interface ItemsProps {
    itemInfo: any;
    endpoint: string;
    onDeleteClick?: () => void;
    setSelectedItemId?: (id: string | null) => void;
    selectedItemId?: string | null;
}

const ListItem: React.FC<ItemsProps> = ({ itemInfo, endpoint, onDeleteClick }) => {
    const [description, setDescription] = useState('');
    const [id, setId] = useState('');
    const dispatch = useDispatch();
    const { confirmDialog } = useDialog();

    useEffect(() => {
        if (itemInfo && 'description' in itemInfo) {
            setDescription(itemInfo.description);
            setId(itemInfo.id.toString());
        }
    }, [itemInfo]);

    const selectedPoint = useSelector((state: any) => state.pointsOfInterest.selectedPointOfInterest);
    const selectedArea = useSelector((state: any) => state.areasOfInterest.selectedAreaOfInterest);
    const selectedPerimeter = useSelector((state: any) => state.perimetersAttention.selectedPerimeterAttention);

    const hiddenPoints = useSelector((state: any) => state.pointsOfInterest.hiddenPoints || []);
    const hiddenAreas = useSelector((state: any) => state.areasOfInterest.hiddenAreas || []);
    const hiddenPerimeters = useSelector((state: any) => state.perimetersAttention.hiddenPerimeters || []);

    const numericId = parseInt(id);

    let isSelected = false;
    if (endpoint === 'pointsOfInterest' && selectedPoint && selectedPoint.id === numericId) {
        isSelected = true;
    } else if (endpoint === 'areasOfInterest' && selectedArea && selectedArea.id === numericId) {
        isSelected = true;
    } else if (endpoint === 'perimetersAttention' && selectedPerimeter && selectedPerimeter.id === numericId) {
        isSelected = true;
    }

    let isHidden = false;
    if (endpoint === 'pointsOfInterest') {
        isHidden = hiddenPoints.includes(numericId);
    } else if (endpoint === 'areasOfInterest') {
        isHidden = hiddenAreas.includes(numericId);
    } else if (endpoint === 'perimetersAttention') {
        isHidden = hiddenPerimeters.includes(numericId);
    }

    const onDeleteClickHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        confirmDialog('Você realmente deseja deletar este item?', async () => {
            try {
                await axios.delete(`http://${window.location.hostname}:3001/${endpoint}/${numericId}`);

                if (endpoint === 'areasOfInterest') {
                    dispatch(removeAreaOfInterest(numericId));
                    dispatch(clearAreaOfInterest());
                    dispatch(setSelectAreaOfInterest(null as any));
                } else if (endpoint === 'pointsOfInterest') {
                    dispatch(removePointOfInterest(numericId));
                    dispatch(clearPointOfInterest());
                    dispatch(setSelectPointOfInterest(null as any));
                } else if (endpoint === 'perimetersAttention') {
                    dispatch(removePerimeterAttention(numericId));
                    dispatch(clearPerimetersAttention());
                    dispatch(setSelectPerimeterAttention(null as any));
                }

                if (isSelected) {
                    dispatch(setFormType('InitialForm'));
                }
                if (onDeleteClick) {
                    onDeleteClick();
                }
            } catch (error) {
                console.error('Erro ao deletar o item:', error);
            }
        });
    };

    const handleSelectToggle = () => {
        if (isSelected) {
            dispatch(setFormType('InitialForm'));

            if (endpoint === 'pointsOfInterest') {
                dispatch(clearPointOfInterest());
                dispatch(setSelectPointOfInterest(null as any));
            } else if (endpoint === 'areasOfInterest') {
                dispatch(clearAreaOfInterest());
                dispatch(setSelectAreaOfInterest(null as any));
            } else if (endpoint === 'perimetersAttention') {
                dispatch(clearPerimetersAttention());
                dispatch(setSelectPerimeterAttention(null as any));
            }
        } else {
            dispatch(clearPointOfInterest());
            dispatch(setSelectPointOfInterest(null as any));
            dispatch(clearAreaOfInterest());
            dispatch(setSelectAreaOfInterest(null as any));
            dispatch(clearPerimetersAttention());
            dispatch(setSelectPerimeterAttention(null as any));

            if (endpoint === 'pointsOfInterest') {
                dispatch(showPointOfInterest(itemInfo));
                dispatch(setSelectPointOfInterest(itemInfo));
                dispatch(setFormType('AddPointForm'));
            } else if (endpoint === 'areasOfInterest') {
                dispatch(showAreaOfInterest(itemInfo));
                dispatch(setSelectAreaOfInterest(itemInfo));
                dispatch(setFormType('AddAreaForm'));
            } else if (endpoint === 'perimetersAttention') {
                dispatch(showPerimetersAttention(itemInfo));
                dispatch(setSelectPerimeterAttention(itemInfo));
                dispatch(setFormType('AddPerimeterForm'));
            }
        }
    };

    const handleVisibilityToggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isSelected) {
            handleSelectToggle();
        }

        if (endpoint === 'pointsOfInterest') {
            dispatch(togglePointVisibility(numericId));
        } else if (endpoint === 'areasOfInterest') {
            dispatch(toggleAreaVisibility(numericId));
        } else if (endpoint === 'perimetersAttention') {
            dispatch(togglePerimeterVisibility(numericId));
        }
    };

    return (
        <div
            onClick={handleSelectToggle}
            className={`flex items-center justify-between w-full p-3 mb-2 rounded-lg cursor-pointer transition border text-sm font-semibold ${isSelected
                    ? 'bg-primary border-primary text-white shadow-md'
                    : 'bg-white border-slate-200 hover:bg-slate-100/80 text-slate-700'
                }`}
        >
            <span className="truncate max-w-[150px]">{description}</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleVisibilityToggle}
                    className={`p-1 rounded hover:scale-110 transition drop-shadow-[2px_2px_1px_rgba(0,0,0,0.5)] ${isSelected
                            ? 'text-white'
                            : isHidden
                                ? 'opacity-30 grayscale text-slate-400'
                                : 'text-slate-600 hover:text-primary'
                        }`}
                    title={isHidden ? 'Visualizar no mapa' : 'Ocultar no mapa'}
                >
                    👁️
                </button>
                <button
                    onClick={onDeleteClickHandler}
                    className={`p-1 rounded hover:scale-110 transition drop-shadow-[2px_2px_1px_rgba(0,0,0,0.5)] ${isSelected ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-red-500'
                        }`}
                    title="Deletar"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default ListItem;
