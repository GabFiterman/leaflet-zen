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
        setSelectPerimeterAttention: (state, action: PayloadAction<SelectedPerimeterAttentionState>) => {
            state.selectedPerimeterAttention = action.payload;
        },
        addperimetersAttention: (state, action: PayloadAction<perimeterAttention[]>) => {
            state.perimetersAttention.push(...action.payload);
        },
        addPerimeterAttention: (state, action: PayloadAction<perimeterAttention>) => {
            state.perimetersAttention.push(action.payload);
        },
    },
});

export const { addPerimeterAttention, addperimetersAttention, setSelectPerimeterAttention } =
    perimetersAttentionSlice.actions;
export default perimetersAttentionSlice.reducer;
