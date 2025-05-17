const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth routes
router.post('/login', userController.login);

// User management routes
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router; 