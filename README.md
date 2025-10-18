# 🎓 StudentJobs - Website Tìm Việc Làm Part-time cho Sinh viên

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/database-SQLite-blue)](https://sqlite.org/)
[![Express.js](https://img.shields.io/badge/framework-Express.js-green)](https://expressjs.com/)

Website động với tương tác dữ liệu SQL để tìm việc làm part-time dành cho sinh viên. Được xây dựng với Node.js, Express.js, SQLite và giao diện responsive hiện đại.

## ✨ Tính năng nổi bật

- 🔐 **Hệ thống xác thực JWT** - Đăng ký/đăng nhập an toàn
- 🔍 **Tìm kiếm việc làm thông minh** - Lọc theo danh mục, địa điểm, mức lương
- 📝 **Ứng tuyển trực tuyến** - Gửi đơn ứng tuyển và theo dõi trạng thái
- 👤 **Quản lý hồ sơ cá nhân** - Cập nhật thông tin và kỹ năng
- 📊 **Dashboard cá nhân** - Theo dõi lịch sử ứng tuyển
- 📱 **Responsive Design** - Tối ưu cho mọi thiết bị
- 🎨 **Giao diện hiện đại** - UI/UX chuyên nghiệp

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database (không cần cài đặt server)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling với Flexbox/Grid
- **JavaScript (ES6+)** - Client-side logic
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### DevOps & Deployment
- **Docker** - Containerization
- **Heroku** - Cloud deployment
- **Vercel** - Serverless deployment
- **Nginx** - Reverse proxy

## 🚀 Demo & Live Preview

### 🌐 Online Demo
- **Website**: [https://studentjobs-demo.vercel.app](https://studentjobs-demo.vercel.app)
- **API**: [https://studentjobs-api.herokuapp.com/api/health](https://studentjobs-api.herokuapp.com/api/health)

### 📱 Screenshots
![Homepage](https://via.placeholder.com/800x400/667eea/ffffff?text=StudentJobs+Homepage)
![Job Search](https://via.placeholder.com/800x400/4ecdc4/ffffff?text=Job+Search+Interface)
![Application](https://via.placeholder.com/800x400/45b7d1/ffffff?text=Job+Application)

## 📋 Yêu cầu hệ thống

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **Git** >= 2.0.0

## ⚡ Cài đặt nhanh

### 1. Clone repository
```bash
git clone https://github.com/yourusername/studentjobs-web.git
cd studentjobs-web
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Khởi tạo database
```bash
npm run init-db
```

### 4. Chạy ứng dụng
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Truy cập website
Mở trình duyệt và truy cập: **http://localhost:3000**

## 🗄️ Database Schema

### Bảng chính
- **users** - Thông tin người dùng (sinh viên/nhà tuyển dụng)
- **companies** - Thông tin công ty
- **jobs** - Việc làm với đầy đủ thông tin
- **applications** - Đơn ứng tuyển
- **job_categories** - Danh mục việc làm
- **skills** - Kỹ năng và user_skills, job_skills

### Dữ liệu mẫu
- ✅ 4 công ty uy tín
- ✅ 4 việc làm part-time
- ✅ 6 danh mục việc làm
- ✅ 10 kỹ năng phổ biến

## 🔌 API Documentation

### Authentication
```http
POST /api/auth/register    # Đăng ký tài khoản
POST /api/auth/login       # Đăng nhập
GET  /api/auth/me          # Thông tin user hiện tại
PUT  /api/auth/profile     # Cập nhật profile
```

### Jobs
```http
GET  /api/jobs             # Lấy danh sách việc làm
GET  /api/jobs/:id         # Chi tiết việc làm
GET  /api/jobs/categories/list  # Danh mục việc làm
POST /api/jobs             # Tạo việc làm (employer)
```

### Applications
```http
POST /api/applications              # Ứng tuyển việc làm
GET  /api/applications/my-applications  # Đơn ứng tuyển của user
GET  /api/applications/:id          # Chi tiết đơn ứng tuyển
PUT  /api/applications/:id          # Cập nhật đơn ứng tuyển
DELETE /api/applications/:id        # Hủy đơn ứng tuyển
```

### Health Check
```http
GET  /api/health            # Kiểm tra trạng thái server
```

## 🚀 Deployment

### Heroku Deployment
```bash
# 1. Tạo app trên Heroku
heroku create your-app-name

# 2. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key

# 3. Deploy
git push heroku main

# 4. Khởi tạo database
heroku run npm run init-db
```

### Vercel Deployment
```bash
# 1. Cài đặt Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables trong Vercel dashboard
```

### Docker Deployment
```bash
# 1. Build image
docker build -t studentjobs-web .

# 2. Run container
docker run -p 3000:3000 studentjobs-web

# 3. Docker Compose
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables
```env
# Database
DB_FILENAME=studentjobs.db

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Upload
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
```

### Cấu hình Production
- Sử dụng PostgreSQL thay vì SQLite
- Enable HTTPS
- Setup CDN cho static files
- Configure logging và monitoring

## 📱 Mobile Support

Website được tối ưu hoàn toàn cho mobile:
- ✅ Responsive design
- ✅ Touch-friendly interface
- ✅ Fast loading
- ✅ Offline support (PWA ready)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt với salt rounds
- **Input Validation** - Comprehensive validation
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Cross-origin security
- **Helmet.js** - Security headers

## 🎨 UI/UX Features

- **Modern Design** - Clean và professional
- **Responsive Layout** - Mobile-first approach
- **Smooth Animations** - CSS transitions
- **Loading States** - Better user experience
- **Error Handling** - User-friendly messages
- **Accessibility** - WCAG compliant

## 📊 Performance

- **Fast Loading** - Optimized assets
- **Database Indexing** - Query optimization
- **Caching** - Static file caching
- **Compression** - Gzip compression
- **CDN Ready** - Static file delivery

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Hãy xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

### Development Setup
```bash
# Fork repository
git clone https://github.com/yourusername/studentjobs-web.git

# Tạo feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Tạo Pull Request
```

## 📄 License

Dự án này được phân phối dưới [MIT License](LICENSE).

## 👥 Team

- **Frontend**: React, Vue.js, Angular
- **Backend**: Node.js, Python, Java
- **Database**: PostgreSQL, MongoDB
- **DevOps**: Docker, Kubernetes, AWS

## 📞 Support & Contact

- **Email**: support@studentjobs.vn
- **Website**: [https://studentjobs.vn](https://studentjobs.vn)
- **Documentation**: [Wiki](https://github.com/yourusername/studentjobs-web/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/studentjobs-web/issues)

## 🎯 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Video interviews
- [ ] AI job matching
- [ ] Multi-language support

### Version 3.0 (Q4 2024)
- [ ] Advanced analytics dashboard
- [ ] Company profiles
- [ ] Skill assessments
- [ ] Career guidance
- [ ] Social features

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/studentjobs-web&type=Date)](https://star-history.com/#yourusername/studentjobs-web&Date)

## 📈 Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/studentjobs-web?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/studentjobs-web?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/studentjobs-web)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/studentjobs-web)

---

**StudentJobs** - Kết nối sinh viên với cơ hội việc làm part-time tốt nhất! 🎓💼

*Được phát triển với ❤️ bởi StudentJobs Team*