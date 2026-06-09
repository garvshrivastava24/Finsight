import { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const StatCard = ({ title, amount, icon, type }) => (
  <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(amount)}</h3>
    </div>
    <div style={{ 
      padding: '1rem', 
      borderRadius: '50%', 
      backgroundColor: type === 'income' ? 'rgba(16, 185, 129, 0.1)' : type === 'expense' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
      color: type === 'income' ? 'var(--success)' : type === 'expense' ? 'var(--danger)' : 'var(--accent-primary)'
    }}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/analytics/dashboard');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load stats.</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Current Balance" amount={stats.currentBalance} icon={<DollarSign />} type="balance" />
        <StatCard title="Total Income" amount={stats.totalIncome} icon={<TrendingUp />} type="income" />
        <StatCard title="Total Expenses" amount={stats.totalExpenses} icon={<TrendingDown />} type="expense" />
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Transactions</h2>
        </div>
        
        {stats.recentTransactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No recent transactions.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{formatDate(tx.date)}</td>
                    <td style={{ padding: '1rem' }}>{tx.description || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)'
                      }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'right',
                      fontWeight: '500',
                      color: tx.type === 'Income' ? 'var(--success)' : 'var(--text-primary)'
                    }}>
                      {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
