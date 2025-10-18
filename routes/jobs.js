const express = require('express');
const { body, validationResult, query } = require('express-validator');
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

// Get all jobs with filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Trang phải là số nguyên dương'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Giới hạn phải từ 1-50'),
  query('category').optional().trim(),
  query('location').optional().trim(),
  query('job_type').optional().isIn(['part-time', 'full-time', 'internship', 'freelance']),
  query('salary_min').optional().isInt({ min: 0 }),
  query('salary_max').optional().isInt({ min: 0 }),
  query('is_remote').optional().isBoolean(),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      location,
      job_type,
      salary_min,
      salary_max,
      is_remote,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['j.is_active = 1'];
    let queryParams = [];

    // Build WHERE conditions
    if (category) {
      whereConditions.push('j.category = ?');
      queryParams.push(category);
    }

    if (location) {
      whereConditions.push('j.location LIKE ?');
      queryParams.push(`%${location}%`);
    }

    if (job_type) {
      whereConditions.push('j.job_type = ?');
      queryParams.push(job_type);
    }

    if (salary_min) {
      whereConditions.push('j.salary_min >= ?');
      queryParams.push(salary_min);
    }

    if (salary_max) {
      whereConditions.push('j.salary_max <= ?');
      queryParams.push(salary_max);
    }

    if (is_remote !== undefined) {
      whereConditions.push('j.is_remote = ?');
      queryParams.push(is_remote === 'true' ? 1 : 0);
    }

    if (search) {
      whereConditions.push('(j.title LIKE ? OR j.description LIKE ? OR c.name LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await getQuery(
      `SELECT COUNT(*) as total 
       FROM jobs j 
       JOIN companies c ON j.company_id = c.id 
       ${whereClause}`,
      queryParams
    );

    const total = countResult.total;

    // Get jobs
    const jobs = await allQuery(
      `SELECT 
         j.id, j.title, j.description, j.requirements, j.benefits,
         j.salary_min, j.salary_max, j.salary_type, j.job_type, j.category,
         j.location, j.work_schedule, j.experience_level, j.is_remote,
         j.application_deadline, j.created_at,
         c.id as company_id, c.name as company_name, c.logo as company_logo,
         c.address as company_address, c.industry
       FROM jobs j 
       JOIN companies c ON j.company_id = c.id 
       ${whereClause}
       ORDER BY j.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách việc làm'
    });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const job = await getQuery(
      `SELECT 
         j.*, 
         c.name as company_name, c.logo as company_logo, c.description as company_description,
         c.website as company_website, c.address as company_address, c.phone as company_phone,
         c.email as company_email, c.industry, c.size
       FROM jobs j 
       JOIN companies c ON j.company_id = c.id 
       WHERE j.id = ? AND j.is_active = 1`,
      [id]
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy việc làm'
      });
    }

    res.json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin việc làm'
    });
  }
});

// Get job categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await allQuery(
      'SELECT * FROM job_categories ORDER BY name'
    );

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh mục việc làm'
    });
  }
});

// Create job (for employers)
router.post('/', verifyToken, [
  body('title').trim().isLength({ min: 5 }).withMessage('Tiêu đề phải có ít nhất 5 ký tự'),
  body('description').trim().isLength({ min: 20 }).withMessage('Mô tả phải có ít nhất 20 ký tự'),
  body('salary_min').isInt({ min: 0 }).withMessage('Lương tối thiểu phải là số dương'),
  body('salary_max').isInt({ min: 0 }).withMessage('Lương tối đa phải là số dương'),
  body('job_type').isIn(['part-time', 'full-time', 'internship', 'freelance']).withMessage('Loại việc làm không hợp lệ'),
  body('category').trim().notEmpty().withMessage('Danh mục không được để trống'),
  body('location').trim().notEmpty().withMessage('Địa điểm không được để trống')
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

    // Check if user is employer
    if (req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ nhà tuyển dụng mới có thể tạo việc làm'
      });
    }

    const {
      title, description, requirements, benefits, salary_min, salary_max,
      salary_type, job_type, category, location, work_schedule, experience_level,
      is_remote, application_deadline, skills
    } = req.body;

    // For now, we'll use a default company_id. In a real app, you'd get this from the user's profile
    const company_id = 1; // This should come from the authenticated user's company

    const result = await runQuery(
      `INSERT INTO jobs (
        company_id, title, description, requirements, benefits,
        salary_min, salary_max, salary_type, job_type, category,
        location, work_schedule, experience_level, is_remote, application_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_id, title, description, requirements, benefits,
        salary_min, salary_max, salary_type, job_type, category,
        location, work_schedule, experience_level, is_remote, application_deadline
      ]
    );

    // Add job skills if provided
    if (skills && skills.length > 0) {
      for (const skill of skills) {
        await runQuery(
          'INSERT INTO job_skills (job_id, skill_id, is_required) VALUES (?, ?, ?)',
          [result.id, skill.skill_id, skill.is_required || true]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Tạo việc làm thành công',
      data: {
        job_id: result.id
      }
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo việc làm'
    });
  }
});

module.exports = router;