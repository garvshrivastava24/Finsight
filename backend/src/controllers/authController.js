const authService = require('../services/authService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please include all fields');
    }

    const userData = await authService.registerUser(name, email, password);
    res.status(201).json(userData);
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please include all fields');
    }

    const userData = await authService.loginUser(email, password);
    res.json(userData);
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      res.status(401);
    }
    next(error);
  }
};

// @desc    Logout user / clear cookie if we were using cookies (client clears token for now)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout
};
