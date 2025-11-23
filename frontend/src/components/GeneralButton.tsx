import React from 'react';

// Define theme type for TypeScript
type ButtonTheme = 'apply' | 'cancel' | 'continue' | 'submit' | 'sub-submit' | 'danger';

// Define width type for TypeScript
type ButtonWidth = 'full' | 'auto' | string;

// Button props interface
interface ButtonProps {
    text: string;
    theme: ButtonTheme;
    width?: ButtonWidth;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    loading?: boolean;
}

const GeneralButton: React.FC<ButtonProps> = ({
    text,
    theme,
    width = 'auto',
    onClick,
    disabled = false,
    className = '',
    loading = false
}) => {
    const themeStyles: Record<ButtonTheme, string> = {
        apply: 'bg-green-600 text-white hover:bg-green-700',
        cancel: 'bg-red-600 text-white hover:bg-red-700',
        continue: 'bg-blue-600 text-white hover:bg-blue-700',
        submit: 'bg-[#0077C8] text-white hover:bg-[#005f9e] uppercase',
        'sub-submit': 'bg-[#80BBE4] text-gray-700 hover:bg-[#99C9EB]',
        danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    const widthStyles = width === 'full' ? 'w-full' : width === 'auto' ? '' : width;

    const baseClasses = 'font-[Roboto] cursor-pointer rounded-full font-semibold transition-colors duration-200 focus:outline-none active:outline-none flex items-center justify-center px-4 py-2 shadow-[0_8px_4px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_4px_2px_rgba(0,0,0,0.1)] focus:border-2 focus:border-blue-500';
    const disabledClasses = disabled || loading ? 'font-[Roboto] opacity-50 !cursor-not-allowed' : '';
    const combinedClasses = `${baseClasses} ${themeStyles[theme]} ${widthStyles} ${disabledClasses} ${className}`;

    return (
        <button
            className={combinedClasses}
            onClick={(e) => {
                e.preventDefault();
                if (onClick) onClick();
            }}
            disabled={disabled || loading}
            type={theme === 'submit' || theme === 'sub-submit' ? 'submit' : 'button'}
            aria-disabled={disabled || loading}
        >
            {loading ? (
                <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {text}
                </span>
            ) : (
                text
            )}
        </button>
    );
};

export default GeneralButton;