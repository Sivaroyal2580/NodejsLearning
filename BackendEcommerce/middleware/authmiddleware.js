const jwt = require('jsonwebtoken');
const secretKey = 'bjsaug54yfdd47'; // Replace with your actual secret key

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, secretKey);
    req.user = user; // Attach user information to the request object
    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authenticateToken, secretKey };
