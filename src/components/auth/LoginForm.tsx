import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type LoginFormProps = {
  userType: 'user' | 'admin';
  onLoginSuccess: () => void;
};

export const LoginForm = ({ userType, onLoginSuccess }: LoginFormProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, userType);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {userType === 'admin' ? 'Admin Login' : 'User Login'}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded font-bold ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : userType === 'admin'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>

      {userType === 'user' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            For demo: use <span className="font-semibold">user@example.com</span> /
            <span className="font-semibold">password123</span>
          </p>
        </div>
      )}

{userType === 'user' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            For demo: use <span className="font-semibold">user1@example.com</span> /
            <span className="font-semibold">password123</span>
          </p>
        </div>
      )}

      {userType === 'admin' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            For demo: use <span className="font-semibold">admin@example.com</span> /
            <span className="font-semibold">admin123</span>
          </p>
        </div>
      )}
    </div>
  );
};
