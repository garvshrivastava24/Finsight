const Transaction = require('../models/Transaction');

const getTransactions = async (userId) => {
  return await Transaction.find({ userId }).sort({ date: -1 });
};

const getTransactionById = async (id, userId) => {
  const transaction = await Transaction.findById(id);
  if (!transaction || transaction.userId.toString() !== userId.toString()) {
    throw new Error('Transaction not found or unauthorized');
  }
  return transaction;
};

const createTransaction = async (userId, transactionData) => {
  return await Transaction.create({
    userId,
    ...transactionData
  });
};

const updateTransaction = async (id, userId, transactionData) => {
  let transaction = await Transaction.findById(id);
  if (!transaction || transaction.userId.toString() !== userId.toString()) {
    throw new Error('Transaction not found or unauthorized');
  }
  
  transaction = await Transaction.findByIdAndUpdate(id, transactionData, {
    new: true,
    runValidators: true
  });
  return transaction;
};

const deleteTransaction = async (id, userId) => {
  const transaction = await Transaction.findById(id);
  if (!transaction || transaction.userId.toString() !== userId.toString()) {
    throw new Error('Transaction not found or unauthorized');
  }
  
  await transaction.deleteOne();
  return { id };
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
