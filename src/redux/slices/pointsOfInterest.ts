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
        setSelectPointOfInterest: (state, action: PayloadAction<SelectedPointOfInterestState>) => {
            state.selectedPointOfInterest = action.payload;
        },
        addPointsOfInterest: (state, action: PayloadAction<PointOfInterest[]>) => {
            state.pointsOfInterest.push(...action.payload);
        },
        addPointOfInterest: (state, action: PayloadAction<PointOfInterest>) => {
            state.pointsOfInterest.push(action.payload);
        },
    },
});

export const { addPointOfInterest, addPointsOfInterest, setSelectPointOfInterest } = pointsOfInterestSlice.actions;
export default pointsOfInterestSlice.reducer;
