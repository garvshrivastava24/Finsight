import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import API from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analytics = () => {
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [incomeVsExpense, setIncomeVsExpense] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [breakdownRes, incVsExpRes] = await Promise.all([
          API.get('/analytics/expenses-breakdown'),
          API.get(`/analytics/income-vs-expense/${currentYear}`)
        ]);
        
        setExpenseBreakdown(breakdownRes.data);
        setIncomeVsExpense(incVsExpRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [currentYear]);

  if (loading) return <div>Loading Analytics...</div>;

  const pieData = {
    labels: expenseBreakdown.map(item => item._id),
    datasets: [
      {
        data: expenseBreakdown.map(item => item.total),
        backgroundColor: [
          '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
          '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: incomeVsExpense.map(item => item.income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // success
      },
      {
        label: 'Expense',
        data: incomeVsExpense.map(item => item.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // danger
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { stacked: false },
      y: { stacked: false }
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Pie Chart */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>Expense Breakdown</h2>
          {expenseBreakdown.length > 0 ? (
            <div style={{ maxWidth: '300px', margin: '0 auto' }}>
              <Pie data={pieData} />
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No expense data available.</p>
          )}
        </div>

        {/* Bar Chart */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>Income vs Expense ({currentYear})</h2>
          <Bar data={barData} options={barOptions} />
        </div>

      </div>
    </div>
  );
};

export default Analytics;
