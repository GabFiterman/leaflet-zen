import db from '../../db/db.json';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialPositionState {
    latitude: number | null;
    longitude: number | null;
    zoomLevel: number | null;
}

const LS_KEY = 'leafletZenInitialPosition';

const loadInitialState = (): InitialPositionState => {
    try {
        const serializedState = localStorage.getItem(LS_KEY);
        if (serializedState === null) {
            return db.initialPosition as InitialPositionState;
        }
        return JSON.parse(serializedState) as InitialPositionState;
    } catch (err) {
        console.error('Erro ao carregar estado do LocalStorage. Usando template.', err);
        return db.initialPosition as InitialPositionState;
    }
};

const saveState = (state: InitialPositionState) => {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (err) {
        console.error('Erro ao salvar estado no LocalStorage.', err);
    }
};

const initialState: InitialPositionState = loadInitialState();

const initialPositionSlice = createSlice({
    name: 'initialPosition',
    initialState,
    reducers: {
        addInitialPosition: (state, action: PayloadAction<InitialPositionState>) => {
            const newState = { ...state, ...action.payload };
            saveState(newState);
            return newState;
        },
        updateInitialPosition: (state, action: PayloadAction<Partial<InitialPositionState>>) => {
            const newState = { ...state, ...action.payload };
            saveState(newState);
            return newState;
        },
    },
});

export const { addInitialPosition, updateInitialPosition } = initialPositionSlice.actions;
export default initialPositionSlice.reducer;
