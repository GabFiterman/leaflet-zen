/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import db from '../../db/db.json';

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
    hiddenAreas: number[];
}

type SelectedAreaOfInterestState = {
    topLeft: Coordinates;
    bottomRight: Coordinates;
};

const LS_KEY = 'leafletZenAreasOfInterest';

const loadAreasState = (): AreaOfInterest[] => {
    try {
        const serializedState = localStorage.getItem(LS_KEY);
        if (serializedState === null) {
            return db.areasOfInterest as AreaOfInterest[];
        }
        return JSON.parse(serializedState) as AreaOfInterest[];
    } catch (err) {
        console.error('Erro ao carregar Areas do LocalStorage. Usando template.', err);
        return db.areasOfInterest as AreaOfInterest[];
    }
};

const saveAreasState = (areas: AreaOfInterest[]) => {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(areas));
    } catch (err) {
        console.error('Erro ao salvar Areas no LocalStorage.', err);
    }
};

const initialState: AreaOfInterestState = {
    areasOfInterest: loadAreasState(),
    hiddenAreas: [],
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
            if (action.payload && (action.payload as any).id) {
                const id = (action.payload as any).id;
                if (!state.hiddenAreas) {
                    state.hiddenAreas = [];
                }
                state.hiddenAreas = state.hiddenAreas.filter((aId) => aId !== id);
            }
        },
        toggleAreaVisibility: (state, action: PayloadAction<number>) => {
            if (!state.hiddenAreas) {
                state.hiddenAreas = [];
            }
            const id = action.payload;
            if (state.hiddenAreas.includes(id)) {
                state.hiddenAreas = state.hiddenAreas.filter((aId) => aId !== id);
            } else {
                state.hiddenAreas.push(id);
            }
        },
        clearAreaOfInterest: (state) => {
            state.showAreaOfInterest = null;
        },
        addAreaOfInterest: (state, action: PayloadAction<AreaOfInterest>) => {
            state.areasOfInterest.push(action.payload);
            saveAreasState(state.areasOfInterest);
        },
        addAreasOfInterest: (state, action: PayloadAction<AreaOfInterest[]>) => {
            state.areasOfInterest.push(...action.payload);
            saveAreasState(state.areasOfInterest);
        },

        removeAreaOfInterest: (state, action: PayloadAction<number>) => {
            const itemIdToRemove = action.payload;
            state.areasOfInterest = state.areasOfInterest.filter((area) => area.id !== itemIdToRemove);
            saveAreasState(state.areasOfInterest);
            if (state.showAreaOfInterest && state.showAreaOfInterest.id === itemIdToRemove) {
                state.showAreaOfInterest = null;
            }
        },
        updateAreaOfInterest: (state, action: PayloadAction<AreaOfInterest>) => {
            const index = state.areasOfInterest.findIndex((area) => area.id === action.payload.id);
            if (index !== -1) {
                state.areasOfInterest[index] = action.payload;
                saveAreasState(state.areasOfInterest);
            }
            if (state.showAreaOfInterest && state.showAreaOfInterest.id === action.payload.id) {
                state.showAreaOfInterest = action.payload;
            }
            if (state.selectedAreaOfInterest && (state.selectedAreaOfInterest as any).id === action.payload.id) {
                state.selectedAreaOfInterest = action.payload as any;
            }
        },
    },
});

export const {
    addAreaOfInterest,
    addAreasOfInterest,
    clearAreaOfInterest,
    removeAreaOfInterest,
    setSelectAreaOfInterest,
    showAreaOfInterest,
    updateAreaOfInterest,
    toggleAreaVisibility,
} = areasOfInterestSlice.actions;
export default areasOfInterestSlice.reducer;
