import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialPositionState {
    latitude: number | null;
    longitude: number | null;
    zoomLevel: number | null;
}

const initialState: InitialPositionState = {
    latitude: null,
    longitude: null,
    zoomLevel: null,
};

const initialPositionSlice = createSlice({
    name: 'initialPosition',
    initialState,
    reducers: {
        addInitialPosition: (state, action: PayloadAction<InitialPositionState>) => {
            return { ...state, ...action.payload };
        },
        updateInitialPosition: (state, action: PayloadAction<Partial<InitialPositionState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { addInitialPosition, updateInitialPosition } = initialPositionSlice.actions;
export default initialPositionSlice.reducer;
