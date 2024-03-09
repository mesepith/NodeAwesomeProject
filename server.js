const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001; // Use your desired port

app.use(bodyParser.json());

// Setup your MySQL connection
const connection = mysql.createConnection({
  host: 'localhost', // Your MySQL host
  user: 'root', // Your MySQL user
  password: '', // Your MySQL password
  database: 'awesome_projet' // Your MySQL database
});

connection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the database.');
});

// Registration endpoint with bcrypt for password hashing
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10); // 10 rounds is generally considered safe
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    connection.query(query, [name, email, hashedPassword], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ message: 'User registered successfully', userId: results.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log(email);
  
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], async (error, results) => {
      if (error) {
        console.log(1);
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        console.log(2);
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = results[0];
  
      // Compare submitted password with stored hashed password
      const match = await bcrypt.compare(password, user.password);
  
      if (match) {
        console.log(3);
        res.status(200).json({ message: 'Login successful', userId: user.id, name: user.name });
      } else {
        console.log(4);
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
