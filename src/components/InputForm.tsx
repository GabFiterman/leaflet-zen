/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePosition } from '../redux/slices/currentPosition';
import { updateInitialPosition } from '../redux/slices/initialPosition';
import axios from 'axios';

const InputForm: React.FC = () => {
    const dispatch = useDispatch();

    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);

    const [latitude, setLatitude] = useState(initialPosition?.latitude?.toString() || '');
    const [longitude, setLongitude] = useState(initialPosition?.longitude?.toString() || '');
    const [zoomLevel, setZoomLevel] = useState(initialPosition?.zoomLevel?.toString() || '');

    useEffect(() => {
        if (
            initialPosition.latitude !== null &&
            initialPosition.longitude !== null &&
            initialPosition.zoomLevel !== null
        ) {
            setLatitude(initialPosition.latitude.toString());
            setLongitude(initialPosition.longitude.toString());
            setZoomLevel(initialPosition.zoomLevel.toString());
        }
        if (
            currentPosition.latitude !== null &&
            currentPosition.longitude !== null &&
            currentPosition.zoomLevel !== null
        ) {
            setLatitude(currentPosition.latitude.toString());
            setLongitude(currentPosition.longitude.toString());
            setZoomLevel(currentPosition.zoomLevel.toString());
        }
    }, [currentPosition, initialPosition]);

    const handleUpdateInitialPosition = async () => {
        if (latitude.trim() !== '' && longitude.trim() !== '' && zoomLevel.trim() !== '') {
            const newItem = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                zoomLevel: parseInt(zoomLevel),
            };

            try {
                await axios.post('http://localhost:3001/initialPosition', newItem);
                dispatch(updateInitialPosition(newItem));
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    const handleInputChange = (fieldName: string, value: string) => {
        switch (fieldName) {
            case 'latitude':
                setLatitude(value);
                break;
            case 'longitude':
                setLongitude(value);
                break;
            case 'zoomLevel':
                setZoomLevel(value);
                break;
            default:
                break;
        }
    };

    const handleInputBlur = (fieldName: string, value: string) => {
        switch (fieldName) {
            case 'latitude':
                dispatch(
                    updatePosition({
                        latitude: parseFloat(value),
                    }),
                );
                break;
            case 'longitude':
                dispatch(
                    updatePosition({
                        longitude: parseFloat(value),
                    }),
                );
                break;
            case 'zoomLevel':
                dispatch(
                    updatePosition({
                        zoomLevel: parseInt(value),
                    }),
                );
                break;
            default:
                break;
        }
    };

    const handleReturnToInitial = () => {
        dispatch(updatePosition(initialPosition));
        setLatitude(initialPosition.latitude.toString());
        setLongitude(initialPosition.longitude.toString());
        setZoomLevel(initialPosition.zoomLevel.toString());
    };

    return (
        <div className="text-black">
            <div className="flex justify-center gap-5">
                <input
                    type="text"
                    className="rounded-md px-3"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    onBlur={(e) => handleInputBlur('latitude', e.target.value)}
                />
                <input
                    type="text"
                    className="rounded-md px-3"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    onBlur={(e) => handleInputBlur('longitude', e.target.value)}
                />
                <input
                    type="text"
                    className="rounded-md px-3"
                    placeholder="Zoom Level"
                    value={zoomLevel}
                    onChange={(e) => handleInputChange('zoomLevel', e.target.value)}
                    onBlur={(e) => handleInputBlur('zoomLevel', e.target.value)}
                />
                <button
                    onClick={handleReturnToInitial}
                    className="bg-slate-800 px-4 py-2 text-gray-50 font-bold rounded-md"
                >
                    Return to Initial Pos
                </button>
                <button
                    onClick={handleUpdateInitialPosition}
                    className="bg-slate-800 px-4 py-2 text-gray-50 font-bold rounded-md"
                >
                    Update Initial Pos
                </button>
            </div>
        </div>
    );
};

export default InputForm;
