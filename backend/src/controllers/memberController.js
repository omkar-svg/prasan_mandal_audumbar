const { Member, Donation } = require('../models');

const getMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{ model: Donation }]
    });
    // Format to include donation status easily for frontend
    const formattedMembers = members.map(m => {
      const donationAmount = m.Donations.reduce((sum, d) => sum + d.amount, 0);
      return {
        id: m.id,
        name: m.name,
        mobile: m.mobile,
        role: m.role,
        donationAmount,
        donated: donationAmount > 0,
        createdAt: m.createdAt
      };
    });
    res.json(formattedMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, mobile, role } = req.body;
    const newMember = await Member.create({ name, mobile, role: role || 'normal' });
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: 'Error creating member', error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, role } = req.body;
    await Member.update({ name, mobile, role }, { where: { id } });
    const updatedMember = await Member.findByPk(id);
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Error updating member', error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Member.destroy({ where: { id } });
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting member', error: error.message });
  }
};

module.exports = { getMembers, createMember, updateMember, deleteMember };
