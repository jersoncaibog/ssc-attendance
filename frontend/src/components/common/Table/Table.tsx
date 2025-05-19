import MoreVertIcon from "@mui/icons-material/MoreVert";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

export type TableRecord = AttendanceRecord | StudentRecord;

interface TableProps {
  columns: Column[];
  data: TableRecord[];
  className?: string;
  onActionClick?: (action: string, row: TableRecord) => void;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  };
  onSortChange: (config: { key: string; direction: "asc" | "desc" }) => void;
}

export const Table = ({
  columns,
  data,
  className = "",
  onActionClick,
  sortConfig,
  onSortChange,
}: TableProps) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleScroll = () => {
      setActiveMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    tableRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      tableRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "text-green-600";
      case "absent":
        return "text-gray-400";
      case "excused":
        return "text-orange-400";
      default:
        return "text-gray-700";
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

  const handleSort = (key: string) => {
    onSortChange({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleMenuClick = (rowIndex: number, button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 120, // Adjust for menu width
    });
    setActiveMenu(activeMenu === rowIndex ? null : rowIndex);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof TableRecord];
    const bValue = b[sortConfig.key as keyof TableRecord];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div
      ref={tableRef}
      className={`w-full max-w-[60rem] max-h-[calc(100vh-16rem)] sm:max-h-[calc(100vh-13rem)] lg:h-[calc(100vh-10.5rem)] lg:max-h-[calc(100vh-10.5rem)] overflow-x-auto overflow-y-auto rounded-md border-border-dark bg-white mx-auto shadow-sm border ${className}`}
    >
      <table className="w-full min-w-[800px] border-collapse">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-border-dark bg-background-dark">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer whitespace-nowrap ${
                  column.key === "status"
                    ? "sticky right-10 bg-background-dark"
                    : ""
                }`}
                // style={{ width: column.width ? `${column.width}rem` : "auto" }}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {sortConfig.key === column.key &&
                    (sortConfig.direction === "asc" ? (
                      <SouthIcon sx={{ fontSize: "1rem" }} />
                    ) : (
                      <NorthIcon sx={{ fontSize: "1rem" }} />
                    ))}
                </div>
              </th>
            ))}
            <th className="w-10 sticky right-0 bg-background-dark"></th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="h-32 text-center text-gray-400 text-sm"
              >
                <div className="max-w-[100vw]">No data available</div>
              </td>
            </tr>
          ) : (
            <>
              {sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-border-dark hover:bg-gray-100 group"
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className={`px-4 text-gray-700 text-xs whitespace-nowrap ${
                        column.key === "status"
                          ? "sticky right-10 bg-white group-hover:bg-gray-100"
                          : ""
                      }`}
                    >
                      {column.key === "status" && isAttendanceRecord(row) ? (
                        <span
                          className={`px-2 py-1 rounded-md font-medium ${getStatusColor(
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
                  <td className="px-3 py-1 sticky right-0 bg-white group-hover:bg-gray-100">
                    <div className="relative">
                      <button
                        ref={(el) => {
                          buttonRefs.current[rowIndex] = el;
                        }}
                        onClick={(e) =>
                          handleMenuClick(rowIndex, e.currentTarget)
                        }
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <MoreVertIcon
                          fontSize="small"
                          className="text-gray-600"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {activeMenu !== null &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed bg-white border border-border-dark rounded-md shadow-lg py-1 z-50 max-w-[6rem]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            {isAttendanceRecord(sortedData[activeMenu]) ? (
              <>
                <button
                  onClick={() => {
                    handleActionClick("status", {
                      ...sortedData[activeMenu],
                      status: "Present",
                    });
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Present
                </button>
                <button
                  onClick={() => {
                    handleActionClick("status", {
                      ...sortedData[activeMenu],
                      status: "Absent",
                    });
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Absent
                </button>
                <button
                  onClick={() => {
                    handleActionClick("status", {
                      ...sortedData[activeMenu],
                      status: "Excused",
                    });
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Excused
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleActionClick("metrics", sortedData[activeMenu]);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Metrics
                </button>
                <button
                  onClick={() =>
                    handleActionClick("edit", sortedData[activeMenu])
                  }
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleActionClick("delete", sortedData[activeMenu])
                  }
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
