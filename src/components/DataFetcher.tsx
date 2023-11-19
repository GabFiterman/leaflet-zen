/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/DataFetcher.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface DataFetcherProps {
    endpoint: string;
}

const DataFetcher: React.FC<DataFetcherProps> = ({ endpoint }) => {
    const [data, setData] = useState<unknown[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001${endpoint}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [endpoint]);

    return (
        <div>
            <h2>
                Data from <b>{endpoint}</b>
            </h2>
            <ul>
                {data.map((item: any) => (
                    <li key={item.id}>
                        <h3>
                            {item.id} | <b>{item.description}</b>
                        </h3>
                        <span>{item.latitude} </span>|<span> {item.longitude}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DataFetcher;
