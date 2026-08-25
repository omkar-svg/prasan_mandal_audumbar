const jwt = require('jsonwebtoken');
const { Member } = require('../models');

const login = async (req, res) => {
  console.log('Login attempt received:', req.body);
  
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  try {
    const member = await Member.findOne({ where: { mobile } });
    if (!member) {
      return res.status(401).json({ message: 'Invalid mobile number' });
    }

    const token = jwt.sign({ id: member.id, role: member.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: member.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login };
