// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, budgets: 0, expenses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch all users (public.users + email from auth)
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, email, role, created_at')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        // Fetch counts
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const { count: budgetCount } = await supabase
          .from('budgets')
          .select('*', { count: 'exact', head: true });

        const { count: expenseCount } = await supabase
          .from('expenses')
          .select('*', { count: 'exact', head: true });

        setUsers(usersData || []);
        setStats({
          totalUsers: userCount || 0,
          budgets: budgetCount || 0,
          expenses: expenseCount || 0
        });
      } catch (error) {
        console.error('Admin fetch error:', error);
        alert('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.budgets}</div>
            <div className="text-gray-600">Active Budgets</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-purple-600">{stats.expenses}</div>
            <div className="text-gray-600">Total Expenses</div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Insights */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6">
          <h2 className="font-bold text-lg text-blue-800 mb-1">
            💡 Gemini AI Insight (Admin Mode)
          </h2>
          <p className="text-blue-700">
            "System analytics: {stats.totalUsers} users, {stats.expenses} expenses logged. 
            Consider sending budget reminders to users with 80%+ budget usage."
          </p>
        </div>
      </div>
    </div>
  );
}