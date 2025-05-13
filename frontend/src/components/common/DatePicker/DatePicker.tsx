import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
} from "date-fns";
import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
  className?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
}

export const DatePicker = ({
  className = "",
  value = new Date(),
  onChange,
  placeholder = "Select date",
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value);
  const [currentMonth, setCurrentMonth] = useState<Date>(value);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <div
        className={`${className} w-40 flex flex-row items-center border border-border-dark px-3 py-1.5 gap-2 rounded-md focus-within:border-border-focus focus-within:ring-2 focus-within:ring-zinc-200 cursor-pointer text-xs`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-textbox-placeholder">
          <CalendarMonthIcon sx={{ fontSize: "1rem" }} />
        </span>
        <input
          type="text"
          className="w-full outline-none text-xs cursor-pointer bg-transparent"
          placeholder={placeholder}
          value={selectedDate ? format(selectedDate, "MMM dd, yyyy") : ""}
          readOnly
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-border-dark rounded-md shadow-lg p-2 z-10 w-64">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
              className="p-1 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <span className="text-xs font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                )
              }
              className="p-1 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs text-center text-gray-500 py-1">
                {day}
              </div>
            ))}

            {days.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  text-xs p-1 rounded hover:bg-gray-100
                  ${!isSameMonth(day, currentMonth) ? "text-gray-300" : ""}
                  ${isToday(day) ? "bg-blue-50 text-blue-600" : ""}
                  ${
                    isSameDay(day, selectedDate)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : ""
                  }
                `}
              >
                {format(day, "d")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
