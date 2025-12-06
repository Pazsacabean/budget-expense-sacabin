// src/pages/Guest.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot'; // ✅ FIXED: removed "/chat"

export default function Guest() {
  const [demoBudget, setDemoBudget] = useState(5000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Smart Budgeting System
          </h1>
          <p className="text-gray-600 mb-8">
            Try our AI-powered budgeting assistant. Sign up for full features!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Sign Up Free
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold border"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Demo Features</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">Try Budget Suggestion (₱)</label>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="500"
                    value={demoBudget}
                    onChange={(e) => setDemoBudget(e.target.value)}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold my-4">₱{demoBudget}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded">
                    <div className="font-bold">Food</div>
                    <div>₱{(demoBudget * 0.4).toFixed(0)}</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="font-bold">Transport</div>
                    <div>₱{(demoBudget * 0.3).toFixed(0)}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <div className="font-bold">Others</div>
                    <div>₱{(demoBudget * 0.3).toFixed(0)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Full System Features</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  AI-Powered Budget Suggestions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Expense Tracking & Analytics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Multi-turn AI Conversations
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Role-Based Access Control
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Budget Reminders & Reports
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-semibold">Try AI Assistant</h2>
              <p className="text-gray-600">Ask general budgeting questions (Guest Mode)</p>
            </div>
            <div className="p-4">
              <Chatbot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}