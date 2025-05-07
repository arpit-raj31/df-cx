
exports.insertUser = `
  INSERT INTO users (firstName, userName, email, mobile, password, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, NOW(), NOW())
`;
