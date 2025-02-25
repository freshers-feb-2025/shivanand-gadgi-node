const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Student, Teacher, Admin } = require('../models');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, grade, subject, permissions } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    switch (role) {
      case 'student':
        user = await Student.create({ name, email, password: hashedPassword, role, grade });
        break;
      case 'teacher':
        user = await Teacher.create({ name, email, password: hashedPassword, role, subject });
        break;
      case 'admin':
        user = await Admin.create({ name, email, password: hashedPassword, role, permissions });
        break;
      default:
        return res.status(400).json({ error: 'Invalid role' });
    }

    res.status(201).json({ message: 'User registered successfully', user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;