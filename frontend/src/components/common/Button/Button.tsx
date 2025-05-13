import React from "react";

interface ButtonProps {
  className?: string;
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  title?: string;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  className = "",
  icon,
  label,
  onClick,
  variant = "primary",
  title,
  type = "button",
}: ButtonProps) => {
  const variantStyles = {
    primary:
      "text-gray-600 hover:bg-gray-100 border border-border-dark hover:border-gray-400",
    secondary: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
  };

  const paddingStyles = label ? "pl-3 pr-4 py-1.5" : "p-0.5 px-2";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md focus:outline-none transition-colors w-fit text-nowrap text-xs flex flex-row items-center justify-center gap-2 ${variantStyles[variant]} ${paddingStyles} ${className}`}
      title={title}
    >
      {icon && <span className="text-current">{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};
