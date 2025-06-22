import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialUsers, User } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDateTime } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Only admin can add users!');
      return;
    }

    const newUser: User = {
      ...user,
      id: uuidv4(),
      createdAt: getCurrentDateTime()
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    toast.success('User added successfully!');
  };

  const updateUser = (id: string, user: Partial<User>) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Only admin can update users!');
      return;
    }

    // Prevent changing own role (admin can't demote themselves)
    if (id === currentUser.id && user.role && user.role !== 'admin') {
      toast.error('You cannot change your own admin role!');
      return;
    }

    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, ...user };
      }
      return u;
    });
    
    saveUsers(updatedUsers);
    toast.success('User updated successfully!');
  };

  const deleteUser = (id: string) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Only admin can delete users!');
      return;
    }

    // Prevent deleting yourself
    if (id === currentUser.id) {
      toast.error('You cannot delete your own account!');
      return;
    }

    const updatedUsers = users.filter(u => u.id !== id);
    saveUsers(updatedUsers);
    toast.success('User deleted successfully!');
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      deleteUser, 
      getUserById
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};