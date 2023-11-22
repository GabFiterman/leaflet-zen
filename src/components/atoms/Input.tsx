interface InputProps {
    placeholder?: string;
    type?: 'text' | 'number';
    color?: string;
    textColor?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
    placeholder = 'digite ...',
    type = 'text',
    color = 'lightText',
    textColor = 'darkText',
    value,
    onChange,
    onBlur,
}) => {
    let inputClasses = 'rounded px-3 border-2 border-solid';

    color ? (inputClasses += ` border-${color}`) : (inputClasses += ' border-lightText');
    textColor ? (inputClasses += ` text-${color}`) : (inputClasses += ' text-darkText');

    return (
        <input
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

export default Input;