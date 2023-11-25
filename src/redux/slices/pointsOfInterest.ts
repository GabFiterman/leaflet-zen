/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PointOfInterest {
    id: number;
    description: string;
    latitude: number;
    longitude: number;
    zoomLevel: number;
}

interface PointsOfInterestState {
    pointsOfInterest: PointOfInterest[];
    selectedPointOfInterest?: SelectedPointOfInterestState | null;
    showPointOfInterest?: any;
}

type SelectedPointOfInterestState = {
    latitude: number;
    longitude: number;
    zoomLevel: number;
};

const initialState: PointsOfInterestState = {
    pointsOfInterest: [],
};

const pointsOfInterestSlice = createSlice({
    name: 'pointsOfInterest',
    initialState,
    reducers: {
        showPointOfInterest: (state, action: PayloadAction<SelectedPointOfInterestState>) => {
            state.showPointOfInterest = action.payload;
        },
        setSelectPointOfInterest: (state, action: PayloadAction<SelectedPointOfInterestState>) => {
            state.selectedPointOfInterest = action.payload;
        },
        addPointsOfInterest: (state, action: PayloadAction<PointOfInterest[]>) => {
            state.pointsOfInterest.push(...action.payload);
        },
        addPointOfInterest: (state, action: PayloadAction<PointOfInterest>) => {
            state.pointsOfInterest.push(action.payload);
        },
        clearPointOfInterest: (state) => {
            state.showPointOfInterest = null;
        },
    },
});

export const {
    addPointOfInterest,
    addPointsOfInterest,
    setSelectPointOfInterest,
    showPointOfInterest,
    clearPointOfInterest,
} = pointsOfInterestSlice.actions;
export default pointsOfInterestSlice.reducer;
