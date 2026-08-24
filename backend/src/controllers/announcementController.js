const { Announcement } = require('../models');

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const newAnnouncement = await Announcement.create({ title, message });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;
    await Announcement.update({ title, message }, { where: { id } });
    const updatedAnnouncement = await Announcement.findByPk(id);
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.destroy({ where: { id } });
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
