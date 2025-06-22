import { useState } from 'react';
import { BarChart, Calendar, FileDown, FileText, Filter, ArrowDownToLine, BarChart3, ChevronsUpDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSuppliers } from '../context/SupplierContext';

// CSV Export Function
const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    return;
  }
  
  // Get headers from first object keys
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV rows
  const csvRows = [];
  
  // Add headers row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values with commas by wrapping in quotes
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"`
        : value;
    });
    csvRows.push(values.join(','));
  }
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element and trigger download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ReportCard = ({ title, description, icon, onClick }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div 
      className="card p-6 flex items-start hover:shadow-md cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="rounded-full p-3 bg-[var(--primary-50)] text-[var(--primary-700)] mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-[var(--neutral-800)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--neutral-600)]">{description}</p>
      </div>
    </div>
  );
};

const ReportsPage = () => {
  const { products, categories } = useProducts();
  const { suppliers } = useSuppliers();
  
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  
  // Generate inventory report data
  const generateInventoryReport = () => {
    return products.map(product => {
      const supplier = suppliers.find(s => s.id === product.supplier);
      
      return {
        Name: product.name,
        SKU: product.sku,
        Category: product.category,
        Supplier: supplier ? supplier.name : 'Unknown',
        Price: product.price,
        Quantity: product.quantity,
        Value: product.price * product.quantity,
        'Low Stock Threshold': product.threshold,
        Status: product.quantity === 0 
          ? 'Out of Stock' 
          : product.quantity <= product.threshold 
            ? 'Low Stock' 
            : 'In Stock'
      };
    }).filter(product => {
      // Apply category filter
      if (categoryFilter !== 'all' && product.Category !== categoryFilter) {
        return false;
      }
      
      // Apply stock status filter
      if (stockStatusFilter === 'in-stock' && product.Status !== 'In Stock') {
        return false;
      } else if (stockStatusFilter === 'low-stock' && product.Status !== 'Low Stock') {
        return false;
      } else if (stockStatusFilter === 'out-of-stock' && product.Status !== 'Out of Stock') {
        return false;
      }
      
      return true;
    });
  };
  
  // Generate low stock report data
  const generateLowStockReport = () => {
    return products
      .filter(product => product.quantity <= product.threshold)
      .map(product => {
        const supplier = suppliers.find(s => s.id === product.supplier);
        
        return {
          Name: product.name,
          SKU: product.sku,
          Category: product.category,
          Supplier: supplier ? supplier.name : 'Unknown',
          'Current Quantity': product.quantity,
          'Low Stock Threshold': product.threshold,
          'Reorder Amount': product.threshold * 2 - product.quantity, // Suggest reorder amount
          Status: product.quantity === 0 ? 'Out of Stock' : 'Low Stock'
        };
      });
  };
  
  // Generate category distribution report
  const generateCategoryReport = () => {
    const categoryData = categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category);
      const totalItems = categoryProducts.length;
      const totalValue = categoryProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;
      
      return {
        Category: category,
        'Total Items': totalItems,
        'Total Value': totalValue,
        'Average Price': averagePrice.toFixed(2),
        'Most Expensive Item': categoryProducts.length > 0 
          ? categoryProducts.reduce((max, p) => p.price > max.price ? p : max, categoryProducts[0]).name
          : 'N/A',
        'Least Expensive Item': categoryProducts.length > 0
          ? categoryProducts.reduce((min, p) => p.price < min.price ? p : min, categoryProducts[0]).name
          : 'N/A'
      };
    });
    
    return categoryData;
  };
  
  // Generate supplier report
  const generateSupplierReport = () => {
    return suppliers.map(supplier => {
      const supplierProducts = products.filter(p => p.supplier === supplier.id);
      const totalItems = supplierProducts.length;
      const totalValue = supplierProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const uniqueCategories = [...new Set(supplierProducts.map(p => p.category))];
      
      return {
        'Supplier Name': supplier.name,
        'Contact Person': supplier.contactPerson,
        'Email': supplier.email,
        'Phone': supplier.phone,
        'Total Products': totalItems,
        'Total Inventory Value': totalValue,
        'Categories': uniqueCategories.join(', '),
        'Low Stock Items': supplierProducts.filter(p => p.quantity <= p.threshold).length
      };
    });
  };
  
  // Export the current report
  const handleExport = () => {
    let reportData = [];
    let filename = '';
    
    if (selectedReport === 'inventory') {
      reportData = generateInventoryReport();
      filename = 'inventory_report';
    } else if (selectedReport === 'low-stock') {
      reportData = generateLowStockReport();
      filename = 'low_stock_report';
    } else if (selectedReport === 'category') {
      reportData = generateCategoryReport();
      filename = 'category_report';
    } else if (selectedReport === 'supplier') {
      reportData = generateSupplierReport();
      filename = 'supplier_report';
    }
    
    if (reportData.length > 0) {
      const date = new Date().toISOString().split('T')[0];
      exportToCSV(reportData, `${filename}_${date}.csv`);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Reports</h1>
      </div>
      
      {!selectedReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportCard
            title="Inventory Report"
            description="Get a complete overview of all products in stock with quantities, values, and status"
            icon={<FileText size={24} />}
            onClick={() => setSelectedReport('inventory')}
          />
          
          <ReportCard
            title="Low Stock Report"
            description="View all products that are low in stock or out of stock and need reordering"
            icon={<Filter size={24} />}
            onClick={() => setSelectedReport('low-stock')}
          />
          
          <ReportCard
            title="Category Distribution Report"
            description="See how your inventory is distributed across different product categories"
            icon={<BarChart size={24} />}
            onClick={() => setSelectedReport('category')}
          />
          
          <ReportCard
            title="Supplier Report"
            description="Get detailed information about suppliers and their associated products"
            icon={<Calendar size={24} />}
            onClick={() => setSelectedReport('supplier')}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="mr-4 text-[var(--neutral-600)] hover:text-[var(--neutral-800)]"
                onClick={() => setSelectedReport(null)}
              >
                ← Back to reports
              </button>
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">
                {selectedReport === 'inventory' && 'Inventory Report'}
                {selectedReport === 'low-stock' && 'Low Stock Report'}
                {selectedReport === 'category' && 'Category Distribution Report'}
                {selectedReport === 'supplier' && 'Supplier Report'}
              </h2>
            </div>
            
            <button 
              className="btn btn-primary flex items-center"
              onClick={handleExport}
            >
              <FileDown size={18} className="mr-2" />
              Export CSV
            </button>
          </div>
          
          {selectedReport === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-[var(--neutral-200)]">
                <div className="flex flex-col md:flex-row gap-4">
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Stock Status</label>
                    <select
                      className="form-select"
                      value={stockStatusFilter}
                      onChange={(e) => setStockStatusFilter(e.target.value)}
                    >
                      <option value="all">All Stock Status</option>
                      <option value="in-stock">In Stock</option>
                      <option value="low-stock">Low Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end ml-auto">
                    <button
                      className="btn btn-secondary flex items-center"
                      onClick={() => {
                        setCategoryFilter('all');
                        setStockStatusFilter('all');
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--neutral-200)]">
                    <thead className="bg-[var(--neutral-50)]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Supplier
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                      {generateInventoryReport().map((item, index) => (
                        <tr key={index} className="hover:bg-[var(--neutral-50)]">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[var(--neutral-800)]">
                            <div>
                              <div>{item.Name}</div>
                              <div className="text-xs text-[var(--neutral-500)]">{item.SKU}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                            {item.Category}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                            {item.Supplier}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            ৳{parseInt(item.Price).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            {item.Quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            ৳{parseInt(item.Value).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.Status === 'In Stock' 
                                ? 'bg-[var(--success-100)] text-[var(--success-800)]' 
                                : item.Status === 'Low Stock'
                                  ? 'bg-[var(--warning-100)] text-[var(--warning-800)]'
                                  : 'bg-[var(--error-100)] text-[var(--error-800)]'
                            }`}>
                              {item.Status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {selectedReport === 'low-stock' && (
            <div className="space-y-4">
              {generateLowStockReport().length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--neutral-200)]">
                      <thead className="bg-[var(--neutral-50)]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                            Supplier
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                            Current Qty
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                            Threshold
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                            Reorder Amt
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                        {generateLowStockReport().map((item, index) => (
                          <tr key={index} className="hover:bg-[var(--neutral-50)]">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[var(--neutral-800)]">
                              <div>
                                <div>{item.Name}</div>
                                <div className="text-xs text-[var(--neutral-500)]">{item.SKU}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                              {item.Category}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                              {item.Supplier}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                              {item['Current Quantity']}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                              {item['Low Stock Threshold']}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[var(--primary-700)]">
                              {item['Reorder Amount']}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.Status === 'Low Stock'
                                  ? 'bg-[var(--warning-100)] text-[var(--warning-800)]'
                                  : 'bg-[var(--error-100)] text-[var(--error-800)]'
                              }`}>
                                {item.Status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-[var(--success-100)] flex items-center justify-center text-[var(--success-700)] mb-4">
                    <ChevronsUpDown size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--neutral-700)] mb-2">No Low Stock Items</h3>
                  <p className="text-[var(--neutral-500)]">
                    Great! All products are above their low stock thresholds.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {selectedReport === 'category' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--neutral-200)]">
                    <thead className="bg-[var(--neutral-50)]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Total Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Total Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Avg Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Most Expensive
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Least Expensive
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                      {generateCategoryReport().map((item, index) => (
                        <tr key={index} className="hover:bg-[var(--neutral-50)]">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-700)]">
                              {item.Category}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            {item['Total Items']}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            ৳{parseInt(item['Total Value']).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            ৳{parseInt(item['Average Price']).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                            {item['Most Expensive Item']}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                            {item['Least Expensive Item']}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-6">
                <h3 className="text-lg font-medium text-[var(--neutral-800)] mb-4 flex items-center">
                  <BarChart3 size={20} className="mr-2 text-[var(--primary-500)]" />
                  Category Distribution
                </h3>
                <div className="space-y-4">
                  {categories.map(category => {
                    const count = products.filter(p => p.category === category).length;
                    const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                    
                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-[var(--neutral-700)]">{category}</span>
                          <span className="text-sm text-[var(--neutral-600)]">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-[var(--neutral-200)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--primary-500)] rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {selectedReport === 'supplier' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--neutral-200)]">
                    <thead className="bg-[var(--neutral-50)]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Supplier
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Total Products
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Inventory Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Categories
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                          Low Stock Items
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                      {generateSupplierReport().map((item, index) => (
                        <tr key={index} className="hover:bg-[var(--neutral-50)]">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[var(--neutral-800)]">
                            {item['Supplier Name']}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-[var(--neutral-600)]">
                              {item['Contact Person']}
                            </div>
                            <div className="text-xs text-[var(--neutral-500)]">
                              {item['Email']}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            {item['Total Products']}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--neutral-800)]">
                            ৳{parseInt(item['Total Inventory Value']).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--neutral-600)]">
                            <div className="flex flex-wrap gap-1">
                              {item['Categories'].split(', ').map((cat, i) => (
                                <span key={i} className="inline-block px-2 py-0.5 text-xs rounded-full bg-[var(--primary-50)] text-[var(--primary-700)]">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item['Low Stock Items'] > 0
                                ? 'bg-[var(--warning-100)] text-[var(--warning-800)]'
                                : 'bg-[var(--success-100)] text-[var(--success-800)]'
                            }`}>
                              {item['Low Stock Items']}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-6">
                <h3 className="text-lg font-medium text-[var(--neutral-800)] mb-4 flex items-center">
                  <ArrowDownToLine size={20} className="mr-2 text-[var(--warning-500)]" />
                  Suppliers with Low Stock Items
                </h3>
                <div className="space-y-4">
                  {generateSupplierReport()
                    .filter(item => item['Low Stock Items'] > 0)
                    .sort((a, b) => b['Low Stock Items'] - a['Low Stock Items'])
                    .map((item, index) => {
                      const percentage = 100 * (item['Low Stock Items'] / item['Total Products']);
                      
                      return (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-[var(--neutral-700)]">{item['Supplier Name']}</span>
                            <span className="text-sm text-[var(--warning-600)]">
                              {item['Low Stock Items']} / {item['Total Products']} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2.5 bg-[var(--neutral-200)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--warning-500)] rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;