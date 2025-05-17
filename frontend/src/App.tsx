import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Analytics } from "@vercel/analytics/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
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

interface AttendanceUpdatePayload {
  operation: "INSERT" | "UPDATE";
  record: {
    id: number;
    student_id: string;
    event_id: number;
    status: string;
    check_in_time: string;
    created_at: string;
    updated_at: string;
  };
}

function AppContent() {
  const { showToast } = useToast();
  const [selectedTable, setSelectedTable] = useState("attendance");
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
          console.log(res);

          const mappedAttendance = res.data.map((record: DBAttendance) => ({
            studentId: record.student_id,
            name: record.name,
            course: record.course.toUpperCase(),
            year: record.year,
            section: record.section.toUpperCase(),
            status: record.status,
          }));

          console.log(mappedAttendance);
          setAttendanceData(mappedAttendance);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedEvent]);

  // Setup Socket.IO connection for real-time attendance updates
  useEffect(() => {
    const socket = io(config.SOCKET_URL, {
      transports: ["websocket", "polling"],
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    socket.on("attendanceUpdate", (payload: AttendanceUpdatePayload) => {
      console.log("Received attendance update:", payload);

      if (
        selectedEvent &&
        payload.record.event_id === parseInt(selectedEvent.id)
      ) {
        // Update attendance data if it matches the current event
        setAttendanceData((prevData) => {
          const newData = [...prevData];
          const index = newData.findIndex(
            (item) => item.studentId === payload.record.student_id
          );

          if (index !== -1) {
            newData[index] = {
              ...newData[index],
              status: payload.record.status,
            };
          }

          return newData;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
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

  const handleAddStudentSubmit = (data: {
    studentId: string;
    name: string;
    course: string;
    year: string;
    section: string;
  }) => {
    console.log("Adding new student:", data);
    setStudents((prev) => [...prev, data]);
    setIsAddStudentModalOpen(false);
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
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // You can add additional logic here when date changes
  };

  const attendanceColumns = [
    { key: "studentId", label: "ID", width: "7" },
    { key: "name", label: "NAME", width: "24" },
    { key: "course", label: "COURSE", width: "0" },
    { key: "year", label: "YEAR", width: "0" },
    { key: "section", label: "SECTION", width: "0" },
    { key: "status", label: "STATUS", width: "0" },
  ];

  const studentColumns = [
    { key: "studentId", label: "ID", width: "20" },
    { key: "name", label: "NAME", width: "100" },
    { key: "course", label: "COURSE", width: "20" },
    { key: "year", label: "YEAR", width: "10" },
    { key: "section", label: "SECTION", width: "10" },
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
    console.log("Searching for:", value);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleDownload = () => {
    console.log("Exporting data...");
  };

  return (
    <div className="app bg-background-light h-[100vh] pb-5">
      <Analytics />
      {/* Header */}
      <div className="w-full h-fit flex flex-col p-5 border-b border-border-dark bg-white gap-5 mb-6">
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
            <span className="font-medium text-sm text-gray-600">President</span>
            <UserMenu onLogout={handleLogout} />
          </div>
        </div>

        {/* Menu bar */}
        <div className="flex flex-row items-center gap-3 w-[60rem] ">
          {/* Date and Event Group */}
          <div className="flex flex-row gap-3">
            <Button
              onClick={handleDownload}
              icon={<SaveAltIcon sx={{ fontSize: "1rem" }} />}
              variant="primary"
              title="Export Table Data"
            />
            {selectedTable === "attendance" ? (
              <>
                <Button
                  icon={<HowToRegIcon sx={{ fontSize: "1rem" }} />}
                  label="RFID Check-In"
                  variant="primary"
                  onClick={() => setIsRfidModalOpen(true)}
                />
                <DatePicker
                  placeholder="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
                <EventSelector
                  placeholder="Select Event"
                  events={events.map((event) => ({
                    id: event.id.toString(),
                    name: event.title,
                    date: event.event_date,
                    location: event.location,
                  }))}
                  value={selectedEvent}
                  onChange={handleEventChange}
                />
              </>
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
          <div className="border-r h-8 border-border-light mx-1 text-xs"></div>
          {/* Filters Section */}
          <div className="flex flex-row items-center gap-3 mr-auto text-xs">
            <DropdownSelector placeholder="Course" options={courseOptions} />
            <DropdownSelector placeholder="Year" options={yearOptions} />
            <DropdownSelector placeholder="Section" options={sectionOptions} />
          </div>
        </div>
      </div>

      {/* Attendance / Students tables */}
      {selectedTable === "attendance" ? (
        <div className="w-[60rem] h-full mx-auto bg-white rounded-md shadow-sm">
          <Table
            columns={attendanceColumns}
            data={attendanceData}
            onActionClick={handleTableAction}
          />
        </div>
      ) : (
        <div className="w-[60rem] h-full mx-auto bg-white rounded-md shadow-sm">
          <Table
            columns={studentColumns}
            data={students}
            onActionClick={handleTableAction}
          />
        </div>
      )}

      {/* RFID Check-in Modal */}
      <Modal isOpen={isRfidModalOpen} onClose={() => setIsRfidModalOpen(false)}>
        <div className="p-6 text-center">
          <h2 className="font-light text-xl">Ready to Scan</h2>
          <img
            src="/rfid-scan.jpg"
            alt="RFID Scanner"
            className="w-32 mx-auto mt-2"
          />
          <p className="font-medium text-sm mt-8">
            Hold near the RFID reader to scan.
          </p>
          <Button
            label="Cancel"
            className="min-w-full mt-8 py-2 !text-sm"
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
