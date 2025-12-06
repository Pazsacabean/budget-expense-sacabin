// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../lib/context/AuthContext';     // ✅ already fixed
import Chatbot from '../components/Chatbot';              // ✅ already fixed
import BudgetDashboard from '../components/BudgetDashboard'; // ✅ FIXED: removed "/budget"

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your expenses, manage your budget, and get AI-powered financial advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Budget Dashboard */}
          <div className="lg:col-span-2">
            <BudgetDashboard />
          </div>

          {/* Sidebar - Chatbot */}
          <div className="space-y-8">
            {/* Quick Stats Card */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-4">Quick Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Days in Cycle</span>
                  <span className="font-semibold">7</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Avg. Daily Spend</span>
                  <span className="font-semibold">₱714.29</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Savings Rate</span>
                  <span className="font-semibold text-green-600">25%</span>
                </div>
              </div>
            </div>

            {/* AI Chatbot */}
            <div className="sticky top-8">
              <Chatbot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}