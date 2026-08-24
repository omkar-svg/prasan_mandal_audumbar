const { Donation, Member } = require('../models');

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      include: [{ model: Member }]
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

const createDonation = async (req, res) => {
  try {
    const { memberId, amount } = req.body;
    const newDonation = await Donation.create({ memberId, amount });
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error: error.message });
  }
};

const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    await Donation.update({ amount }, { where: { id } });
    const updatedDonation = await Donation.findByPk(id);
    res.json(updatedDonation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating donation', error: error.message });
  }
};

const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await Donation.destroy({ where: { id } });
    res.json({ message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting donation', error: error.message });
  }
};

module.exports = { getDonations, createDonation, updateDonation, deleteDonation };
