/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addPointsOfInterest } from '../redux/slices/pointsOfInterest';
import { addInitialPosition } from '../redux/slices/initialPosition';

const DataFetcher: React.FC = () => {
    const dispatch = useDispatch();
    const pointsOfInterestData = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const initialPositionData = useSelector((state: any) => state.initialPosition);

    const fetchData = async (endpoint: string, action: Function) => {
        try {
            const response = await axios.get<any>(`http://localhost:3001${endpoint}`);
            dispatch(action(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (pointsOfInterestData.length === 0) {
            fetchData('/pointsOfInterest', addPointsOfInterest);
        }
        if (
            initialPositionData.latitude === null ||
            initialPositionData.longitude === null ||
            initialPositionData.zoomLevel === null
        ) {
            fetchData('/initialPosition', addInitialPosition);
        }
    }, [pointsOfInterestData, initialPositionData]);

    return null;
};

export default DataFetcher;
