import React from 'react';

interface InputProps {
    placeholder?: string;
    type?: 'text' | 'number';
    color?: string;
    textColor?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { placeholder = 'Digite...', type = 'text', color, textColor, value, onChange, onBlur, onKeyDown, required },
        ref,
    ) => {
        let inputClasses =
            'w-full px-3 py-1.5 border rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition duration-150 ease-in-out';

        if (color) {
            inputClasses += ` border-${color}`;
        } else {
            inputClasses += ' border-slate-300';
        }

        if (textColor) {
            inputClasses += ` text-${textColor}`;
        } else {
            inputClasses += ' text-darkText';
        }

        return (
            <input
                ref={ref}
                type={type}
                className={inputClasses}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                required={required}
            />
        );
    },
);

Input.displayName = 'Input';

export default Input;
