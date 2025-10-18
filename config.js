require('dotenv').config();

module.exports = {
  database: {
    filename: process.env.DB_FILENAME || 'studentjobs.db',
    // SQLite configuration
    options: {
      verbose: console.log
    }
  },
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: '24h'
  },
  upload: {
    path: process.env.UPLOAD_PATH || 'uploads/',
    maxFileSize: process.env.MAX_FILE_SIZE || 5242880 // 5MB
  }
};