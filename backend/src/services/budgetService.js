const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const getBudgets = async (userId) => {
  return await Budget.find({ userId }).sort({ year: -1, month: -1 });
};

const createBudget = async (userId, data) => {
  const { month, year, targetAmount } = data;
  const existing = await Budget.findOne({ userId, month, year });
  
  if (existing) {
    throw new Error('Budget for this month already exists');
  }

  return await Budget.create({ userId, month, year, targetAmount });
};

const updateBudget = async (id, userId, data) => {
  const budget = await Budget.findById(id);
  
  if (!budget || budget.userId.toString() !== userId.toString()) {
    throw new Error('Budget not found or unauthorized');
  }

  return await Budget.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const getBudgetProgress = async (userId, month, year) => {
  const budget = await Budget.findOne({ userId, month, year });
  if (!budget) {
    return null; // No budget set
  }

  // Calculate expenses for the given month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const expenses = await Transaction.aggregate([
    {
      $match: {
        userId: userId,
        type: 'Expense',
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const spentAmount = expenses.length > 0 ? expenses[0].total : 0;
  const remaining = budget.targetAmount - spentAmount;
  const utilizationPercentage = (spentAmount / budget.targetAmount) * 100;

  return {
    budget,
    spentAmount,
    remaining,
    utilizationPercentage
  };
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  getBudgetProgress
};
