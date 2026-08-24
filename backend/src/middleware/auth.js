const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { role: 'admin' | 'user' }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

const passcodeMiddleware = (req, res, next) => {
  const passcode = req.headers['x-passcode'];
  if (passcode === process.env.ACTION_PASSCODE) {
    next();
  } else {
    res.status(403).json({ message: 'Invalid passcode for this action' });
  }
};

module.exports = { authMiddleware, adminMiddleware, passcodeMiddleware };
