export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  price: number;
  quantity: number;
  threshold: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SoldProduct {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  soldBy: string;
  soldAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

export const categories = [
  'Processor',
  'Motherboard',
  'RAM',
  'Storage',
  'Power Supply',
  'Graphics Card',
  'Chassis'
];

export const initialProducts: Product[] = [
  // Processors
  {
    id: '1',
    name: 'AMD Ryzen 5 3600',
    sku: 'CPU-AMD-R5-3600',
    category: 'Processor',
    supplier: 'AMD Official',
    price: 12500,
    quantity: 15,
    threshold: 5,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-05-20T10:45:00Z'
  },
  {
    id: '2',
    name: 'AMD Ryzen 5 5600',
    sku: 'CPU-AMD-R5-5600',
    category: 'Processor',
    supplier: 'AMD Official',
    price: 15800,
    quantity: 10,
    threshold: 3,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-01-18T09:20:00Z',
    updatedAt: '2025-05-19T14:30:00Z'
  },
  {
    id: '3',
    name: 'AMD Ryzen 7 3700X',
    sku: 'CPU-AMD-R7-3700X',
    category: 'Processor',
    supplier: 'AMD Official',
    price: 23500,
    quantity: 8,
    threshold: 3,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-01-20T11:15:00Z',
    updatedAt: '2025-05-18T16:20:00Z'
  },
  {
    id: '4',
    name: 'AMD Ryzen 7 7800X3D',
    sku: 'CPU-AMD-R7-7800X3D',
    category: 'Processor',
    supplier: 'AMD Official',
    price: 49000,
    quantity: 5,
    threshold: 2,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-02-05T10:30:00Z',
    updatedAt: '2025-05-17T09:45:00Z'
  },
  {
    id: '5',
    name: 'AMD Ryzen 9 7900X',
    sku: 'CPU-AMD-R9-7900X',
    category: 'Processor',
    supplier: 'AMD Official',
    price: 60000,
    quantity: 3,
    threshold: 1,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-02-10T14:20:00Z',
    updatedAt: '2025-05-16T11:30:00Z'
  },
  
  // Motherboards
  {
    id: '6',
    name: 'MSI B450M PRO-VDH MAX',
    sku: 'MB-MSI-B450M-PRO',
    category: 'Motherboard',
    supplier: 'MSI Bangladesh',
    price: 9200,
    quantity: 12,
    threshold: 4,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-01-25T08:45:00Z',
    updatedAt: '2025-05-15T13:20:00Z'
  },
  {
    id: '7',
    name: 'ASUS PRIME B550M-A',
    sku: 'MB-ASUS-B550M-A',
    category: 'Motherboard',
    supplier: 'ASUS Bangladesh',
    price: 14000,
    quantity: 8,
    threshold: 3,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-01-28T10:30:00Z',
    updatedAt: '2025-05-14T15:45:00Z'
  },
  
  // RAM
  {
    id: '12',
    name: 'Corsair Vengeance LPX 8GB DDR4 3200MHz',
    sku: 'RAM-COR-8GB-DDR4',
    category: 'RAM',
    supplier: 'Corsair Official',
    price: 3500,
    quantity: 20,
    threshold: 5,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-02-15T09:30:00Z',
    updatedAt: '2025-05-09T14:15:00Z'
  },
  {
    id: '13',
    name: 'G.Skill Ripjaws V 16GB DDR4 3200MHz',
    sku: 'RAM-GSK-16GB-DDR4',
    category: 'RAM',
    supplier: 'G.Skill BD',
    price: 6500,
    quantity: 15,
    threshold: 4,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-02-18T11:20:00Z',
    updatedAt: '2025-05-08T16:30:00Z'
  },
  
  // Storage
  {
    id: '18',
    name: 'WD Blue 1TB 7200rpm HDD',
    sku: 'HDD-WD-1TB-BLUE',
    category: 'Storage',
    supplier: 'Western Digital',
    price: 4200,
    quantity: 25,
    threshold: 8,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-03-05T10:15:00Z',
    updatedAt: '2025-05-03T11:45:00Z'
  },
  {
    id: '19',
    name: 'Seagate Barracuda 2TB 7200rpm HDD',
    sku: 'HDD-SEA-2TB-BARR',
    category: 'Storage',
    supplier: 'Seagate BD',
    price: 6200,
    quantity: 18,
    threshold: 5,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-03-08T12:30:00Z',
    updatedAt: '2025-05-02T13:20:00Z'
  },
  
  // Power Supply
  {
    id: '22',
    name: 'Thermaltake Smart 550W',
    sku: 'PSU-TT-550W-SMART',
    category: 'Power Supply',
    supplier: 'Thermaltake BD',
    price: 5800,
    quantity: 14,
    threshold: 4,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-03-15T09:45:00Z',
    updatedAt: '2025-04-30T10:30:00Z'
  },
  {
    id: '23',
    name: 'Corsair CV550 550W',
    sku: 'PSU-COR-550W-CV',
    category: 'Power Supply',
    supplier: 'Corsair Official',
    price: 5500,
    quantity: 16,
    threshold: 5,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-03-18T11:30:00Z',
    updatedAt: '2025-04-29T12:15:00Z'
  },
  
  // Graphics Card
  {
    id: '25',
    name: 'MSI GeForce RTX 4060 Ventus 2X 8G OC',
    sku: 'GPU-MSI-4060-8G',
    category: 'Graphics Card',
    supplier: 'MSI Bangladesh',
    price: 49500,
    quantity: 7,
    threshold: 2,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-03-25T14:30:00Z',
    updatedAt: '2025-04-26T15:45:00Z'
  },
  {
    id: '26',
    name: 'Gigabyte GeForce RTX 3060 Gaming OC 12GB',
    sku: 'GPU-GIG-3060-12G',
    category: 'Graphics Card',
    supplier: 'Gigabyte BD',
    price: 43000,
    quantity: 5,
    threshold: 2,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-03-28T16:15:00Z',
    updatedAt: '2025-04-25T17:30:00Z'
  },
  
  // Chassis
  {
    id: '29',
    name: 'Thermaltake Versa H18',
    sku: 'CASE-TT-VERSA-H18',
    category: 'Chassis',
    supplier: 'Thermaltake BD',
    price: 3200,
    quantity: 10,
    threshold: 3,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-04-05T09:30:00Z',
    updatedAt: '2025-04-22T10:45:00Z'
  },
  {
    id: '30',
    name: 'Corsair 4000D Airflow',
    sku: 'CASE-COR-4000D-AF',
    category: 'Chassis',
    supplier: 'Corsair Official',
    price: 9800,
    quantity: 6,
    threshold: 2,
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-04-08T11:15:00Z',
    updatedAt: '2025-04-21T12:30:00Z'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'AMD Official',
    contactPerson: 'Rahul Khan',
    email: 'rahul@amdbd.com',
    phone: '+8801712345678',
    address: '15/A, Gulshan Avenue, Dhaka',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-05-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'MSI Bangladesh',
    contactPerson: 'Tanvir Ahmed',
    email: 'tanvir@msibd.com',
    phone: '+8801812345678',
    address: '27, Banani DOHS, Dhaka',
    createdAt: '2025-01-12T10:30:00Z',
    updatedAt: '2025-05-14T16:15:00Z'
  },
  {
    id: '3',
    name: 'ASUS Bangladesh',
    contactPerson: 'Fahmida Rahman',
    email: 'fahmida@asusbd.com',
    phone: '+8801912345678',
    address: '42, Mohakhali DOHS, Dhaka',
    createdAt: '2025-01-15T11:45:00Z',
    updatedAt: '2025-05-13T13:30:00Z'
  },
  {
    id: '4',
    name: 'Corsair Official',
    contactPerson: 'Anik Islam',
    email: 'anik@corsairbd.com',
    phone: '+8801612345678',
    address: '18, Uttara Sector 7, Dhaka',
    createdAt: '2025-01-18T13:15:00Z',
    updatedAt: '2025-05-12T15:45:00Z'
  },
  {
    id: '5',
    name: 'G.Skill BD',
    contactPerson: 'Nadia Hossain',
    email: 'nadia@gskillbd.com',
    phone: '+8801512345678',
    address: '35, Mirpur DOHS, Dhaka',
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-05-11T12:30:00Z'
  },
  {
    id: '6',
    name: 'Western Digital',
    contactPerson: 'Sabbir Rahman',
    email: 'sabbir@wdbd.com',
    phone: '+8801312345678',
    address: '23, Bashundhara R/A, Dhaka',
    createdAt: '2025-01-25T09:45:00Z',
    updatedAt: '2025-05-10T11:15:00Z'
  },
  {
    id: '7',
    name: 'Seagate BD',
    contactPerson: 'Tahmina Akter',
    email: 'tahmina@seagatebd.com',
    phone: '+8801412345678',
    address: '12, Dhanmondi R/A, Dhaka',
    createdAt: '2025-01-28T11:00:00Z',
    updatedAt: '2025-05-09T10:30:00Z'
  },
  {
    id: '8',
    name: 'Thermaltake BD',
    contactPerson: 'Imran Hossain',
    email: 'imran@thermaltakebd.com',
    phone: '+8801212345678',
    address: '56, Banasree, Dhaka',
    createdAt: '2025-02-01T12:15:00Z',
    updatedAt: '2025-05-08T09:45:00Z'
  },
  {
    id: '9',
    name: 'Gigabyte BD',
    contactPerson: 'Sharmin Jahan',
    email: 'sharmin@gigabytebd.com',
    phone: '+8801112345678',
    address: '31, Mohammadpur, Dhaka',
    createdAt: '2025-02-05T13:30:00Z',
    updatedAt: '2025-05-07T14:00:00Z'
  },
  {
    id: '10',
    name: 'Lian Li Official',
    contactPerson: 'Raihan Ali',
    email: 'raihan@lianlibd.com',
    phone: '+8801912345678',
    address: '9, New Eskaton, Dhaka',
    createdAt: '2025-02-08T14:45:00Z',
    updatedAt: '2025-05-06T16:15:00Z'
  }
];

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Tanmay Das',
    email: 'admin@glitched.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastLogin: '2025-05-22T08:30:00Z',
    createdAt: '2025-01-01T09:00:00Z'
  },
  {
    id: '2',
    name: 'Pritom',
    email: 'manager@glitched.com',
    role: 'manager',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastLogin: '2025-05-21T14:15:00Z',
    createdAt: '2025-01-05T10:30:00Z'
  },
  {
    id: '3',
    name: 'Robin',
    email: 'staff1@glitched.com',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastLogin: '2025-05-22T09:45:00Z',
    createdAt: '2025-01-10T11:45:00Z'
  },
  {
    id: '4',
    name: 'Salman',
    email: 'staff2@glitched.com',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastLogin: '2025-05-21T16:30:00Z',
    createdAt: '2025-01-15T13:15:00Z'
  }
];

export const initialSoldProducts: SoldProduct[] = [
  {
    id: '1',
    productId: '1',
    quantity: 2,
    price: 12500,
    totalPrice: 25000,
    soldBy: '3',
    soldAt: '2025-05-01T10:30:00Z',
    customerName: 'Rakib Hassan',
    customerPhone: '+8801712345678',
    customerEmail: 'rakib@example.com',
    customerAddress: '123/A, Gulshan Avenue, Dhaka-1212, Bangladesh'
  },
  {
    id: '2',
    productId: '2',
    quantity: 1,
    price: 15800,
    totalPrice: 15800,
    soldBy: '4',
    soldAt: '2025-05-02T14:15:00Z',
    customerName: 'Sadia Rahman',
    customerPhone: '+8801812345678',
    customerEmail: 'sadia@example.com',
    customerAddress: '45/B, Banani DOHS, Dhaka-1213, Bangladesh'
  },
  {
    id: '3',
    productId: '3',
    quantity: 1,
    price: 23500,
    totalPrice: 23500,
    soldBy: '3',
    soldAt: '2025-05-03T09:45:00Z',
    customerName: 'Kamal Hossain',
    customerPhone: '+8801912345678',
    customerEmail: 'kamal@example.com',
    customerAddress: '78/C, Bashundhara R/A, Dhaka-1229, Bangladesh'
  }
];