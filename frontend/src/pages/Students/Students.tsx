import { useState } from "react";
import { Table } from "../../components/common/Table/Table";

interface StudentRecord {
  studentId: string;
  name: string;
  course: string;
  year: string;
  section: string;
}

function Students() {
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      studentId: "23-0001",
      name: "John Doe",
      course: "BSIT",
      year: "2",
      section: "A",
    },
    {
      studentId: "23-0002",
      name: "Jinky Caibog",
      course: "BSHM",
      year: "1",
      section: "B",
    },
    {
      studentId: "23-0003",
      name: "Mike Johnson",
      course: "BSCrim",
      year: "3",
      section: "C",
    },
  ]);

  const studentColumns = [
    { key: "studentId", label: "ID", width: "36" },
    { key: "name", label: "NAME", width: "64" },
    { key: "course", label: "COURSE", width: "32" },
    { key: "year", label: "YEAR", width: "24" },
    { key: "section", label: "SECTION", width: "24" },
  ];

  const handleTableAction = (action: string, row: StudentRecord) => {
    switch (action) {
      case "metrics":
        console.log("Viewing metrics for:", row);
        break;
      case "edit":
        console.log("Editing student:", row);
        break;
      case "delete":
        console.log("Deleting student:", row);
        break;
    }
  };

  const handleDownload = () => {
    console.log("Exporting data...");
  };

  return (
    <div className="w-[50rem] h-full mx-auto bg-white rounded-md shadow-sm mt-5">
      <Table
        columns={studentColumns}
        data={students}
        onActionClick={handleTableAction}
      />
    </div>
  );
}

export default Students;
