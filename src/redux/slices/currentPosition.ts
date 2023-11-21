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
        setInitialPosition: (state, action: PayloadAction<CurrentPositionState>) => {
            return { ...state, ...action.payload };
        },
        updatePosition: (state, action: PayloadAction<Partial<CurrentPositionState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setInitialPosition, updatePosition } = currentPositionSlice.actions;
export default currentPositionSlice.reducer;
