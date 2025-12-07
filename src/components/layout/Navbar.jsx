// Create: src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">$</span>
              </div>
              <span className="font-bold text-gray-800 text-xl">BudgetAI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Dashboard
                </Link>
                
                {user.user_metadata?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/guest" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Guest Demo
                </Link>
                <Link to="/login" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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