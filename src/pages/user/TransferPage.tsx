import { useState } from 'react';
import { UserDashboardNav } from '../../components/user/UserDashboardNav';
import { useTransaction } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

export const TransferPage = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [recipientId, setRecipientId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { transfer, getUserBalance } = useTransaction();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { users } = useUser();
  const navigate = useNavigate();

  // Redirect if not authenticated or if admin
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const currentBalance = getUserBalance();

  // Filter out current user and admin users from recipient list
  const availableRecipients = users.filter(
    (u) => u.id !== user?.id && u.role !== 'admin'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (amount > currentBalance) {
      setError(`Insufficient funds. Your current balance is $${currentBalance.toFixed(2)}`);
      return;
    }

    if (!recipientId) {
      setError('Please select a recipient');
      return;
    }

    const recipient = users.find(u => u.id === recipientId);
    if (!recipient) {
      setError('Invalid recipient selected');
      return;
    }

    setIsLoading(true);
    try {
      const result = await transfer(Number(amount), recipientId, recipient.username);
      if (result) {
        setSuccess(`Successfully transferred $${amount} to ${recipient.username}`);
        setAmount('');
        setRecipientId('');
        // Automatically navigate back to dashboard after successful transfer
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Failed to process transfer');
      }
    } catch (err) {
      setError('An error occurred while processing your transfer');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <UserDashboardNav />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Transfer Money</h1>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
            Your current balance: <span className="font-bold">${currentBalance.toFixed(2)}</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="recipient" className="block text-gray-700 font-medium mb-2">
                Recipient
              </label>
              <select
                id="recipient"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                required
              >
                <option value="">Select recipient</option>
                {availableRecipients.map((recipient) => (
                  <option key={recipient.id} value={recipient.id}>
                    {recipient.username} ({recipient.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                Transfer Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  min="0.01"
                  step="0.01"
                  max={currentBalance}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded font-bold ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Transfer Funds'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
