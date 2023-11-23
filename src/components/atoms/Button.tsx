interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    color?: 'primary' | 'highlight' | 'lightBg' | 'darkBg';
    bold?: boolean;
    paddingX?: string;
    paddingY?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
    text,
    type = 'button',
    color = 'primary',
    paddingX = 3,
    paddingY,
    bold,
    onClick,
}) => {
    let buttonClasses = 'px-3 rounded-md';

    bold ? (buttonClasses += ' font-bold') : (buttonClasses += ' font-normal');
    paddingX ? (buttonClasses += ` px-${paddingX}`) : (buttonClasses += ' px-3');
    paddingY ? (buttonClasses += ` py-${paddingY}`) : (buttonClasses += ' py-0');

    switch (color) {
        case 'primary':
            buttonClasses += ' bg-primary text-white';
            break;
        case 'highlight':
            buttonClasses += ' bg-highlight text-darkText';
            break;
        case 'lightBg':
            buttonClasses += ' bg-lightBg text-darkText';
            break;
        case 'darkBg':
            buttonClasses += ' bg-darkBg text-white';
            break;
        default:
            buttonClasses += ' bg-primary text-white';
            break;
    }

    return (
        <button type={type} className={buttonClasses} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
