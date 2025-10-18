# 🚀 Deploy StudentJobs lên Vercel để có Link Public

## Cách 1: Deploy trực tiếp từ GitHub

### Bước 1: Truy cập Vercel
1. Mở trình duyệt và truy cập: **https://vercel.com**
2. Đăng nhập bằng GitHub account
3. Click **"New Project"**

### Bước 2: Import Repository
1. Chọn repository: **nghianghichcode/webtimviec**
2. Click **"Import"**

### Bước 3: Cấu hình Project
- **Framework Preset**: Other
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `./` (default)
- **Install Command**: `npm install`

### Bước 4: Environment Variables
Thêm các biến môi trường:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
```

### Bước 5: Deploy
1. Click **"Deploy"**
2. Chờ 2-3 phút
3. Nhận link public: `https://your-app-name.vercel.app`

## Cách 2: Deploy bằng Vercel CLI

### Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Deploy
```bash
vercel
```

### Follow prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Personal
- **Link to existing project?** → No
- **What's your project's name?** → studentjobs-web
- **In which directory is your code located?** → ./

### Kết quả:
- **Preview URL**: `https://studentjobs-web-xxx.vercel.app`
- **Production URL**: `https://studentjobs-web.vercel.app`
