import { useState } from 'react';
import { UserDashboardNav } from '../../components/user/UserDashboardNav';
import { useTransaction } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const TransactionsPage = () => {
  const { userTransactions } = useTransaction();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Redirect if not authenticated or if admin
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...userTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter transactions based on selected filter
  const filteredTransactions = sortedTransactions.filter((transaction) => {
    if (filter === 'all') return true;
    if (filter === 'deposits' && transaction.type === 'deposit') return true;
    if (filter === 'withdrawals' && transaction.type === 'withdrawal') return true;
    if (filter === 'transfers' && transaction.type === 'transfer') return true;
    if (filter === 'received' && (transaction.type === 'receive' ||
       (transaction.type === 'transfer' && transaction.recipientId === user?.id))) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <UserDashboardNav />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Transaction History</h1>

          <div className="flex space-x-2">
            <label htmlFor="filter" className="mr-2 text-gray-700 self-center">
              Filter:
            </label>
            <select
              id="filter"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="deposits">Deposits</option>
              <option value="withdrawals">Withdrawals</option>
              <option value="transfers">Transfers</option>
              <option value="received">Received</option>
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => {
                    const isIncoming =
                      transaction.type === 'deposit' ||
                      transaction.type === 'receive' ||
                      (transaction.type === 'transfer' && transaction.recipientId === user?.id);

                    return (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {transaction.type}
                          {transaction.type === 'transfer' &&
                            (transaction.userId === user?.id ? ' (Sent)' : ' (Received)')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                            isIncoming ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isIncoming ? '+' : '-'}${transaction.amount.toFixed(2)}
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
