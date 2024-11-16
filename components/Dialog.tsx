import React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
  className = "",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className = "",
}) => <div className={`p-6 w-full sm:w-[28rem] ${className}`}>{children}</div>;

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className = "",
}) => <div className={`mb-4 ${className}`}>{children}</div>;

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className = "",
}) => <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
