/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';
import { updateInitialPosition } from '../../redux/slices/initialPosition';
import { Button, Input } from './../atoms';
import axios from 'axios';

const InitialForm: React.FC = () => {
    const dispatch = useDispatch();
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
        if (
            currentPosition.latitude !== null &&
            currentPosition.longitude !== null &&
            currentPosition.zoomLevel !== null
        ) {
            setLocalLatitude(currentPosition.latitude.toString());
            setLocalLongitude(currentPosition.longitude.toString());
            setLocalZoomLevel(currentPosition.zoomLevel.toString());
        }
    }, [currentPosition, initialPosition]);

    const handleUpdateInitialPosition = async () => {
        if (localLatitude.trim() !== '' && localLongitude.trim() !== '' && localZoomLevel.trim() !== '') {
            const newItem = {
                latitude: parseFloat(localLatitude),
                longitude: parseFloat(localLongitude),
                zoomLevel: parseInt(localZoomLevel),
            };

            try {
                const endpoint = '/initialPosition';
                await axios.post(`http://localhost:3001${endpoint}`, newItem);
                dispatch(updateInitialPosition(newItem));
                alert('Posição inicial atualizada com sucesso!');
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    return (
        <div>
            <h3 className="text-2xl">Ponto e Zoom Iniciais</h3>
            <div className="flex justify-start gap-2">
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

                <Button text="Salvar" onClick={handleUpdateInitialPosition} />
            </div>
        </div>
    );
};

export default InitialForm;
