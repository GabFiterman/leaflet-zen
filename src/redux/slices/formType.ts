import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormType {
    currentForm: 'InitialForm' | 'AddPointForm';
}

const initialState: FormType = {
    currentForm: 'InitialForm',
};

const formTypeSlice = createSlice({
    name: 'formType',
    initialState,
    reducers: {
        setFormType: (state, action: PayloadAction<'InitialForm' | 'AddPointForm'>) => {
            state.currentForm = action.payload;
        },
    },
});

export const { setFormType } = formTypeSlice.actions;
export default formTypeSlice.reducer;
