const transactionService = require('../services/transactionService');
const { parseToCSV } = require('../utils/csvHelper');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getTransactions(req.user._id);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.user._id, req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.user._id, req.body);
    res.json(transaction);
  } catch (error) {
    if (error.message === 'Transaction not found or unauthorized') {
      res.status(404);
    }
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const result = await transactionService.deleteTransaction(req.params.id, req.user._id);
    res.json({ message: 'Transaction removed', id: result.id });
  } catch (error) {
    if (error.message === 'Transaction not found or unauthorized') {
      res.status(404);
    }
    next(error);
  }
};

// @desc    Export transactions to CSV
// @route   GET /api/transactions/export
// @access  Private
const exportTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getTransactions(req.user._id);
    const csv = parseToCSV(transactions);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportTransactions
};
