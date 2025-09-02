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
    syncStatus: 'Synced'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    status: 'onsite',
    syncStatus: 'Synced'
  },
  {
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    phone: '+1 (555) 345-6789',
    status: 'traveling',
    syncStatus: 'Pending'
  },
  {
    name: 'Lisa Wilson',
    email: 'lisa.wilson@company.com',
    phone: '+1 (555) 456-7890',
    status: 'accept',
    syncStatus: 'Synced'
  },
  {
    name: 'Tom Brown',
    email: 'tom.brown@company.com',
    phone: '+1 (555) 567-8901',
    status: 'completed',
    syncStatus: 'Synced'
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
    description: 'Routine safety inspection of fire suppression system',
    engineer: 'Mike Davis',
    status: 'green',
    priority: 'Medium',
    category: 'Fire Safety',
    jobType: 'Inspection',
    targetCompletionTime: 180,
    createdAt: new Date('2024-09-01T08:00:00'),
    updatedAt: new Date('2024-09-01T11:00:00'),
    contact: {
      name: 'Frank Miller',
      number: '+1 (555) 301-4001',
      email: 'frank.miller@globalmfg.com',
      relationship: 'Safety Manager'
    },
    reporter: {
      name: 'Grace Lee',
      number: '+1 (555) 301-4002',
      email: 'grace.lee@globalmfg.com',
      relationship: 'Plant Supervisor'
    },
    primaryJobTrade: 'Fire Safety',
    secondaryJobTrades: ['Electrical'],
    tags: ['Inspection', 'Compliance'],
    customAlerts: {
      acceptSLA: 60,
      onsiteSLA: 180,
      completedSLA: 360
    },
    project: 'Safety Compliance',
    customerOrderNumber: 'INS-2024-001',
    referenceNumber: 'REF-003',
    jobOwner: 'Safety Department',
    jobRef1: 'FIRE-003',
    jobRef2: 'INS-003',
    requiresApproval: true,
    preferredAppointmentDate: new Date('2024-09-02T09:00:00'),
    startDate: new Date('2024-09-01T08:00:00'),
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: true,
    completionTimeFromEngineerOnsite: false
  },
  {
    id: '4',
    jobNumber: 'JOB-240901-004',
    customer: 'Metro Hospital',
    site: 'Emergency Wing',
    description: 'Plumbing repair in patient bathroom - water leak',
    engineer: 'Lisa Wilson',
    status: 'amber',
    priority: 'High',
    category: 'Plumbing',
    jobType: 'Repair',
    targetCompletionTime: 90,
    createdAt: new Date('2024-09-01T12:15:00'),
    updatedAt: new Date('2024-09-01T12:30:00'),
    contact: {
      name: 'Helen Rodriguez',
      number: '+1 (555) 401-5001',
      email: 'helen.rodriguez@metrohospital.com',
      relationship: 'Facilities Coordinator'
    },
    reporter: {
      name: 'Ivan Petrov',
      number: '+1 (555) 401-5002',
      email: 'ivan.petrov@metrohospital.com',
      relationship: 'Maintenance Supervisor'
    },
    primaryJobTrade: 'Plumbing',
    secondaryJobTrades: [],
    tags: ['Repair', 'Urgent'],
    customAlerts: {
      acceptSLA: 20,
      onsiteSLA: 60,
      completedSLA: 120
    },
    project: 'Emergency Wing Maintenance',
    customerOrderNumber: 'REP-2024-001',
    referenceNumber: 'REF-004',
    jobOwner: 'Facilities Department',
    jobRef1: 'PLUMB-004',
    jobRef2: 'REP-004',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-01T13:00:00'),
    startDate: new Date('2024-09-01T12:15:00'),
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  },
  {
    id: '5',
    jobNumber: 'JOB-240901-005',
    customer: 'City University',
    site: 'Library',
    description: 'Installation of new security cameras in reading areas',
    engineer: 'Tom Brown',
    status: 'completed',
    priority: 'Low',
    category: 'Security Systems',
    jobType: 'Installation',
    targetCompletionTime: 240,
    createdAt: new Date('2024-08-30T10:00:00'),
    updatedAt: new Date('2024-09-01T16:00:00'),
    contact: {
      name: 'Julia Kim',
      number: '+1 (555) 501-6001',
      email: 'julia.kim@cityuni.edu',
      relationship: 'Library Director'
    },
    reporter: {
      name: 'Kevin O\'Connor',
      number: '+1 (555) 501-6002',
      email: 'kevin.oconnor@cityuni.edu',
      relationship: 'Security Manager'
    },
    primaryJobTrade: 'Security Systems',
    secondaryJobTrades: ['Electrical'],
    tags: ['Installation', 'Scheduled'],
    customAlerts: {
      acceptSLA: 120,
      onsiteSLA: 240,
      completedSLA: 480
    },
    project: 'Campus Security Upgrade',
    customerOrderNumber: 'INST-2024-001',
    referenceNumber: 'REF-005',
    jobOwner: 'Security Department',
    jobRef1: 'SEC-005',
    jobRef2: 'INST-005',
    requiresApproval: true,
    preferredAppointmentDate: new Date('2024-08-30T11:00:00'),
    startDate: new Date('2024-08-30T10:00:00'),
    endDate: new Date('2024-09-01T16:00:00'),
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: true
  },
  {
    id: '6',
    jobNumber: 'JOB-240902-006',
    customer: 'Acme Corporation',
    site: 'Warehouse A',
    description: 'Painting touch-up work in loading dock area',
    engineer: 'John Smith',
    status: 'green',
    priority: 'Low',
    category: 'Painting',
    jobType: 'Maintenance',
    targetCompletionTime: 300,
    createdAt: new Date('2024-09-02T07:30:00'),
    updatedAt: new Date('2024-09-02T08:00:00'),
    contact: {
      name: 'Laura Martinez',
      number: '+1 (555) 101-2003',
      email: 'laura.martinez@acme.com',
      relationship: 'Warehouse Manager'
    },
    reporter: {
      name: 'Mark Thompson',
      number: '+1 (555) 101-2004',
      email: 'mark.thompson@acme.com',
      relationship: 'Dock Supervisor'
    },
    primaryJobTrade: 'Painting',
    secondaryJobTrades: [],
    tags: ['Maintenance', 'Preventive'],
    customAlerts: {
      acceptSLA: 60,
      onsiteSLA: 180,
      completedSLA: 360
    },
    project: 'Warehouse Maintenance',
    customerOrderNumber: 'PAINT-2024-001',
    referenceNumber: 'REF-006',
    jobOwner: 'Warehouse Operations',
    jobRef1: 'PAINT-006',
    jobRef2: 'MAINT-006',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-03T09:00:00'),
    startDate: new Date('2024-09-02T07:30:00'),
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  },
  {
    id: '7',
    jobNumber: 'JOB-240902-007',
    customer: 'TechStart Inc',
    site: 'Headquarters',
    description: 'Carpet replacement in executive conference room',
    engineer: 'Sarah Johnson',
    status: 'amber',
    priority: 'Medium',
    category: 'Flooring',
    jobType: 'Installation',
    targetCompletionTime: 480,
    createdAt: new Date('2024-09-02T09:15:00'),
    updatedAt: new Date('2024-09-02T09:45:00'),
    contact: {
      name: 'Nancy Wilson',
      number: '+1 (555) 201-3003',
      email: 'nancy.wilson@techstart.com',
      relationship: 'Executive Assistant'
    },
    reporter: {
      name: 'Oscar Garcia',
      number: '+1 (555) 201-3004',
      email: 'oscar.garcia@techstart.com',
      relationship: 'Facilities Coordinator'
    },
    primaryJobTrade: 'Flooring',
    secondaryJobTrades: [],
    tags: ['Installation', 'Scheduled'],
    customAlerts: {
      acceptSLA: 30,
      onsiteSLA: 90,
      completedSLA: 180
    },
    project: 'Office Renovation',
    customerOrderNumber: 'FLOOR-2024-001',
    referenceNumber: 'REF-007',
    jobOwner: 'Executive Office',
    jobRef1: 'FLOOR-007',
    jobRef2: 'RENO-007',
    requiresApproval: true,
    preferredAppointmentDate: new Date('2024-09-04T08:00:00'),
    startDate: new Date('2024-09-02T09:15:00'),
    endDate: null,
    lockVisitDateTime: false,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  },
  {
    id: '8',
    jobNumber: 'JOB-240902-008',
    customer: 'Global Manufacturing',
    site: 'Quality Control',
    description: 'Roof leak repair above testing equipment',
    engineer: 'Mike Davis',
    status: 'red',
    priority: 'Critical',
    category: 'Roofing',
    jobType: 'Emergency',
    targetCompletionTime: 120,
    createdAt: new Date('2024-09-02T11:00:00'),
    updatedAt: new Date('2024-09-02T11:15:00'),
    contact: {
      name: 'Paul Anderson',
      number: '+1 (555) 301-4003',
      email: 'paul.anderson@globalmfg.com',
      relationship: 'QC Manager'
    },
    reporter: {
      name: 'Quinn Roberts',
      number: '+1 (555) 301-4004',
      email: 'quinn.roberts@globalmfg.com',
      relationship: 'QC Technician'
    },
    primaryJobTrade: 'Roofing',
    secondaryJobTrades: ['Electrical'],
    tags: ['Emergency', 'Critical'],
    customAlerts: {
      acceptSLA: 10,
      onsiteSLA: 30,
      completedSLA: 60
    },
    project: 'Emergency Repairs',
    customerOrderNumber: 'EMG-2024-002',
    referenceNumber: 'REF-008',
    jobOwner: 'Quality Control',
    jobRef1: 'ROOF-008',
    jobRef2: 'EMG-008',
    requiresApproval: false,
    preferredAppointmentDate: new Date('2024-09-02T12:00:00'),
    startDate: new Date('2024-09-02T11:00:00'),
    endDate: null,
    lockVisitDateTime: true,
    deployToMobile: true,
    isRecurringJob: false,
    completionTimeFromEngineerOnsite: false
  }
];