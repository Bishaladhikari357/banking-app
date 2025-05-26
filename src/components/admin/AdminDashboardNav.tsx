import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboardNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-purple-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-xl font-bold">Banking App Admin</h1>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="text-sm">
              <span className="text-purple-200">Welcome,</span>
              <span className="ml-1 font-semibold">{user?.username}</span>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap mt-4 border-t border-purple-600 pt-2">
          <Link
            to="/admin"
            className={`mr-6 py-2 ${
              isActive('/admin')
                ? 'text-white border-b-2 border-white font-medium'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`mr-6 py-2 ${
              isActive('/admin/users')
                ? 'text-white border-b-2 border-white font-medium'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Users
          </Link>
          <Link
            to="/admin/transactions"
            className={`mr-6 py-2 ${
              isActive('/admin/transactions')
                ? 'text-white border-b-2 border-white font-medium'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};
