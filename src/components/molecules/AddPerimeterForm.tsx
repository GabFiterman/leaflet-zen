/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPerimeterAtention } from '../../redux/slices/perimitersAtention';
import { Button, Input } from '../atoms';
import axios from 'axios';

const AddPointForm: React.FC = () => {
    const dispatch = useDispatch();
    const selectedPerimeterAtention = useSelector((state: any) =>
        state.perimetersAtention ? state.perimetersAtention.selectedAttentionPerimeter || {} : {},
    );

    const [localDescription, setLocalDescription] = useState('');

    const [localLatitude, setLocalLatitude] = useState(selectedPerimeterAtention?.center?.latitude?.toString() || '');

    const [localLongitude, setLocalLongitude] = useState(
        selectedPerimeterAtention?.center?.longitude?.toString() || '',
    );

    const [localRadius, setLocalRadius] = useState(selectedPerimeterAtention?.radius?.toString() || '');

    useEffect(() => {
        if (selectedPerimeterAtention?.center && selectedPerimeterAtention?.radius) {
            setLocalLatitude(selectedPerimeterAtention.center.latitude.toString());
            setLocalLongitude(selectedPerimeterAtention.center.longitude.toString());
            setLocalRadius(selectedPerimeterAtention.radius.toString());
        }
    }, [selectedPerimeterAtention]);

    const handleAddPerimeterAtention = async () => {
        if (localLatitude.trim() !== '' && localLongitude.trim() !== '' && localRadius.trim() !== '') {
            const newPerimeterAtention = {
                id: parseInt(Date.now().toString() + Math.floor(Math.random() * 100).toString()),
                description: localDescription,
                center: {
                    latitude: parseFloat(localLatitude),
                    longitude: parseFloat(localLongitude),
                },
                radius: parseFloat(localRadius),
            };

            try {
                const endpoint = '/attentionPerimeters';
                await axios.post(`http://localhost:3001${endpoint}`, newPerimeterAtention);
                dispatch(addPerimeterAtention(newPerimeterAtention));
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

                <Button text="Salvar" onClick={handleAddPerimeterAtention} />
            </div>
        </div>
    );
};

export default AddPointForm;
