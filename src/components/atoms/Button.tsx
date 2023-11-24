interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    color?: 'primary' | 'highlight' | 'lightBg' | 'darkBg' | 'invisible';
    bold?: boolean;
    paddingX?: string;
    paddingY?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    trash?: boolean;
    onTrashClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    text,
    type = 'button',
    color = 'primary',
    paddingX = '3',
    paddingY = '0',
    bold,
    onClick,
    trash,
    onTrashClick,
}) => {
    let buttonClasses = 'px-3 rounded-md';

    bold ? (buttonClasses += ' font-bold') : (buttonClasses += ' font-normal');
    buttonClasses += ` px-${paddingX}`;
    buttonClasses += ` py-${paddingY}`;

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
        case 'invisible':
            buttonClasses += ' bg-transparent text-white';
            break;
        default:
            buttonClasses += ' bg-primary text-white';
            break;
    }

    return (
        <button type={type} className={buttonClasses} onClick={onClick}>
            {text}
            {trash && (
                <span className="ml-2 cursor-pointer" onClick={onTrashClick}>
                    🗑️
                </span>
            )}
        </button>
    );
};

export default Button;
