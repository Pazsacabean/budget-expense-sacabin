// src/components/BudgetDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from "../lib/supabase";
import { getBudgetSuggestions } from "../lib/gemini";
import { useAuth } from '../lib/context/AuthContext';
import BudgetStats from './BudgetStats';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

export default function BudgetDashboard() {
  const { user } = useAuth();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budgetInput, setBudgetInput] = useState('');
  const [periodType, setPeriodType] = useState('weekly');

  const fetchBudget = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching budget:', error);
      }
      setBudget(data || null);
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const fetchExpenses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!budgetInput || !user) return;

    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const suggestions = await getBudgetSuggestions(amount, periodType);
      setAiSuggestions(suggestions);

      // In BudgetDashboard.jsx - UPDATE the insert block:
const { data, error } = await supabase
  .from('budgets')
  .insert([
    {
      user_id: user.id,
      amount: parseFloat(budgetInput),  // ✅ Store as float
      period_type: periodType,          // ✅ Changed from 'period'
      categories: JSON.stringify({      // ✅ Store as JSON string
        food: suggestions?.food || amount * 0.4,
        transportation: suggestions?.transportation || amount * 0.3,
        other: suggestions?.other || amount * 0.3
      }),
      start_date: new Date().toISOString(),
      end_date: periodType === 'weekly' 
        ? new Date(Date.now() + 7 * 86400000).toISOString()
        : new Date(Date.now() + 30 * 86400000).toISOString(),
      created_at: new Date().toISOString()
    }
  ])
  .select()
  .single();

      if (error) {
        console.error('Error saving budget:', error);
        alert('Failed to save budget. Please try again.');
        return;
      }

      setBudget(data);
      setBudgetInput('');
      alert('Budget set successfully!');
    } catch (error) {
      console.error('Error setting budget:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBudget();
      fetchExpenses();
      setLoading(false);
    }
  }, [user]);

  // ✅ Use `budget?.amount` instead of `budget.total_amount`
  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  const budgetAmount = budget?.amount || 0;
  const remaining = budgetAmount - totalSpent;
  const percentSpent = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Budget Setting Section */}
      <div className="card animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Set Your Budget</h2>
            <p className="text-gray-600 mt-1">
              {budget
                ? `Current ${budget.period} budget: ₱${budget.amount.toFixed(2)}`
                : 'Set your first budget to get started'}
            </p>
          </div>

          {budget && (
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                remaining > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {remaining > 0 ? 'Within Budget' : 'Over Budget'}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSetBudget} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount (₱)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter your budget amount"
                  className="input-field pl-10"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value)}
                className="input-field"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading || !budgetInput}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Setting Budget...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Set Budget
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                const demoAmount = periodType === 'weekly' ? '5000' : '20000';
                setBudgetInput(demoAmount);
              }}
              className="btn-secondary flex-1"
            >
              Try Demo Amount
            </button>
          </div>
        </form>

        {aiSuggestions && (
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-800">AI Budget Suggestions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Food</span>
                  <span className="badge badge-food">40%</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ₱{aiSuggestions.food?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-600 mt-2">Groceries, dining out, snacks</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Transportation</span>
                  <span className="badge badge-transport">30%</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ₱{aiSuggestions.transportation?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-600 mt-2">Commute, fuel, parking, rides</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Others</span>
                  <span className="badge badge-other">30%</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ₱{aiSuggestions.other?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-600 mt-2">Entertainment, shopping, bills</p>
              </div>
            </div>
            {aiSuggestions.tips && (
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">{aiSuggestions.tips}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BudgetStats budget={budget} expenses={expenses} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ExpenseForm onExpenseAdded={fetchExpenses} />
        </div>
        <div className="lg:col-span-2">
          <ExpenseList expenses={expenses} onExpenseDeleted={fetchExpenses} />
        </div>
      </div>
    </div>
  );
}