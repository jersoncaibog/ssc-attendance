import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import "./App.css";
import { DatePicker } from "./components/common/DatePicker/DatePicker";
import { DropdownSelector } from "./components/common/DropdownSelector/DropdownSelector";
import { EventSelector } from "./components/common/EventSelector/EventSelector";
import { SearchBar } from "./components/common/SearchBar/SearchBar";
import { Table } from "./components/common/Table/Table";
import { TableSelector } from "./components/common/TableSelector/TableSelector";
import { Textbox } from "./components/common/Textbox/Textbox";
import { UserMenu } from "./components/common/UserMenu/UserMenu";
import Students from "./pages/Students/Students";

interface AttendanceRecord {
  studentId: string;
  name: string;
  course: string;
  year: string;
  section: string;
  status: string;
}

function App() {
  const [selectedTable, setSelectedTable] = useState("attendance");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    {
      studentId: "23-0001",
      name: "John Doe",
      course: "BSIT",
      year: "2",
      section: "A",
      status: "Present",
    },
    {
      studentId: "23-0002",
      name: "Jinky Caibog",
      course: "BSHM",
      year: "1",
      section: "B",
      status: "Absent",
    },
    {
      studentId: "23-0003",
      name: "Mike Johnson",
      course: "BSCrim",
      year: "3",
      section: "C",
      status: "Excused",
    },
  ]);

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

  const handleTableAction = (action: string, row: AttendanceRecord) => {
    if (action === "status") {
      setAttendanceData((prevData) =>
        prevData.map((item) => (item.studentId === row.studentId ? row : item))
      );
    }
  };

  const handleAddStudent = () => {
    console.log("Adding new student...");
  };

  const attendanceColumns = [
    { key: "studentId", label: "ID", width: "36" },
    { key: "name", label: "NAME", width: "64" },
    { key: "course", label: "COURSE", width: "32" },
    { key: "year", label: "YEAR", width: "24" },
    { key: "section", label: "SECTION", width: "24" },
    { key: "status", label: "STATUS", width: "32" },
  ];

  return (
    <div className="app bg-background-light h-[100vh] pb-5">
      {/* Header */}
      <div className="w-full h-fit grid grid-cols-[1fr_5fr_1fr] p-5 border-b border-border-dark bg-white gap-5">
        {/* Logo and Table selector */}
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-sscTheme font-bold">SSC</h1>
          <TableSelector value={selectedTable} onChange={setSelectedTable} />
        </div>

        {/* Menu bar */}
        <div className="flex flex-row items-center gap-3 w-[50rem] mx-auto">
          {selectedTable === "attendance" ? (
            <>
              {/* Date and Event Group */}
              <div className="flex flex-row items-center gap-3 mr-auto">
                <DatePicker placeholder="Date" />
                <EventSelector placeholder="Select Event" />
              </div>

              {/* RFID and Search Group */}
              <div className="flex flex-row items-center gap-3">
                <Textbox
                  icon={<HowToRegIcon fontSize="small" />}
                  placeholder="RFID Check-In"
                />
                <SearchBar onSearch={handleSearch} />
              </div>
            </>
          ) : (
            <>
              {/* Filters Group */}
              <div className="flex flex-row items-center gap-3 mr-auto">
                <DropdownSelector
                  placeholder="Course"
                  options={courseOptions}
                />
                <DropdownSelector placeholder="Year" options={yearOptions} />
                <DropdownSelector
                  placeholder="Section"
                  options={sectionOptions}
                />
              </div>

              {/* Search and Add Group */}
              <div className="flex flex-row items-center gap-3">
                <SearchBar onSearch={handleSearch} />
                <button
                  onClick={handleAddStudent}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-md border border-border-dark focus:outline-none transition-colors"
                  title="Add New Student"
                >
                  <PersonAddIcon fontSize="small" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <UserMenu username="SSC President" onLogout={handleLogout} />
        </div>
      </div>

      {selectedTable === "attendance" ? (
        <>
          {/* Filters Section */}
          <div className="py-5 flex flex-row items-center gap-3 w-[50rem] mx-auto">
            <DropdownSelector placeholder="Course" options={courseOptions} />
            <DropdownSelector placeholder="Year" options={yearOptions} />
            <DropdownSelector placeholder="Section" options={sectionOptions} />
            <button
              onClick={handleDownload}
              className="ml-auto p-2 pb-0 text-gray-600 hover:bg-gray-100 rounded-md border-0 focus:outline-none transition-colors"
              title="Export Data"
            >
              <FileDownloadIcon />
            </button>
          </div>

          {/* Table Section */}
          <div className="w-[50rem] h-full mx-auto bg-white rounded-md shadow-sm">
            <Table
              columns={attendanceColumns}
              data={attendanceData}
              onActionClick={handleTableAction}
            />
          </div>
        </>
      ) : (
        <Students />
      )}
    </div>
  );
}

export default App;
