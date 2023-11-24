import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormType {
    currentForm: 'InitialForm' | 'AddPointForm' | 'AddAreaForm';
}

const initialState: FormType = {
    currentForm: 'InitialForm',
};

const formTypeSlice = createSlice({
    name: 'formType',
    initialState,
    reducers: {
        setFormType: (state, action: PayloadAction<'InitialForm' | 'AddPointForm' | 'AddAreaForm'>) => {
            state.currentForm = action.payload;
        },
    },
});

export const { setFormType } = formTypeSlice.actions;
export default formTypeSlice.reducer;
