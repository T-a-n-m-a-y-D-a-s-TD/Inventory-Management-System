import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialProducts, Product, categories } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDateTime } from '../utils/dateUtils';
import toast from 'react-hot-toast';

interface ProductContextType {
  products: Product[];
  categories: string[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getLowStockProducts: () => Product[];
  getProductStats: () => {
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    categoryCounts: { [key: string]: number };
  };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = getCurrentDateTime();
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    toast.success('Product added successfully!');
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          ...product, 
          updatedAt: getCurrentDateTime()
        };
      }
      return p;
    });
    
    saveProducts(updatedProducts);
    toast.success('Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
    toast.success('Product deleted successfully!');
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.quantity <= p.threshold);
  };

  const getProductStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockCount = getLowStockProducts().length;
    
    const categoryCounts: { [key: string]: number } = {};
    categories.forEach(category => {
      categoryCounts[category] = products.filter(p => p.category === category).length;
    });

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      categoryCounts
    };
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      getProductById,
      getProductsByCategory,
      getLowStockProducts,
      getProductStats
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};