const parseToCSV = (transactions) => {
  if (!transactions || !transactions.length) {
    return 'Date,Type,Category,Description,Amount\n';
  }

  const header = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = transactions.map(t => {
    const date = new Date(t.date).toISOString().split('T')[0];
    const desc = t.description ? `"${t.description.replace(/"/g, '""')}"` : '';
    return `${date},${t.type},${t.category},${desc},${t.amount}`;
  });

  return [header.join(','), ...rows].join('\n');
};

module.exports = { parseToCSV };
