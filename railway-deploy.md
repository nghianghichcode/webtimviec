# 🚂 Deploy StudentJobs lên Railway

## Cách 1: Deploy từ GitHub

### Bước 1: Truy cập Railway
1. Mở: **https://railway.app**
2. Đăng nhập bằng GitHub
3. Click **"New Project"**

### Bước 2: Deploy từ GitHub
1. Chọn **"Deploy from GitHub repo"**
2. Chọn repository: **nghianghichcode/webtimviec**
3. Click **"Deploy Now"**

### Bước 3: Cấu hình
- **Build Command**: `npm install && npm run init-db`
- **Start Command**: `npm start`

### Bước 4: Environment Variables
Thêm trong Railway dashboard:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

### Bước 5: Nhận Link Public
- Railway sẽ tự động tạo domain: `https://your-app-name.railway.app`
- Click vào domain để truy cập website

## Cách 2: Railway CLI

### Cài đặt Railway CLI
```bash
npm install -g @railway/cli
```

### Login và Deploy
```bash
railway login
railway init
railway up
```

### Kết quả:
- **Public URL**: `https://your-app-name.railway.app`
