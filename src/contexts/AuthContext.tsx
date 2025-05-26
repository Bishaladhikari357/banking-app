import { createContext, useContext, useState, type ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  balance?: number;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    username: 'user1',
    password: 'password123',
    role: 'user',
    balance: 1000,
  },
  {
    id: '2',
    email: 'admin@example.com',
    username: 'admin1',
    password: 'admin123',
    role: 'admin',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Login function
  const login = async (email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
