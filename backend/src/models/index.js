const Member = require('./Member');
const Officer = require('./Officer');
const Donation = require('./Donation');
const Announcement = require('./Announcement');
const Expense = require('./Expense');

// Define associations
Member.hasOne(Officer, { foreignKey: 'memberId', onDelete: 'CASCADE' });
Officer.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasMany(Donation, { foreignKey: 'memberId', onDelete: 'CASCADE' });
Donation.belongsTo(Member, { foreignKey: 'memberId' });

module.exports = {
  Member,
  Officer,
  Donation,
  Announcement,
  Expense
};
