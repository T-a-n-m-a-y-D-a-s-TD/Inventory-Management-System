import { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Calendar,
  User,
  Package,
  Phone,
  Mail,
  MapPin,
  X,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  FileText,
  Download,
  Printer,
  Eye
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { useProducts } from '../context/ProductContext';
import { useUsers } from '../context/UserContext';
import { formatDate, formatTime, formatInvoiceDate, formatInvoiceTime } from '../utils/dateUtils';

interface SortConfig {
  key: 'date' | 'product' | 'seller' | 'customer' | 'price';
  direction: 'asc' | 'desc';
}

const InvoiceModal = ({ sale, onClose }: { sale: any; onClose: () => void }) => {
  const { products } = useProducts();
  const { users } = useUsers();
  
  const product = products.find(p => p.id === sale.productId);
  const seller = users.find(u => u.id === sale.soldBy);
  
  const invoiceNumber = `INV-${sale.id.slice(0, 8).toUpperCase()}`;
  const saleDate = new Date(sale.soldAt);
  const invoiceDate = formatInvoiceDate(saleDate);
  const invoiceTime = formatInvoiceTime(saleDate);
  
  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice-header { text-align: center; margin-bottom: 30px; }
                .company-logo { font-size: 24px; font-weight: bold; color: #0066ff; margin-bottom: 10px; }
                .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .customer-details, .invoice-info { width: 45%; }
                .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .invoice-table th { background-color: #f5f5f5; }
                .total-section { text-align: right; margin-top: 20px; }
                .total-amount { font-size: 18px; font-weight: bold; }
                .footer { margin-top: 40px; text-align: center; color: #666; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };
  
  const handleDownload = () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (invoiceContent) {
      const content = `
GLITCHED TECHNOLOGIES
Inventory Management System
Invoice: ${invoiceNumber}
Date: ${invoiceDate} ${invoiceTime}

BILL TO:
${sale.customerName}
${sale.customerPhone}
${sale.customerEmail}
${sale.customerAddress}

SOLD BY: ${seller?.name || 'Unknown'}

ITEM DETAILS:
Product: ${product?.name || 'Unknown Product'}
SKU: ${product?.sku || 'N/A'}
Quantity: ${sale.quantity}
Unit Price: ৳${sale.price.toLocaleString()}
Total: ৳${sale.totalPrice.toLocaleString()}

TOTAL AMOUNT: ৳${sale.totalPrice.toLocaleString()}

Thank you for your business!
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceNumber}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-in-bottom">
        <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--neutral-800)] flex items-center">
            <FileText size={20} className="mr-2 text-[var(--primary-500)]" />
            Invoice {invoiceNumber}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              className="btn btn-secondary flex items-center"
              onClick={handlePrint}
            >
              <Printer size={18} className="mr-2" />
              Print
            </button>
            <button
              className="btn btn-primary flex items-center"
              onClick={handleDownload}
            >
              <Download size={18} className="mr-2" />
              Download
            </button>
            <button
              className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div id="invoice-content" className="p-8">
          {/* Invoice Header */}
          <div className="text-center mb-8">
            <div className="bg-[var(--primary-500)] text-white font-bold text-2xl h-12 w-12 rounded-md flex items-center justify-center mx-auto mb-4">
              GT
            </div>
            <h1 className="text-2xl font-bold text-[var(--neutral-800)]">GLITCHED TECHNOLOGIES</h1>
            <p className="text-[var(--neutral-600)]">Inventory Management System</p>
          </div>
          
          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">BILL TO:</h3>
              <div className="space-y-2">
                <p className="font-medium text-[var(--neutral-800)]">{sale.customerName}</p>
                <div className="flex items-center text-[var(--neutral-600)]">
                  <Phone size={16} className="mr-2" />
                  {sale.customerPhone}
                </div>
                <div className="flex items-center text-[var(--neutral-600)]">
                  <Mail size={16} className="mr-2" />
                  {sale.customerEmail}
                </div>
                <div className="flex items-center text-[var(--neutral-600)]">
                  <MapPin size={16} className="mr-2" />
                  {sale.customerAddress}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">INVOICE INFO:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--neutral-600)]">Invoice Number:</span>
                  <span className="font-medium text-[var(--neutral-800)]">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--neutral-600)]">Date:</span>
                  <span className="font-medium text-[var(--neutral-800)]">{invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--neutral-600)]">Time:</span>
                  <span className="font-medium text-[var(--neutral-800)]">{invoiceTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--neutral-600)]">Sold By:</span>
                  <span className="font-medium text-[var(--neutral-800)]">{seller?.name || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">ITEMS:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[var(--neutral-200)]">
                <thead className="bg-[var(--neutral-50)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--neutral-700)] border-b border-[var(--neutral-200)]">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--neutral-700)] border-b border-[var(--neutral-200)]">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-[var(--neutral-700)] border-b border-[var(--neutral-200)]">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--neutral-700)] border-b border-[var(--neutral-200)]">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[var(--neutral-700)] border-b border-[var(--neutral-200)]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 text-[var(--neutral-800)] border-b border-[var(--neutral-200)]">
                      {product?.name || 'Unknown Product'}
                    </td>
                    <td className="px-4 py-3 text-[var(--neutral-600)] border-b border-[var(--neutral-200)]">
                      {product?.sku || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--neutral-800)] border-b border-[var(--neutral-200)]">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--neutral-800)] border-b border-[var(--neutral-200)]">
                      ৳{sale.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--neutral-800)] border-b border-[var(--neutral-200)]">
                      ৳{sale.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Total Section */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="border-t-2 border-[var(--neutral-300)] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[var(--neutral-800)]">TOTAL AMOUNT:</span>
                  <span className="text-xl font-bold text-[var(--primary-700)]">
                    ৳{sale.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 text-center text-[var(--neutral-500)]">
            <p>Thank you for your business!</p>
            <p className="text-sm mt-2">This is a computer-generated invoice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesPage = () => {
  const { soldProducts } = useSales();
  const { products } = useProducts();
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc'
  });
  
  // Handle sorting
  const handleSort = (key: 'date' | 'product' | 'seller' | 'customer' | 'price') => {
    if (sortConfig.key === key) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key, direction: 'desc' });
    }
  };
  
  // Get product name from ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  // Get seller name from ID
  const getSellerName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  // Filter and sort sales
  const filteredSales = soldProducts
    .filter(sale => {
      const product = getProductName(sale.productId).toLowerCase();
      const seller = getSellerName(sale.soldBy).toLowerCase();
      const customer = sale.customerName.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return product.includes(search) ||
             seller.includes(search) ||
             customer.includes(search) ||
             sale.customerPhone.includes(search) ||
             sale.customerEmail.toLowerCase().includes(search);
    })
    .sort((a, b) => {
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (sortConfig.key) {
        case 'date':
          return multiplier * (new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime());
        case 'product':
          return multiplier * getProductName(a.productId).localeCompare(getProductName(b.productId));
        case 'seller':
          return multiplier * getSellerName(a.soldBy).localeCompare(getSellerName(b.soldBy));
        case 'customer':
          return multiplier * a.customerName.localeCompare(b.customerName);
        case 'price':
          return multiplier * (a.totalPrice - b.totalPrice);
        default:
          return 0;
      }
    });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Sales History</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search sales..."
            className="pl-10 pr-4 py-2 w-full border border-[var(--neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-[var(--primary-500)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-500)]" size={18} />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
              onClick={() => setSearchTerm('')}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {filteredSales.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--neutral-200)]">
              <thead className="bg-[var(--neutral-50)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('date')}
                    >
                      Date & Time
                      {sortConfig.key === 'date' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('product')}
                    >
                      Product
                      {sortConfig.key === 'product' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('seller')}
                    >
                      Sold By
                      {sortConfig.key === 'seller' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('customer')}
                    >
                      Customer
                      {sortConfig.key === 'customer' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortConfig.key === 'price' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[var(--neutral-50)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-[var(--neutral-500)] mr-2" />
                        <div>
                          <div className="text-sm font-medium text-[var(--neutral-800)]">
                            {formatDate(sale.soldAt)}
                          </div>
                          <div className="text-xs text-[var(--neutral-500)]">
                            {formatTime(sale.soldAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package size={16} className="text-[var(--neutral-500)] mr-2" />
                        <span className="text-sm text-[var(--neutral-800)]">
                          {getProductName(sale.productId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-[var(--neutral-500)] mr-2" />
                        <span className="text-sm text-[var(--neutral-800)]">
                          {getSellerName(sale.soldBy)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-[var(--neutral-800)]">
                          {sale.customerName}
                        </div>
                        <div className="flex items-center text-xs text-[var(--neutral-500)]">
                          <Phone size={12} className="mr-1" />
                          {sale.customerPhone}
                        </div>
                        <div className="flex items-center text-xs text-[var(--neutral-500)]">
                          <Mail size={12} className="mr-1" />
                          {sale.customerEmail}
                        </div>
                        <div className="flex items-center text-xs text-[var(--neutral-500)]">
                          <MapPin size={12} className="mr-1" />
                          {sale.customerAddress}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[var(--neutral-800)]">
                        {sale.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[var(--neutral-800)]">
                          ৳{sale.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--neutral-500)]">
                          ৳{sale.price.toLocaleString()} each
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="text-[var(--primary-600)] hover:text-[var(--primary-800)] flex items-center"
                        onClick={() => setSelectedInvoice(sale)}
                        title="View Invoice"
                      >
                        <Eye size={18} className="mr-1" />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-[var(--neutral-400)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--neutral-700)] mb-2">No sales found</h3>
          <p className="text-[var(--neutral-500)]">
            No sales match your search criteria.
          </p>
        </div>
      )}
      
      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          sale={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default SalesPage;