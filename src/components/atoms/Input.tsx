interface InputProps {
    placeholder?: string;
    type?: 'text' | 'number';
    color?: string;
    textColor?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({
    placeholder = 'digite ...',
    type = 'text',
    color = 'lightText',
    textColor = 'darkText',
    value,
    onChange,
    onBlur,
    required,
}) => {
    let inputClasses = 'rounded px-1 border-2 border-solid max-w-[100px]';

    color ? (inputClasses += ` border-${color}`) : (inputClasses += ' border-slate-500');
    textColor ? (inputClasses += ` text-${color}`) : (inputClasses += ' text-darkText');

    return (
        <input
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
        />
    );
};

export default Input;
