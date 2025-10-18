const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/connection');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token không được cung cấp'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }
};

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const [users] = await pool.execute(
      `SELECT 
         id, name, email, phone, role, avatar, university, major, 
         year_of_study, skills, bio, is_verified, created_at
       FROM users WHERE id = ?`,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const user = users[0];
    
    // Parse skills if it's a JSON string
    if (user.skills && typeof user.skills === 'string') {
      try {
        user.skills = JSON.parse(user.skills);
      } catch (e) {
        user.skills = [];
      }
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin người dùng'
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio không được quá 500 ký tự'),
  body('university').optional().trim().isLength({ max: 100 }).withMessage('Tên trường không được quá 100 ký tự'),
  body('major').optional().trim().isLength({ max: 100 }).withMessage('Chuyên ngành không được quá 100 ký tự'),
  body('year_of_study').optional().isInt({ min: 1, max: 6 }).withMessage('Năm học phải từ 1-6')
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

    const user_id = req.user.userId;
    const { name, phone, university, major, year_of_study, bio, skills } = req.body;

    // Build update query
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

    updateValues.push(user_id);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin'
    });
  }
});

// Upload avatar
router.post('/avatar', verifyToken, async (req, res) => {
  try {
    // In a real application, you would handle file upload here
    // For now, we'll just accept a URL
    const { avatar_url } = req.body;

    if (!avatar_url) {
      return res.status(400).json({
        success: false,
        message: 'URL avatar không được để trống'
      });
    }

    const user_id = req.user.userId;

    await pool.execute(
      'UPDATE users SET avatar = ? WHERE id = ?',
      [avatar_url, user_id]
    );

    res.json({
      success: true,
      message: 'Cập nhật avatar thành công',
      data: {
        avatar: avatar_url
      }
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật avatar'
    });
  }
});

// Get user statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    // Get application statistics
    const [applicationStats] = await pool.execute(
      `SELECT 
         COUNT(*) as total_applications,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_applications,
         SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_applications,
         SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_applications
       FROM applications WHERE user_id = ?`,
      [user_id]
    );

    // Get recent applications
    const [recentApplications] = await pool.execute(
      `SELECT 
         a.id, a.status, a.applied_at,
         j.title as job_title,
         c.name as company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.user_id = ?
       ORDER BY a.applied_at DESC
       LIMIT 5`,
      [user_id]
    );

    res.json({
      success: true,
      data: {
        applications: applicationStats[0],
        recent_applications: recentApplications
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê người dùng'
    });
  }
});

// Get all users (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (role) {
      whereConditions.push('role = ?');
      queryParams.push(role);
    }

    if (search) {
      whereConditions.push('(name LIKE ? OR email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;

    // Get users
    const [users] = await pool.execute(
      `SELECT 
         id, name, email, phone, role, avatar, university, major, 
         year_of_study, is_verified, created_at
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách người dùng'
    });
  }
});

// Get user by ID (admin only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    const { id } = req.params;

    const [users] = await pool.execute(
      `SELECT 
         id, name, email, phone, role, avatar, university, major, 
         year_of_study, skills, bio, is_verified, created_at
       FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const user = users[0];
    
    // Parse skills if it's a JSON string
    if (user.skills && typeof user.skills === 'string') {
      try {
        user.skills = JSON.parse(user.skills);
      } catch (e) {
        user.skills = [];
      }
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin người dùng'
    });
  }
});

// Update user verification status (admin only)
router.put('/:id/verify', verifyToken, [
  body('is_verified').isBoolean().withMessage('Trạng thái xác thực phải là boolean')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật trạng thái xác thực'
      });
    }

    const { id } = req.params;
    const { is_verified } = req.body;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    await pool.execute(
      'UPDATE users SET is_verified = ? WHERE id = ?',
      [is_verified, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật trạng thái xác thực thành công'
    });

  } catch (error) {
    console.error('Update user verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái xác thực'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa người dùng'
      });
    }

    const { id } = req.params;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Don't allow admin to delete themselves
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa chính mình'
      });
    }

    // Delete user (this will cascade delete applications due to foreign key constraints)
    await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa người dùng thành công'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa người dùng'
    });
  }
});

module.exports = router;
