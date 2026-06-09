const analyticsService = require('../services/analyticsService');

// @desc    Get dashboard summary stats
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const stats = await analyticsService.getDashboardStats(req.user._id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense category breakdown
// @route   GET /api/analytics/expenses-breakdown
// @access  Private
const getExpenseBreakdown = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const breakdown = await analyticsService.getExpenseCategoryBreakdown(
      req.user._id,
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    res.json(breakdown);
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly income vs expense
// @route   GET /api/analytics/income-vs-expense/:year
// @access  Private
const getIncomeVsExpense = async (req, res, next) => {
  try {
    const stats = await analyticsService.getMonthlyIncomeVsExpense(req.user._id, parseInt(req.params.year));
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate and get monthly summary
// @route   POST /api/analytics/monthly-summary
// @access  Private
const createMonthlySummary = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      res.status(400);
      throw new Error('Please provide month and year');
    }
    const summary = await analyticsService.generateMonthlySummary(req.user._id, parseInt(month), parseInt(year));
    res.status(201).json(summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getExpenseBreakdown,
  getIncomeVsExpense,
  createMonthlySummary
};
