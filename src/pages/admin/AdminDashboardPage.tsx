import { useAuth } from '../../contexts/AuthContext';
import { useTransaction } from '../../contexts/TransactionContext';
import { useUser } from '../../contexts/UserContext';
import { AdminDashboardNav } from '../../components/admin/AdminDashboardNav';
import { Navigate } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { allTransactions } = useTransaction();
  const { users } = useUser();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Get counts and statistics
  const userCount = users.filter(u => u.role === 'user').length;
  const transactionCount = allTransactions.length;

  // Calculate transaction totals by type
  const depositTotal = allTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const withdrawalTotal = allTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const transferTotal = allTransactions
    .filter(t => t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  // Get recent transactions
  const recentTransactions = [...allTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboardNav />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h2 className="text-sm text-gray-500 mb-1">Total Users</h2>
            <p className="text-2xl font-bold">{userCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h2 className="text-sm text-gray-500 mb-1">Total Transactions</h2>
            <p className="text-2xl font-bold">{transactionCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h2 className="text-sm text-gray-500 mb-1">Total Deposits</h2>
            <p className="text-2xl font-bold">${depositTotal.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h2 className="text-sm text-gray-500 mb-1">Total Withdrawals</h2>
            <p className="text-2xl font-bold">${withdrawalTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <a
                href="/admin/transactions"
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                View All
              </a>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2 text-gray-600 text-xs">Date</th>
                      <th className="pb-2 text-gray-600 text-xs">User</th>
                      <th className="pb-2 text-gray-600 text-xs">Type</th>
                      <th className="pb-2 text-gray-600 text-xs text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => {
                      const user = users.find(u => u.id === transaction.userId);
                      return (
                        <tr key={transaction.id} className="border-t">
                          <td className="py-3 text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-sm">
                            {user?.username || 'Unknown'}
                          </td>
                          <td className="py-3 text-sm capitalize">
                            {transaction.type}
                          </td>
                          <td
                            className={`py-3 text-sm text-right font-medium ${
                              transaction.type === 'deposit' || transaction.type === 'receive'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            ${transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">System Overview</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-gray-700 font-medium mb-2">Transaction Distribution</h3>
                <div className="flex mt-2">
                  <div
                    className="bg-green-500 h-4 rounded-l"
                    style={{
                      width: `${depositTotal ? (depositTotal / (depositTotal + withdrawalTotal + transferTotal)) * 100 : 0}%`
                    }}
                    title={`Deposits: $${depositTotal.toFixed(2)}`}
                  />
                  <div
                    className="bg-red-500 h-4"
                    style={{
                      width: `${withdrawalTotal ? (withdrawalTotal / (depositTotal + withdrawalTotal + transferTotal)) * 100 : 0}%`
                    }}
                    title={`Withdrawals: $${withdrawalTotal.toFixed(2)}`}
                  />
                  <div
                    className="bg-blue-500 h-4 rounded-r"
                    style={{
                      width: `${transferTotal ? (transferTotal / (depositTotal + withdrawalTotal + transferTotal)) * 100 : 0}%`
                    }}
                    title={`Transfers: $${transferTotal.toFixed(2)}`}
                  />
                </div>
                <div className="flex text-xs mt-2 text-gray-600 justify-between">
                  <span>Deposits</span>
                  <span>Withdrawals</span>
                  <span>Transfers</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-gray-700 font-medium mb-2">System Stats</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Average Transaction Amount:</span>
                    <span className="font-medium">
                      ${allTransactions.length > 0
                        ? (allTransactions.reduce((sum, t) => sum + t.amount, 0) / allTransactions.length).toFixed(2)
                        : '0.00'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Net Balance (Deposits - Withdrawals):</span>
                    <span className={`font-medium ${depositTotal - withdrawalTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(depositTotal - withdrawalTotal).toFixed(2)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
