/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePosition } from '../redux/slices/currentPosition';

interface InputFormProps {
    initialData?: {
        id: number;
        description: string;
        latitude: number;
        longitude: number;
        zoomLevel: number;
    };
}

const InputForm: React.FC<InputFormProps> = ({ initialData }) => {
    const dispatch = useDispatch();
    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest[0]);

    const [latitude, setLatitude] = useState(initialData?.latitude?.toString() || '');
    const [longitude, setLongitude] = useState(initialData?.longitude?.toString() || '');
    const [zoomLevel, setZoomLevel] = useState(initialData?.zoomLevel?.toString() || '');

    useEffect(() => {
        if (initialData) {
            setLatitude(initialData.latitude.toString());
            setLongitude(initialData.longitude.toString());
            setZoomLevel(initialData.zoomLevel.toString());
        }
    }, [initialData]);

    useEffect(() => {
        if (
            currentPosition.latitude !== null &&
            currentPosition.longitude !== null &&
            currentPosition.zoomLevel !== null
        ) {
            setLatitude(currentPosition.latitude.toString());
            setLongitude(currentPosition.longitude.toString());
            setZoomLevel(currentPosition.zoomLevel.toString());
        }
    }, [currentPosition]);

    // NOTE: not Discontinued, use this in other component
    // const handleAddItem = async () => {
    //     if (description.trim() !== '' && latitude.trim() !== '' && longitude.trim() !== '' && zoomLevel.trim() !== '') {
    //         const newItem = {
    //             id: Date.now(),
    //             description,
    //             latitude: parseFloat(latitude),
    //             longitude: parseFloat(longitude),
    //             zoomLevel: parseInt(zoomLevel),
    //         };

    //         try {
    //             await axios.post('http://localhost:3001/pointsOfInterest', newItem);
    //             dispatch(addPointsOfInterest([newItem]));
    //             dispatch(updatePosition(newItem));

    //             setDescription('');
    //             setLatitude('');
    //             setLongitude('');
    //             setZoomLevel('');
    //         } catch (error) {
    //             console.error('Error adding item:', error);
    //         }
    //     }
    // };

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

    const handleInputBlur = () => {
        dispatch(
            updatePosition({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                zoomLevel: parseInt(zoomLevel),
            }),
        );
    };

    const handleReturnToInitial = () => {
        dispatch(updatePosition(initialPosition));
        setLatitude(initialPosition.latitude.toString());
        setLongitude(initialPosition.longitude.toString());
        setZoomLevel(initialPosition.zoomLevel.toString());
    };

    return (
        <div className="text-black">
            <h2>{initialData ? 'Update Item' : 'Add New Item'}</h2>
            <div className="flex justify-center gap-5">
                <input
                    type="text"
                    className="rounded-md px-3"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    onBlur={handleInputBlur}
                />
                <input
                    type="text"
                    className="rounded-md px-3"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    onBlur={handleInputBlur}
                />
                <input
                    type="text"
                    className="rounded-md px-3"
                    placeholder="Zoom Level"
                    value={zoomLevel}
                    onChange={(e) => handleInputChange('zoomLevel', e.target.value)}
                    onBlur={handleInputBlur}
                />
                <button
                    onClick={handleReturnToInitial}
                    className="bg-slate-800 px-4 py-2 text-gray-50 font-bold rounded-md"
                >
                    Return to Initial Position
                </button>
            </div>
        </div>
    );
};

export default InputForm;
