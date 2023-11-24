import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Center {
    latitude: number;
    longitude: number;
}

interface AttentionPerimeter {
    id: number;
    description: string;
    center: Center;
    radius: number;
}

interface AttentionPerimeterState {
    attentionPerimeters: AttentionPerimeter[];
    selectedAttentionPerimeter?: SelectedAttentionPerimeterState | null;
}

type SelectedAttentionPerimeterState = {
    center: Center;
    radius: number;
};

const initialState: AttentionPerimeterState = {
    attentionPerimeters: [],
};

const perimetersOfInterestSlice = createSlice({
    name: 'perimetersAtention',
    initialState,
    reducers: {
        setSelectedPerimeterAtention: (state, action: PayloadAction<SelectedAttentionPerimeterState>) => {
            state.selectedAttentionPerimeter = action.payload;
        },
        addPerimetersAtention: (state, action: PayloadAction<AttentionPerimeter[]>) => {
            state.attentionPerimeters.push(...action.payload);
        },
        addPerimeterAtention: (state, action: PayloadAction<AttentionPerimeter>) => {
            state.attentionPerimeters.push(action.payload);
        },
    },
});

export const { addPerimeterAtention, addPerimetersAtention, setSelectedPerimeterAtention } =
    perimetersOfInterestSlice.actions;
export default perimetersOfInterestSlice.reducer;
