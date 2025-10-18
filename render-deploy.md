# 🐳 Deploy StudentJobs lên Render

## Cách 1: Deploy từ GitHub

### Bước 1: Truy cập Render
1. Mở: **https://render.com**
2. Đăng nhập bằng GitHub
3. Click **"New +"** → **"Web Service"**

### Bước 2: Connect Repository
1. Chọn repository: **nghianghichcode/webtimviec**
2. Click **"Connect"**

### Bước 3: Cấu hình Service
- **Name**: `studentjobs-web`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run init-db`
- **Start Command**: `npm start`
- **Plan**: Free

### Bước 4: Environment Variables
Thêm trong Render dashboard:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
```

### Bước 5: Deploy
1. Click **"Create Web Service"**
2. Chờ 5-10 phút
3. Nhận link: `https://studentjobs-web.onrender.com`

## Cách 2: Render CLI

### Cài đặt Render CLI
```bash
npm install -g @render/cli
```

### Deploy
```bash
render deploy
```

### Kết quả:
- **Public URL**: `https://your-app-name.onrender.com`
