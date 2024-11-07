import { ReactNode, useState } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "gradient";
  isActive?: boolean;
}

export const AnimatedContainer = ({
  children,
  className = "",
  variant = "glass",
  isActive = false,
}: AnimatedContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    glass: "bg-white/10",
    solid: "bg-white dark:bg-gray-900",
    gradient: "bg-gradient-to-br from-zinc-100 to-white dark:from-gray-900 dark:to-gray-800",
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient light effect */}
      <div
        className={`
          absolute -inset-[1px]
          bg-gradient-to-r from-teal-200 via-blue-200 to-purple-300
          rounded-xl opacity-0
          group-hover:opacity-30
          transition-all duration-1000
          ${isActive ? "opacity-50 animate-pulse" : ""}
        `}
      />

      {/* Border gradient */}
      <div
        className={`
          absolute -inset-[1px]
          bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600
          rounded-xl
          opacity-40
          group-hover:opacity-100
          transition-all duration-300
        `}
      />

      {/* Content container */}
      <div
        className={`
          relative 
          rounded-xl
          ${variantStyles[variant]}
          transition-all
          duration-300
          transform
          ${isHovered ? "scale-[1.0001] shadow-2xl" : "scale-100 shadow-xl"}
          ${isActive ? "scale-[1.02]" : ""}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};