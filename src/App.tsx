import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { UserProvider } from './contexts/UserContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/user/DashboardPage';
import { DepositPage } from './pages/user/DepositPage';
import { WithdrawPage } from './pages/user/WithdrawPage';
import { TransferPage } from './pages/user/TransferPage';
import { TransactionsPage } from './pages/user/TransactionsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TransactionProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/" element={<LoginPage />} />

              {/* User Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/deposit" element={<DepositPage />} />
              <Route path="/dashboard/withdraw" element={<WithdrawPage />} />
              <Route path="/dashboard/transfer" element={<TransferPage />} />
              <Route path="/dashboard/transactions" element={<TransactionsPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/transactions" element={<AdminTransactionsPage />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </TransactionProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
