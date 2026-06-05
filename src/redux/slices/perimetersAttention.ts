/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import db from '../../db/db.json';

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
    hiddenPerimeters: number[];
}

type SelectedPerimeterAttentionState = {
    center: Center;
    radius: number;
};

const LS_KEY = 'leafletZenPerimetersAttention';

const loadPerimetersState = (): perimeterAttention[] => {
    try {
        const serializedState = localStorage.getItem(LS_KEY);
        if (serializedState === null) {
            return db.perimetersAttention as perimeterAttention[];
        }
        return JSON.parse(serializedState) as perimeterAttention[];
    } catch (err) {
        console.error('Erro ao carregar Perimeters do LocalStorage. Usando template.', err);
        return db.perimetersAttention as perimeterAttention[];
    }
};

const savePerimetersState = (perimeters: perimeterAttention[]) => {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(perimeters));
    } catch (err) {
        console.error('Erro ao salvar Perimeters no LocalStorage.', err);
    }
};

const initialState: PerimeterAttentionState = {
    perimetersAttention: loadPerimetersState(),
    hiddenPerimeters: [],
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
            if (action.payload && (action.payload as any).id) {
                const id = (action.payload as any).id;
                if (!state.hiddenPerimeters) {
                    state.hiddenPerimeters = [];
                }
                state.hiddenPerimeters = state.hiddenPerimeters.filter((pId) => pId !== id);
            }
        },
        togglePerimeterVisibility: (state, action: PayloadAction<number>) => {
            if (!state.hiddenPerimeters) {
                state.hiddenPerimeters = [];
            }
            const id = action.payload;
            if (state.hiddenPerimeters.includes(id)) {
                state.hiddenPerimeters = state.hiddenPerimeters.filter((pId) => pId !== id);
            } else {
                state.hiddenPerimeters.push(id);
            }
        },
        addperimetersAttention: (state, action: PayloadAction<perimeterAttention[]>) => {
            state.perimetersAttention.push(...action.payload);
            savePerimetersState(state.perimetersAttention);
        },
        addPerimeterAttention: (state, action: PayloadAction<perimeterAttention>) => {
            state.perimetersAttention.push(action.payload);
            savePerimetersState(state.perimetersAttention);
        },
        clearPerimetersAttention: (state) => {
            state.showPerimeterAttention = null;
        },
        removePerimeterAttention: (state, action: PayloadAction<number>) => {
            const itemIdToRemove = action.payload;
            state.perimetersAttention = state.perimetersAttention.filter(
                (perimeter) => perimeter.id !== itemIdToRemove,
            );
            savePerimetersState(state.perimetersAttention);
            if (state.showPerimeterAttention && state.showPerimeterAttention.id === itemIdToRemove) {
                state.showPerimeterAttention = null;
            }
        },
        updatePerimeterAttention: (state, action: PayloadAction<perimeterAttention>) => {
            const index = state.perimetersAttention.findIndex((perimeter) => perimeter.id === action.payload.id);
            if (index !== -1) {
                state.perimetersAttention[index] = action.payload;
                savePerimetersState(state.perimetersAttention);
            }
            if (state.showPerimeterAttention && state.showPerimeterAttention.id === action.payload.id) {
                state.showPerimeterAttention = action.payload;
            }
            if (
                state.selectedPerimeterAttention &&
                (state.selectedPerimeterAttention as any).id === action.payload.id
            ) {
                state.selectedPerimeterAttention = action.payload as any;
            }
        },
    },
});

export const {
    addPerimeterAttention,
    addperimetersAttention,
    clearPerimetersAttention,
    removePerimeterAttention,
    setSelectPerimeterAttention,
    showPerimetersAttention,
    updatePerimeterAttention,
    togglePerimeterVisibility,
} = perimetersAttentionSlice.actions;
export default perimetersAttentionSlice.reducer;
