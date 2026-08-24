const jwt = require('jsonwebtoken');

const login = (req, res) => {
  console.log('Login attempt received:', req.body);
  console.log('Expected ADMIN:', process.env.ADMIN_ACCESS_CODE);
  
  const { access_code } = req.body;

  if (!access_code) {
    return res.status(400).json({ message: 'Access code is required' });
  }

  let role = null;
  const safe_access_code = String(access_code).trim();

  if (safe_access_code === String(process.env.ADMIN_ACCESS_CODE).trim()) {
    role = 'admin';
  } else if (safe_access_code === String(process.env.USER_ACCESS_CODE).trim()) {
    role = 'user';
  }

  if (!role) {
    return res.status(401).json({ message: 'Invalid access code' });
  }

  const token = jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, role });
};

module.exports = { login };
