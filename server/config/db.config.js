const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost', // or sometimes it's a specific host like 'mysql.hostinger.com'
  user: 'u908694165_prasanna', // replace with your actual DB username
  password: 'Prasanna@123', // replace with your actual DB password
  database: 'u908694165_Tradecfd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
