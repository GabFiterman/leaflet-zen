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
        setSelectAreaOfInterest: (state, action: PayloadAction<SelectedAreaOfInterestState>) => {
            state.selectedAreaOfInterest = action.payload;
        },
        addAreasOfInterest: (state, action: PayloadAction<AreaOfInterest[]>) => {
            state.areasOfInterest.push(...action.payload);
        },
        addAreaOfInterest: (state, action: PayloadAction<AreaOfInterest>) => {
            state.areasOfInterest.push(action.payload);
        },
    },
});

export const { addAreaOfInterest, addAreasOfInterest, setSelectAreaOfInterest } = areasOfInterestSlice.actions;
export default areasOfInterestSlice.reducer;
