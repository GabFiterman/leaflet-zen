import { useEffect, useState } from 'react';
import { Button } from '../atoms';
import axios from 'axios';

interface ItemsProps {
    itemInfo: { id: string; description: string } | object;
    endpoint: string;
    onDeleteClick: () => void;
}

const ListItem: React.FC<ItemsProps> = ({ itemInfo, endpoint, onDeleteClick }) => {
    const [description, setDescription] = useState('');
    const [id, setId] = useState('');

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
                onClick={() => console.log('O botão foi clicado')}
                color="lightBg"
                trash
                onTrashClick={onDeleteClickHandler}
                fullWidth
                sidebar
            />
        </div>
    );
};

export default ListItem;
