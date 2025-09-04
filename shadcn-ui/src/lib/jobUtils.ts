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
    currentJobs: 1
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
    currentJobs: 1
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
    dateAccepted: null,
    dateOnSite: null,
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
  },
  {
    id: '3',
    jobNumber: 'JOB-240901-003',
    customer: 'Global Manufacturing',
    site: 'Plant 1',
    description: 'Plumbing leak in production area - urgent repair needed',
    engineer: 'Mike Davis',
    status: 'red',
    priority: 'High',
    category: 'Plumbing',
    jobType: 'Emergency',
    targetCompletionTime: 90,
    dateLogged: new Date('2024-09-01T16:00:00'),
    dateAccepted: null,
    dateOnSite: null,
    dateCompleted: null,
    reason: null,
    createdAt: new Date('2024-09-01T16:00:00'),
    updatedAt: new Date('2024-09-01T16:00:00'),
    contact: {
      name: 'Frank Miller',
      number: '+1 (555) 301-4001',
      email: 'frank.miller@globalmfg.com',
      relationship: 'Plant Manager'
    },
    reporter: {
      name: 'Grace Wong',
      number: '+1 (555) 301-4002',
      email: 'grace.wong@globalmfg.com',
      relationship: 'Maintenance Supervisor'
    },
    primaryJobTrade: 'Plumbing',
    secondaryJobTrades: [],
    tags: ['Emergency', 'Urgent'],
    customAlerts: {
      acceptSLA: 15,
      onsiteSLA: 45,
      completedSLA: 120
    },
    project: 'Production Support',
    customerOrderNumber: 'URG-2024-001',
    referenceNumber: 'REF-003',
    jobOwner: 'Maintenance Department',
    jobRef1: 'PLMB-003',
    jobRef2: 'URG-003',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-01T17:00:00'),
    startDate: new Date('2024-09-01T16:00:00'),
    endDate: null,
    lockVisitDateTime: true,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  },
  {
    id: '4',
    jobNumber: 'JOB-240901-004',
    customer: 'Metro Hospital',
    site: 'Emergency Wing',
    description: 'Backup generator maintenance check',
    engineer: 'Lisa Wilson',
    status: 'amber',
    priority: 'Medium',
    category: 'Electrical',
    jobType: 'Maintenance',
    targetCompletionTime: 180,
    dateLogged: new Date('2024-09-01T08:00:00'),
    dateAccepted: new Date('2024-09-01T08:30:00'),
    dateOnSite: new Date('2024-09-01T09:00:00'),
    dateCompleted: null,
    reason: null,
    createdAt: new Date('2024-09-01T08:00:00'),
    updatedAt: new Date('2024-09-01T09:00:00'),
    contact: {
      name: 'Dr. Helen Roberts',
      number: '+1 (555) 401-5001',
      email: 'h.roberts@metrohospital.com',
      relationship: 'Emergency Department Head'
    },
    reporter: {
      name: 'Jack Thompson',
      number: '+1 (555) 401-5002',
      email: 'j.thompson@metrohospital.com',
      relationship: 'Facilities Coordinator'
    },
    primaryJobTrade: 'Electrical',
    secondaryJobTrades: ['HVAC'],
    tags: ['Maintenance', 'Critical Infrastructure'],
    customAlerts: {
      acceptSLA: 30,
      onsiteSLA: 60,
      completedSLA: 240
    },
    project: 'Emergency Readiness',
    customerOrderNumber: 'MAINT-2024-001',
    referenceNumber: 'REF-004',
    jobOwner: 'Facilities Management',
    jobRef1: 'GEN-004',
    jobRef2: 'MAINT-004',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-01T09:00:00'),
    startDate: new Date('2024-09-01T08:00:00'),
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: true,
    completionTimeFromEngineerOnsite: false
  },
  {
    id: '5',
    jobNumber: 'JOB-240901-005',
    customer: 'City University',
    site: 'Library',
    description: 'Security system installation in new reading room',
    engineer: 'Tom Brown',
    status: 'green',
    priority: 'Low',
    category: 'Security Systems',
    jobType: 'Installation',
    targetCompletionTime: 240,
    dateLogged: new Date('2024-08-30T10:00:00'),
    dateAccepted: new Date('2024-08-30T10:30:00'),
    dateOnSite: new Date('2024-08-31T09:00:00'),
    dateCompleted: new Date('2024-09-01T15:00:00'),
    reason: null,
    createdAt: new Date('2024-08-30T10:00:00'),
    updatedAt: new Date('2024-09-01T15:00:00'),
    contact: {
      name: 'Prof. Kevin Lee',
      number: '+1 (555) 501-6001',
      email: 'k.lee@cityuni.edu',
      relationship: 'Head Librarian'
    },
    reporter: {
      name: 'Mary Johnson',
      number: '+1 (555) 501-6002',
      email: 'm.johnson@cityuni.edu',
      relationship: 'Campus Security'
    },
    primaryJobTrade: 'Security Systems',
    secondaryJobTrades: ['Electrical'],
    tags: ['Installation', 'Scheduled'],
    customAlerts: {
      acceptSLA: 60,
      onsiteSLA: 120,
      completedSLA: 360
    },
    project: 'Library Renovation',
    customerOrderNumber: 'INSTALL-2024-001',
    referenceNumber: 'REF-005',
    jobOwner: 'Campus Facilities',
    jobRef1: 'SEC-005',
    jobRef2: 'INSTALL-005',
    requiresApproval: true,
    preferredAppointmentDate: new Date('2024-08-31T09:00:00'),
    startDate: new Date('2024-08-30T10:00:00'),
    endDate: new Date('2024-09-01T15:00:00'),
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: true
  },
  {
    id: '6',
    jobNumber: 'JOB-240901-006',
    customer: 'Acme Corporation',
    site: 'Warehouse A',
    description: 'Fire alarm system annual inspection',
    engineer: 'John Smith',
    status: 'red',
    priority: 'Medium',
    category: 'Fire Safety',
    jobType: 'Inspection',
    targetCompletionTime: 150,
    dateLogged: new Date('2024-09-01T13:00:00'),
    dateAccepted: null,
    dateOnSite: null,
    dateCompleted: null,
    reason: null,
    createdAt: new Date('2024-09-01T13:00:00'),
    updatedAt: new Date('2024-09-01T13:00:00'),
    contact: {
      name: 'Alice Johnson',
      number: '+1 (555) 101-2001',
      email: 'alice.johnson@acme.com',
      relationship: 'Facilities Manager'
    },
    reporter: {
      name: 'Safety Officer Dan',
      number: '+1 (555) 101-2003',
      email: 'dan.safety@acme.com',
      relationship: 'Safety Officer'
    },
    primaryJobTrade: 'Fire Safety',
    secondaryJobTrades: ['Electrical'],
    tags: ['Inspection', 'Compliance'],
    customAlerts: {
      acceptSLA: 45,
      onsiteSLA: 90,
      completedSLA: 240
    },
    project: 'Annual Compliance',
    customerOrderNumber: 'INSP-2024-001',
    referenceNumber: 'REF-006',
    jobOwner: 'Safety Department',
    jobRef1: 'FIRE-006',
    jobRef2: 'INSP-006',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-02T14:00:00'),
    startDate: new Date('2024-09-01T13:00:00'),
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: true,
    completionTimeFromEngineerOnsite: false
  }
];