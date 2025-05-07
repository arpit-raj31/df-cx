// db.config.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',         // Your DB host
  user: 'root',              // Your DB username
 // Your DB password
  database: 'tradecfd1'  // Your DB name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = connection;
