const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { runQuery, getQuery } = require('../database/connection');
const config = require('../config');

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, university, major, year_of_study } = req.body;

    // Check if user already exists
    const existingUser = await getQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await runQuery(
      `INSERT INTO users (name, email, password, phone, university, major, year_of_study, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'student')`,
      [name, email, hashedPassword, phone, university, major, year_of_study]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.id, email, role: 'student' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: result.id,
          name,
          email,
          role: 'student'
        },
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await getQuery(
      'SELECT id, name, email, password, role, avatar, is_verified FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          is_verified: user.is_verified
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await getQuery(
      'SELECT id, name, email, role, avatar, university, major, year_of_study, bio, is_verified FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
    
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Update profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio không được quá 500 ký tự')
], async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const { name, phone, university, major, year_of_study, bio, skills } = req.body;

    // Update user profile
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (university) {
      updateFields.push('university = ?');
      updateValues.push(university);
    }
    if (major) {
      updateFields.push('major = ?');
      updateValues.push(major);
    }
    if (year_of_study) {
      updateFields.push('year_of_study = ?');
      updateValues.push(year_of_study);
    }
    if (bio) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }
    if (skills) {
      updateFields.push('skills = ?');
      updateValues.push(JSON.stringify(skills));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(decoded.userId);

    await runQuery(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
    
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin'
    });
  }
});

module.exports = router;