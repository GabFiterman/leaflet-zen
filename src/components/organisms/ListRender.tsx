/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import ListItem from '../molecules/ItemList';

interface Item {
    id: number;
    description: string;
    [key: string]: any;
}

interface ListRendererProps {
    data: Item[];
    endpoint: string;
}

const ListRenderer: React.FC<ListRendererProps> = ({ data: initialData, endpoint }) => {
    const [data, setData] = useState(initialData);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const handleItemDelete = (itemId: number) => {
        setData((prevData) => prevData.filter((item) => item.id !== itemId));
    };

    return (
        <div className="w-full">
            {data.map((item) => (
                <ListItem
                    key={item.id}
                    endpoint={endpoint}
                    itemInfo={{ ...item, description: item.description }}
                    onDeleteClick={() => handleItemDelete(item.id)}
                    setSelectedItemId={setSelectedItemId}
                    selectedItemId={selectedItemId}
                />
            ))}
        </div>
    );
};

export default ListRenderer;
