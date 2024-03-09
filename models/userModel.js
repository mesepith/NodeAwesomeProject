// models/userModel.js
const db = require('../db'); // Adjust the path based on where you place db.js

const createUser = async (userData) => {
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const [results] = await db.promise().query(query, [userData.name, userData.email, userData.password]);
  return results;
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [results] = await db.promise().query(query, [email]);
  return results[0];
};

module.exports = { createUser, findUserByEmail };
