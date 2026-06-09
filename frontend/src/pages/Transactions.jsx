import { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get('/transactions');
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setAmount('');
    setCategory('');
    setDescription('');
    setType('Expense');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: Number(amount),
        type,
        category,
        description
      };
      
      if (isEditing) {
        await API.put(`/transactions/${editingId}`, payload);
      } else {
        await API.post('/transactions', payload);
      }
      
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (tx) => {
    setIsEditing(true);
    setEditingId(tx._id);
    setAmount(tx.amount);
    setType(tx.type);
    setCategory(tx.category);
    setDescription(tx.description || '');
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this?')) {
      try {
        await API.delete(`/transactions/${id}`);
        fetchTransactions();
        if (editingId === id) resetForm();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const categories = type === 'Income' 
    ? ['Salary', 'Freelance', 'Investment', 'Other']
    : ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Other'];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Transactions</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        {/* Add Transaction Form */}
        <div className="glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Add New</h2>
          <form onSubmit={handleSubmit}>
            <select 
              className="input-field" 
              value={type} 
              onChange={(e) => { setType(e.target.value); setCategory(''); }}
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>

            <input 
              type="number" 
              className="input-field" 
              placeholder="Amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />

            <select 
              className="input-field" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input 
              type="text" 
              className="input-field" 
              placeholder="Description (optional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />

            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {isEditing ? 'Update Transaction' : <><Plus size={18} /> Add Transaction</>}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', background: 'transparent', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
            )}
          </form>

          <button 
            onClick={async () => {
              try {
                const response = await API.get('/transactions/export', { responseType: 'blob' });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'transactions.csv');
                document.body.appendChild(link);
                link.click();
              } catch (error) {
                console.error('Export failed', error);
              }
            }}
            style={{ 
              width: '100%', 
              marginTop: '1rem',
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'transparent',
              color: 'var(--text-primary)',
              fontWeight: '500'
            }}
          >
            Export to CSV
          </button>
        </div>

        {/* Transaction List */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{formatDate(tx.date)}</td>
                    <td style={{ padding: '1rem' }}>
                       <span style={{ color: tx.type === 'Income' ? 'var(--success)' : 'var(--danger)' }}>
                        {tx.type}
                       </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{tx.category}</td>
                    <td style={{ padding: '1rem' }}>{tx.description || '-'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatCurrency(tx.amount)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEdit(tx)}
                        style={{ color: 'var(--text-secondary)', background: 'transparent', padding: '0.25rem', borderRadius: '4px' }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tx._id)}
                        style={{ color: 'var(--danger)', background: 'transparent', padding: '0.25rem', borderRadius: '4px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
