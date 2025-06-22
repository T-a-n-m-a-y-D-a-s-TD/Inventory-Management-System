import { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown,
  Check,
  PackageOpen,
  ShoppingCart
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSuppliers } from '../context/SupplierContext';
import { useSales } from '../context/SalesContext';
import { categories } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  supplier: string;
  price: number;
  quantity: number;
  threshold: number;
  imageUrl?: string;
}

interface SaleFormData {
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
}

interface SortConfig {
  key: 'name' | 'category' | 'price' | 'quantity';
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  search: string;
  category: string;
  stockStatus: '' | 'in-stock' | 'out-of-stock' | 'low-stock';
}

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { suppliers, getSupplierOptions } = useSuppliers();
  const { addSale } = useSales();
  const { currentUser } = useAuth();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    category: categories[0],
    supplier: suppliers[0]?.id || '',
    price: 0,
    quantity: 0,
    threshold: 5,
    imageUrl: ''
  });

  const [saleData, setSaleData] = useState<SaleFormData>({
    quantity: 1,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: ''
  });
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });
  
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    search: '',
    category: '',
    stockStatus: ''
  });
  
  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const canSell = currentUser?.role === 'staff';
  
  // Handle sorting
  const handleSort = (key: 'name' | 'category' | 'price' | 'quantity') => {
    if (sortConfig.key === key) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };
  
  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filterConfig.search.toLowerCase()) || 
                         product.sku.toLowerCase().includes(filterConfig.search.toLowerCase());
    
    const matchesCategory = filterConfig.category === '' || product.category === filterConfig.category;
    
    let matchesStockStatus = true;
    if (filterConfig.stockStatus === 'in-stock') {
      matchesStockStatus = product.quantity > 0;
    } else if (filterConfig.stockStatus === 'out-of-stock') {
      matchesStockStatus = product.quantity === 0;
    } else if (filterConfig.stockStatus === 'low-stock') {
      matchesStockStatus = product.quantity <= product.threshold && product.quantity > 0;
    }
    
    return matchesSearch && matchesCategory && matchesStockStatus;
  }).sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === 'category') {
      return sortConfig.direction === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortConfig.key === 'price') {
      return sortConfig.direction === 'asc'
        ? a.price - b.price
        : b.price - a.price;
    } else {
      return sortConfig.direction === 'asc'
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    }
  });
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      sku: '',
      category: categories[0],
      supplier: suppliers[0]?.id || '',
      price: 0,
      quantity: 0,
      threshold: 5,
      imageUrl: ''
    });
  };

  // Reset sale data
  const resetSaleData = () => {
    setSaleData({
      quantity: 1,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: ''
    });
  };
  
  // Open edit modal
  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        supplier: product.supplier,
        price: product.price,
        quantity: product.quantity,
        threshold: product.threshold,
        imageUrl: product.imageUrl || ''
      });
      setSelectedProduct(id);
      setShowEditModal(true);
    }
  };
  
  // Open delete modal
  const handleDelete = (id: string) => {
    setSelectedProduct(id);
    setShowDeleteModal(true);
  };

  // Open sale modal
  const handleOpenSale = (id: string) => {
    setSelectedProduct(id);
    resetSaleData();
    setShowSaleModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  // Handle sale input changes
  const handleSaleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaleData({
      ...saleData,
      [name]: name === 'quantity' ? parseInt(value) : value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      toast.error('You do not have permission to add or edit products');
      return;
    }
    
    if (showAddModal) {
      // Add new product
      addProduct(formData);
      setShowAddModal(false);
    } else if (showEditModal && selectedProduct) {
      // Update existing product
      updateProduct(selectedProduct, formData);
      setShowEditModal(false);
    }
    
    resetFormData();
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!canEdit) {
      toast.error('You do not have permission to delete products');
      return;
    }
    
    if (selectedProduct) {
      deleteProduct(selectedProduct);
      setShowDeleteModal(false);
    }
  };

  // Handle sale submission
  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSell) {
      toast.error('Only staff members can record sales');
      return;
    }

    if (!selectedProduct) {
      toast.error('No product selected');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (saleData.quantity > product.quantity) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      await addSale(
        product.id,
        saleData.quantity,
        product.price,
        saleData.customerName,
        saleData.customerPhone,
        saleData.customerEmail,
        saleData.customerAddress
      );
      
      setShowSaleModal(false);
      resetSaleData();
      toast.success('Sale recorded successfully');
    } catch (error) {
      toast.error('Failed to record sale');
    }
  };
  
  // Get supplier name from ID
  const getSupplierName = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Unknown Supplier';
  };
  
  // Get stock status badge
  const getStockStatusBadge = (quantity: number, threshold: number) => {
    if (quantity === 0) {
      return <span className="badge bg-[var(--error-100)] text-[var(--error-800)]">Out of Stock</span>;
    } else if (quantity <= threshold) {
      return <span className="badge bg-[var(--warning-100)] text-[var(--warning-800)]">Low Stock</span>;
    } else {
      return <span className="badge bg-[var(--success-100)] text-[var(--success-800)]">In Stock</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Products</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-[var(--neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-[var(--primary-500)]"
              value={filterConfig.search}
              onChange={(e) => setFilterConfig({ ...filterConfig, search: e.target.value })}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-500)]" size={18} />
            {filterConfig.search && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setFilterConfig({ ...filterConfig, search: '' })}
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <button
            className="btn btn-secondary flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
          
          {canEdit && (
            <button
              className="btn btn-primary flex items-center"
              onClick={() => {
                resetFormData();
                setShowAddModal(true);
              }}
            >
              <Plus size={18} className="mr-2" />
              Add Product
            </button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-md shadow-sm border border-[var(--neutral-200)] animate-slide-in-bottom">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[var(--neutral-800)]">
              <SlidersHorizontal size={18} className="inline-block mr-2" />
              Filter Products
            </h3>
            <button
              className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
              onClick={() => setShowFilters(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filterConfig.category}
                onChange={(e) => setFilterConfig({ ...filterConfig, category: e.target.value })}
              >
                <option value="">All Categories</option>
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
                value={filterConfig.stockStatus}
                onChange={(e) => setFilterConfig({ ...filterConfig, stockStatus: e.target.value as any })}
              >
                <option value="">All</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-3">
            <button
              className="btn btn-secondary"
              onClick={() => setFilterConfig({ search: '', category: '', stockStatus: '' })}
            >
              Reset
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--neutral-200)]">
              <thead className="bg-[var(--neutral-50)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('name')}
                    >
                      Product
                      {sortConfig.key === 'name' ? (
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
                      onClick={() => handleSort('category')}
                    >
                      Category
                      {sortConfig.key === 'category' ? (
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
                    Supplier
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('quantity')}
                    >
                      Stock
                      {sortConfig.key === 'quantity' ? (
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--neutral-50)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl ? (
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.imageUrl}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-[var(--neutral-200)] flex items-center justify-center">
                            <PackageOpen size={16} className="text-[var(--neutral-500)]" />
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[var(--neutral-800)]">{product.name}</p>
                          <p className="text-xs text-[var(--neutral-500)]">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-[var(--primary-50)] text-[var(--primary-700)]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                      {getSupplierName(product.supplier)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--neutral-800)]">
                      ৳{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-[var(--neutral-800)]">{product.quantity}</span>
                        {getStockStatusBadge(product.quantity, product.threshold)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canSell && product.quantity > 0 && (
                        <button
                          className="text-[var(--success-600)] hover:text-[var(--success-800)] mr-3"
                          onClick={() => handleOpenSale(product.id)}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      )}
                      {canEdit && (
                        <>
                          <button
                            className="text-[var(--primary-600)] hover:text-[var(--primary-800)] mr-3"
                            onClick={() => handleEdit(product.id)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="text-[var(--error-600)] hover:text-[var(--error-800)]"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-8 text-center">
          <PackageOpen size={48} className="mx-auto text-[var(--neutral-400)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--neutral-700)] mb-2">No products found</h3>
          <p className="text-[var(--neutral-500)]">
            No products match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Add New Product</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Product Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="sku" className="form-label">
                    SKU *
                  </label>
                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    className="form-input"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="supplier" className="form-label">
                    Supplier *
                  </label>
                  <select
                    id="supplier"
                    name="supplier"
                    className="form-select"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                  >
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="price" className="form-label">
                    Price (৳) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="quantity" className="form-label">
                    Quantity *
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="threshold" className="form-label">
                    Low Stock Threshold *
                  </label>
                  <input
                    id="threshold"
                    name="threshold"
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="form-label">
                    Image URL
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    className="form-input"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Plus size={18} className="mr-2" />
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Edit Product</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowEditModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-name" className="form-label">
                    Product Name *
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-sku" className="form-label">
                    SKU *
                  </label>
                  <input
                    id="edit-sku"
                    name="sku"
                    type="text"
                    className="form-input"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-supplier" className="form-label">
                    Supplier *
                  </label>
                  <select
                    id="edit-supplier"
                    name="supplier"
                    className="form-select"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                  >
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-price" className="form-label">
                    Price (৳) *
                  </label>
                  <input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-quantity" className="form-label">
                    Quantity *
                  </label>
                  <input
                    id="edit-quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-threshold" className="form-label">
                    Low Stock Threshold *
                  </label>
                  <input
                    id="edit-threshold"
                    name="threshold"
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-imageUrl" className="form-label">
                    Image URL
                  </label>
                  <input
                    id="edit-imageUrl"
                    name="imageUrl"
                    type="text"
                    className="form-input"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Confirm Delete</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center text-[var(--error-500)] mb-4">
                <div className="rounded-full bg-[var(--error-100)] p-3">
                  <Trash2 size={24} />
                </div>
              </div>
              
              <p className="text-center text-[var(--neutral-700)] mb-4">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sale Modal */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Record Sale</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowSaleModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="sale-quantity" className="form-label">
                    Quantity to Sell *
                  </label>
                  <input
                    id="sale-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    className="form-input"
                    value={saleData.quantity}
                    onChange={handleSaleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customerName" className="form-label">
                    Customer Name *
                  </label>
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    className="form-input"
                    value={saleData.customerName}
                    onChange={handleSaleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" className="form-label">
                    Customer Phone *
                  </label>
                  <input
                    id="customerPhone"
                    name="customerPhone"
                    type="text"
                    className="form-input"
                    value={saleData.customerPhone}
                    onChange={handleSaleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customerEmail" className="form-label">
                    Customer Email
                  </label>
                  <input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    className="form-input"
                    value={saleData.customerEmail}
                    onChange={handleSaleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="customerAddress" className="form-label">
                    Customer Address
                  </label>
                  <input
                    id="customerAddress"
                    name="customerAddress"
                    type="text"
                    className="form-input"
                    value={saleData.customerAddress}
                    onChange={handleSaleInputChange}
                  />
                </div>

                {selectedProduct && (
                  <div className="bg-[var(--neutral-50)] p-4 rounded-md">
                    <p className="text-sm text-[var(--neutral-600)]">
                      Available Stock: {products.find(p => p.id === selectedProduct)?.quantity || 0}
                    </p>
                    <p className="text-sm font-medium text-[var(--neutral-800)] mt-2">
                      Total Price: ৳{((products.find(p => p.id === selectedProduct)?.price || 0) * saleData.quantity).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSaleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Record Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;