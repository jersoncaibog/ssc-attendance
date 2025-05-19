import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Analytics } from "@vercel/analytics/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import { Button } from "./components/common/Button/Button";
import { DatePicker } from "./components/common/DatePicker/DatePicker";
import { DropdownSelector } from "./components/common/DropdownSelector/DropdownSelector";
import {
  EventSelector,
  type Event,
} from "./components/common/EventSelector/EventSelector";
import { Modal } from "./components/common/Modal/Modal";
import { SearchBar } from "./components/common/SearchBar/SearchBar";
import type { TableRecord } from "./components/common/Table/Table";
import { Table } from "./components/common/Table/Table";
import { TableSelector } from "./components/common/TableSelector/TableSelector";
import { UserMenu } from "./components/common/UserMenu/UserMenu";
import { AddStudentForm } from "./components/forms/AddStudentForm/AddStudentForm";
import { EditStudentForm } from "./components/forms/EditStudentForm/EditStudentForm";
import { Metrics } from "./components/ui/Metrics/Metrics";
import config from "./config";
import { ToastProvider, useToast } from "./contexts/ToastContext";

interface AttendanceRecord {
  studentId: string;
  name: string;
  course: string;
  year: string;
  section: string;
  status: string;
}

interface StudentRecord {
  studentId: string;
  name: string;
  course: string;
  year: string;
  section: string;
  rfid?: string;
}

interface DBStudent {
  id: number;
  student_id: string;
  name: string;
  course: string;
  year: string;
  section: string;
  rfid: string;
  created_at: string;
  updated_at: string;
}

interface DBAttendance {
  id: number;
  student_id: string;
  event_id: number;
  status: string;
  check_in_time: string;
  created_at: string;
  updated_at: string;
  name: string;
  course: string;
  year: string;
  section: string;
}

interface DBEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  created_at: string;
  updated_at: string;
}

function AppContent() {
  const { showToast } = useToast();
  const [selectedTable, setSelectedTable] = useState("attendance");
  const [selectedFilters, setSelectedFilters] = useState({
    course: "all",
    year: "all",
    section: "all",
  });
  const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingStudent, setEditingStudent] = useState<
    AttendanceRecord | StudentRecord | null
  >(null);
  const [selectedStudentForMetrics, setSelectedStudentForMetrics] =
    useState<StudentRecord | null>(null);
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  // Fetch students from database
  useEffect(() => {
    axios
      .get(`${config.API_BASE_URL}/students`)
      .then((res) => {
        const mappedStudents = res.data.map((student: DBStudent) => ({
          studentId: student.student_id,
          name: student.name,
          course: student.course.toUpperCase(),
          year: student.year,
          section: student.section.toUpperCase(),
          rfid: student.rfid,
        }));
        setStudents(mappedStudents);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Fetch events from database
  useEffect(() => {
    const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
    axios
      .get(`${config.API_BASE_URL}/events/date/${formattedDate}`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selectedDate]);

  // Fetch attendance data from database
  useEffect(() => {
    if (selectedEvent) {
      axios
        .get(`${config.API_BASE_URL}/attendance/event/${selectedEvent?.id}`)
        .then((res) => {
          const mappedAttendance = res.data.map((record: DBAttendance) => ({
            studentId: record.student_id,
            name: record.name,
            course: record.course.toUpperCase(),
            year: record.year,
            section: record.section.toUpperCase(),
            status: record.status,
          }));

          setAttendanceData(mappedAttendance);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setAttendanceData([]);
    }
  }, [selectedEvent]);

  const handleTableAction = (action: string, row: TableRecord) => {
    switch (action) {
      case "status":
        if ("status" in row) {
          setAttendanceData((prevData) =>
            prevData.map((item) =>
              item.studentId === row.studentId ? row : item
            )
          );

          // update attendance in database
          axios
            .put(
              `${config.API_BASE_URL}/attendance/${row.studentId}/${selectedEvent?.id}`,
              { status: row.status }
            )
            .then((res) => {
              console.log("Attendance updated in database:", res);
              showToast(
                `${
                  row.name
                }'s attendance marked as ${row.status.toLowerCase()}`,
                "success"
              );
            })
            .catch((err) => {
              console.error(err);
              showToast(
                `Failed to update ${row.name}'s attendance status`,
                "error"
              );
            });
        }
        break;
      case "edit":
        if ("studentId" in row) {
          setEditingStudent(row as AttendanceRecord | StudentRecord);
          setIsEditStudentModalOpen(true);
        }
        break;
      case "delete":
        if ("studentId" in row) {
          if (selectedTable === "attendance") {
            setAttendanceData((prev) =>
              prev.filter((student) => student.studentId !== row.studentId)
            );
          } else {
            setStudents((prev) =>
              prev.filter((student) => student.studentId !== row.studentId)
            );
          }
        }
        break;
      case "metrics":
        if ("studentId" in row) {
          setSelectedStudentForMetrics(row as StudentRecord);
          setIsMetricsModalOpen(true);
        }
        break;
    }
  };

  const handleAddStudent = () => {
    setIsAddStudentModalOpen(true);
  };

  const handleAddStudentSubmit = async (data: {
    studentId: string;
    name: string;
    course: string;
    year: string;
    section: string;
    rfid: string;
  }) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/students`, {
        student_id: data.studentId,
        name: data.name,
        course: data.course.toLowerCase(),
        year: data.year,
        section: data.section.toLowerCase(),
        rfid: data.rfid.trim(), // Trim whitespace and use empty string if not provided
      });

      const newStudent = response.data;

      // Update local state with the new student
      setStudents((prev) => [
        ...prev,
        {
          studentId: newStudent.student_id,
          name: newStudent.name,
          course: newStudent.course.toUpperCase(),
          year: newStudent.year,
          section: newStudent.section.toUpperCase(),
          rfid: newStudent.rfid,
        },
      ]);

      showToast(`Student ${newStudent.name} added successfully`, "success");
      setIsAddStudentModalOpen(false);
    } catch (error: unknown) {
      console.error("Error adding student:", error);
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message || "Failed to add student",
          "error"
        );
      } else {
        showToast("Failed to add student", "error");
      }
    }
  };

  const handleEditStudentSubmit = (data: {
    studentId: string;
    name: string;
    course: string;
    year: string;
    section: string;
  }) => {
    if (selectedTable === "attendance") {
      setAttendanceData((prevData) =>
        prevData.map((item) =>
          item.studentId === data.studentId ? { ...item, ...data } : item
        )
      );
    } else {
      setStudents((prevData) =>
        prevData.map((item) =>
          item.studentId === data.studentId ? { ...item, ...data } : item
        )
      );
    }
    setIsEditStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleEventChange = (event: Event) => {
    setSelectedEvent(event);
    showToast(`Viewing attendance for ${event.name}`, "info");
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined); // Reset selected event when date changes
  };

  const handleAddEvent = async (eventData: {
    title: string;
    description: string;
    event_date: string;
    location: string;
  }) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/events/`,
        eventData
      );
      const newEvent = response.data;

      // Format both dates to YYYY-MM-DD for comparison
      const formattedSelectedDate = selectedDate.toLocaleDateString("en-CA");
      const formattedEventDate = new Date(
        newEvent.event_date
      ).toLocaleDateString("en-CA");

      if (formattedEventDate === formattedSelectedDate) {
        console.log("Adding event to list");
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }

      // Show success toast
      showToast(`Event "${newEvent.title}" created successfully`);
    } catch (error) {
      console.error("Error creating event:", error);
      showToast("Failed to create event");
    }
  };

  const handleEditEvent = async (event: Event) => {
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}/events/${event.id}`,
        {
          title: event.name,
          description: event.description,
          event_date: event.date,
          location: event.location,
        }
      );
      const updatedEvent = response.data;

      // Update the event in the events list if it matches the selected date
      const formattedSelectedDate = selectedDate.toLocaleDateString("en-CA");
      const formattedEventDate = new Date(
        updatedEvent.event_date
      ).toLocaleDateString("en-CA");

      if (formattedEventDate === formattedSelectedDate) {
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id.toString() === updatedEvent.id.toString() ? updatedEvent : e
          )
        );
      }

      showToast(`Event "${updatedEvent.title}" updated successfully`);
    } catch (error) {
      console.error("Error updating event:", error);
      showToast("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/events/${eventId}`);

      // Remove the event from the events list
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.id.toString() !== eventId)
      );

      // If the deleted event was selected, clear the selection
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(undefined);
      }

      showToast("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      showToast("Failed to delete event");
    }
  };

  const attendanceColumns = [
    { key: "studentId", label: "ID", width: "0" },
    { key: "name", label: "NAME", width: "0" },
    { key: "course", label: "COURSE", width: "0" },
    { key: "year", label: "YEAR", width: "0" },
    { key: "section", label: "SECTION", width: "0" },
    { key: "status", label: "STATUS", width: "0" },
  ];

  const studentColumns = [
    { key: "studentId", label: "ID", width: "0" },
    { key: "rfid", label: "RFID", width: "0" },
    { key: "name", label: "NAME", width: "0" },
    { key: "course", label: "COURSE", width: "0" },
    { key: "year", label: "YEAR", width: "0" },
    { key: "section", label: "SECTION", width: "0" },
  ];

  const courseOptions = [
    { value: "all", label: "All Courses" },
    { value: "bsit", label: "BSIT" },
    { value: "bshm", label: "BSHM" },
    { value: "bscrim", label: "BSCrim" },
  ];

  const yearOptions = [
    { value: "all", label: "All Years" },
    { value: "1", label: "Year 1" },
    { value: "2", label: "Year 2" },
    { value: "3", label: "Year 3" },
    { value: "4", label: "Year 4" },
  ];

  const sectionOptions = [
    { value: "all", label: "All Sections" },
    { value: "a", label: "Section A" },
    { value: "b", label: "Section B" },
    { value: "c", label: "Section C" },
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleDownload = () => {
    const data = getFilteredData();
    // Sort the data using the same logic as the table
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof TableRecord];
      const bValue = b[sortConfig.key as keyof TableRecord];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    const worksheet = XLSX.utils.json_to_sheet(sortedData);
    const workbook = XLSX.utils.book_new();

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      selectedTable === "attendance" ? "Attendance" : "Students"
    );

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTable}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showToast(`Exported ${sortedData.length} records to Excel`, "success");
  };

  // Filter the data based on selected filters and search query
  const getFilteredData = useCallback(() => {
    const data = selectedTable === "attendance" ? attendanceData : students;

    return data.filter((item) => {
      // Search filter
      const searchMatch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.course.toLowerCase().includes(searchQuery.toLowerCase());

      // Other filters
      const courseMatch =
        selectedFilters.course === "all" ||
        item.course.toLowerCase() === selectedFilters.course;
      const yearMatch =
        selectedFilters.year === "all" || item.year === selectedFilters.year;
      const sectionMatch =
        selectedFilters.section === "all" ||
        item.section.toLowerCase() === selectedFilters.section;

      return searchMatch && courseMatch && yearMatch && sectionMatch;
    });
  }, [selectedTable, attendanceData, students, selectedFilters, searchQuery]);

  const handleFilterChange = (
    filterType: "course" | "year" | "section",
    value: string
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    // Show toast for filter change
    const filterName = filterType.charAt(0).toUpperCase() + filterType.slice(1);
    const filterValue = value === "all" ? "All" : value.toUpperCase();
    showToast(`${filterName} filter set to ${filterValue}`, "info");
  };

  return (
    <div className="app bg-background-light h-[100vh] pb-5">
      <Analytics />
      {/* Header */}
      <div className="w-full h-fit flex flex-col p-5 border-b border-border-dark bg-white gap-5 mb-6 z-20">
        {/* Top part */}
        <div className="flex flex-row items-center w-full">
          {/* Logo and Table selector */}
          <div className="flex flex-row items-center mr-4 gap-2">
            <h1 className="text-sscTheme font-bold text-sm">SSC</h1>
            <TableSelector value={selectedTable} onChange={setSelectedTable} />
          </div>
          <SearchBar onSearch={handleSearch} />
          {/* User Menu */}
          <div className="flex flex-row items-center gap-3 text-sm">
            <span className="font-medium text-sm text-gray-600 hidden sm:block">
              President
            </span>
            <UserMenu onLogout={handleLogout} />
          </div>
        </div>

        {/* Menu bar */}
        <div className="flex lg:flex-row flex-col gap-3 w-full lg:w-[60rem]">
          {/* Date and Event Group */}
          <div className="flex flex-row gap-3">
            <Button
              onClick={handleDownload}
              icon={<SaveAltIcon sx={{ fontSize: "1rem" }} />}
              variant="primary"
              title="Export Table Data"
              className="hidden sm:block"
            />
            {selectedTable === "attendance" ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    icon={<SaveAltIcon sx={{ fontSize: "1rem" }} />}
                    variant="primary"
                    title="Export Table Data"
                    className="sm:hidden"
                  />
                  <Button
                    icon={<HowToRegIcon sx={{ fontSize: "1rem" }} />}
                    label="RFID Check-In"
                    variant="primary"
                    onClick={() => setIsRfidModalOpen(true)}
                  />
                </div>
                <div className="flex flex-row gap-3">
                  <DatePicker
                    placeholder="Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                  <EventSelector
                    className="w-40"
                    value={selectedEvent}
                    onChange={handleEventChange}
                    placeholder="Select event"
                    events={events.map((event) => ({
                      id: event.id.toString(),
                      name: event.title,
                      date: event.event_date,
                      location: event.location,
                      description: event.description,
                    }))}
                    onAddEvent={handleAddEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                </div>
              </div>
            ) : (
              <Button
                onClick={handleAddStudent}
                icon={<PersonAddIcon sx={{ fontSize: "1rem" }} />}
                label="Add Student"
                variant="primary"
                title="Add New Student"
              />
            )}
          </div>
          <div className="hidden lg:block border-r h-8 border-border-light mx-1 text-xs"></div>
          {/* Filters Section */}
          <div className="flex flex-row items-center gap-3 w-full text-xs">
            <DropdownSelector
              placeholder="Course"
              options={courseOptions}
              value={selectedFilters.course}
              onChange={(value) => handleFilterChange("course", value)}
              className={`max-w-32`}
            />
            <DropdownSelector
              placeholder="Year"
              options={yearOptions}
              value={selectedFilters.year}
              onChange={(value) => handleFilterChange("year", value)}
              className={`max-w-32`}
            />
            <DropdownSelector
              placeholder="Section"
              options={sectionOptions}
              value={selectedFilters.section}
              onChange={(value) => handleFilterChange("section", value)}
              className={`max-w-32`}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-full px-5">
        {/* Attendance / Students tables */}
        {selectedTable === "attendance" ? (
          <Table
            columns={attendanceColumns}
            data={getFilteredData()}
            onActionClick={handleTableAction}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
          />
        ) : (
          <Table
            columns={studentColumns}
            data={getFilteredData()}
            onActionClick={handleTableAction}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
          />
        )}
      </div>

      {/* RFID Check-in Modal */}
      <Modal isOpen={isRfidModalOpen} onClose={() => setIsRfidModalOpen(false)}>
        <div
          className="p-6 text-center"
          onClick={(e) => {
            // Find and focus the input when clicking anywhere in the modal
            const input = e.currentTarget.querySelector("input");
            input?.focus();
          }}
        >
          <div className="flex flex-row items-center justify-center rounded-full w-fit mx-auto border-[2px] border-gray-500 overflow-hidden mt-8">
            <img
              src="/rfid-scan.svg"
              alt="RFID Scanner"
              className="h-28 w-28 translate-x-[-0.5rem] translate-y-[0.5rem] mx-auto"
            />
          </div>
          <h2 className="font-medium select-none mt-12">Ready to Scan</h2>
          <p className="text-sm font-light text-gray-600 mt-4 select-none">
            Please tap your RFID card on the RFID reader to record attendance
            for this event.
          </p>
          <input type="text" className="sr-only" autoFocus />
          <Button
            label="Cancel"
            className="min-w-full mt-12 py-2 !text-sm"
            variant="secondary"
            onClick={() => setIsRfidModalOpen(false)}
          />
        </div>
      </Modal>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      >
        <AddStudentForm
          onSubmit={handleAddStudentSubmit}
          onCancel={() => setIsAddStudentModalOpen(false)}
        />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditStudentModalOpen}
        onClose={() => {
          setIsEditStudentModalOpen(false);
          setEditingStudent(null);
        }}
      >
        {editingStudent && (
          <EditStudentForm
            onSubmit={handleEditStudentSubmit}
            onCancel={() => {
              setIsEditStudentModalOpen(false);
              setEditingStudent(null);
            }}
            initialData={editingStudent}
          />
        )}
      </Modal>

      {/* Metrics Modal */}
      <Modal
        isOpen={isMetricsModalOpen}
        onClose={() => {
          setIsMetricsModalOpen(false);
          setSelectedStudentForMetrics(null);
        }}
      >
        {selectedStudentForMetrics && (
          <Metrics
            studentData={selectedStudentForMetrics}
            onClose={() => {
              setIsMetricsModalOpen(false);
              setSelectedStudentForMetrics(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
