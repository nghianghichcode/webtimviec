# 🤝 Contributing to StudentJobs

Cảm ơn bạn đã quan tâm đến việc đóng góp cho StudentJobs! Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng.

## 📋 Cách đóng góp

### 🐛 Báo cáo Bug
1. Kiểm tra xem bug đã được báo cáo chưa trong [Issues](https://github.com/yourusername/studentjobs-web/issues)
2. Tạo issue mới với template "Bug Report"
3. Cung cấp thông tin chi tiết:
   - Mô tả bug
   - Steps to reproduce
   - Expected behavior
   - Screenshots (nếu có)
   - Environment info

### ✨ Đề xuất Feature
1. Kiểm tra [Issues](https://github.com/yourusername/studentjobs-web/issues) xem feature đã được đề xuất chưa
2. Tạo issue mới với template "Feature Request"
3. Mô tả chi tiết feature và use case

### 🔧 Code Contribution

#### Setup Development Environment
```bash
# 1. Fork repository
git clone https://github.com/yourusername/studentjobs-web.git
cd studentjobs-web

# 2. Install dependencies
npm install

# 3. Setup database
npm run init-db

# 4. Start development server
npm run dev
```

#### Development Workflow
```bash
# 1. Tạo feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# ... code changes ...

# 3. Test changes
npm test

# 4. Commit changes
git add .
git commit -m "feat: add your feature description"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Create Pull Request
```

## 📝 Code Style Guidelines

### JavaScript/Node.js
- Sử dụng ES6+ syntax
- 2 spaces indentation
- Semicolons required
- Use const/let instead of var
- Async/await preferred over promises

```javascript
// ✅ Good
const getUser = async (id) => {
  try {
    const user = await db.getUser(id);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// ❌ Bad
function getUser(id) {
  return db.getUser(id).then(user => {
    return user;
  });
}
```

### CSS
- Use BEM methodology
- Mobile-first responsive design
- Use CSS custom properties
- Avoid !important

```css
/* ✅ Good */
.job-card {
  padding: 1rem;
  border-radius: 8px;
  background: var(--color-white);
}

.job-card__title {
  font-size: 1.2rem;
  font-weight: 600;
}

/* ❌ Bad */
.job-card {
  padding: 1rem !important;
  background: white;
}
```

### HTML
- Semantic HTML5 elements
- Accessibility attributes
- SEO-friendly structure

```html
<!-- ✅ Good -->
<main class="jobs-section">
  <h2 class="section-title">Việc làm hot</h2>
  <div class="jobs-grid" role="list">
    <article class="job-card" role="listitem">
      <h3 class="job-card__title">Barista</h3>
    </article>
  </div>
</main>

<!-- ❌ Bad -->
<div class="jobs">
  <div class="title">Việc làm hot</div>
  <div class="grid">
    <div class="card">
      <div class="title">Barista</div>
    </div>
  </div>
</div>
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📚 Documentation

### API Documentation
- Sử dụng JSDoc cho functions
- Cập nhật README.md khi thay đổi API
- Thêm examples cho endpoints mới

```javascript
/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User object
 * @throws {Error} When user not found
 */
const getUserById = async (id) => {
  // implementation
};
```

### Code Comments
- Comment cho complex logic
- Explain "why" not "what"
- Use Vietnamese for business logic comments

```javascript
// Kiểm tra xem user đã ứng tuyển job này chưa
// để tránh duplicate applications
const existingApplication = await getQuery(
  'SELECT id FROM applications WHERE user_id = ? AND job_id = ?',
  [user_id, job_id]
);
```

## 🔍 Pull Request Guidelines

### PR Template
```markdown
## 📝 Description
Mô tả ngắn gọn về thay đổi

## 🔗 Related Issues
Fixes #123

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## 📸 Screenshots (nếu có)
![Screenshot](url)

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process
1. **Automated Checks**: CI/CD pipeline
2. **Code Review**: 2+ reviewers required
3. **Testing**: All tests must pass
4. **Documentation**: Update docs if needed

## 🏷️ Commit Message Convention

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add JWT token refresh
fix(jobs): resolve pagination issue
docs(api): update authentication endpoints
style(ui): improve mobile responsiveness
refactor(db): optimize job queries
test(auth): add login test cases
chore(deps): update dependencies
```

## 🚀 Release Process

### Version Numbering
Sử dụng [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared

## 🎯 Areas for Contribution

### 🐛 Bug Fixes
- Performance issues
- UI/UX problems
- API errors
- Database queries

### ✨ New Features
- Advanced search filters
- Job recommendations
- Company profiles
- Mobile app features

### 📚 Documentation
- API documentation
- User guides
- Developer tutorials
- Code examples

### 🧪 Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

### 🎨 UI/UX
- Design improvements
- Accessibility enhancements
- Mobile optimization
- User experience

## 💡 Ideas for Contribution

### Beginner Friendly
- Fix typos in documentation
- Add unit tests
- Improve error messages
- Add loading states

### Intermediate
- Implement new API endpoints
- Add new UI components
- Optimize database queries
- Add form validation

### Advanced
- Implement real-time features
- Add caching layer
- Optimize performance
- Add monitoring

## 📞 Getting Help

- **Discord**: [Join our Discord](https://discord.gg/studentjobs)
- **Email**: dev@studentjobs.vn
- **GitHub Discussions**: [Discussions](https://github.com/yourusername/studentjobs-web/discussions)
- **Issues**: [GitHub Issues](https://github.com/yourusername/studentjobs-web/issues)

## 🏆 Recognition

Contributors sẽ được:
- ✅ Listed in CONTRIBUTORS.md
- ✅ Mentioned in release notes
- ✅ Receive contributor badge
- ✅ Invited to core team (outstanding contributions)

## 📄 License

Bằng cách đóng góp, bạn đồng ý rằng đóng góp của bạn sẽ được cấp phép dưới [MIT License](LICENSE).

---

**Cảm ơn bạn đã đóng góp cho StudentJobs!** 🙏

*Together, we're building the future of student employment!* 🚀
