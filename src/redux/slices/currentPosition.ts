import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentPositionState {
    latitude: number | null;
    longitude: number | null;
    zoomLevel: number | null;
}

const initialState: CurrentPositionState = {
    latitude: null,
    longitude: null,
    zoomLevel: null,
};

const currentPositionSlice = createSlice({
    name: 'currentPosition',
    initialState,
    reducers: {
        setCurrentPosition: (state, action: PayloadAction<CurrentPositionState>) => {
            return { ...state, ...action.payload };
        },
        updateCurrentPosition: (state, action: PayloadAction<Partial<CurrentPositionState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setCurrentPosition, updateCurrentPosition } = currentPositionSlice.actions;
export default currentPositionSlice.reducer;
