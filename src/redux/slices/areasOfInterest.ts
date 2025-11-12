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
    },
});

export const {
    addAreaOfInterest,
    addAreasOfInterest,
    clearAreaOfInterest,
    removeAreaOfInterest,
    setSelectAreaOfInterest,
    showAreaOfInterest,
} = areasOfInterestSlice.actions;
export default areasOfInterestSlice.reducer;
