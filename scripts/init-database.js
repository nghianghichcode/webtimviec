const { runQuery, allQuery } = require('../database/connection');
const config = require('../config');

async function initDatabase() {
  try {
    console.log('🔄 Đang khởi tạo SQLite database...');

    // Create tables
    console.log('🔄 Đang tạo các bảng...');

    // Users table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student' CHECK(role IN ('student', 'employer', 'admin')),
        avatar TEXT,
        university TEXT,
        major TEXT,
        year_of_study INTEGER,
        skills TEXT,
        bio TEXT,
        is_verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Companies table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        logo TEXT,
        website TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        industry TEXT,
        size TEXT CHECK(size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
        is_verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT,
        benefits TEXT,
        salary_min INTEGER,
        salary_max INTEGER,
        salary_type TEXT DEFAULT 'hourly' CHECK(salary_type IN ('hourly', 'daily', 'monthly')),
        job_type TEXT DEFAULT 'part-time' CHECK(job_type IN ('part-time', 'full-time', 'internship', 'freelance')),
        category TEXT,
        location TEXT,
        work_schedule TEXT,
        experience_level TEXT DEFAULT 'entry' CHECK(experience_level IN ('entry', 'intermediate', 'advanced')),
        is_remote BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        application_deadline DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    // Applications table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        cover_letter TEXT,
        resume_url TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'accepted', 'rejected')),
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_at DATETIME,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        UNIQUE(user_id, job_id)
      )
    `);

    // Job categories table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS job_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Skills table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User skills junction table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS user_skills (
        user_id INTEGER NOT NULL,
        skill_id INTEGER NOT NULL,
        proficiency TEXT DEFAULT 'beginner' CHECK(proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
        PRIMARY KEY (user_id, skill_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      )
    `);

    // Job skills junction table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS job_skills (
        job_id INTEGER NOT NULL,
        skill_id INTEGER NOT NULL,
        is_required BOOLEAN DEFAULT 1,
        PRIMARY KEY (job_id, skill_id),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tất cả các bảng đã được tạo thành công');

    // Insert sample data
    console.log('🔄 Đang thêm dữ liệu mẫu...');

    // Insert job categories
    await runQuery(`
      INSERT OR IGNORE INTO job_categories (name, description, icon, color) VALUES
      ('F&B', 'Thực phẩm và Đồ uống', 'fas fa-utensils', '#ff6b6b'),
      ('Giáo dục', 'Dạy học và Gia sư', 'fas fa-chalkboard-teacher', '#4ecdc4'),
      ('Công nghệ', 'IT và Phần mềm', 'fas fa-laptop-code', '#45b7d1'),
      ('Bán lẻ', 'Bán hàng và Dịch vụ', 'fas fa-shopping-bag', '#96ceb4'),
      ('Marketing', 'Quảng cáo và Truyền thông', 'fas fa-bullhorn', '#feca57'),
      ('Dịch vụ', 'Khách sạn và Du lịch', 'fas fa-concierge-bell', '#ff9ff3')
    `);

    // Insert sample companies
    await runQuery(`
      INSERT OR IGNORE INTO companies (name, description, logo, website, address, phone, email, industry, size, is_verified) VALUES
      ('Starbucks Coffee', 'Chuỗi cà phê quốc tế', 'starbucks-logo.png', 'https://starbucks.vn', '123 Nguyễn Huệ, Q1, TP.HCM', '1900 1234', 'hr@starbucks.vn', 'F&B', 'large', 1),
      ('Trung tâm Anh ngữ ABC', 'Trung tâm dạy tiếng Anh', 'abc-logo.png', 'https://abc.edu.vn', '456 Lê Lợi, Q3, TP.HCM', '028 1234 5678', 'info@abc.edu.vn', 'Education', 'medium', 1),
      ('TechStart Vietnam', 'Công ty công nghệ', 'techstart-logo.png', 'https://techstart.vn', '789 Nguyễn Văn Cừ, Q5, TP.HCM', '028 9876 5432', 'contact@techstart.vn', 'Technology', 'medium', 1),
      ('Uniqlo Vietnam', 'Thương hiệu thời trang', 'uniqlo-logo.png', 'https://uniqlo.vn', '321 Đồng Khởi, Q1, TP.HCM', '028 1111 2222', 'jobs@uniqlo.vn', 'Retail', 'large', 1)
    `);

    // Insert sample jobs
    await runQuery(`
      INSERT OR IGNORE INTO jobs (company_id, title, description, requirements, benefits, salary_min, salary_max, salary_type, job_type, category, location, work_schedule, experience_level, is_remote, is_active) VALUES
      (1, 'Barista', 'Phục vụ khách hàng, pha chế đồ uống, quản lý quầy', 'Kỹ năng giao tiếp tốt, có kinh nghiệm làm việc nhóm', 'Lương cạnh tranh, môi trường làm việc năng động, đào tạo kỹ năng', 25000, 30000, 'hourly', 'part-time', 'F&B', 'Quận 1, TP.HCM', 'Thứ 2-6, 4-6h/ngày', 'entry', 0, 1),
      (2, 'Gia sư tiếng Anh', 'Dạy kèm học sinh cấp 1,2,3 môn tiếng Anh', 'Trình độ tiếng Anh tốt, có kinh nghiệm dạy học', 'Lương cao, lịch linh hoạt, phát triển kỹ năng sư phạm', 50000, 70000, 'hourly', 'part-time', 'Giáo dục', 'Quận 3, TP.HCM', 'Linh hoạt', 'intermediate', 0, 1),
      (3, 'Content Writer', 'Viết bài blog, content marketing cho website', 'Kỹ năng viết tốt, hiểu biết về SEO', 'Làm việc remote, lương theo dự án, môi trường sáng tạo', 30000, 50000, 'hourly', 'part-time', 'Công nghệ', 'Remote', 'Linh hoạt', 'entry', 1, 1),
      (4, 'Nhân viên bán hàng', 'Tư vấn khách hàng, sắp xếp hàng hóa, thu ngân', 'Kỹ năng giao tiếp, chăm sóc khách hàng', 'Lương ổn định, thưởng doanh số, môi trường chuyên nghiệp', 22000, 28000, 'hourly', 'part-time', 'Bán lẻ', 'Quận 1, TP.HCM', 'Cuối tuần, 4-8h/ngày', 'entry', 0, 1)
    `);

    // Insert sample skills
    await runQuery(`
      INSERT OR IGNORE INTO skills (name, category) VALUES
      ('Tiếng Anh', 'Ngôn ngữ'),
      ('Giao tiếp', 'Kỹ năng mềm'),
      ('Làm việc nhóm', 'Kỹ năng mềm'),
      ('Quản lý thời gian', 'Kỹ năng mềm'),
      ('Viết lách', 'Kỹ năng chuyên môn'),
      ('Photoshop', 'Công nghệ'),
      ('Excel', 'Công nghệ'),
      ('PowerPoint', 'Công nghệ'),
      ('Bán hàng', 'Kinh doanh'),
      ('Chăm sóc khách hàng', 'Dịch vụ')
    `);

    console.log('✅ Dữ liệu mẫu đã được thêm thành công');
    console.log('🎉 Khởi tạo database hoàn tất!');

  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;