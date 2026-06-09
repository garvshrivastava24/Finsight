const express = require('express');
const router = express.Router();
const { getDashboard, getExpenseBreakdown, getIncomeVsExpense, createMonthlySummary } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/expenses-breakdown', getExpenseBreakdown);
router.get('/income-vs-expense/:year', getIncomeVsExpense);
router.post('/monthly-summary', createMonthlySummary);

module.exports = router;
