import React from 'react';
import { useDispatch } from 'react-redux';
import { setFormType } from '../../redux/slices/formType';
import { Button } from '../atoms';

const AddPointOfInterestButton: React.FC = () => {
    const dispatch = useDispatch();

    const handleAddPointOfInterest = () => {
        dispatch(setFormType('AddPointForm'));
    };

    return <Button text="Pontos +" onClick={handleAddPointOfInterest} color="invisible" />;
};

export default AddPointOfInterestButton;
