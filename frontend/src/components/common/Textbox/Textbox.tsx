import React from "react";

interface TextboxProps {
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  name?: string;
  defaultValue?: string;
}

export const Textbox = ({
  className = "",
  icon,
  placeholder,
  name,
  defaultValue,
}: TextboxProps) => {
  return (
    <div
      className={`${className} w-40 h-fit flex flex-row items-center border border-border-dark px-3 py-1.5 gap-2 rounded-md focus-within:border-border-focus focus-within:ring-2 focus-within:ring-zinc-200 text-xs`}
    >
      <span className="text-textbox-placeholder">{icon && icon}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="w-full outline-none text-xs bg-transparent"
        placeholder={placeholder}
      />
    </div>
  );
};
