// components/MaxWidthWrapper.tsx
import { PropsWithChildren } from "react";
import { cn } from "../utils/cn"; // A helper function to conditionally join class names (if available)

interface MaxWidthWrapperProps {
  className?: string;
}

export function MaxWidthWrapper({
  children,
  className = "",
}: PropsWithChildren<MaxWidthWrapperProps>) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        className // Allows additional custom styles to be passed
      )}
    >
      {children}
    </div>
  );
}
