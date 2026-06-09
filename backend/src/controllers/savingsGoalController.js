const savingsGoalService = require('../services/savingsGoalService');

// @desc    Get user savings goals
// @route   GET /api/savings-goals
// @access  Private
const getSavingsGoals = async (req, res, next) => {
  try {
    const goals = await savingsGoalService.getSavingsGoals(req.user._id);
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a savings goal
// @route   POST /api/savings-goals
// @access  Private
const createSavingsGoal = async (req, res, next) => {
  try {
    const goal = await savingsGoalService.createSavingsGoal(req.user._id, req.body);
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a savings goal
// @route   PUT /api/savings-goals/:id
// @access  Private
const updateSavingsGoal = async (req, res, next) => {
  try {
    const goal = await savingsGoalService.updateSavingsGoal(req.params.id, req.user._id, req.body);
    res.json(goal);
  } catch (error) {
    if (error.message === 'Savings goal not found or unauthorized') {
      res.status(404);
    }
    next(error);
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/savings-goals/:id
// @access  Private
const deleteSavingsGoal = async (req, res, next) => {
  try {
    const result = await savingsGoalService.deleteSavingsGoal(req.params.id, req.user._id);
    res.json({ message: 'Savings goal removed', id: result.id });
  } catch (error) {
    if (error.message === 'Savings goal not found or unauthorized') {
      res.status(404);
    }
    next(error);
  }
};

module.exports = {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal
};
