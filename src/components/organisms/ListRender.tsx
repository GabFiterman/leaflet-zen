/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ItemList from '../molecules/ItemList';

interface Item {
    id: number;
    description: string;
    [key: string]: any;
}

interface ListRendererProps {
    data: Item[];
    endpoint: string;
}

const ListRenderer: React.FC<ListRendererProps> = ({ data, endpoint }) => {
    return (
        <div className="w-full">
            {data.map((item) => (
                <ItemList key={item.id} endpoint={endpoint} itemInfo={item} />
            ))}
        </div>
    );
};

export default ListRenderer;
