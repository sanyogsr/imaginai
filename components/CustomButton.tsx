// CustomButton.tsx - Our custom button component
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

const CustomButton: React.FC<ButtonProps> = ({
  onClick,
  disabled,
  children,
  className = "",
  variant = "primary",
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
