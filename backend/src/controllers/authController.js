const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { access_code } = req.body;

  if (!access_code) {
    return res.status(400).json({ message: 'Access code is required' });
  }

  let role = null;

  if (access_code === process.env.ADMIN_ACCESS_CODE) {
    role = 'admin';
  } else if (access_code === process.env.USER_ACCESS_CODE) {
    role = 'user';
  }

  if (!role) {
    return res.status(401).json({ message: 'Invalid access code' });
  }

  const token = jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, role });
};

module.exports = { login };
