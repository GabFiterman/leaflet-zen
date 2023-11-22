import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPointOfInterest } from '../../redux/slices/pointsOfInterest';
import axios from 'axios';

const AddNewItem: React.FC = () => {
    const dispatch = useDispatch();
    const [newDescription, setNewDescription] = useState<string>('');
    const [newLatitude, setNewLatitude] = useState<string>('');
    const [newLongitude, setNewLongitude] = useState<string>('');
    const [newZoomLevel, setNewZoomLevel] = useState<string>('');

    const handleAddNewItem = async () => {
        if (newDescription.trim() !== '') {
            const newItemObject = {
                id: Date.now(),
                description: newDescription,
                latitude: parseFloat(newLatitude),
                longitude: parseFloat(newLongitude),
                zoomLevel: parseFloat(newZoomLevel),
            };

            try {
                await axios.post('http://localhost:3001/pointsOfInterest', newItemObject);

                dispatch(addPointOfInterest(newItemObject));
                setNewDescription('');
                setNewLatitude('');
                setNewLongitude('');
                setNewZoomLevel('');
            } catch (error) {
                console.error('Error adding new item:', error);
            }
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold">Add New Item</h1>
            <div className="flex flex-col gap-5 items-center justify-center">
                <input
                    className="text-gray-800"
                    type="text"
                    placeholder="Descrição"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                />
                <input
                    className="text-gray-800"
                    type="number"
                    placeholder="Nova Latitude"
                    value={newLatitude}
                    onChange={(e) => setNewLatitude(e.target.value)}
                />
                <input
                    className="text-gray-800"
                    type="number"
                    placeholder="Nova Longitude"
                    value={newLongitude}
                    onChange={(e) => setNewLongitude(e.target.value)}
                />
                <input
                    className="text-gray-800"
                    type="number"
                    placeholder="Nova Longitude"
                    value={newZoomLevel}
                    onChange={(e) => setNewZoomLevel(e.target.value)}
                />
                <button className="bg-slate-500 text-gray-100 px-4 py-1" onClick={handleAddNewItem}>
                    Adicionar Novo Item
                </button>
            </div>
        </>
    );
};

export default AddNewItem;
