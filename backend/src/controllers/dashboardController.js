const { Member, Officer, Donation, Announcement, Expense } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await Member.count();
    const totalOfficers = await Officer.count();
    
    // To find out how many members donated, we can count distinct memberIds in Donations
    const donatedMembersCount = await Donation.count({ distinct: true, col: 'memberId' });
    const notDonatedMembersCount = totalMembers - donatedMembersCount;

    let dashboardData = {
      totalMembers,
      totalOfficers,
      donatedMembersCount,
      notDonatedMembersCount,
    };

    // If admin, we can also send total donation sum and expenses
    if (req.user && req.user.role === 'admin') {
      const totalDonationSum = await Donation.sum('amount') || 0;
      const totalExpenses = await Expense.sum('amount') || 0;
      const remainingBalance = totalDonationSum - totalExpenses;
      
      dashboardData.totalDonationSum = totalDonationSum;
      dashboardData.totalExpenses = totalExpenses;
      dashboardData.remainingBalance = remainingBalance;
    }

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };
