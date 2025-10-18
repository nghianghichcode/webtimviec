// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const filterBtns = document.querySelectorAll('.filter-btn');
const jobCards = document.querySelectorAll('.job-card');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeBtns = document.querySelectorAll('.close');

// Global state
let currentUser = null;
let currentJobs = [];
let currentPage = 1;
let currentFilters = {};

// Global state for saved jobs
let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];

// Sample jobs data
const sampleJobs = [
    {
        id: 1,
        title: "Barista - Starbucks",
        company: "Starbucks Vietnam",
        location: "Hà Nội",
        salary: "25k-35k/h",
        type: "Part-time",
        category: "food",
        description: "Tìm kiếm nhân viên pha chế cà phê part-time tại Starbucks. Công việc linh hoạt, phù hợp với sinh viên.",
        requirements: [
            "Sinh viên năm 2 trở lên",
            "Có kinh nghiệm pha chế (ưu tiên)",
            "Giao tiếp tốt",
            "Làm việc được ca sáng/chiều"
        ],
        benefits: [
            "Lương cạnh tranh",
            "Đào tạo miễn phí",
            "Môi trường làm việc chuyên nghiệp",
            "Cơ hội thăng tiến"
        ],
        postedDate: "2024-01-15",
        deadline: "2024-02-15"
    },
    {
        id: 2,
        title: "Gia sư Toán - Online",
        company: "Gia sư Online",
        location: "Toàn quốc",
        salary: "50k-80k/h",
        type: "Part-time",
        category: "education",
        description: "Tìm gia sư dạy Toán online cho học sinh cấp 2, cấp 3. Làm việc linh hoạt theo lịch học.",
        requirements: [
            "Sinh viên chuyên ngành Toán/Toán học",
            "Điểm GPA >= 3.0",
            "Có kinh nghiệm gia sư",
            "Thành thạo công nghệ online"
        ],
        benefits: [
            "Lương cao",
            "Làm việc tại nhà",
            "Lịch linh hoạt",
            "Phát triển kỹ năng sư phạm"
        ],
        postedDate: "2024-01-14",
        deadline: "2024-02-14"
    },
    {
        id: 3,
        title: "Content Writer",
        company: "Tech Solutions",
        location: "TP.HCM",
        salary: "30k-50k/h",
        type: "Part-time",
        category: "content",
        description: "Viết nội dung cho website và blog công nghệ. Công việc remote, linh hoạt thời gian.",
        requirements: [
            "Sinh viên chuyên ngành Marketing/CNTT",
            "Kỹ năng viết tốt",
            "Hiểu biết về công nghệ",
            "Làm việc độc lập"
        ],
        benefits: [
            "Làm việc remote",
            "Lương hấp dẫn",
            "Phát triển portfolio",
            "Môi trường startup năng động"
        ],
        postedDate: "2024-01-13",
        deadline: "2024-02-13"
    },
    {
        id: 4,
        title: "Nhân viên bán hàng - Uniqlo",
        company: "Uniqlo Vietnam",
        location: "Hà Nội",
        salary: "25k-30k/h",
        type: "Part-time",
        category: "retail",
        description: "Tư vấn khách hàng, bán hàng tại cửa hàng Uniqlo. Công việc phù hợp với sinh viên.",
        requirements: [
            "Sinh viên năm 2 trở lên",
            "Giao tiếp tốt",
            "Ngoại hình ưa nhìn",
            "Làm việc được cuối tuần"
        ],
        benefits: [
            "Lương cạnh tranh",
            "Đào tạo sản phẩm",
            "Môi trường quốc tế",
            "Giảm giá sản phẩm"
        ],
        postedDate: "2024-01-12",
        deadline: "2024-02-12"
    },
    {
        id: 5,
        title: "Gia sư Tiếng Anh",
        company: "English Center",
        location: "Đà Nẵng",
        salary: "40k-60k/h",
        type: "Part-time",
        category: "education",
        description: "Dạy Tiếng Anh cho học sinh cấp 1, cấp 2. Làm việc tại trung tâm hoặc online.",
        requirements: [
            "IELTS >= 6.5 hoặc TOEIC >= 800",
            "Kỹ năng sư phạm",
            "Kiên nhẫn với trẻ em",
            "Làm việc được buổi tối"
        ],
        benefits: [
            "Lương cao",
            "Phát triển kỹ năng sư phạm",
            "Môi trường chuyên nghiệp",
            "Cơ hội thăng tiến"
        ],
        postedDate: "2024-01-11",
        deadline: "2024-02-11"
    },
    {
        id: 6,
        title: "Nhân viên phục vụ - KFC",
        company: "KFC Vietnam",
        location: "TP.HCM",
        salary: "22k-28k/h",
        type: "Part-time",
        category: "food",
        description: "Phục vụ khách hàng, chuẩn bị đồ ăn nhanh. Công việc linh hoạt, phù hợp sinh viên.",
        requirements: [
            "Sinh viên năm 1 trở lên",
            "Sức khỏe tốt",
            "Làm việc được ca tối",
            "Thái độ phục vụ tốt"
        ],
        benefits: [
            "Lương ổn định",
            "Đào tạo kỹ năng",
            "Môi trường năng động",
            "Thưởng theo doanh số"
        ],
        postedDate: "2024-01-10",
        deadline: "2024-02-10"
    },
    {
        id: 7,
        title: "Freelance Designer",
        company: "Creative Studio",
        location: "Toàn quốc",
        salary: "50k-100k/h",
        type: "Part-time",
        category: "design",
        description: "Thiết kế logo, banner, poster cho các dự án. Làm việc remote, linh hoạt thời gian.",
        requirements: [
            "Thành thạo Photoshop, Illustrator",
            "Portfolio đẹp",
            "Sáng tạo, có gu thẩm mỹ",
            "Làm việc độc lập"
        ],
        benefits: [
            "Lương cao",
            "Làm việc tại nhà",
            "Phát triển portfolio",
            "Linh hoạt thời gian"
        ],
        postedDate: "2024-01-09",
        deadline: "2024-02-09"
    },
    {
        id: 8,
        title: "Nhân viên bán hàng - Nike",
        company: "Nike Vietnam",
        location: "Hà Nội",
        salary: "28k-35k/h",
        type: "Part-time",
        category: "retail",
        description: "Tư vấn sản phẩm thể thao, bán hàng tại cửa hàng Nike. Công việc năng động.",
        requirements: [
            "Yêu thích thể thao",
            "Giao tiếp tốt",
            "Làm việc được cuối tuần",
            "Hiểu biết về sản phẩm thể thao"
        ],
        benefits: [
            "Lương hấp dẫn",
            "Giảm giá sản phẩm",
            "Môi trường thể thao",
            "Đào tạo sản phẩm"
        ],
        postedDate: "2024-01-08",
        deadline: "2024-02-08"
    }
];

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Modal close functionality
document.addEventListener('click', (e) => {
    // Close modal when clicking X button
    if (e.target.classList.contains('close')) {
        hideModals();
    }
    
    // Close modal when clicking outside modal content
    if (e.target.classList.contains('modal')) {
        hideModals();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideModals();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Job Filter Functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        
        // Update current filters
        if (category === 'all') {
            delete currentFilters.category;
        } else {
            currentFilters.category = category;
        }
        
        // Apply filters
        await applyFilters();
    });
});

// Modal Functions
function showLoginModal() {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showRegisterModal() {
    registerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModals() {
    // Hide all modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Reset body overflow
    document.body.style.overflow = 'auto';
    
    // Remove any active classes
    document.body.classList.remove('modal-open');
}

// Close modals when clicking close button
closeBtns.forEach(btn => {
    btn.addEventListener('click', hideModals);
});

// Add form event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === registerModal) {
        hideModals();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideModals();
    }
});

// Scroll to jobs section
function scrollToJobs() {
    const jobsSection = document.getElementById('jobs');
    if (jobsSection) {
        jobsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form Validation and Submission
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    return isValid;
}

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(contactForm)) {
            // Show success message
            showNotification('Tin nhắn đã được gửi thành công!', 'success');
            contactForm.reset();
        } else {
            showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        }
    });
}

// Modal Form Submissions
const modalForms = document.querySelectorAll('.modal-form');
modalForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(form)) {
            const formType = form.closest('.modal').id;
            if (formType === 'loginModal') {
                showNotification('Đăng nhập thành công!', 'success');
                hideModals();
            } else if (formType === 'registerModal') {
                showNotification('Đăng ký thành công!', 'success');
                hideModals();
            }
            form.reset();
        } else {
            showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        }
    });
});

// Job Application
document.querySelectorAll('.job-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const jobTitle = btn.closest('.job-card').querySelector('h4').textContent;
        showNotification(`Đã ứng tuyển cho vị trí: ${jobTitle}`, 'success');
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .job-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Search Functionality
function searchJobs(query) {
    const jobCards = document.querySelectorAll('.job-card');
    const searchTerm = query.toLowerCase();
    
    jobCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const company = card.querySelector('.company-info h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || company.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add search input if needed
function addSearchInput() {
    const jobsSection = document.getElementById('jobs');
    if (jobsSection && !document.querySelector('.search-container')) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="jobSearch" placeholder="Tìm kiếm việc làm..." />
                <i class="fas fa-search"></i>
            </div>
        `;
        
        // Add styles
        const searchStyles = document.createElement('style');
        searchStyles.textContent = `
            .search-container {
                display: flex;
                justify-content: center;
                margin-bottom: 2rem;
            }
            .search-box {
                position: relative;
                max-width: 400px;
                width: 100%;
            }
            .search-box input {
                width: 100%;
                padding: 1rem 3rem 1rem 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 25px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            .search-box input:focus {
                outline: none;
                border-color: #2563eb;
            }
            .search-box i {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #64748b;
            }
        `;
        document.head.appendChild(searchStyles);
        
        jobsSection.querySelector('.container').insertBefore(searchContainer, jobsSection.querySelector('.jobs-filter'));
        
        // Add search functionality
        const searchInput = document.getElementById('jobSearch');
        searchInput.addEventListener('input', (e) => {
            searchJobs(e.target.value);
        });
    }
}

// Initialize search functionality
addSearchInput();

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('StudentJobs website loaded successfully!');
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Show loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.innerHTML = `
        <div class="spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Đang tải Part Hub...</p>
        </div>
    `;
    document.body.appendChild(loadingSpinner);
    
    setTimeout(async () => {
        try {
            await initializeApp();
            document.body.style.opacity = '1';
            loadingSpinner.remove();
        } catch (error) {
            console.error('App initialization error:', error);
            loadingSpinner.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Có lỗi xảy ra khi tải ứng dụng</p>
                    <button class="btn btn-primary" onclick="location.reload()">Thử lại</button>
                </div>
            `;
        }
    }, 1000);
});

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Authentication Functions
async function login(email, password) {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      currentUser = response.data.user;
      return response;
    }
  } catch (error) {
    throw error;
  }
}

async function register(userData) {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      currentUser = response.data.user;
      return response;
    }
  } catch (error) {
    throw error;
  }
}

async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  updateAuthUI();
  showNotification('Đã đăng xuất thành công!', 'success');
}

// User Profile Functions
function showUserProfile() {
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập trước!', 'error');
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="fas fa-user"></i> Hồ sơ cá nhân</h2>
        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
      </div>
      <div class="modal-body">
        <div class="profile-info">
          <div class="profile-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="profile-details">
            <h3>${currentUser.name}</h3>
            <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
            <p><i class="fas fa-phone"></i> ${currentUser.phone || 'Chưa cập nhật'}</p>
            <p><i class="fas fa-university"></i> ${currentUser.university || 'Chưa cập nhật'}</p>
            <p><i class="fas fa-graduation-cap"></i> ${currentUser.major || 'Chưa cập nhật'}</p>
            <p><i class="fas fa-calendar"></i> Năm ${currentUser.year_of_study || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-primary" onclick="editProfile()">
            <i class="fas fa-edit"></i> Chỉnh sửa hồ sơ
          </button>
          <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
            <i class="fas fa-times"></i> Đóng
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function showMyApplications() {
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập trước!', 'error');
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="fas fa-file-alt"></i> Đơn ứng tuyển của tôi</h2>
        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
      </div>
      <div class="modal-body">
        <div class="applications-list">
          <div class="no-applications">
            <i class="fas fa-inbox"></i>
            <h3>Chưa có đơn ứng tuyển nào</h3>
            <p>Hãy tìm việc làm phù hợp và ứng tuyển ngay!</p>
            <button class="btn btn-primary" onclick="this.closest('.modal').remove(); document.querySelector('.nav-link[href=\"jobs.html\"]').click();">
              <i class="fas fa-search"></i> Tìm việc làm
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function editProfile() {
  showNotification('Tính năng chỉnh sửa hồ sơ đang được phát triển!', 'info');
}

// Saved Jobs Functions
function saveJob(jobId) {
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để lưu việc!', 'error');
    return;
  }
  
  const job = sampleJobs.find(j => j.id === jobId);
  if (!job) return;
  
  const isAlreadySaved = savedJobs.some(saved => saved.id === jobId);
  
  if (isAlreadySaved) {
    unsaveJob(jobId);
  } else {
    savedJobs.push({
      id: jobId,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    showNotification('Đã lưu việc làm!', 'success');
    updateSaveButton(jobId, true);
  }
}

function unsaveJob(jobId) {
  savedJobs = savedJobs.filter(job => job.id !== jobId);
  localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  showNotification('Đã bỏ lưu việc làm!', 'info');
  updateSaveButton(jobId, false);
}

function updateSaveButton(jobId, isSaved) {
  const saveBtn = document.querySelector(`[data-job-id="${jobId}"] .save-job-btn`);
  if (saveBtn) {
    saveBtn.innerHTML = isSaved 
      ? '<i class="fas fa-heart"></i> Đã lưu'
      : '<i class="far fa-heart"></i> Lưu việc';
    saveBtn.classList.toggle('saved', isSaved);
  }
}

function showSavedJobs() {
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để xem việc đã lưu!', 'error');
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="fas fa-heart"></i> Việc làm đã lưu</h2>
        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
      </div>
      <div class="modal-body">
        <div class="saved-jobs-list">
          ${savedJobs.length === 0 ? `
            <div class="no-saved-jobs">
              <i class="fas fa-heart-broken"></i>
              <h3>Chưa có việc nào được lưu</h3>
              <p>Hãy tìm việc làm phù hợp và lưu lại nhé!</p>
              <button class="btn btn-primary" onclick="this.closest('.modal').remove(); document.querySelector('.nav-link[href=\"jobs.html\"]').click();">
                <i class="fas fa-search"></i> Tìm việc làm
              </button>
            </div>
          ` : `
            <div class="jobs-grid">
              ${savedJobs.map(job => `
                <div class="job-card">
                  <div class="job-header">
                    <h3>${job.title}</h3>
                    <button class="btn btn-outline btn-sm" onclick="unsaveJob(${job.id}); this.closest('.modal').remove(); showSavedJobs();">
                      <i class="fas fa-trash"></i> Bỏ lưu
                    </button>
                  </div>
                  <div class="job-company">${job.company}</div>
                  <div class="job-location">
                    <i class="fas fa-map-marker-alt"></i> ${job.location}
                  </div>
                  <div class="job-salary">
                    <i class="fas fa-money-bill-wave"></i> ${job.salary}
                  </div>
                  <div class="job-actions">
                    <button class="btn btn-primary" onclick="showJobDetails(${job.id}); this.closest('.modal').remove();">
                      <i class="fas fa-eye"></i> Xem chi tiết
                    </button>
                    <button class="btn btn-outline" onclick="applyForJob(${job.id})">
                      <i class="fas fa-paper-plane"></i> Ứng tuyển
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

async function getCurrentUser() {
  try {
    const response = await apiRequest('/auth/me');
    if (response.success) {
      currentUser = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.error('Get current user error:', error);
    logout();
  }
}

// Job Functions
async function fetchJobs(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await apiRequest(`/jobs?${queryParams.toString()}`);
    
    if (response.success) {
      currentJobs = response.data.jobs;
      return response.data;
    }
  } catch (error) {
    console.error('Fetch jobs error:', error);
    // Fallback to sample data if API fails
    console.log('Falling back to sample data...');
    let filteredJobs = [...sampleJobs];
    
    // Apply filters to sample data
    if (filters.category && filters.category !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.category === filters.category);
    }
    
    if (filters.location && filters.location !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
      );
    }
    
    currentJobs = filteredJobs;
    return {
      jobs: filteredJobs,
      total: filteredJobs.length,
      page: 1,
      totalPages: 1
    };
  }
}

async function fetchJobById(id) {
  try {
    const response = await apiRequest(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch job error:', error);
    // Fallback to sample data
    const job = sampleJobs.find(job => job.id === parseInt(id));
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  }
}

async function applyForJob(jobId, coverLetter = '', resumeUrl = '') {
  try {
    const response = await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({
        job_id: jobId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
      }),
    });
    return response;
  } catch (error) {
    console.error('Apply for job error:', error);
    throw error;
  }
}

async function getUserApplications() {
  try {
    const response = await apiRequest('/applications/my-applications');
    return response.data;
  } catch (error) {
    console.error('Get applications error:', error);
    throw error;
  }
}

// UI Update Functions
function updateAuthUI() {
  const navButtons = document.querySelector('.nav-buttons');
  if (!navButtons) return;
  
  if (currentUser) {
    navButtons.innerHTML = `
      <div class="user-menu">
        <div class="user-info">
          <i class="fas fa-user-circle"></i>
          <span class="user-name">${currentUser.name}</span>
        </div>
        <div class="user-actions">
          <button class="btn btn-outline" onclick="showUserProfile()">
            <i class="fas fa-user"></i> Hồ sơ
          </button>
          <button class="btn btn-outline" onclick="showSavedJobs()">
            <i class="fas fa-heart"></i> Việc đã lưu
          </button>
          <button class="btn btn-outline" onclick="showMyApplications()">
            <i class="fas fa-file-alt"></i> Đơn ứng tuyển
          </button>
          <button class="btn btn-outline" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </div>
    `;
  } else {
    navButtons.innerHTML = `
      <button class="btn btn-outline" onclick="showLoginModal()">
        <i class="fas fa-sign-in-alt"></i> Đăng nhập
      </button>
      <button class="btn btn-primary" onclick="showRegisterModal()">
        <i class="fas fa-user-plus"></i> Đăng ký
      </button>
    `;
  }
}

async function renderJobs(jobs) {
  const jobsGrid = document.querySelector('.jobs-grid');
  if (!jobsGrid) return;

  if (jobs.length === 0) {
    jobsGrid.innerHTML = `
      <div class="no-jobs">
        <i class="fas fa-search"></i>
        <h3>Không tìm thấy việc làm</h3>
        <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    `;
    return;
  }

  jobsGrid.innerHTML = jobs.map(job => {
    const isSaved = savedJobs.some(saved => saved.id === job.id);
    return `
      <div class="job-card" data-category="${job.category}" data-job-id="${job.id}">
        <div class="job-header">
          <div class="job-company">
            <img src="${job.company_logo || 'https://via.placeholder.com/40'}" alt="Company" class="company-logo">
            <div class="company-info">
              <h3>${job.company_name}</h3>
              <p>${job.location}</p>
            </div>
          </div>
          <div class="job-header-actions">
            <span class="job-type">${job.job_type}</span>
            <button class="save-job-btn ${isSaved ? 'saved' : ''}" onclick="saveJob(${job.id})">
              <i class="fas fa-heart"></i> ${isSaved ? 'Đã lưu' : 'Lưu việc'}
            </button>
          </div>
        </div>
        <div class="job-content">
          <h4>${job.title}</h4>
          <p>${job.description.substring(0, 100)}...</p>
          <div class="job-details">
            <span><i class="fas fa-money-bill"></i> ${formatSalary(job.salary_min, job.salary_max, job.salary_type)}</span>
            <span><i class="fas fa-clock"></i> ${job.work_schedule || 'Linh hoạt'}</span>
            <span><i class="fas fa-calendar"></i> ${job.is_remote ? 'Remote' : 'Tại văn phòng'}</span>
          </div>
        </div>
        <div class="job-footer">
          <button class="btn btn-primary" onclick="applyForJob(${job.id})">Ứng tuyển</button>
          <button class="btn btn-outline" onclick="viewJobDetails(${job.id})">Chi tiết</button>
        </div>
      </div>
    `;
  }).join('');
}

function formatSalary(min, max, type) {
  if (!min && !max) return 'Thỏa thuận';
  
  const formatNumber = (num) => num.toLocaleString('vi-VN');
  
  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)}đ/${type === 'hourly' ? 'giờ' : type === 'daily' ? 'ngày' : 'tháng'}`;
  } else if (min) {
    return `Từ ${formatNumber(min)}đ/${type === 'hourly' ? 'giờ' : type === 'daily' ? 'ngày' : 'tháng'}`;
  } else {
    return `${formatNumber(max)}đ/${type === 'hourly' ? 'giờ' : type === 'daily' ? 'ngày' : 'tháng'}`;
  }
}

// Updated Modal Functions
async function showLoginModal() {
  loginModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

async function showRegisterModal() {
  registerModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Updated Form Handlers
async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    await login(email, password);
    showNotification('Đăng nhập thành công!', 'success');
    hideModals();
    updateAuthUI();
    event.target.reset();
  } catch (error) {
    showNotification(error.message || 'Đăng nhập thất bại', 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    university: formData.get('university'),
    major: formData.get('major'),
    year_of_study: formData.get('year_of_study') ? parseInt(formData.get('year_of_study')) : null
  };

  try {
    await register(userData);
    showNotification('Đăng ký thành công!', 'success');
    hideModals();
    updateAuthUI();
    event.target.reset();
  } catch (error) {
    showNotification(error.message || 'Đăng ký thất bại', 'error');
  }
}

// Updated Job Application
async function applyForJob(jobId) {
  if (!currentUser) {
    showNotification('Vui lòng đăng nhập để ứng tuyển', 'error');
    showLoginModal();
    return;
  }

  try {
    const response = await applyForJob(jobId);
    showNotification('Ứng tuyển thành công!', 'success');
  } catch (error) {
    showNotification(error.message || 'Ứng tuyển thất bại', 'error');
  }
}

async function viewJobDetails(jobId) {
  try {
    const job = await fetchJobById(jobId);
    // Show job details modal or navigate to detail page
    showJobDetailsModal(job);
  } catch (error) {
    showNotification('Không thể tải thông tin việc làm', 'error');
  }
}

function showJobDetailsModal(job) {
  // Create and show job details modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content job-details-modal">
      <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
      <div class="job-detail-header">
        <h2>${job.title}</h2>
        <div class="company-info">
          <img src="${job.company_logo || 'https://via.placeholder.com/60'}" alt="Company" class="company-logo">
          <div>
            <h3>${job.company_name}</h3>
            <p>${job.location}</p>
          </div>
        </div>
      </div>
      <div class="job-detail-content">
        <div class="job-info">
          <h3>Thông tin việc làm</h3>
          <p><strong>Mô tả:</strong> ${job.description}</p>
          ${job.requirements ? `<p><strong>Yêu cầu:</strong> ${job.requirements}</p>` : ''}
          ${job.benefits ? `<p><strong>Quyền lợi:</strong> ${job.benefits}</p>` : ''}
          <p><strong>Lương:</strong> ${formatSalary(job.salary_min, job.salary_max, job.salary_type)}</p>
          <p><strong>Loại việc:</strong> ${job.job_type}</p>
          <p><strong>Lịch làm việc:</strong> ${job.work_schedule || 'Linh hoạt'}</p>
        </div>
      </div>
      <div class="job-detail-footer">
        <button class="btn btn-primary" onclick="applyForJob(${job.id}); this.closest('.modal').remove()">Ứng tuyển ngay</button>
        <button class="btn btn-outline" onclick="this.closest('.modal').remove()">Đóng</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Updated Filter Functions
async function applyFilters() {
  try {
    const data = await fetchJobs(currentFilters);
    await renderJobs(data.jobs);
  } catch (error) {
    showNotification('Không thể tải danh sách việc làm', 'error');
  }
}

// Initialize App
async function initializeApp() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      currentUser = JSON.parse(user);
      await getCurrentUser(); // Verify token is still valid
    } catch (error) {
      logout();
    }
  }
  
  updateAuthUI();
  
  // Load initial jobs
  try {
    const data = await fetchJobs();
    await renderJobs(data.jobs);
  } catch (error) {
    console.error('Failed to load jobs:', error);
  }
}

// Job detail functions
function showJobDetails(jobId) {
    const job = sampleJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const modal = document.getElementById('jobDetailModal');
    const content = document.getElementById('jobDetailContent');
    
    if (modal && content) {
        content.innerHTML = `
            <div class="job-detail-header">
                <h2 class="job-detail-title">${job.title}</h2>
                <p class="job-detail-company">${job.company}</p>
                <div class="job-detail-meta">
                    <div class="job-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>${job.salary}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${job.type}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>Đăng: ${job.postedDate}</span>
                    </div>
                </div>
            </div>
            
            <div class="job-detail-content">
                <div class="job-detail-section">
                    <h3>Mô tả công việc</h3>
                    <p>${job.description}</p>
                </div>
                
                <div class="job-detail-section">
                    <h3>Yêu cầu</h3>
                    <div class="job-requirements">
                        <ul>
                            ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="job-detail-section">
                    <h3>Quyền lợi</h3>
                    <div class="job-requirements">
                        <ul>
                            ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="job-apply-section">
                <div class="job-salary">${job.salary}</div>
                <p>Hạn nộp hồ sơ: ${job.deadline}</p>
                <button class="btn btn-primary btn-large" onclick="applyForJob(${job.id})">
                    <i class="fas fa-paper-plane"></i> Ứng tuyển ngay
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

function searchJobs() {
    const searchTerm = document.getElementById('jobSearchInput')?.value || '';
    const location = document.getElementById('locationFilter')?.value || '';
    const salary = document.getElementById('salaryFilter')?.value || '';
    const time = document.getElementById('timeFilter')?.value || '';
    
    let filteredJobs = sampleJobs;
    
    if (searchTerm) {
        filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (location) {
        filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    renderJobs(filteredJobs);
}

function loadMoreJobs() {
    // Simulate loading more jobs
    const moreJobs = [
        {
            id: 4,
            title: "Nhân viên bán hàng",
            company: "Shopee Vietnam",
            location: "TP.HCM",
            salary: "25k-40k/h",
            type: "Part-time",
            category: "retail",
            description: "Tìm nhân viên bán hàng part-time tại cửa hàng Shopee.",
            requirements: ["Sinh viên", "Giao tiếp tốt", "Nhiệt tình"],
            benefits: ["Lương cạnh tranh", "Môi trường năng động"],
            postedDate: "2024-01-12",
            deadline: "2024-02-12"
        }
    ];
    
    currentJobs = [...currentJobs, ...moreJobs];
    renderJobs(currentJobs);
}

function renderJobs(jobs) {
    const jobsGrid = document.getElementById('jobsGrid');
    if (!jobsGrid) return;
    
    currentJobs = jobs;
    
    jobsGrid.innerHTML = jobs.map(job => `
        <div class="job-card">
            <div class="job-header">
                <h3 class="job-title">${job.title}</h3>
                <span class="job-type">${job.type}</span>
            </div>
            <div class="job-company">${job.company}</div>
            <div class="job-details">
                <div class="job-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${job.salary}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-clock"></i>
                    <span>${job.postedDate}</span>
                </div>
            </div>
            <div class="job-description">
                ${job.description}
            </div>
            <div class="job-footer">
                <button class="btn btn-outline" onclick="showJobDetails(${job.id})">
                    <i class="fas fa-eye"></i> Xem chi tiết
                </button>
                <button class="btn btn-primary" onclick="applyForJob(${job.id})">
                    <i class="fas fa-paper-plane"></i> Ứng tuyển
                </button>
            </div>
        </div>
    `).join('');
    
    // Update jobs count
    const jobsCount = document.getElementById('jobsCount');
    if (jobsCount) {
        jobsCount.textContent = jobs.length;
    }
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

// Company registration
function showCompanyRegistration() {
    const modal = document.getElementById('companyRegistrationModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Company jobs
function viewCompanyJobs(companyId) {
    // Filter jobs by company
    const companyJobs = sampleJobs.filter(job => 
        job.company.toLowerCase().includes(companyId.toLowerCase())
    );
    
    if (companyJobs.length > 0) {
        renderJobs(companyJobs);
        // Scroll to jobs section
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Export functions for global access
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.scrollToJobs = scrollToJobs;
window.applyForJob = applyForJob;
window.viewJobDetails = viewJobDetails;
window.logout = logout;
window.showJobDetails = showJobDetails;
window.searchJobs = searchJobs;
window.loadMoreJobs = loadMoreJobs;
window.showCompanyRegistration = showCompanyRegistration;
window.viewCompanyJobs = viewCompanyJobs;
window.showUserProfile = showUserProfile;
window.showMyApplications = showMyApplications;
window.editProfile = editProfile;
window.saveJob = saveJob;
window.unsaveJob = unsaveJob;
window.showSavedJobs = showSavedJobs;
