import { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Edit2, Check, X } from 'lucide-react';

const Budgets = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [targetAmount, setTargetAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTargetAmount, setEditTargetAmount] = useState('');
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchBudgetProgress = async () => {
    try {
      const { data } = await API.get(`/budgets/progress/${currentYear}/${currentMonth}`);
      setProgress(data);
    } catch (error) {
      if(error.response?.status === 404) {
        setProgress(null); // No budget yet
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetProgress();
  }, []);

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      await API.post('/budgets', {
        month: currentMonth,
        year: currentYear,
        targetAmount: Number(targetAmount)
      });
      setTargetAmount('');
      fetchBudgetProgress();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/budgets/${progress.budget._id}`, {
        targetAmount: Number(editTargetAmount)
      });
      setIsEditing(false);
      fetchBudgetProgress();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Monthly Budget</h1>

      <div style={{ maxWidth: '600px' }}>
        {!progress ? (
          <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>No budget set for this month.</h3>
            <form onSubmit={handleCreateBudget} style={{ display: 'flex', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
              <input 
                type="number" 
                className="input-field" 
                placeholder="Enter Target Amount" 
                value={targetAmount} 
                onChange={(e) => setTargetAmount(e.target.value)} 
                required 
                style={{ marginBottom: 0 }}
              />
              <button type="submit" className="btn-primary">Set Budget</button>
            </form>
          </div>
        ) : (
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>Budget Utilization</span>
              
              {!isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {formatCurrency(progress.spentAmount)} / {formatCurrency(progress.budget.targetAmount)}
                  </span>
                  <button 
                    onClick={() => { setIsEditing(true); setEditTargetAmount(progress.budget.targetAmount); }}
                    style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateBudget} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{formatCurrency(progress.spentAmount)} / </span>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={editTargetAmount} 
                    onChange={(e) => setEditTargetAmount(e.target.value)} 
                    style={{ marginBottom: 0, padding: '0.25rem 0.5rem', width: '120px' }}
                    required 
                  />
                  <button type="submit" style={{ color: 'var(--success)', background: 'transparent' }}><Check size={20} /></button>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ color: 'var(--danger)', background: 'transparent' }}><X size={20} /></button>
                </form>
              )}
            </div>
            
            {/* Progress Bar Container */}
            <div style={{ 
              width: '100%', 
              height: '1.5rem', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              {/* Progress Fill */}
              <div style={{
                height: '100%',
                width: `${Math.min(progress.utilizationPercentage, 100)}%`,
                backgroundColor: progress.utilizationPercentage > 100 ? 'var(--danger)' : 'var(--accent-primary)',
                transition: 'width 0.5s ease-in-out'
              }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>{progress.utilizationPercentage.toFixed(1)}% Used</span>
              <span>{formatCurrency(Math.max(progress.remaining, 0))} Remaining</span>
            </div>
            
            {progress.utilizationPercentage > 100 && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px' }}>
                Warning: You have exceeded your budget by {formatCurrency(Math.abs(progress.remaining))}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
