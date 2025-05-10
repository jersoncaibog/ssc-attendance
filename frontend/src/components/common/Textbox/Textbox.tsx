import React from "react";

interface TextboxProps {
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const Textbox = ({ className = "", icon, placeholder }: TextboxProps) => {
  return (
    <div
      className={`${className} w-40 flex flex-row items-center border border-border-dark px-3 py-1 gap-2 rounded-md focus-within:border-border-focus `}
    >
      <span className="text-textbox-placeholder">{icon && icon}</span>
      <input type="text" className="w-full outline-none text-sm " placeholder={placeholder} />
    </div>
  );
};