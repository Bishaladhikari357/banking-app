import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleUserLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleAdminLoginSuccess = () => {
    navigate('/admin');
  };

  if (isAuthenticated) {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-t-lg">
          <div className="flex">
            <button
              className={`w-1/2 py-3 font-semibold ${
                activeTab === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } rounded-tl-lg transition-colors`}
              onClick={() => setActiveTab('user')}
            >
              User Login
            </button>
            <button
              className={`w-1/2 py-3 font-semibold ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } rounded-tr-lg transition-colors`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Login
            </button>
          </div>
        </div>

        <div className="mt-1">
          {activeTab === 'user' ? (
            <LoginForm userType="user" onLoginSuccess={handleUserLoginSuccess} />
          ) : (
            <LoginForm userType="admin" onLoginSuccess={handleAdminLoginSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};
