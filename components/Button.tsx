// components/Button.tsx
import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="bg-black py-1 px-4 text-white rounded-lg hover:scale-105 transition-transform"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
