const express = require('express');
const { body, validationResult } = require('express-validator');
const { runQuery, getQuery, allQuery } = require('../database/connection');
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

// Apply for a job
router.post('/', verifyToken, [
  body('job_id').isInt({ min: 1 }).withMessage('ID việc làm không hợp lệ'),
  body('cover_letter').optional().trim().isLength({ max: 1000 }).withMessage('Thư xin việc không được quá 1000 ký tự'),
  body('resume_url').optional().trim().isURL().withMessage('URL CV không hợp lệ')
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

    const { job_id, cover_letter, resume_url } = req.body;
    const user_id = req.user.userId;

    // Check if job exists and is active
    const job = await getQuery(
      'SELECT id, title, application_deadline FROM jobs WHERE id = ? AND is_active = 1',
      [job_id]
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy việc làm hoặc việc làm đã bị đóng'
      });
    }

    // Check application deadline
    if (job.application_deadline && new Date(job.application_deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Hạn nộp hồ sơ đã qua'
      });
    }

    // Check if user already applied
    const existingApplication = await getQuery(
      'SELECT id FROM applications WHERE user_id = ? AND job_id = ?',
      [user_id, job_id]
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã ứng tuyển việc làm này rồi'
      });
    }

    // Create application
    const result = await runQuery(
      'INSERT INTO applications (user_id, job_id, cover_letter, resume_url) VALUES (?, ?, ?, ?)',
      [user_id, job_id, cover_letter, resume_url]
    );

    res.status(201).json({
      success: true,
      message: 'Ứng tuyển thành công',
      data: {
        application_id: result.id,
        job_title: job.title
      }
    });

  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi ứng tuyển'
    });
  }
});

// Get user's applications
router.get('/my-applications', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const user_id = req.user.userId;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE a.user_id = ?';
    let queryParams = [user_id];

    if (status) {
      whereClause += ' AND a.status = ?';
      queryParams.push(status);
    }

    // Get total count
    const countResult = await getQuery(
      `SELECT COUNT(*) as total FROM applications a ${whereClause}`,
      queryParams
    );

    const total = countResult.total;

    // Get applications
    const applications = await allQuery(
      `SELECT 
         a.id, a.cover_letter, a.resume_url, a.status, a.applied_at, a.reviewed_at, a.notes,
         j.id as job_id, j.title as job_title, j.salary_min, j.salary_max, j.salary_type,
         j.job_type, j.location, j.is_remote,
         c.name as company_name, c.logo as company_logo
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       ${whereClause}
       ORDER BY a.applied_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách ứng tuyển'
    });
  }
});

// Get application by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    const application = await getQuery(
      `SELECT 
         a.*,
         j.title as job_title, j.description as job_description, j.salary_min, j.salary_max,
         j.salary_type, j.job_type, j.location, j.work_schedule, j.is_remote,
         c.name as company_name, c.logo as company_logo, c.address as company_address,
         c.phone as company_phone, c.email as company_email
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.id = ? AND a.user_id = ?`,
      [id, user_id]
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin ứng tuyển'
    });
  }
});

// Update application (for users to update their application)
router.put('/:id', verifyToken, [
  body('cover_letter').optional().trim().isLength({ max: 1000 }).withMessage('Thư xin việc không được quá 1000 ký tự'),
  body('resume_url').optional().trim().isURL().withMessage('URL CV không hợp lệ')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { cover_letter, resume_url } = req.body;
    const user_id = req.user.userId;

    // Check if application exists and belongs to user
    const application = await getQuery(
      'SELECT id, status FROM applications WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    // Check if application can be updated (only pending applications)
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể cập nhật đơn ứng tuyển đang chờ xử lý'
      });
    }

    // Update application
    const updateFields = [];
    const updateValues = [];

    if (cover_letter !== undefined) {
      updateFields.push('cover_letter = ?');
      updateValues.push(cover_letter);
    }

    if (resume_url !== undefined) {
      updateFields.push('resume_url = ?');
      updateValues.push(resume_url);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateValues.push(id);

    await runQuery(
      `UPDATE applications SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật đơn ứng tuyển thành công'
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật đơn ứng tuyển'
    });
  }
});

// Cancel application
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;

    // Check if application exists and belongs to user
    const application = await getQuery(
      'SELECT id, status FROM applications WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    // Check if application can be cancelled (only pending applications)
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy đơn ứng tuyển đang chờ xử lý'
      });
    }

    // Delete application
    await runQuery(
      'DELETE FROM applications WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Hủy đơn ứng tuyển thành công'
    });

  } catch (error) {
    console.error('Cancel application error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi hủy đơn ứng tuyển'
    });
  }
});

module.exports = router;