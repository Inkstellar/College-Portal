const express = require('express');
const router = express.Router();
const { userService } = require('../dataService');
const { validateUserData, validateUserUpdateData, validatePaginationParams } = require('../middleware/validation');

// GET /api/users - Get all users with pagination and filtering
router.get('/', validatePaginationParams, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, department, search } = req.query;

    let query = {};

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const allUsers = await userService.find(query);
    const users = allUsers
      .filter(user => user.password) // Exclude password from response
      .slice((page - 1) * limit, page * limit)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

    const total = await userService.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id - Get single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Create new user
router.post('/', validateUserData, async (req, res) => {
  try {
    const { name, email, password, role, studentId, department, year, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await userService.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check if studentId is unique (if provided)
    if (studentId) {
      const existingStudentId = await userService.findOne({ studentId });
      if (existingStudentId) {
        return res.status(400).json({ error: 'Student ID already exists' });
      }
    }

    const userData = {
      name,
      email,
      password, // In production, hash the password
      role,
      studentId,
      department,
      year,
      phone,
      address
    };

    const savedUser = await userService.create(userData);
    const { password: _, ...userResponse } = savedUser;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', validateUserUpdateData, async (req, res) => {
  try {
    const { name, email, role, studentId, department, year, phone, address, isActive } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await userService.findOne({ email, id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken by another user' });
      }
    }

    // Check if studentId is already taken by another user
    if (studentId) {
      const existingStudentId = await userService.findOne({ studentId, id: { $ne: req.params.id } });
      if (existingStudentId) {
        return res.status(400).json({ error: 'Student ID already taken by another user' });
      }
    }

    const updateData = {
      name,
      email,
      role,
      studentId,
      department,
      year,
      phone,
      address,
      isActive
    };

    const user = await userService.findByIdAndUpdate(req.params.id, updateData);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await userService.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/stats/overview - Get user statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalUsers = await userService.countDocuments();
    const activeUsers = await userService.countDocuments({ isActive: true });
    const students = await userService.countDocuments({ role: 'student' });
    const faculty = await userService.countDocuments({ role: 'faculty' });
    const admins = await userService.countDocuments({ role: 'admin' });

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      students,
      faculty,
      admins
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
