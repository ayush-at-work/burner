import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    lastLogin: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser && (password === 'admin123' && username === 'admin' || password === 'user123')) {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      users,
      createUser,
      deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
