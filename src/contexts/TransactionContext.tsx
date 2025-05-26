import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Transaction = {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'receive' | 'transfer';
  amount: number;
  description: string;
  date: Date;
  recipientId?: string;
  recipientName?: string;
};

type TransactionContextType = {
  transactions: Transaction[];
  userTransactions: Transaction[];
  allTransactions: Transaction[];
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number) => Promise<boolean>;
  transfer: (amount: number, recipientId: string, recipientName: string) => Promise<boolean>;
  getUserBalance: () => number;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Mock initial transactions
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'deposit',
    amount: 500,
    description: 'Initial deposit',
    date: new Date('2024-04-10'),
  },
  {
    id: '2',
    userId: '1',
    type: 'withdrawal',
    amount: 100,
    description: 'ATM withdrawal',
    date: new Date('2024-04-15'),
  },
  {
    id: '3',
    userId: '1',
    type: 'receive',
    amount: 200,
    description: 'Payment from John Doe',
    date: new Date('2024-04-20'),
  },
];

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Get user-specific transactions
  const userTransactions = transactions.filter(
    (t) => user && (t.userId === user.id || t.recipientId === user.id)
  );

  // All transactions (for admin)
  const allTransactions = transactions;

  // Calculate user balance
  const getUserBalance = (): number => {
    if (!user) return 0;

    return transactions.reduce((balance, transaction) => {
      if (transaction.userId === user.id) {
        if (transaction.type === 'deposit' || transaction.type === 'receive') {
          return balance + transaction.amount;
        }
        if (transaction.type === 'withdrawal' || transaction.type === 'transfer') {
          return balance - transaction.amount;
        }
      } else if (transaction.recipientId === user.id && transaction.type === 'transfer') {
        return balance + transaction.amount;
      }
      return balance;
    }, 0);
  };

  // Deposit money
  const deposit = async (amount: number): Promise<boolean> => {
    if (!user) return false;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'deposit',
      amount,
      description: 'Deposit',
      date: new Date(),
    };

    setTransactions([...transactions, newTransaction]);
    return true;
  };

  // Withdraw money
  const withdraw = async (amount: number): Promise<boolean> => {
    if (!user) return false;

    const balance = getUserBalance();
    if (balance < amount) return false;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'withdrawal',
      amount,
      description: 'Withdrawal',
      date: new Date(),
    };

    setTransactions([...transactions, newTransaction]);
    return true;
  };

  // Transfer money
  const transfer = async (
    amount: number,
    recipientId: string,
    recipientName: string
  ): Promise<boolean> => {
    if (!user) return false;

    const balance = getUserBalance();
    if (balance < amount) return false;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'transfer',
      amount,
      description: `Transfer to ${recipientName}`,
      date: new Date(),
      recipientId,
      recipientName,
    };

    setTransactions([...transactions, newTransaction]);
    return true;
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        userTransactions,
        allTransactions,
        deposit,
        withdraw,
        transfer,
        getUserBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
