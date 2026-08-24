const { Officer, Member } = require('../models');

const getOfficers = async (req, res) => {
  try {
    const officers = await Officer.findAll({
      include: [{ model: Member }]
    });
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching officers', error: error.message });
  }
};

const createOfficer = async (req, res) => {
  try {
    const { memberId, position } = req.body;
    const newOfficer = await Officer.create({ memberId, position });
    res.status(201).json(newOfficer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating officer', error: error.message });
  }
};

const updateOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;
    await Officer.update({ position }, { where: { id } });
    const updatedOfficer = await Officer.findByPk(id);
    res.json(updatedOfficer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating officer', error: error.message });
  }
};

const deleteOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    await Officer.destroy({ where: { id } });
    res.json({ message: 'Officer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting officer', error: error.message });
  }
};

module.exports = { getOfficers, createOfficer, updateOfficer, deleteOfficer };
