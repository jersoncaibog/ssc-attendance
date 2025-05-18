import React from "react";

interface TextboxProps {
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Textbox = ({
  className = "",
  icon,
  placeholder,
  name,
  value,
  onChange,
}: TextboxProps) => {
  return (
    <div
      className={`${className} w-40 h-fit flex flex-row items-center border border-border-dark p-1.5 gap-2 rounded-md focus-within:border-border-focus focus-within:ring-2 focus-within:ring-zinc-200 text-xs`}
    >
      <span className="text-textbox-placeholder">{icon && icon}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full outline-none text-xs bg-transparent"
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
};
