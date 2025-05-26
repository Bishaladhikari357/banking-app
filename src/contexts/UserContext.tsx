import { createContext, useContext, useState, type ReactNode } from 'react';

export type BankUser = {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
};

// Mock users list (for admin)
const MOCK_USERS: BankUser[] = [
  {
    id: '1',
    email: 'user@example.com',
    username: 'user1',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@example.com',
    username: 'admin1',
    role: 'admin',
  },
  {
    id: '3',
    email: 'user2@example.com',
    username: 'user2',
    role: 'user',
  },
];

type UserContextType = {
  users: BankUser[];
  getUser: (id: string) => BankUser | undefined;
  getAllUsers: () => BankUser[];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<BankUser[]>(MOCK_USERS);

  const getUser = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getAllUsers = () => {
    return users;
  };

  return (
    <UserContext.Provider value={{ users, getUser, getAllUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
