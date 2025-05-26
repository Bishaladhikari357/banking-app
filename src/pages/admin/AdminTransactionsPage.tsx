import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTransaction } from '../../contexts/TransactionContext';
import { useUser } from '../../contexts/UserContext';
import { AdminDashboardNav } from '../../components/admin/AdminDashboardNav';
import { Navigate } from 'react-router-dom';

export const AdminTransactionsPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { allTransactions } = useTransaction();
  const { users } = useUser();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...allTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter transactions based on filter and search text
  const filteredTransactions = sortedTransactions.filter(transaction => {
    // Type filter
    if (filter !== 'all' && transaction.type !== filter) return false;

    // Search filter (by user, description, or amount)
    if (search) {
      const user = users.find(u => u.id === transaction.userId);
      const recipient = users.find(u => u.id === transaction.recipientId);

      const matchesUser = user &&
        (user.username.toLowerCase().includes(search.toLowerCase()) ||
         user.email.toLowerCase().includes(search.toLowerCase()));

      const matchesRecipient = recipient &&
        (recipient.username.toLowerCase().includes(search.toLowerCase()) ||
         recipient.email.toLowerCase().includes(search.toLowerCase()));

      const matchesDescription = transaction.description.toLowerCase().includes(search.toLowerCase());
      const matchesAmount = transaction.amount.toString().includes(search);

      if (!(matchesUser || matchesRecipient || matchesDescription || matchesAmount)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboardNav />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 lg:mb-0">All Transactions</h1>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="transfer">Transfers</option>
              <option value="receive">Received</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => {
                    const user = users.find(u => u.id === transaction.userId);
                    const isIncoming =
                      transaction.type === 'deposit' ||
                      transaction.type === 'receive';

                    return (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()} {' '}
                          {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.username || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === 'deposit'
                              ? 'bg-green-100 text-green-800'
                              : transaction.type === 'withdrawal'
                              ? 'bg-red-100 text-red-800'
                              : transaction.type === 'transfer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.description}
                          {transaction.type === 'transfer' && transaction.recipientName && (
                            <span className="ml-1 text-xs text-gray-400">
                              (to {transaction.recipientName})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span className={isIncoming ? 'text-green-600' : 'text-red-600'}>
                            ${transaction.amount.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
