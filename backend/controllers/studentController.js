const Student = require('../models/Student');

const studentController = {
  async getAllStudents(req, res) {
    try {
      const students = await Student.findAll();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
  },

  async getStudentById(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
  },

  async createStudent(req, res) {
    try {
      const student = await Student.create(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ message: 'Error creating student', error: error.message });
    }
  },

  async updateStudent(req, res) {
    try {
      const student = await Student.update(req.params.id, req.body);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: 'Error updating student', error: error.message });
    }
  },

  async deleteStudent(req, res) {
    try {
      const student = await Student.delete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
  },

  async getStudentsByCourse(req, res) {
    try {
      const students = await Student.findByCourse(req.params.course);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students by course', error: error.message });
    }
  }
};

module.exports = studentController; 