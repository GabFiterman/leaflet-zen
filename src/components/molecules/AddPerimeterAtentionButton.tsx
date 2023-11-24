import React from 'react';
import { useDispatch } from 'react-redux';
import { setFormType } from '../../redux/slices/formType';
import { Button } from '../atoms';

const AddPerimeterAtentionButton: React.FC = () => {
    const dispatch = useDispatch();

    const handleAddPerimeterAtention = () => {
        dispatch(setFormType('AddPerimeterForm'));
    };

    return <Button text="Perímetros +" onClick={handleAddPerimeterAtention} color="invisible" />;
};

export default AddPerimeterAtentionButton;
