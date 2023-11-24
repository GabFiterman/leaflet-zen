/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ListItem from '../molecules/ItemList';

interface Item {
    id: number;
    description: string;
    [key: string]: any;
}

interface ListRendererProps {
    data: Item[];
    onDeleteItemClick?: (id: number) => void;
}

const ListRenderer: React.FC<ListRendererProps> = ({ data, onDeleteItemClick }) => {
    return (
        <div>
            {data.map((item) => {
                return <ListItem key={item.id} itemInfo={{ ...item, description: item.description }} />;
            })}
        </div>
    );
};

export default ListRenderer;
