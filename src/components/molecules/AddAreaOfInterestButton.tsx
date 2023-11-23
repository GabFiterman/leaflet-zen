import React from 'react';
import { useDispatch } from 'react-redux';
import { setFormType } from '../../redux/slices/formType';
import { Button } from '../atoms';

const AddAreaOfInterestButton: React.FC = () => {
    const dispatch = useDispatch();

    const handleAddAreaOfInterest = () => {
        dispatch(setFormType('AddAreaForm'));
    };

    return <Button text="Pontos +" onClick={handleAddAreaOfInterest} color="invisible" />;
};

export default AddAreaOfInterestButton;
