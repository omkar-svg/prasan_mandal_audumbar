const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Officer = sequelize.define('Officer', {
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Officer;
