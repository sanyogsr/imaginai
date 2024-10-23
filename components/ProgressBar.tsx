import React from "react";

interface ProgressProps {
  value: number;
  maxValue?: number;
  variant?: "default" | "gradient";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  maxValue = 100,
  variant = "gradient",
  size = "md",
  showValue = false,
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    default: "bg-purple-500",
    gradient: "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500",
  };

  return (
    <div className="w-full">
      <div className="w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`${sizeClasses[size]} ${variants[variant]} rounded-full transition-all duration-500 ease-out transform origin-left`}
          style={{ width: `${percentage}%` }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent to-white/20 animate-shimmer" />
        </div>
      </div>
      {showValue && (
        <div className="mt-1 text-xs font-medium text-gray-500 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};
