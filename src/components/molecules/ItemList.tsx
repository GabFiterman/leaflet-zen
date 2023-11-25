/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../atoms';
import axios from 'axios';
import { showPointOfInterest, clearPointOfInterest } from '../../redux/slices/pointsOfInterest';

interface ItemsProps {
    itemInfo: { id: string; description: string; type: string } | object;
    endpoint: string;
    onDeleteClick: () => void;
}

const ListItem: React.FC<
    ItemsProps & { setSelectedItemId: (id: string | null) => void; selectedItemId: string | null }
> = ({ itemInfo, endpoint, onDeleteClick, setSelectedItemId, selectedItemId }) => {
    const [description, setDescription] = useState('');
    const [id, setId] = useState('');
    const dispatch = useDispatch();
    const currentPointOfInterest = useSelector((state: any) => state.pointsOfInterest.showPointOfInterest);

    const onDeleteClickHandler = async () => {
        if (window.confirm('Você realmente deseja deletar este item?')) {
            try {
                console.log('TRY TO DELETE');
                await axios.delete(`http://localhost:3001/${endpoint}/${id}`);
                onDeleteClick();
            } catch (error) {
                console.error('Erro ao deletar o item:', error);
            }
        }
    };

    const showItem = () => {
        let pointOfInterest: any;

        if (itemInfo && 'latitude' in itemInfo && 'longitude' in itemInfo && 'zoomLevel' in itemInfo) {
            pointOfInterest = {
                latitude: itemInfo.latitude as number,
                longitude: itemInfo.longitude as number,
                zoomLevel: itemInfo.zoomLevel as number,
            };
        }

        if (
            pointOfInterest &&
            currentPointOfInterest &&
            currentPointOfInterest.latitude === pointOfInterest.latitude &&
            currentPointOfInterest.longitude === pointOfInterest.longitude &&
            currentPointOfInterest.zoomLevel === pointOfInterest.zoomLevel
        ) {
            console.log('CLEAR POINT OF INTEREST');
            setSelectedItemId(null); // Limpe o id do item selecionado
            dispatch(clearPointOfInterest());
        } else if (pointOfInterest) {
            setSelectedItemId(id); // Atualize o id do item selecionado
            dispatch(clearPointOfInterest());
            setTimeout(() => {
                dispatch(showPointOfInterest(pointOfInterest));
            }, 100);
        }
    };

    useEffect(() => {
        if (itemInfo && 'description' in itemInfo) {
            setDescription((itemInfo as { description: string }).description);
            setId((itemInfo as { id: string }).id);
        }
    }, [itemInfo]);

    return (
        <div className="outline outline-lightText flex flex-col items-center justify-center w-full">
            <Button
                text={description}
                onClick={showItem}
                color={id === selectedItemId ? 'highlight' : 'lightBg'}
                trash
                onTrashClick={onDeleteClickHandler}
                fullWidth
                sidebar
            />
        </div>
    );
};

export default ListItem;
