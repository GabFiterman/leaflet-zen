/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';
import { addPointOfInterest } from '../../redux/slices/pointsOfInterest';
import { Button, Input } from '../atoms';
import axios from 'axios';

const AddPointForm: React.FC = () => {
    const dispatch = useDispatch();
    const currentPosition = useSelector((state: any) => state.currentPosition);

    const [localDescription, setLocalDescription] = useState('');
    const [localLatitude, setLocalLatitude] = useState(currentPosition?.latitude?.toString() || '');
    const [localLongitude, setLocalLongitude] = useState(currentPosition?.longitude?.toString() || '');
    const [localZoomLevel, setLocalZoomLevel] = useState(currentPosition?.zoomLevel?.toString() || '');

    useEffect(() => {
        if (
            currentPosition.latitude !== null &&
            currentPosition.longitude !== null &&
            currentPosition.zoomLevel !== null
        ) {
            setLocalLatitude(currentPosition.latitude.toString());
            setLocalLongitude(currentPosition.longitude.toString());
            setLocalZoomLevel(currentPosition.zoomLevel.toString());
        }
    }, [currentPosition]);

    const handleAddPointOfInterest = async () => {
        if (localLatitude.trim() !== '' && localLongitude.trim() !== '' && localZoomLevel.trim() !== '') {
            const newItem = {
                id: parseInt(Date.now().toString() + Math.floor(Math.random() * 100).toString()),
                description: localDescription,
                latitude: parseFloat(localLatitude),
                longitude: parseFloat(localLongitude),
                zoomLevel: parseInt(localZoomLevel),
            };

            try {
                const endpoint = '/pointsOfInterest';
                await axios.post(`http://localhost:3001${endpoint}`, newItem);
                dispatch(addPointOfInterest(newItem));
                alert('Novo ponto adicionado com sucesso!');
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    return (
        <div>
            <h3 className="text-2xl">Adicionar Ponto de Interesse</h3>
            <div className="flex justify-start gap-2">
                <div>
                    <span>Descrição: </span>
                    <Input value={localDescription} onChange={(e) => setLocalDescription(e.target.value)} />
                </div>
                <div>
                    <span>Latitude: </span>
                    <Input
                        value={localLatitude}
                        onChange={(e) => setLocalLatitude(e.target.value)}
                        onBlur={() => {
                            dispatch(updateCurrentPosition({ latitude: parseFloat(localLatitude) }));
                        }}
                    />
                </div>
                <div>
                    <span>Longitude: </span>
                    <Input
                        value={localLongitude}
                        onChange={(e) => setLocalLongitude(e.target.value)}
                        onBlur={() => {
                            dispatch(updateCurrentPosition({ longitude: parseFloat(localLongitude) }));
                        }}
                    />
                </div>
                <div>
                    <span>Zoom: </span>
                    <Input
                        value={localZoomLevel}
                        onChange={(e) => setLocalZoomLevel(e.target.value)}
                        onBlur={() => {
                            dispatch(updateCurrentPosition({ zoomLevel: parseInt(localZoomLevel) }));
                        }}
                    />
                </div>

                <Button text="Salvar" onClick={handleAddPointOfInterest} />
            </div>
        </div>
    );
};

export default AddPointForm;
