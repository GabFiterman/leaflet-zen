import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormType {
    currentForm: 'InitialForm' | 'AddPointForm' | 'AddAreaForm' | 'AddPerimeterForm';
}

const initialState: FormType = {
    currentForm: 'InitialForm',
};

const formTypeSlice = createSlice({
    name: 'formType',
    initialState,
    reducers: {
        setFormType: (
            state,
            action: PayloadAction<'InitialForm' | 'AddPointForm' | 'AddAreaForm' | 'AddPerimeterForm'>,
        ) => {
            state.currentForm = action.payload;
        },
    },
});

export const { setFormType } = formTypeSlice.actions;
export default formTypeSlice.reducer;
