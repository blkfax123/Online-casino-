import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  walletAddress?: string;
  isVip: boolean;
  level: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithWallet: (walletAddress: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('casinoUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        balance: 1000.00,
        isVip: false,
        level: 1
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('casinoUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithWallet = async (walletAddress: string): Promise<boolean> => {
    try {
      // Simulate wallet authentication
      await new Promise(resolve => setTimeout(resolve, 1500));

      const userData: User = {
        id: '2',
        email: '',
        username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        balance: 2500.00,
        walletAddress,
        isVip: true,
        level: 3
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('casinoUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Wallet login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('casinoUser');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('casinoUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      loginWithWallet,
      logout,
      updateBalance
    }}>
      {children}
    </AuthContext.Provider>
  );
};