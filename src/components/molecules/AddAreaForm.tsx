/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAreaOfInterest } from '../../redux/slices/areasOfInterest';
import { Button, Input } from '../atoms';
import axios from 'axios';

const AddPointForm: React.FC = () => {
    const dispatch = useDispatch();
    const selectedAreaOfInterest = useSelector((state: any) =>
        state.areasOfInterest ? state.areasOfInterest.selectedAreaOfInterest || {} : {},
    );

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

    useEffect(() => {
        if (selectedAreaOfInterest?.topLeft && selectedAreaOfInterest?.bottomRight) {
            setLocalLatitudeTop(selectedAreaOfInterest.topLeft.latitude.toString());
            setLocalLongitudeLeft(selectedAreaOfInterest.topLeft.longitude.toString());
            setLocalLatitudeBottom(selectedAreaOfInterest.bottomRight.latitude.toString());
            setLocalLongitudeRight(selectedAreaOfInterest.bottomRight.longitude.toString());
        }
    }, [selectedAreaOfInterest]);

    const handleAddAreaOfInterest = async () => {
        if (
            localLatitudeTop.trim() !== '' &&
            localLongitudeLeft.trim() !== '' &&
            localLatitudeBottom.trim() !== '' &&
            localLongitudeRight.trim() !== ''
        ) {
            const newAreaOfInterest = {
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
            };

            try {
                const endpoint = '/areasOfInterest';
                await axios.post(`http://localhost:3001${endpoint}`, newAreaOfInterest);
                dispatch(addAreaOfInterest(newAreaOfInterest));
                alert('Nova área adicionada com sucesso!');
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    return (
        <div>
            <h3 className="text-2xl">Adicionar Área de Interesse</h3>
            <div className="flex justify-start gap-2">
                <div>
                    <span>Descrição: </span>
                    <Input value={localDescription} onChange={(e) => setLocalDescription(e.target.value)} />
                </div>
                <div>
                    <span>Latitude Superior: </span>
                    <Input value={localLatitudeTop} onChange={(e) => setLocalLatitudeTop(e.target.value)} />
                </div>
                <div>
                    <span>Longitude Esquerda: </span>
                    <Input value={localLongitudeLeft} onChange={(e) => setLocalLongitudeLeft(e.target.value)} />
                </div>
                <div>
                    <span>Latitude Inferior: </span>
                    <Input value={localLatitudeBottom} onChange={(e) => setLocalLatitudeBottom(e.target.value)} />
                </div>
                <div>
                    <span>Longitude Inferior: </span>
                    <Input value={localLongitudeRight} onChange={(e) => setLocalLongitudeRight(e.target.value)} />
                </div>

                <Button text="Salvar" onClick={handleAddAreaOfInterest} />
            </div>
        </div>
    );
};

export default AddPointForm;
