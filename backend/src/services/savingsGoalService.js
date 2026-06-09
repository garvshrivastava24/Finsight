const SavingsGoal = require('../models/SavingsGoal');

const getSavingsGoals = async (userId) => {
  return await SavingsGoal.find({ userId }).sort({ createdAt: -1 });
};

const createSavingsGoal = async (userId, data) => {
  return await SavingsGoal.create({
    userId,
    ...data
  });
};

const updateSavingsGoal = async (id, userId, data) => {
  const goal = await SavingsGoal.findById(id);
  
  if (!goal || goal.userId.toString() !== userId.toString()) {
    throw new Error('Savings goal not found or unauthorized');
  }

  return await SavingsGoal.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteSavingsGoal = async (id, userId) => {
  const goal = await SavingsGoal.findById(id);
  
  if (!goal || goal.userId.toString() !== userId.toString()) {
    throw new Error('Savings goal not found or unauthorized');
  }

  await goal.deleteOne();
  return { id };
};

module.exports = {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal
};
