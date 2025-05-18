import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useRef, useState } from "react";
import { AddEventForm } from "../../forms/AddEventForm/AddEventForm";
import { EditEventForm } from "../../forms/EditEventForm/EditEventForm";
import { Modal } from "../Modal/Modal";

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string;
}

interface EventSelectorProps {
  className?: string;
  value?: Event;
  onChange?: (event: Event) => void;
  placeholder?: string;
  events: Event[];
  onAddEvent?: (eventData: {
    title: string;
    description: string;
    event_date: string;
    location: string;
  }) => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export const EventSelector = ({
  className = "",
  value,
  onChange,
  placeholder = "Select event",
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}: EventSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(value);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const eventSelectorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync internal state with value prop
  useEffect(() => {
    setSelectedEvent(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        eventSelectorRef.current &&
        !eventSelectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenFor(null);
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

  const handleAddEvent = (data: {
    title: string;
    description: string;
    event_date: string;
    location: string;
  }) => {
    onAddEvent?.(data);
    setIsAddEventModalOpen(false);
  };

  const handleMenuClick = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX + 8, // 8px offset from the button
    });
    setMenuOpenFor(menuOpenFor === eventId ? null : eventId);
  };

  const handleEditClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullEvent = events.find((e) => e.id === event.id);
    if (fullEvent) {
      setEventToEdit(fullEvent);
      setIsEditModalOpen(true);
    }
    setMenuOpenFor(null);
  };

  const handleEditSubmit = (data: {
    title: string;
    description: string;
    event_date: string;
    location: string;
  }) => {
    if (eventToEdit) {
      onEditEvent?.({
        ...eventToEdit,
        name: data.title,
        description: data.description,
        date: data.event_date,
        location: data.location,
      });
      setIsEditModalOpen(false);
      setEventToEdit(null);
    }
  };

  const handleDeleteClick = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEventToDelete(event);
      setIsDeleteModalOpen(true);
    }
    setMenuOpenFor(null);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent?.(eventToDelete.id);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
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
          value={selectedEvent ? selectedEvent.name : ""}
          readOnly
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-border-dark rounded-md shadow-lg p-2 z-10 w-64">
          <div className="max-h-48 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-xs">
                No events scheduled for this date
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="relative group">
                  <button
                    onClick={() => handleEventSelect(event)}
                    className={`w-full text-left px-3 py-2 hover:bg-zinc-100 rounded-md text-xs ${
                      selectedEvent?.id === event.id ? "bg-zinc-100" : ""
                    }`}
                  >
                    <div className="font-medium">{event.name}</div>
                    <div className="text-gray-500 text-xs">
                      {event.location}
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleMenuClick(event.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded-md opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertIcon sx={{ fontSize: "1rem" }} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-border-dark mt-2 pt-2">
            <button
              className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-md"
              onClick={() => {
                setIsAddEventModalOpen(true);
                setIsOpen(false);
              }}
            >
              <AddIcon sx={{ fontSize: "1rem" }} />
              Add Event
            </button>
          </div>
        </div>
      )}

      {/* Action Menu */}
      {menuOpenFor && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-border-dark rounded-md shadow-lg z-20 w-32"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <button
            onClick={(e) =>
              handleEditClick(events.find((e) => e.id === menuOpenFor)!, e)
            }
            className="w-full text-left px-3 py-2 hover:bg-zinc-100 text-xs"
          >
            Edit
          </button>
          <button
            onClick={(e) => handleDeleteClick(menuOpenFor, e)}
            className="w-full text-left px-3 py-2 hover:bg-zinc-100 text-xs text-red-600"
          >
            Delete
          </button>
        </div>
      )}

      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
      >
        <AddEventForm
          onSubmit={handleAddEvent}
          onCancel={() => setIsAddEventModalOpen(false)}
        />
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEventToEdit(null);
        }}
      >
        {eventToEdit && (
          <EditEventForm
            event={eventToEdit}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEventToEdit(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
      >
        <div className="p-6">
          <h2 className="font-medium mb-4">Delete Event?</h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete "{eventToDelete?.name}"? This action
            cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setEventToDelete(null);
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
