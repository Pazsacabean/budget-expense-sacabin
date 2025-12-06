// src/components/BudgetStats.jsx
import React from 'react';

export default function BudgetStats({ budget, expenses }) {
  if (!budget) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget Overview</h3>
        <p className="text-gray-600">Set a budget to see your spending stats.</p>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const budgetAmount = budget.amount; // ✅ use .amount
  const remaining = budgetAmount - totalSpent;
  const percentSpent = (totalSpent / budgetAmount) * 100;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Overview</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Budget</span>
            <span className="font-medium">₱{budgetAmount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                percentSpent > 100 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {percentSpent.toFixed(1)}% used
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-sm text-gray-600">Spent</div>
            <div className="font-bold text-blue-700">₱{totalSpent.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-sm text-gray-600">Remaining</div>
            <div className="font-bold text-green-700">₱{Math.max(0, remaining).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}