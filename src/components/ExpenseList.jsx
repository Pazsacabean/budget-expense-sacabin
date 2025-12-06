// src/components/ExpenseList.jsx
import React from 'react';

const categoryColors = {
  food: 'bg-green-100 text-green-800',
  transport: 'bg-blue-100 text-blue-800',
  utilities: 'bg-purple-100 text-purple-800',
  entertainment: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800'
};

export default function ExpenseList({ expenses, onExpenseDeleted }) {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Expenses</h3>
        <p className="text-gray-600">No expenses recorded yet.</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this expense?')) {
      // Mock delete
      alert('Expense deleted (mock)');
      onExpenseDeleted(); // Refresh list
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h3>
      
      <div className="space-y-3">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[expense.category]}`}>
                {expense.category}
              </span>
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-500">
                  {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-bold">₱{parseFloat(expense.amount).toFixed(2)}</span>
              <button 
                onClick={() => handleDelete(expense.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}