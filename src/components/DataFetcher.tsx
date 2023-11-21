/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addPointsOfInterest } from '../redux/slices/pointsOfInterest';

interface DataFetcherProps {
    endpoint: string;
}

interface MyObject {
    id: number;
    description: string;
    latitude: number;
    longitude: number;
    zoomLevel: number;
}

const DataFetcher: React.FC<DataFetcherProps> = ({ endpoint }) => {
    const dispatch = useDispatch();
    const data = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);

    const fetchData = async () => {
        try {
            const response = await axios.get<MyObject[]>(`http://localhost:3001${endpoint}`);
            dispatch(addPointsOfInterest(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (data.length === 0) {
            fetchData();
        }
    }, [data]);

    return (
        <div>
            <h2>Data from {endpoint}</h2>
            <ul>
                {data.map((item: any) => (
                    <li key={item.id}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    );
};

export default DataFetcher;
