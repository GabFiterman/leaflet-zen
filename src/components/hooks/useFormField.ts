import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';

interface UseFormFieldOptions {
    initialValue: string;
    fieldName: string;
}

interface UseFormFieldProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
}

const useFormField = ({ initialValue, fieldName }: UseFormFieldOptions): UseFormFieldProps => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(initialValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        switch (fieldName) {
            case 'latitude':
                dispatch(
                    updateCurrentPosition({
                        latitude: parseFloat(value),
                    }),
                );
                break;
            case 'longitude':
                dispatch(
                    updateCurrentPosition({
                        longitude: parseFloat(value),
                    }),
                );
                break;
            case 'zoomLevel':
                dispatch(
                    updateCurrentPosition({
                        zoomLevel: parseInt(value),
                    }),
                );
                break;
            default:
                break;
        }
    };

    return {
        value,
        setValue,
        onChange: handleChange,
        onBlur: handleBlur,
    };
};

export default useFormField;
