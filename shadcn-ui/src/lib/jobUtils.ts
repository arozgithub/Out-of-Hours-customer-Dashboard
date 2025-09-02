import { Job, Customer, Engineer } from '@/types/job';

// Utility functions for styling
export const getStatusColor = (status: Job['status']): string => {
  switch (status) {
    case 'green':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'amber':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'red':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityColor = (priority: Job['priority']): string => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getEngineerStatusColor = (status: Engineer['status']): string => {
  switch (status) {
    case 'accept':
      return 'bg-green-500';
    case 'onsite':
      return 'bg-blue-500';
    case 'travel':
      return 'bg-yellow-500';
    case 'completed':
      return 'bg-gray-400';
    case 'require_revisit':
      return 'bg-orange-500';
    default:
      return 'bg-gray-400';
  }
};

// Generate job number
export const generateJobNumber = (): string => {
  const prefix = 'JOB';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Mock data
export const mockJobTrades = [
  'Electrical',
  'Plumbing',
  'HVAC',
  'Carpentry',
  'Painting',
  'Roofing',
  'Flooring',
  'Landscaping',
  'Security Systems',
  'Fire Safety'
];

export const mockTags = [
  'Urgent',
  'Scheduled',
  'Maintenance',
  'Repair',
  'Installation',
  'Inspection',
  'Emergency',
  'Warranty',
  'Preventive',
  'Compliance'
];

export const mockEngineers: Engineer[] = [
  {
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    status: 'accept',
    syncStatus: 'synced',
    currentJobs: 2
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    status: 'onsite',
    syncStatus: 'synced',
    currentJobs: 1
  },
  {
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    phone: '+1 (555) 345-6789',
    status: 'travel',
    syncStatus: 'pending',
    currentJobs: 3
  },
  {
    name: 'Lisa Wilson',
    email: 'lisa.wilson@company.com',
    phone: '+1 (555) 456-7890',
    status: 'accept',
    syncStatus: 'synced',
    currentJobs: 1
  },
  {
    name: 'Tom Brown',
    email: 'tom.brown@company.com',
    phone: '+1 (555) 567-8901',
    status: 'completed',
    syncStatus: 'synced',
    currentJobs: 0
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 100-2000',
    sites: ['Main Office', 'Warehouse A', 'Warehouse B', 'Distribution Center']
  },
  {
    id: '2',
    name: 'TechStart Inc',
    email: 'support@techstart.com',
    phone: '+1 (555) 200-3000',
    sites: ['Headquarters', 'R&D Lab', 'Data Center']
  },
  {
    id: '3',
    name: 'Global Manufacturing',
    email: 'facilities@globalmfg.com',
    phone: '+1 (555) 300-4000',
    sites: ['Plant 1', 'Plant 2', 'Quality Control', 'Administration']
  },
  {
    id: '4',
    name: 'Metro Hospital',
    email: 'maintenance@metrohospital.com',
    phone: '+1 (555) 400-5000',
    sites: ['Main Building', 'Emergency Wing', 'Parking Garage', 'Cafeteria']
  },
  {
    id: '5',
    name: 'City University',
    email: 'facilities@cityuni.edu',
    phone: '+1 (555) 500-6000',
    sites: ['Library', 'Science Building', 'Student Center', 'Dormitory A', 'Dormitory B']
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    jobNumber: 'JOB-240901-001',
    customer: 'Acme Corporation',
    site: 'Main Office',
    description: 'HVAC system maintenance in conference room',
    engineer: 'John Smith',
    status: 'amber',
    priority: 'High',
    category: 'HVAC',
    jobType: 'Maintenance',
    targetCompletionTime: 120,
    dateLogged: new Date('2024-09-01T09:00:00'),
    dateAccepted: new Date('2024-09-01T09:15:00'),
    dateOnSite: null,
    dateCompleted: null,
    reason: null,
    createdAt: new Date('2024-09-01T09:00:00'),
    updatedAt: new Date('2024-09-01T09:30:00'),
    contact: {
      name: 'Alice Johnson',
      number: '+1 (555) 101-2001',
      email: 'alice.johnson@acme.com',
      relationship: 'Facilities Manager'
    },
    reporter: {
      name: 'Bob Wilson',
      number: '+1 (555) 101-2002',
      email: 'bob.wilson@acme.com',
      relationship: 'Office Manager'
    },
    primaryJobTrade: 'HVAC',
    secondaryJobTrades: ['Electrical'],
    tags: ['Maintenance', 'Scheduled'],
    customAlerts: {
      acceptSLA: 30,
      onsiteSLA: 90,
      completedSLA: 180
    },
    project: 'Q3 Maintenance',
    customerOrderNumber: 'PO-2024-001',
    referenceNumber: 'REF-001',
    jobOwner: 'Facilities Department',
    jobRef1: 'HVAC-001',
    jobRef2: 'MAINT-001',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-02T10:00:00'),
    startDate: new Date('2024-09-01T09:00:00'),
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  },
  {
    id: '2',
    jobNumber: 'JOB-240901-002',
    customer: 'TechStart Inc',
    site: 'Data Center',
    description: 'Emergency electrical repair - server room power outage',
    engineer: 'Sarah Johnson',
    status: 'red',
    priority: 'Critical',
    category: 'Electrical',
    jobType: 'Emergency',
    targetCompletionTime: 60,
    dateLogged: new Date('2024-09-01T14:30:00'),
    dateAccepted: new Date('2024-09-01T14:35:00'),
    dateOnSite: new Date('2024-09-01T14:50:00'),
    dateCompleted: null,
    reason: null,
    createdAt: new Date('2024-09-01T14:30:00'),
    updatedAt: new Date('2024-09-01T14:45:00'),
    contact: {
      name: 'David Chen',
      number: '+1 (555) 201-3001',
      email: 'david.chen@techstart.com',
      relationship: 'IT Manager'
    },
    reporter: {
      name: 'Emma Davis',
      number: '+1 (555) 201-3002',
      email: 'emma.davis@techstart.com',
      relationship: 'System Administrator'
    },
    primaryJobTrade: 'Electrical',
    secondaryJobTrades: [],
    tags: ['Emergency', 'Critical'],
    customAlerts: {
      acceptSLA: 10,
      onsiteSLA: 30,
      completedSLA: 60
    },
    project: 'Infrastructure',
    customerOrderNumber: 'EMG-2024-001',
    referenceNumber: 'REF-002',
    jobOwner: 'IT Department',
    jobRef1: 'ELEC-002',
    jobRef2: 'EMG-002',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-01T15:00:00'),
    startDate: new Date('2024-09-01T14:30:00'),
    endDate: null,
    lockVisitDateTime: true,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  }
];