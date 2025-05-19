import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface DropdownSelectorProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: Option[];
  icon?: React.ReactNode;
  name?: string;
}

export const DropdownSelector = ({
  className = "",
  value,
  onChange,
  placeholder = "Select option",
  options,
  icon,
  name,
}: DropdownSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === internalValue);

  return (
    <div className="relative text-xs h-fit" ref={dropdownRef}>
      {name && <input type="hidden" name={name} value={internalValue || ""} />}
      <div
        className={`w-full flex flex-row h-fit items-center border border-border-dark px-3 py-1 gap-2 rounded-md focus-within:border-border-focus focus-within:ring-2 focus-within:ring-zinc-200 cursor-pointer text-xs ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <span className="text-textbox-placeholder">{icon}</span>}
        <input
          type="text"
          className="w-full outline-none text-xs cursor-pointer bg-transparent"
          placeholder={placeholder}
          value={selectedOption?.label || ""}
          readOnly
        />
        <ArrowDropDownIcon fontSize="small" />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-border-dark rounded-md shadow-lg py-2 z-10 w-full text-xs">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 hover:bg-zinc-100 text-xs ${
                  internalValue === option.value ? "bg-zinc-100" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
