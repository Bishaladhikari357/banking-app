import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTransaction } from '../../contexts/TransactionContext';

export const UserDashboardNav = () => {
  const { user, logout } = useAuth();
  const { getUserBalance } = useTransaction();
  const location = useLocation();
  const balance = getUserBalance();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-xl font-bold text-blue-600">Banking App</h1>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="bg-gray-100 px-4 py-2 rounded-md">
              <span className="text-sm text-gray-600">Balance:</span>
              <span className="ml-2 font-bold text-green-600">${balance.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Welcome,</span>
              <span className="ml-1 font-semibold">{user?.username}</span>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap mt-4 border-t pt-2">
          <Link
            to="/dashboard"
            className={`mr-4 py-2 ${
              isActive('/dashboard')
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/deposit"
            className={`mr-4 py-2 ${
              isActive('/dashboard/deposit')
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Deposit
          </Link>
          <Link
            to="/dashboard/withdraw"
            className={`mr-4 py-2 ${
              isActive('/dashboard/withdraw')
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Withdraw
          </Link>
          <Link
            to="/dashboard/transfer"
            className={`mr-4 py-2 ${
              isActive('/dashboard/transfer')
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Transfer
          </Link>
          <Link
            to="/dashboard/transactions"
            className={`mr-4 py-2 ${
              isActive('/dashboard/transactions')
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};
