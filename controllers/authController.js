// controllers/authController.js
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const results = await createUser({ ...req.body, password: hashedPassword });
    console.log('results.insertId : ', results.insertId);
    res.status(201).json({ message: 'User created', userId: results.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).json({ message: 'Login successful', userId: user.id, name: user.name });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
