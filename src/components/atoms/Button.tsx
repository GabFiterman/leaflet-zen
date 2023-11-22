interface ButtonProps {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    color?: 'primary' | 'highlight' | 'lightBg' | 'darkBg';
    bold?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, type = 'button', color = 'primary', bold, onClick }) => {
    let buttonClasses = 'px-3 py-2 rounded-md';

    bold ? (buttonClasses += ' font-bold') : (buttonClasses += ' font-normal');

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
