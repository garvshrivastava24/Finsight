const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, updateBudget, getBudgetProgress } = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/:id')
  .put(updateBudget);

router.route('/progress/:year/:month')
  .get(getBudgetProgress);

module.exports = router;
