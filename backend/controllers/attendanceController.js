const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const attendanceController = {
  async getEventAttendance(req, res) {
    try {
      const attendance = await Attendance.findByEvent(req.params.eventId);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
  },

  async getStudentAttendance(req, res) {
    try {
      const attendance = await Attendance.findByStudent(req.params.studentId);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student attendance', error: error.message });
    }
  },

  async updateAttendanceStatus(req, res) {
    try {
      const { studentId, eventId } = req.params;
      const { status } = req.body;
      
      if (!['Present', 'Absent', 'Excused'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const attendance = await Attendance.updateStatus(studentId, eventId, status);
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error updating attendance', error: error.message });
    }
  },

  async initializeEventAttendance(req, res) {
    try {
      const { eventId } = req.params;
      const students = await Student.findAll();
      const studentIds = students.map(student => student.student_id);
      
      const attendance = await Attendance.createBulk(eventId, studentIds);
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error initializing attendance', error: error.message });
    }
  },

  async getAttendanceStats(req, res) {
    try {
      const stats = await Attendance.getAttendanceStats(req.params.eventId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance stats', error: error.message });
    }
  },

  async updateAttendanceByRfid(req, res) {
    try {
      const { rfid, eventId } = req.params;
      
      // Find student by RFID
      const student = await Student.findByRfid(rfid);
      if (!student) {
        return res.status(404).json({ message: 'Student not found with this RFID' });
      }

      // Update attendance status to Present
      const attendance = await Attendance.updateStatus(student.student_id, eventId, 'Present');
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }

      res.json({
        ...attendance,
        student: {
          studentId: student.student_id,
          name: student.name,
          course: student.course,
          year: student.year,
          section: student.section
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating attendance by RFID', error: error.message });
    }
  }
};

module.exports = attendanceController; 