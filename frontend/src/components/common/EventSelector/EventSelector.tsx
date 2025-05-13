import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import { useEffect, useRef, useState } from "react";

interface Event {
  id: string;
  name: string;
  time: string;
}

interface EventSelectorProps {
  className?: string;
  value?: Event;
  onChange?: (event: Event) => void;
  placeholder?: string;
}

// Mock events data
const mockEvents: Event[] = [
  { id: "1", name: "Morning Assembly", time: "7:00 AM" },
  { id: "2", name: "Afternoon Class", time: "1:00 PM" },
];

export const EventSelector = ({
  className = "",
  value,
  onChange,
  placeholder = "Select event",
}: EventSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(value);
  const eventSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        eventSelectorRef.current &&
        !eventSelectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    onChange?.(event);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={eventSelectorRef}>
      <div
        className={`${className} w-40 flex flex-row items-center border border-border-dark px-3 py-1.5 gap-2 rounded-md focus-within:border-border-focus focus-within:ring-2 focus-within:ring-zinc-200 cursor-pointer text-xs`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-textbox-placeholder">
          <EventIcon sx={{ fontSize: "1rem" }} />
        </span>
        <input
          type="text"
          className="w-full outline-none text-xs cursor-pointer bg-transparent"
          placeholder={placeholder}
          value={
            selectedEvent ? `${selectedEvent.name} (${selectedEvent.time})` : ""
          }
          readOnly
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-border-dark rounded-md shadow-lg p-2 z-10 w-64">
          <div className="max-h-48 overflow-y-auto">
            {mockEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventSelect(event)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-xs"
              >
                <div className="font-medium">{event.name}</div>
                <div className="text-gray-500 text-xs">{event.time}</div>
              </button>
            ))}
          </div>
          <div className="border-t border-border-dark mt-2 pt-2">
            <button
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-md"
              onClick={() => {
                // Handle add event click
                console.log("Add event clicked");
                setIsOpen(false);
              }}
            >
              <AddIcon fontSize="small" />
              Add Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
