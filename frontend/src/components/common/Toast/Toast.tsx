import { CheckCircle, Error, Info, Warning } from "@mui/icons-material";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
}

const variantStyles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: <CheckCircle className="text-green-500" fontSize="small" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: <Error className="text-red-500" fontSize="small" />,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    icon: <Warning className="text-yellow-500" fontSize="small" />,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: <Info className="text-blue-500" fontSize="small" />,
  },
};

export const Toast = ({
  message,
  variant = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = variantStyles[variant];

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`
          flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
          ${styles.bg} ${styles.border} ${styles.text}
          border animate-slide-up
        `}
      >
        {styles.icon}
        <p className="text-xs">{message}</p>
      </div>
    </div>,
    document.body
  );
};
