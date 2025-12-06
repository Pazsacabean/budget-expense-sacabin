import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext'; // ✅ Fixed path

export default function Navbar() {
  const { user, signOut } = useAuth();
  const userRole = user?.user_metadata?.role || 'guest';

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">$</span>
              </div>
              <span className="text-xl font-bold text-gray-800">BudgetAI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600 text-sm">
                  Welcome, <span className="font-semibold">{user.email}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userRole === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userRole}
                </span>
                
                {userRole === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/guest" className="text-gray-700 hover:text-blue-600">
                  Demo
                </Link>
                <Link to="/login" className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}