interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    color?: 'primary' | 'highlight' | 'lightBg' | 'darkBg' | 'invisible';
    bold?: boolean;
    paddingX?: string;
    paddingY?: string;
    fullWidth?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    trash?: boolean;
    onTrashClick?: () => void;
    sidebar?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    text,
    type = 'button',
    color = 'primary',
    fullWidth,
    bold,
    onClick,
    trash,
    onTrashClick,
    sidebar,
}) => {
    let buttonClasses = 'rounded py-1 px-4';
    sidebar && (buttonClasses += ' py-4 flex justify-between items-center');

    bold ? (buttonClasses += ' font-bold') : (buttonClasses += ' font-normal');
    fullWidth && (buttonClasses += ' w-full');

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
                <span className="cursor-pointer" onClick={onTrashClick}>
                    🗑️
                </span>
            )}
        </button>
    );
};

export default Button;
