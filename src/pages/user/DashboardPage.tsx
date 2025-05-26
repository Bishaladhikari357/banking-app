import { useAuth } from '../../contexts/AuthContext';
import { useTransaction } from '../../contexts/TransactionContext';
import { UserDashboardNav } from '../../components/user/UserDashboardNav';
import { Navigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { userTransactions, getUserBalance } = useTransaction();

  // Redirect if not authenticated or if admin
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const balance = getUserBalance();
  const recentTransactions = [...userTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const depositSum = userTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const withdrawalSum = userTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const transferSum = userTransactions
    .filter(t => t.type === 'transfer' && t.userId === user?.id)
    .reduce((sum, t) => sum + t.amount, 0);

  const receivedSum = userTransactions
    .filter(t => t.type === 'receive' || (t.type === 'transfer' && t.recipientId === user?.id))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserDashboardNav />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500 mb-1">Current Balance</h2>
            <p className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500 mb-1">Total Deposits</h2>
            <p className="text-2xl font-bold text-blue-600">${depositSum.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500 mb-1">Total Withdrawals</h2>
            <p className="text-2xl font-bold text-red-600">${withdrawalSum.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500 mb-1">Received Funds</h2>
            <p className="text-2xl font-bold text-purple-600">${receivedSum.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

          {recentTransactions.length === 0 ? (
            <p className="text-gray-500">No recent transactions.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2 text-gray-600">Date</th>
                    <th className="pb-2 text-gray-600">Type</th>
                    <th className="pb-2 text-gray-600">Description</th>
                    <th className="pb-2 text-gray-600 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t">
                      <td className="py-3 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm capitalize">{transaction.type}</td>
                      <td className="py-3 text-sm">{transaction.description}</td>
                      <td
                        className={`py-3 text-sm text-right font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'receive' ||
                          (transaction.type === 'transfer' && transaction.recipientId === user?.id)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'deposit' || transaction.type === 'receive' ||
                         (transaction.type === 'transfer' && transaction.recipientId === user?.id)
                          ? '+'
                          : '-'}
                        ${transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
