const insertUser = `INSERT INTO users (firstName, userName, email, mobile, password) VALUES (?, ?, ?, ?, ?)`;

module.exports = {
  insertUser,
};
