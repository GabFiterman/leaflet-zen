/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPerimeterAttention } from '../../redux/slices/perimetersAttention';
import { Button, Input } from '../atoms';
import axios from 'axios';

const AddPerimeterForm: React.FC = () => {
    const dispatch = useDispatch();

    const selectedPerimeterAttention = useSelector((state: any) =>
        state.perimetersAttention ? state.perimetersAttention.selectedPerimeterAttention || {} : {},
    );

    const [localDescription, setLocalDescription] = useState('');

    const [localLatitude, setLocalLatitude] = useState(
        selectedPerimeterAttention?.center?.lat !== undefined ? selectedPerimeterAttention.center.lat.toString() : '',
    );
    const [localLongitude, setLocalLongitude] = useState(
        selectedPerimeterAttention?.center?.lng !== undefined ? selectedPerimeterAttention.center.lng.toString() : '',
    );
    const [localRadius, setLocalRadius] = useState(
        selectedPerimeterAttention?.radius !== undefined ? selectedPerimeterAttention.radius.toString() : '',
    );

    useEffect(() => {
        console.log('selectedPerimeterAttention', selectedPerimeterAttention);
        if (selectedPerimeterAttention?.center && selectedPerimeterAttention?.radius) {
            console.log('selectedPerimeterAttention.center', selectedPerimeterAttention.center);
            const { latitude, longitude } = selectedPerimeterAttention.center;
            console.log('lat', latitude);
            console.log('lng', longitude);
            setLocalLatitude(latitude.toString() || 'na');
            setLocalLongitude(longitude.toString() || 'na');
            setLocalRadius(selectedPerimeterAttention.radius.toString());
        }
    }, [selectedPerimeterAttention]);

    const handleAddPerimeterAttention = async () => {
        if (localLatitude.trim() !== '' && localLongitude.trim() !== '' && localRadius.trim() !== '') {
            const newPerimeterAttention = {
                id: parseInt(Date.now().toString() + Math.floor(Math.random() * 100).toString()),
                description: localDescription,
                center: {
                    latitude: parseFloat(localLatitude),
                    longitude: parseFloat(localLongitude),
                },
                radius: parseFloat(localRadius),
            };

            try {
                const endpoint = '/perimetersAttention';
                await axios.post(`http://localhost:3001${endpoint}`, newPerimeterAttention);
                dispatch(addPerimeterAttention(newPerimeterAttention));
                alert('Novo perímetro adicionado com sucesso!');
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    return (
        <div>
            <h3 className="text-2xl">Novo Perímetro</h3>
            <div className="flex justify-start gap-2">
                <div>
                    <span>Descrição: </span>
                    <Input value={localDescription} onChange={(e) => setLocalDescription(e.target.value)} />
                </div>
                <div>
                    <span>Latitude: </span>
                    <Input value={localLatitude} onChange={(e) => setLocalLatitude(e.target.value)} />
                </div>
                <div>
                    <span>Longitude: </span>
                    <Input value={localLongitude} onChange={(e) => setLocalLongitude(e.target.value)} />
                </div>
                <div>
                    <span>Raio (km): </span>
                    <Input value={localRadius} onChange={(e) => setLocalRadius(e.target.value)} />
                </div>

                <Button text="Salvar" onClick={handleAddPerimeterAttention} />
            </div>
        </div>
    );
};

export default AddPerimeterForm;
