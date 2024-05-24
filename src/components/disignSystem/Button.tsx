import React from 'react';

interface ButtonProps {
    onClick: () => void;
    active: boolean;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, active, children, className }) => {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded ${
                active
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-purple-500 border border-purple-500'
            } hover:bg-purple-600 transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
