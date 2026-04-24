const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    // Check if token is in "Bearer <token>" format
    const tokenString = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    
    const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = verified; // { userId, email }
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
