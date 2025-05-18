import { Button } from "../../common/Button/Button";

interface MetricsProps {
  studentData: {
    studentId: string;
    name: string;
    course: string;
    year: string;
    section: string;
  };
  onClose: () => void;
}

export const Metrics = ({ studentData, onClose }: MetricsProps) => {
  // Mock metrics data - in a real app, this would come from an API
  const metrics = {
    totalEvents: 45,
    present: 38,
    absent: 5,
    excused: 2,
    attendanceRate: "84.4%",
  };

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold mb-6">Student Metrics</h2>

      {/* Student Info */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Student Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm border border-border-dark p-4 rounded-md">
          <div>
            <p className="text-gray-500 text-xs">Name</p>
            <p className="font-medium">{studentData.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">ID</p>
            <p className="font-medium">{studentData.studentId}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Course</p>
            <p className="font-medium">{studentData.course}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Year & Section</p>
            <p className="font-medium">
              {studentData.year}-{studentData.section}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Metrics */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Attendance Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border-dark p-4 rounded-md flex flex-col gap-1 text-center">
            <p className="text-gray-500 text-xs">Total Events</p>
            <p className="text-base font-semibold">
              {metrics.totalEvents}
            </p>
          </div>
          <div className="border border-border-dark p-4 rounded-md flex flex-col gap-1 text-center">
            <p className="text-gray-500 text-xs">Attendance Rate</p>
            <p className="text-base font-semibold">
              {metrics.attendanceRate}
            </p>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Status Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-border-dark p-4 rounded-md flex flex-col gap-1 text-center">
            <p className="text-gray-500 text-xs">Present</p>
            <p className="text-base font-semibold">
              {metrics.present}
            </p>
          </div>
          <div className="border border-border-dark p-4 rounded-md flex flex-col gap-1 text-center">
            <p className="text-gray-500 text-xs">Absent</p>
            <p className="text-base font-semibold">
              {metrics.absent}
            </p>
          </div>
          <div className="border border-border-dark p-4 rounded-md flex flex-col gap-1 text-center">
            <p className="text-gray-500 text-xs">Excused</p>
            <p className="text-base font-semibold">
              {metrics.excused}
            </p>
          </div>
        </div>
      </div>

      <Button
        label="Close"
        className="w-full mt-4 !py-2.5 font-medium"
        variant="secondary"
        onClick={onClose}
      />
    </div>
  );
};
