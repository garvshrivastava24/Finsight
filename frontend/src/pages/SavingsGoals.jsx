import { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Plus, Trash2, Edit2, Target } from 'lucide-react';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');

  const fetchGoals = async () => {
    try {
      const { data } = await API.get('/savings-goals');
      setGoals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0
      };

      if (isEditing) {
        await API.put(`/savings-goals/${editingId}`, payload);
      } else {
        await API.post('/savings-goals', payload);
      }
      
      resetForm();
      fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (goal) => {
    setIsEditing(true);
    setEditingId(goal._id);
    setName(goal.name);
    setTargetAmount(goal.targetAmount);
    setCurrentAmount(goal.currentAmount);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await API.delete(`/savings-goals/${id}`);
        fetchGoals();
        if (editingId === id) resetForm();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Savings Goals</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        {/* Form */}
        <div className="glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            {isEditing ? 'Edit Goal' : 'Add New Goal'}
          </h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Goal Name (e.g. Vacation)" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />

            <input 
              type="number" 
              className="input-field" 
              placeholder="Target Amount" 
              value={targetAmount} 
              onChange={(e) => setTargetAmount(e.target.value)} 
              required 
            />

            <input 
              type="number" 
              className="input-field" 
              placeholder="Current Saved Amount" 
              value={currentAmount} 
              onChange={(e) => setCurrentAmount(e.target.value)} 
            />

            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {isEditing ? 'Update Goal' : <><Plus size={18} /> Add Goal</>}
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
        </div>

        {/* Goals Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignContent: 'start' }}>
          {goals.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No savings goals created yet.</p>
          ) : (
            goals.map((goal) => {
              const progressPercentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              return (
                <div key={goal._id} className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '8px' }}>
                        <Target size={20} />
                      </div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{goal.name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(goal)} style={{ color: 'var(--text-secondary)', background: 'transparent' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(goal._id)} style={{ color: 'var(--danger)', background: 'transparent' }}><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                      <span style={{ fontWeight: '500' }}>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div style={{ 
                      width: '100%', 
                      height: '0.75rem', 
                      backgroundColor: 'var(--bg-secondary)', 
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)'
                    }}>
                      {/* Progress Fill */}
                      <div style={{
                        height: '100%',
                        width: `${progressPercentage}%`,
                        backgroundColor: progressPercentage === 100 ? 'var(--success)' : 'var(--accent-primary)',
                        transition: 'width 0.5s ease-in-out'
                      }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{formatCurrency(goal.currentAmount)}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>of {formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsGoals;
