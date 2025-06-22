import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialSuppliers, Supplier } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDateTime } from '../utils/dateUtils';
import toast from 'react-hot-toast';

interface SupplierContextType {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplierById: (id: string) => Supplier | undefined;
  getSupplierOptions: () => { value: string; label: string }[];
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider = ({ children }: { children: ReactNode }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const storedSuppliers = localStorage.getItem('suppliers');
    if (storedSuppliers) {
      setSuppliers(JSON.parse(storedSuppliers));
    } else {
      setSuppliers(initialSuppliers);
      localStorage.setItem('suppliers', JSON.stringify(initialSuppliers));
    }
  }, []);

  const saveSuppliers = (updatedSuppliers: Supplier[]) => {
    setSuppliers(updatedSuppliers);
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = getCurrentDateTime();
    const newSupplier: Supplier = {
      ...supplier,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    const updatedSuppliers = [...suppliers, newSupplier];
    saveSuppliers(updatedSuppliers);
    toast.success('Supplier added successfully!');
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    const updatedSuppliers = suppliers.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          ...supplier, 
          updatedAt: getCurrentDateTime()
        };
      }
      return s;
    });
    
    saveSuppliers(updatedSuppliers);
    toast.success('Supplier updated successfully!');
  };

  const deleteSupplier = (id: string) => {
    const updatedSuppliers = suppliers.filter(s => s.id !== id);
    saveSuppliers(updatedSuppliers);
    toast.success('Supplier deleted successfully!');
  };

  const getSupplierById = (id: string) => {
    return suppliers.find(s => s.id === id);
  };

  const getSupplierOptions = () => {
    return suppliers.map(supplier => ({
      value: supplier.id,
      label: supplier.name
    }));
  };

  return (
    <SupplierContext.Provider value={{ 
      suppliers, 
      addSupplier, 
      updateSupplier, 
      deleteSupplier, 
      getSupplierById,
      getSupplierOptions
    }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};