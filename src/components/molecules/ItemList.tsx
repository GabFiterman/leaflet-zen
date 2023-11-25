/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../atoms';
import axios from 'axios';
import { showPointOfInterest, clearPointOfInterest } from '../../redux/slices/pointsOfInterest';
import { showAreaOfInterest, clearAreaOfInterest } from '../../redux/slices/areasOfInterest';
import { showPerimetersAttention, clearPerimetersAttention } from '../../redux/slices/perimetersAttention';

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
    const currentAreaOfInterest = useSelector((state: any) => state.areasOfInterest.showAreaOfInterest);
    const currentPerimeterAttention = useSelector((state: any) => state.perimetersAttention.showPerimeterAttention);

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

    let pointOfInterest: any;

    const makeShowPointOfInterest = () => {
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
            setSelectedItemId(null);
            dispatch(clearPointOfInterest());
        } else if (pointOfInterest) {
            setSelectedItemId(id);
            dispatch(clearPointOfInterest());
            setTimeout(() => {
                dispatch(showPointOfInterest(pointOfInterest));
            }, 100);
        }
    };

    const makeShowAreaOfInterest = () => {
        if ('topLeft' in itemInfo && 'bottomRight' in itemInfo) {
            const areaOfInterest = {
                topLeft: itemInfo.topLeft as { latitude: number; longitude: number },
                bottomRight: itemInfo.bottomRight as { latitude: number; longitude: number },
            };

            if (
                currentAreaOfInterest &&
                currentAreaOfInterest.topLeft &&
                currentAreaOfInterest.bottomRight &&
                currentAreaOfInterest.topLeft.latitude === areaOfInterest.topLeft.latitude &&
                currentAreaOfInterest.topLeft.longitude === areaOfInterest.topLeft.longitude &&
                currentAreaOfInterest.bottomRight.latitude === areaOfInterest.bottomRight.latitude &&
                currentAreaOfInterest.bottomRight.longitude === areaOfInterest.bottomRight.longitude
            ) {
                console.log('CLEAR AREA OF INTEREST');
                setSelectedItemId(null);
                dispatch(clearAreaOfInterest());
            } else {
                setSelectedItemId(id);
                dispatch(clearAreaOfInterest());
                setTimeout(() => {
                    dispatch(showAreaOfInterest(areaOfInterest));
                }, 100);
            }
        }
    };

    const makeShowPerimeterAttention = () => {
        if (itemInfo && 'center' in itemInfo && 'radius' in itemInfo) {
            const perimeterAttention = {
                center: itemInfo.center as { latitude: number; longitude: number },
                radius: itemInfo.radius as number,
            };

            if (
                currentPerimeterAttention &&
                currentPerimeterAttention.center &&
                currentPerimeterAttention.radius &&
                currentPerimeterAttention.center.latitude === perimeterAttention.center.latitude &&
                currentPerimeterAttention.center.longitude === perimeterAttention.center.longitude &&
                currentPerimeterAttention.radius === perimeterAttention.radius
            ) {
                console.log('CLEAR PERIMETER ATTENTION');
                setSelectedItemId(null);
                dispatch(clearPerimetersAttention());
            } else {
                setSelectedItemId(id);
                dispatch(clearPerimetersAttention());
                setTimeout(() => {
                    dispatch(showPerimetersAttention(perimeterAttention));
                }, 100);
            }
        }
    };

    const showItem = () => {
        console.log(itemInfo);
        if ((itemInfo as any).type === 'pointOfInterest') {
            makeShowPointOfInterest();
        } else if ((itemInfo as any).type === 'areaOfInterest') {
            makeShowAreaOfInterest();
        } else if ((itemInfo as any).type === 'perimeterAttention') {
            makeShowPerimeterAttention();
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
