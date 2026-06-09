const express = require('express');
const router = express.Router();
const { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = require('../controllers/savingsGoalController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSavingsGoals)
  .post(createSavingsGoal);

router.route('/:id')
  .put(updateSavingsGoal)
  .delete(deleteSavingsGoal);

module.exports = router;
