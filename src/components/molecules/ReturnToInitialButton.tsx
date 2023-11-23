import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPosition } from '../../redux/slices/currentPosition';
import { Button } from '../atoms';

interface ButtonProps {
    text?: string;
    color?: 'primary' | 'highlight' | 'lightBg' | 'darkBg';
    bold?: boolean;
}

const ReturnToInitialButton: React.FC<ButtonProps> = ({
    text = 'Ponto e Zoom iniciais',
    color = 'highlight',
    bold = false,
}) => {
    const dispatch = useDispatch();
    const initialPosition = useSelector((state: any) => state.initialPosition);

    const handleReturnToInitial = () => {
        dispatch(updateCurrentPosition(initialPosition));
    };

    return <Button text={text} color={color} bold={bold} onClick={handleReturnToInitial} paddingY="2" />;
};

export default ReturnToInitialButton;
