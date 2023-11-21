/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addPointsOfInterest } from '../redux/slices/pointsOfInterest';
import { addInitialPosition } from '../redux/slices/initialPosition';

interface PointsOfInterest {
    id: number;
    description: string;
    latitude: number;
    longitude: number;
    zoomLevel: number;
}

interface InitialPosition {
    latitude: number;
    longitude: number;
    zoomLevel: number;
}

const DataFetcher: React.FC = () => {
    const dispatch = useDispatch();
    const pointsOfInterestData = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const initialPositionData = useSelector((state: any) => state.initialPosition);

    const getPointsOfInterest = async () => {
        try {
            const endpoint = '/pointsOfInterest';
            const response = await axios.get<PointsOfInterest[]>(`http://localhost:3001${endpoint}`);
            dispatch(addPointsOfInterest(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getInitialPosition = async () => {
        try {
            const endpoint = '/initialPosition';
            const response = await axios.get<InitialPosition>(`http://localhost:3001${endpoint}`);
            dispatch(addInitialPosition(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (pointsOfInterestData.length === 0) {
            getPointsOfInterest();
        }
        if (
            initialPositionData.latitude === null ||
            initialPositionData.longitude === null ||
            initialPositionData.zoomLevel === null
        ) {
            getInitialPosition();
        }
    }, [pointsOfInterestData, initialPositionData]);

    return null;
};

export default DataFetcher;
