import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  X, 
  ArrowUpDown,
  Check,
  Phone,
  Mail,
  MapPin,
  UserCircle,
  Truck
} from 'lucide-react';
import { useSuppliers } from '../context/SupplierContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface SupplierFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

interface SortConfig {
  key: 'name' | 'contactPerson' | 'email' | 'phone';
  direction: 'asc' | 'desc';
}

const SuppliersPage = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const { currentUser } = useAuth();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });
  
  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  
  // Handle sorting
  const handleSort = (key: 'name' | 'contactPerson' | 'email' | 'phone') => {
    if (sortConfig.key === key) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };
  
  // Filter and sort suppliers
  const filteredSuppliers = suppliers
    .filter(supplier => 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortConfig.key === 'contactPerson') {
        return sortConfig.direction === 'asc'
          ? a.contactPerson.localeCompare(b.contactPerson)
          : b.contactPerson.localeCompare(a.contactPerson);
      } else if (sortConfig.key === 'email') {
        return sortConfig.direction === 'asc'
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else {
        return sortConfig.direction === 'asc'
          ? a.phone.localeCompare(b.phone)
          : b.phone.localeCompare(a.phone);
      }
    });
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    });
  };
  
  // Open edit modal
  const handleEdit = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address
      });
      setSelectedSupplier(id);
      setShowEditModal(true);
    }
  };
  
  // Open delete modal
  const handleDelete = (id: string) => {
    setSelectedSupplier(id);
    setShowDeleteModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      toast.error('You do not have permission to add or edit suppliers');
      return;
    }
    
    if (showAddModal) {
      // Add new supplier
      addSupplier(formData);
      setShowAddModal(false);
    } else if (showEditModal && selectedSupplier) {
      // Update existing supplier
      updateSupplier(selectedSupplier, formData);
      setShowEditModal(false);
    }
    
    resetFormData();
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!canEdit) {
      toast.error('You do not have permission to delete suppliers');
      return;
    }
    
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier);
      setShowDeleteModal(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Suppliers</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search suppliers..."
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
          
          {canEdit && (
            <button
              className="btn btn-primary flex items-center"
              onClick={() => {
                resetFormData();
                setShowAddModal(true);
              }}
            >
              <Plus size={18} className="mr-2" />
              Add Supplier
            </button>
          )}
        </div>
      </div>
      
      {filteredSuppliers.length > 0 ? (
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
                      Company
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
                      onClick={() => handleSort('contactPerson')}
                    >
                      Contact Person
                      {sortConfig.key === 'contactPerson' ? (
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
                      onClick={() => handleSort('email')}
                    >
                      Email
                      {sortConfig.key === 'email' ? (
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
                      onClick={() => handleSort('phone')}
                    >
                      Phone
                      {sortConfig.key === 'phone' ? (
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
                    Address
                  </th>
                  {canEdit && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-[var(--neutral-50)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-700)]">
                          <Truck size={18} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[var(--neutral-800)]">{supplier.name}</p>
                          <p className="text-xs text-[var(--neutral-500)]">
                            Added on {new Date(supplier.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCircle size={16} className="text-[var(--neutral-500)] mr-1" />
                        <span className="text-sm text-[var(--neutral-700)]">{supplier.contactPerson}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail size={16} className="text-[var(--neutral-500)] mr-1" />
                        <span className="text-sm text-[var(--neutral-700)]">{supplier.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone size={16} className="text-[var(--neutral-500)] mr-1" />
                        <span className="text-sm text-[var(--neutral-700)]">{supplier.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-[var(--neutral-500)] mr-1" />
                        <span className="text-sm text-[var(--neutral-700)]" title={supplier.address}>
                          {supplier.address.length > 25 ? `${supplier.address.substring(0, 25)}...` : supplier.address}
                        </span>
                      </div>
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-[var(--primary-600)] hover:text-[var(--primary-800)] mr-3"
                          onClick={() => handleEdit(supplier.id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-[var(--error-600)] hover:text-[var(--error-800)]"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-8 text-center">
          <Truck size={48} className="mx-auto text-[var(--neutral-400)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--neutral-700)] mb-2">No suppliers found</h3>
          <p className="text-[var(--neutral-500)]">
            No suppliers match your search criteria. Try adjusting your search or add a new supplier.
          </p>
        </div>
      )}
      
      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Add New Supplier</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Company Name *
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
                  <label htmlFor="contactPerson" className="form-label">
                    Contact Person *
                  </label>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    className="form-input"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+8801XXXXXXXXX"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="form-label">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className="form-input resize-none"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
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
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Supplier Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Edit Supplier</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowEditModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="form-label">
                    Company Name *
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
                  <label htmlFor="edit-contactPerson" className="form-label">
                    Contact Person *
                  </label>
                  <input
                    id="edit-contactPerson"
                    name="contactPerson"
                    type="text"
                    className="form-input"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-email" className="form-label">
                    Email *
                  </label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-phone" className="form-label">
                    Phone *
                  </label>
                  <input
                    id="edit-phone"
                    name="phone"
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-address" className="form-label">
                    Address *
                  </label>
                  <textarea
                    id="edit-address"
                    name="address"
                    className="form-input resize-none"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
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
                Are you sure you want to delete this supplier? This action cannot be undone.
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
    </div>
  );
};

export default SuppliersPage;