import { createSlice } from '@reduxjs/toolkit';

interface CounterState {
    currentCount: number;
}

const initialState: CounterState = {
    currentCount: 0,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.currentCount += 1;
        },
        decrement: (state) => {
            state.currentCount -= 1;
        },
    },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
