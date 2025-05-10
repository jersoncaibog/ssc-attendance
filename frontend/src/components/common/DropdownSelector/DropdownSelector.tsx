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
}

export const DropdownSelector = ({
  className = "",
  value,
  onChange,
  placeholder = "Select option",
  options,
  icon,
}: DropdownSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`${className} w-40 flex flex-row items-center border border-border-dark px-3 py-1.5 gap-2 rounded-md focus-within:border-border-focus cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <span className="text-textbox-placeholder">{icon}</span>}
        <input
          type="text"
          className="w-full outline-none text-sm cursor-pointer bg-transparent"
          placeholder={placeholder}
          value={selectedOption?.label || ""}
          readOnly
        />
        <ArrowDropDownIcon fontSize="small" />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-border-dark rounded-md shadow-lg p-2 z-10 w-full">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm ${
                  selectedValue === option.value ? "bg-gray-100" : ""
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
