/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface AreaOfInterest {
    id: number;
    description: string;
    topLeft: Coordinates;
    bottomRight: Coordinates;
}

interface AreaOfInterestState {
    areasOfInterest: AreaOfInterest[];
    selectedAreaOfInterest?: SelectedAreaOfInterestState | null;
    showAreaOfInterest?: any;
}

type SelectedAreaOfInterestState = {
    topLeft: Coordinates;
    bottomRight: Coordinates;
};

const initialState: AreaOfInterestState = {
    areasOfInterest: [],
};

const areasOfInterestSlice = createSlice({
    name: 'areasOfInterest',
    initialState,
    reducers: {
        showAreaOfInterest: (state, action: PayloadAction<SelectedAreaOfInterestState>) => {
            state.showAreaOfInterest = action.payload;
        },
        setSelectAreaOfInterest: (state, action: PayloadAction<SelectedAreaOfInterestState>) => {
            state.selectedAreaOfInterest = action.payload;
        },
        addAreasOfInterest: (state, action: PayloadAction<AreaOfInterest[]>) => {
            state.areasOfInterest.push(...action.payload);
        },
        addAreaOfInterest: (state, action: PayloadAction<AreaOfInterest>) => {
            state.areasOfInterest.push(action.payload);
        },
        clearAreaOfInterest: (state) => {
            state.showAreaOfInterest = null;
        },
    },
});

export const {
    addAreaOfInterest,
    addAreasOfInterest,
    setSelectAreaOfInterest,
    showAreaOfInterest,
    clearAreaOfInterest,
} = areasOfInterestSlice.actions;
export default areasOfInterestSlice.reducer;
