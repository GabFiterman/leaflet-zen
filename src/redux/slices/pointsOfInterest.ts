/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import db from '../../db/db.json';

interface PointOfInterest {
    id: number;
    description: string;
    latitude: number;
    longitude: number;
    zoomLevel: number;
}

interface PointsOfInterestState {
    pointsOfInterest: PointOfInterest[];
    selectedPointOfInterest?: SelectedPointOfInterestState | null;
    showPointOfInterest?: any;
    hiddenPoints: number[];
}

type SelectedPointOfInterestState = {
    latitude: number;
    longitude: number;
    zoomLevel: number;
};

const LS_KEY = 'leafletZenPointsOfInterest';

const loadPointsState = (): PointOfInterest[] => {
    try {
        const serializedState = localStorage.getItem(LS_KEY);
        if (serializedState === null) {
            return db.pointsOfInterest as PointOfInterest[];
        }
        return JSON.parse(serializedState) as PointOfInterest[];
    } catch (err) {
        console.error('Erro ao carregar Points do LocalStorage. Usando template.', err);
        return db.pointsOfInterest as PointOfInterest[];
    }
};

const savePointsState = (points: PointOfInterest[]) => {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(points));
    } catch (err) {
        console.error('Erro ao salvar Points no LocalStorage.', err);
    }
};

const initialState: PointsOfInterestState = {
    pointsOfInterest: loadPointsState(),
    hiddenPoints: [],
};
const pointsOfInterestSlice = createSlice({
    name: 'pointsOfInterest',
    initialState,
    reducers: {
        showPointOfInterest: (state, action: PayloadAction<SelectedPointOfInterestState>) => {
            state.showPointOfInterest = action.payload;
        },
        setSelectPointOfInterest: (state, action: PayloadAction<SelectedPointOfInterestState>) => {
            state.selectedPointOfInterest = action.payload;
            if (action.payload && (action.payload as any).id) {
                const id = (action.payload as any).id;
                if (!state.hiddenPoints) {
                    state.hiddenPoints = [];
                }
                state.hiddenPoints = state.hiddenPoints.filter((pId) => pId !== id);
            }
        },
        togglePointVisibility: (state, action: PayloadAction<number>) => {
            if (!state.hiddenPoints) {
                state.hiddenPoints = [];
            }
            const id = action.payload;
            if (state.hiddenPoints.includes(id)) {
                state.hiddenPoints = state.hiddenPoints.filter((pId) => pId !== id);
            } else {
                state.hiddenPoints.push(id);
            }
        },
        addPointsOfInterest: (state, action: PayloadAction<PointOfInterest[]>) => {
            state.pointsOfInterest.push(...action.payload);
            savePointsState(state.pointsOfInterest);
        },
        addPointOfInterest: (state, action: PayloadAction<PointOfInterest>) => {
            state.pointsOfInterest.push(action.payload);
            savePointsState(state.pointsOfInterest);
        },
        clearPointOfInterest: (state) => {
            state.showPointOfInterest = null;
        },
        removePointOfInterest: (state, action: PayloadAction<number>) => {
            const itemIdToRemove = action.payload;
            state.pointsOfInterest = state.pointsOfInterest.filter((point) => point.id !== itemIdToRemove);
            savePointsState(state.pointsOfInterest);

            if (state.showPointOfInterest && state.showPointOfInterest.id === itemIdToRemove) {
                state.showPointOfInterest = null;
            }
        },
        updatePointOfInterest: (state, action: PayloadAction<PointOfInterest>) => {
            const index = state.pointsOfInterest.findIndex((point) => point.id === action.payload.id);
            if (index !== -1) {
                state.pointsOfInterest[index] = action.payload;
                savePointsState(state.pointsOfInterest);
            }
            if (state.showPointOfInterest && state.showPointOfInterest.id === action.payload.id) {
                state.showPointOfInterest = action.payload;
            }
            if (state.selectedPointOfInterest && (state.selectedPointOfInterest as any).id === action.payload.id) {
                state.selectedPointOfInterest = action.payload as any;
            }
        },
    },
});

export const {
    addPointOfInterest,
    addPointsOfInterest,
    clearPointOfInterest,
    removePointOfInterest,
    setSelectPointOfInterest,
    showPointOfInterest,
    updatePointOfInterest,
    togglePointVisibility,
} = pointsOfInterestSlice.actions;
export default pointsOfInterestSlice.reducer;
