const budgetService = require('../services/budgetService');

// @desc    Get user budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets(req.user._id);
    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.user._id, req.body);
    res.status(201).json(budget);
  } catch (error) {
    if (error.message === 'Budget for this month already exists') {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(req.params.id, req.user._id, req.body);
    res.json(budget);
  } catch (error) {
    if (error.message === 'Budget not found or unauthorized') {
      res.status(404);
    }
    next(error);
  }
};

// @desc    Get budget progress for a specific month
// @route   GET /api/budgets/progress/:year/:month
// @access  Private
const getBudgetProgress = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const progress = await budgetService.getBudgetProgress(req.user._id, parseInt(month), parseInt(year));
    
    if (!progress) {
      return res.status(404).json({ message: 'No budget found for this period' });
    }
    
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  getBudgetProgress
};
