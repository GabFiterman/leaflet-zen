/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addPointsOfInterest } from '../../redux/slices/pointsOfInterest';
import { addInitialPosition } from '../../redux/slices/initialPosition';
import { addAreasOfInterest } from '../../redux/slices/areasOfInterest';
import { addperimetersAttention } from '../../redux/slices/perimetersAttention';

const DataFetcher: React.FC = () => {
    const dispatch = useDispatch();
    const initialPositionData = useSelector((state: any) => state.initialPosition);
    const pointsOfInterestData = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const areasOfInterestData = useSelector((state: any) => state.areasOfInterest.areasOfInterest);
    const perimetersAttentionData = useSelector((state: any) => state.perimetersAttention.perimetersAttention);

    const fetchData = async (endpoint: string, action: Function) => {
        try {
            const response = await axios.get<any>(`http://localhost:3001${endpoint}`);
            dispatch(action(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (
            initialPositionData.latitude === null ||
            initialPositionData.longitude === null ||
            initialPositionData.zoomLevel === null
        ) {
            fetchData('/initialPosition', addInitialPosition);
        }
    }, [initialPositionData]);

    useEffect(() => {
        if (pointsOfInterestData.length === 0) {
            fetchData('/pointsOfInterest', addPointsOfInterest);
        }
    }, [pointsOfInterestData]);

    useEffect(() => {
        if (areasOfInterestData.length === 0) {
            fetchData('/areasOfInterest', addAreasOfInterest);
        }
    }, [areasOfInterestData]);

    useEffect(() => {
        if (perimetersAttentionData.length === 0) {
            fetchData('/perimetersAttention', addperimetersAttention);
        }
    }, [perimetersAttentionData]);

    return null;
};

export default DataFetcher;
