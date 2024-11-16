export const Progress = ({ value = 0, className = "" }) => (
  <div
    className={`h-2 w-full bg-gray-100 rounded-full overflow-hidden ${className}`}
  >
    <div
      className="h-full bg-purple-500 transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);
