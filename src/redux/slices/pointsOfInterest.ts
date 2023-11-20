import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PointOfInterest {
    id: number;
    description: string;
    latitude: number;
    longitude: number;
}

interface PointsOfInterestState {
    pointsOfInterest: PointOfInterest[];
}

const initialState: PointsOfInterestState = {
    pointsOfInterest: [],
};

const pointsOfInterestSlice = createSlice({
    name: 'pointsOfInterest',
    initialState,
    reducers: {
        addPointsOfInterest: (state, action: PayloadAction<PointOfInterest[]>) => {
            state.pointsOfInterest.push(...action.payload);
        },
        addPointOfInterest: (state, action: PayloadAction<PointOfInterest>) => {
            state.pointsOfInterest.push(action.payload);
        },
    },
});

export const { addPointOfInterest, addPointsOfInterest } = pointsOfInterestSlice.actions;
export default pointsOfInterestSlice.reducer;
