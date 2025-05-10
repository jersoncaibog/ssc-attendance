import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useRef, useState } from "react";

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: string | number) => React.ReactNode;
}

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
}

type TableRecord = AttendanceRecord | StudentRecord;

interface TableProps {
  columns: Column[];
  data: TableRecord[];
  className?: string;
  onActionClick?: (action: string, row: TableRecord) => void;
}

export const Table = ({
  columns,
  data,
  className = "",
  onActionClick,
}: TableProps) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700";
      case "absent":
        return "bg-gray-100 text-gray-700";
      case "excused":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleActionClick = (action: string, row: TableRecord) => {
    onActionClick?.(action, row);
    setActiveMenu(null);
  };

  const isAttendanceRecord = (
    record: TableRecord
  ): record is AttendanceRecord => {
    return "status" in record;
  };

  return (
    <div
      className={`w-full h-full overflow-x-auto rounded-md overflow-hidden border-border-dark border ${className}`}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-dark bg-background-dark">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 ${
                  column.width ? `w-${column.width}` : ""
                }`}
              >
                {column.label}
              </th>
            ))}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border-dark hover:bg-gray-50"
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="px-4 py-3 text-sm text-gray-700"
                >
                  {column.key === "status" && isAttendanceRecord(row) ? (
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  ) : (
                    row[column.key as keyof TableRecord]
                  )}
                </td>
              ))}
              <td className="px-2 py-3">
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === rowIndex ? null : rowIndex)
                    }
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <MoreVertIcon fontSize="small" className="text-gray-600" />
                  </button>
                  {activeMenu === rowIndex && (
                    <div className="absolute right-0 mt-1 bg-white border border-border-dark rounded-md shadow-lg py-1 z-10 min-w-[120px]">
                      {isAttendanceRecord(row) ? (
                        <>
                          <button
                            onClick={() =>
                              handleActionClick("status", {
                                ...row,
                                status: "Present",
                              })
                            }
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleActionClick("status", {
                                ...row,
                                status: "Absent",
                              })
                            }
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Absent
                          </button>
                          <button
                            onClick={() =>
                              handleActionClick("status", {
                                ...row,
                                status: "Excused",
                              })
                            }
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Excused
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleActionClick("metrics", row)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Metrics
                          </button>
                          <button
                            onClick={() => handleActionClick("edit", row)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleActionClick("delete", row)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
