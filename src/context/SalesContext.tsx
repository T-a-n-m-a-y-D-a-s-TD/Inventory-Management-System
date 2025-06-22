import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initialSoldProducts, SoldProduct } from '../data/initialData';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { getCurrentDateTime } from '../utils/dateUtils';
import toast from 'react-hot-toast';

interface SalesContextType {
  soldProducts: SoldProduct[];
  addSale: (
    productId: string,
    quantity: number,
    price: number,
    customerName: string,
    customerPhone: string,
    customerEmail: string,
    customerAddress: string
  ) => void;
  getSalesByDateRange: (startDate: string, endDate: string) => SoldProduct[];
  getSalesByProduct: (productId: string) => SoldProduct[];
  getSalesStats: () => {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    monthlySales: { [key: string]: { count: number; revenue: number } };
  };
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const { currentUser } = useAuth();
  const { products, updateProduct } = useProducts();

  useEffect(() => {
    const storedSales = localStorage.getItem('soldProducts');
    if (storedSales) {
      setSoldProducts(JSON.parse(storedSales));
    } else {
      setSoldProducts(initialSoldProducts);
      localStorage.setItem('soldProducts', JSON.stringify(initialSoldProducts));
    }
  }, []);

  const saveSales = (updatedSales: SoldProduct[]) => {
    setSoldProducts(updatedSales);
    localStorage.setItem('soldProducts', JSON.stringify(updatedSales));
  };

  const addSale = (
    productId: string,
    quantity: number,
    price: number,
    customerName: string,
    customerPhone: string,
    customerEmail: string,
    customerAddress: string
  ) => {
    if (!currentUser) {
      toast.error('You must be logged in to record a sale');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (product.quantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    const totalPrice = price * quantity;
    const newSale: SoldProduct = {
      id: uuidv4(),
      productId,
      quantity,
      price,
      totalPrice,
      soldBy: currentUser.id,
      soldAt: getCurrentDateTime(),
      customerName,
      customerPhone,
      customerEmail,
      customerAddress
    };

    // Update product quantity
    updateProduct(productId, {
      quantity: product.quantity - quantity
    });

    // Save sale
    const updatedSales = [...soldProducts, newSale];
    saveSales(updatedSales);
    toast.success('Sale recorded successfully');
  };

  const getSalesByDateRange = (startDate: string, endDate: string) => {
    return soldProducts.filter(sale => {
      const saleDate = new Date(sale.soldAt);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  };

  const getSalesByProduct = (productId: string) => {
    return soldProducts.filter(sale => sale.productId === productId);
  };

  const getSalesStats = () => {
    const totalSales = soldProducts.length;
    const totalRevenue = soldProducts.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const averageOrderValue = totalRevenue / totalSales || 0;

    // Calculate monthly sales
    const monthlySales: { [key: string]: { count: number; revenue: number } } = {};
    soldProducts.forEach(sale => {
      const date = new Date(sale.soldAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlySales[monthKey]) {
        monthlySales[monthKey] = { count: 0, revenue: 0 };
      }
      monthlySales[monthKey].count += 1;
      monthlySales[monthKey].revenue += sale.totalPrice;
    });

    return {
      totalSales,
      totalRevenue,
      averageOrderValue,
      monthlySales
    };
  };

  return (
    <SalesContext.Provider value={{
      soldProducts,
      addSale,
      getSalesByDateRange,
      getSalesByProduct,
      getSalesStats
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};