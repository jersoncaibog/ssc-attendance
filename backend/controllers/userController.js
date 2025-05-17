const User = require('../models/User');

const userController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      await User.updateLastLogin(user.id);
      res.json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  },

  async createUser(req, res) {
    try {
      const { username, password, role } = req.body;
      const user = await User.create(username, password, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
};

module.exports = userController; 