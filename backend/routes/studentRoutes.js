const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get all students
router.get('/', studentController.getAllStudents);

// Get students by course
router.get('/course/:course', studentController.getStudentsByCourse);

// Get single student
router.get('/:id', studentController.getStudentById);

// Create student
router.post('/', studentController.createStudent);

// Update student
router.put('/:id', studentController.updateStudent);

// Delete student
router.delete('/:id', studentController.deleteStudent);

module.exports = router; 