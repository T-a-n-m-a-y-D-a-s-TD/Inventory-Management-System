import { useState } from 'react';
import { Save, Shield, User, Bell, Database, Info, Server, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  
  const [userForm, setUserForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
    confirmPassword: ''
  });
  
  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    ...(isAdmin ? [
      { id: 'system', label: 'System Settings', icon: <Server size={18} /> },
      { id: 'backup', label: 'Backup & Restore', icon: <Database size={18} /> }
    ] : []),
    { id: 'about', label: 'About', icon: <Info size={18} /> }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (userForm.password !== userForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Simulated success
    toast.success('Profile updated successfully');
  };
  
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Notification settings updated');
  };
  
  const handleSystemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System settings updated');
  };
  
  const handleBackupNow = () => {
    toast.success('Backup created successfully');
  };
  
  const handleRestore = () => {
    toast.success('System restored from backup');
  };
  
  const exportData = () => {
    // For demonstration purposes
    const data = {
      timestamp: new Date().toISOString(),
      system: 'TechCity Inventory Management',
      version: '1.0.0'
    };
    
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `techcity_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('Data exported successfully');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
            <ul>
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`w-full px-4 py-3 flex items-center text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--primary-50)] text-[var(--primary-700)] font-medium'
                        : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <User size={20} className="mr-2 text-[var(--primary-500)]" />
                  Profile Settings
                </h2>
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-input"
                        value={userForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        value={userForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="form-label">
                        New Password (leave blank to keep current)
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-input"
                        value={userForm.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="form-input"
                        value={userForm.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button type="submit" className="btn btn-primary flex items-center">
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Bell size={20} className="mr-2 text-[var(--primary-500)]" />
                  Notification Settings
                </h2>
                
                <form onSubmit={handleNotificationSubmit}>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-[var(--neutral-800)]">
                            Enable Notifications
                          </h3>
                          <p className="text-xs text-[var(--neutral-500)] mt-1">
                            Receive notifications about low stock and other important events
                          </p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="toggle-notifications"
                            className="absolute w-6 h-6 opacity-0"
                            checked={notificationsEnabled}
                            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                          />
                          <label
                            htmlFor="toggle-notifications"
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                              notificationsEnabled ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-300)]'
                            }`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-[var(--neutral-800)]">
                            Email Notifications
                          </h3>
                          <p className="text-xs text-[var(--neutral-500)] mt-1">
                            Receive email alerts for critical inventory events
                          </p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="toggle-email"
                            className="absolute w-6 h-6 opacity-0"
                            checked={emailNotificationsEnabled}
                            onChange={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                            disabled={!notificationsEnabled}
                          />
                          <label
                            htmlFor="toggle-email"
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                              emailNotificationsEnabled && notificationsEnabled
                                ? 'bg-[var(--primary-500)]'
                                : 'bg-[var(--neutral-300)]'
                            } ${!notificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                                emailNotificationsEnabled && notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="lowStockThreshold" className="form-label">
                        Low Stock Threshold Alert
                      </label>
                      <div className="flex items-center">
                        <input
                          id="lowStockThreshold"
                          type="range"
                          min="1"
                          max="20"
                          className="w-full h-2 bg-[var(--neutral-200)] rounded-lg appearance-none cursor-pointer"
                          value={lowStockThreshold}
                          onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                          disabled={!notificationsEnabled}
                        />
                        <span className="ml-3 text-sm font-medium text-[var(--neutral-700)]">
                          {lowStockThreshold}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--neutral-500)] mt-1">
                        Notify when stock levels reach this threshold
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        className="btn btn-primary flex items-center"
                        disabled={!notificationsEnabled}
                      >
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* System Settings (Admin Only) */}
            {activeTab === 'system' && isAdmin && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Server size={20} className="mr-2 text-[var(--primary-500)]" />
                  System Settings
                </h2>
                
                <div className="bg-[var(--warning-50)] border border-[var(--warning-200)] rounded-md p-4 mb-6">
                  <p className="text-sm text-[var(--warning-700)] flex items-center">
                    <Shield size={18} className="mr-2" />
                    These settings are for administrators only and can affect the entire system.
                  </p>
                </div>
                
                <form onSubmit={handleSystemSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="company" className="form-label">
                        Company Name
                      </label>
                      <input
                        id="company"
                        type="text"
                        className="form-input"
                        defaultValue="TechCity"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="currency" className="form-label">
                        Currency Symbol
                      </label>
                      <input
                        id="currency"
                        type="text"
                        className="form-input"
                        defaultValue="৳"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dateFormat" className="form-label">
                        Date Format
                      </label>
                      <select id="dateFormat" className="form-select">
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY" selected>DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end">
                      <button type="submit" className="btn btn-primary flex items-center">
                        <Save size={18} className="mr-2" />
                        Save System Settings
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Backup & Restore (Admin Only) */}
            {activeTab === 'backup' && isAdmin && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Database size={20} className="mr-2 text-[var(--primary-500)]" />
                  Backup & Restore
                </h2>
                
                <div className="bg-[var(--warning-50)] border border-[var(--warning-200)] rounded-md p-4 mb-6">
                  <p className="text-sm text-[var(--warning-700)] flex items-center">
                    <Shield size={18} className="mr-2" />
                    Backup operations affect all system data. Make sure to regularly backup your data.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="card p-4">
                    <h3 className="text-lg font-medium text-[var(--neutral-800)] mb-2">Create Backup</h3>
                    <p className="text-sm text-[var(--neutral-600)] mb-4">
                      Create a full backup of your inventory data and settings
                    </p>
                    <div className="flex justify-end">
                      <button 
                        className="btn btn-primary flex items-center"
                        onClick={handleBackupNow}
                      >
                        <Save size={18} className="mr-2" />
                        Backup Now
                      </button>
                    </div>
                  </div>
                  
                  <div className="card p-4">
                    <h3 className="text-lg font-medium text-[var(--neutral-800)] mb-2">Export Data</h3>
                    <p className="text-sm text-[var(--neutral-600)] mb-4">
                      Export your inventory data to a JSON file for external use
                    </p>
                    <div className="flex justify-end">
                      <button 
                        className="btn btn-secondary flex items-center"
                        onClick={exportData}
                      >
                        <ArrowDownToLine size={18} className="mr-2" />
                        Export JSON
                      </button>
                    </div>
                  </div>
                  
                  <div className="card p-4">
                    <h3 className="text-lg font-medium text-[var(--neutral-800)] mb-2">Restore System</h3>
                    <p className="text-sm text-[var(--neutral-600)] mb-4">
                      Restore your system from a previous backup
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="backupFile"
                          className="hidden"
                          accept=".json,.backup"
                        />
                        <label
                          htmlFor="backupFile"
                          className="block w-full px-3 py-2 border border-[var(--neutral-300)] text-sm rounded-md cursor-pointer bg-white text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]"
                        >
                          Choose backup file...
                        </label>
                      </div>
                      <button 
                        className="btn btn-danger flex items-center"
                        onClick={handleRestore}
                      >
                        <RefreshCw size={18} className="mr-2" />
                        Restore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* About */}
            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Info size={20} className="mr-2 text-[var(--primary-500)]" />
                  About TechCity Inventory
                </h2>
                
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="bg-[var(--primary-500)] text-white font-bold text-3xl h-16 w-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                      TC
                    </div>
                    <h3 className="text-xl font-bold text-[var(--neutral-800)]">TechCity Inventory</h3>
                    <p className="text-sm text-[var(--neutral-500)]">Version 1.0.0</p>
                  </div>
                  
                  <div className="border-t border-[var(--neutral-200)] pt-4">
                    <h3 className="text-md font-medium text-[var(--neutral-800)] mb-2">System Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--neutral-600)]">Version</span>
                        <span className="text-sm text-[var(--neutral-800)]">1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--neutral-600)]">Released</span>
                        <span className="text-sm text-[var(--neutral-800)]">May 22, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--neutral-600)]">Last Updated</span>
                        <span className="text-sm text-[var(--neutral-800)]">May 22, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--neutral-600)]">License</span>
                        <span className="text-sm text-[var(--neutral-800)]">Commercial</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[var(--neutral-200)] pt-4">
                    <h3 className="text-md font-medium text-[var(--neutral-800)] mb-2">Support</h3>
                    <p className="text-sm text-[var(--neutral-600)] mb-4">
                      Need help? Contact our support team for assistance with the inventory management system.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Mail size={16} className="text-[var(--primary-500)] mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-[var(--neutral-800)]">Email Support</p>
                          <p className="text-sm text-[var(--neutral-600)]">support@techcity.com</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone size={16} className="text-[var(--primary-500)] mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-[var(--neutral-800)]">Phone Support</p>
                          <p className="text-sm text-[var(--neutral-600)]">+880 1712-345678</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;