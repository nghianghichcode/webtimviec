const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config');

// Create database connection
const dbPath = path.join(__dirname, '..', config.database.filename);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
  } else {
    console.log('✅ Kết nối SQLite database thành công');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Helper function to run queries with promises
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery
};