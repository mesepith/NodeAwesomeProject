const jwt = require('jsonwebtoken');
const JWT_SECRET = '1901'; // Must match the secret used in authController

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('authHeader', authHeader)
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
    if (!token) return res.status(401).send({ error: 'Token required' });
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  };