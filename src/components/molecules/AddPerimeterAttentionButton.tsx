import React from 'react';
import { useDispatch } from 'react-redux';
import { setFormType } from '../../redux/slices/formType';
import { Button } from '../atoms';

const AddPerimeterAttentionButton: React.FC = () => {
    const dispatch = useDispatch();

    const handleAddPerimeterAttention = () => {
        dispatch(setFormType('AddPerimeterForm'));
    };

    return <Button text="Perímetros +" onClick={handleAddPerimeterAttention} color="invisible" />;
};

export default AddPerimeterAttentionButton;
