import { useEffect, useState } from 'react';
import { Button } from '../atoms';

interface ItemsProps {
    itemInfo: { description: string } | object;
    onDeleteClick?: () => void;
}

const ListItem: React.FC<ItemsProps> = ({ itemInfo, onDeleteClick }) => {
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (itemInfo && 'description' in itemInfo) {
            setDescription((itemInfo as { description: string }).description);
        }
    }, [itemInfo]);

    return (
        <div>
            <Button text={description} onClick={onDeleteClick} trash={onDeleteClick !== undefined} />
        </div>
    );
};

export default ListItem;
