/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Center {
    latitude: number;
    longitude: number;
}

interface perimeterAttention {
    id: number;
    description: string;
    center: Center;
    radius: number;
}

interface PerimeterAttentionState {
    perimetersAttention: perimeterAttention[];
    selectedPerimeterAttention?: SelectedPerimeterAttentionState | null;
    showPerimeterAttention?: any;
}

type SelectedPerimeterAttentionState = {
    center: Center;
    radius: number;
};

const initialState: PerimeterAttentionState = {
    perimetersAttention: [],
};

const perimetersAttentionSlice = createSlice({
    name: 'perimetersAttention',
    initialState,
    reducers: {
        showPerimetersAttention: (state, action: PayloadAction<SelectedPerimeterAttentionState>) => {
            state.showPerimeterAttention = action.payload;
        },
        setSelectPerimeterAttention: (state, action: PayloadAction<SelectedPerimeterAttentionState>) => {
            state.selectedPerimeterAttention = action.payload;
        },
        addperimetersAttention: (state, action: PayloadAction<perimeterAttention[]>) => {
            state.perimetersAttention.push(...action.payload);
        },
        addPerimeterAttention: (state, action: PayloadAction<perimeterAttention>) => {
            state.perimetersAttention.push(action.payload);
        },
        clearPerimetersAttention: (state) => {
            state.showPerimeterAttention = null;
        },
    },
});

export const {
    addPerimeterAttention,
    addperimetersAttention,
    setSelectPerimeterAttention,
    showPerimetersAttention,
    clearPerimetersAttention,
} = perimetersAttentionSlice.actions;
export default perimetersAttentionSlice.reducer;
