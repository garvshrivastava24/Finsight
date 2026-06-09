const Transaction = require('../models/Transaction');
const MonthlySummary = require('../models/MonthlySummary');

const getDashboardStats = async (userId) => {
  const transactions = await Transaction.find({ userId });
  
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach(t => {
    if (t.type === 'Income') totalIncome += t.amount;
    if (t.type === 'Expense') totalExpenses += t.amount;
  });

  const currentBalance = totalIncome - totalExpenses;

  // Get recent 5 transactions
  const recentTransactions = await Transaction.find({ userId })
    .sort({ date: -1 })
    .limit(5);

  return {
    totalIncome,
    totalExpenses,
    currentBalance,
    recentTransactions
  };
};

const getExpenseCategoryBreakdown = async (userId, month, year) => {
  const match = { userId, type: 'Expense' };
  
  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    match.date = { $gte: startDate, $lte: endDate };
  }

  const breakdown = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);

  return breakdown;
};

const getMonthlyIncomeVsExpense = async (userId, year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const stats = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' }
      }
    }
  ]);

  // Format data for frontend chart
  const formattedStats = Array(12).fill(null).map((_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0
  }));

  stats.forEach(stat => {
    const monthIndex = stat._id.month - 1;
    if (stat._id.type === 'Income') {
      formattedStats[monthIndex].income = stat.total;
    } else {
      formattedStats[monthIndex].expense = stat.total;
    }
  });

  return formattedStats;
};

const generateMonthlySummary = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === 'Income') totalIncome += t.amount;
    if (t.type === 'Expense') totalExpense += t.amount;
  });

  const totalSavings = totalIncome - totalExpense;

  // We can fetch budget to calculate utilization if we want, leaving as 0 for basic summary if budget not set
  let budgetUtilization = 0;
  const Budget = require('../models/Budget');
  const budget = await Budget.findOne({ userId, month, year });
  if (budget && budget.targetAmount > 0) {
    budgetUtilization = (totalExpense / budget.targetAmount) * 100;
  }

  const summary = await MonthlySummary.findOneAndUpdate(
    { userId, month, year },
    { totalIncome, totalExpense, totalSavings, budgetUtilization },
    { new: true, upsert: true }
  );

  return summary;
};

module.exports = {
  getDashboardStats,
  getExpenseCategoryBreakdown,
  getMonthlyIncomeVsExpense,
  generateMonthlySummary
};
