import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useRef, useState } from "react";

interface TableSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TableSelector = ({ value, onChange }: TableSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "attendance", label: "Attendance" },
    { value: "students", label: "Students" },
  ];

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
    onChange(newValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex flex-row items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-header text-sm">
          {selectedOption?.label}
        </span>
        <ArrowDropDownIcon />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-border-dark rounded-md shadow-lg z-10 min-w-[120px] py-1 gap-1 flex flex-col">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-6 py-2 hover:bg-gray-100 text-xs font-medium ${
                value === option.value ? "bg-gray-100" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
