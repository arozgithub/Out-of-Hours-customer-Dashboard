import React, { createContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Job, Customer, Engineer } from '@/types/job';
import { mockJobs, mockCustomers, mockEngineers } from '@/lib/jobUtils';

interface JobContextType {
  // Jobs
  jobs: Job[];
  addJob: (jobData: Omit<Job, 'id'>) => Job;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  getJobById: (jobId: string) => Job | undefined;
  getJobsByCustomer: (customerName: string) => Job[];
  getJobsByEngineer: (engineerName: string) => Job[];
  getJobsByStatus: (status: Job['status']) => Job[];
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  
  // Engineers
  engineers: Engineer[];
  updateEngineer: (engineerName: string, updates: Partial<Engineer>) => void;
  
  // Stats & Analytics
  getJobStats: () => {
    total: number;
    completed: number;
    pending: number;
    critical: number;
    red: number;
    amber: number;
    green: number;
  };
  
  // Utility functions
  refreshData: () => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOBS: 'jobdashboard_jobs',
  CUSTOMERS: 'jobdashboard_customers', 
  ENGINEERS: 'jobdashboard_engineers',
  VERSION: 'jobdashboard_version'
} as const;

const CURRENT_VERSION = '1.0.0';

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data from localStorage or defaults
  useEffect(() => {
    initializeData();
  }, []);

  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      localStorage.setItem(STORAGE_KEYS.ENGINEERS, JSON.stringify(engineers));
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }, [jobs, customers, engineers]);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    if (isInitialized) {
      saveToStorage();
    }
  }, [jobs, customers, engineers, isInitialized, saveToStorage]);

  const initializeData = () => {
    try {
      // Check version compatibility
      const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
      const isVersionCompatible = storedVersion === CURRENT_VERSION;

      // Load jobs
      const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
      const parsedJobs = storedJobs && isVersionCompatible 
        ? JSON.parse(storedJobs).map((job: Job) => ({
            ...job,
            createdAt: new Date(job.createdAt),
            updatedAt: new Date(job.updatedAt),
            dateLogged: new Date(job.dateLogged),
            dateAccepted: job.dateAccepted ? new Date(job.dateAccepted) : null,
            dateOnSite: job.dateOnSite ? new Date(job.dateOnSite) : null,
            dateCompleted: job.dateCompleted ? new Date(job.dateCompleted) : null,
            preferredAppointmentDate: job.preferredAppointmentDate ? new Date(job.preferredAppointmentDate) : null,
            startDate: job.startDate ? new Date(job.startDate) : null,
            endDate: job.endDate ? new Date(job.endDate) : null,
          }))
        : mockJobs;

      // Load customers
      const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      const parsedCustomers = storedCustomers && isVersionCompatible
        ? JSON.parse(storedCustomers)
        : mockCustomers;

      // Load engineers
      const storedEngineers = localStorage.getItem(STORAGE_KEYS.ENGINEERS);
      const parsedEngineers = storedEngineers && isVersionCompatible
        ? JSON.parse(storedEngineers)
        : mockEngineers;

      setJobs(parsedJobs);
      setCustomers(parsedCustomers);
      setEngineers(parsedEngineers);
      setIsInitialized(true);

      // Update version
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);

      console.log('📊 JobContext initialized:', {
        jobs: parsedJobs.length,
        customers: parsedCustomers.length,
        engineers: parsedEngineers.length,
        fromStorage: isVersionCompatible && storedJobs !== null
      });

    } catch (error) {
      console.error('❌ Error initializing JobContext:', error);
      // Fallback to mock data
      setJobs(mockJobs);
      setCustomers(mockCustomers);
      setEngineers(mockEngineers);
      setIsInitialized(true);
    }
  };

  // Job management functions
  const addJob = (jobData: Omit<Job, 'id'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setJobs(prev => [newJob, ...prev]);
    
    console.log('✅ Job added:', newJob.jobNumber);
    return newJob;
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, ...updates, updatedAt: new Date() }
        : job
    ));
    
    console.log('📝 Job updated:', jobId, updates);
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    console.log('🗑️ Job deleted:', jobId);
  };

  const getJobById = (jobId: string): Job | undefined => {
    return jobs.find(job => job.id === jobId);
  };

  const getJobsByCustomer = (customerName: string): Job[] => {
    return jobs.filter(job => job.customer === customerName);
  };

  const getJobsByEngineer = (engineerName: string): Job[] => {
    return jobs.filter(job => job.engineer === engineerName);
  };

  const getJobsByStatus = (status: Job['status']): Job[] => {
    return jobs.filter(job => job.status === status);
  };

  // Customer management
  const addCustomer = (customerData: Omit<Customer, 'id'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };

    setCustomers(prev => [newCustomer, ...prev]);
    console.log('✅ Customer added:', newCustomer.name);
    return newCustomer;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, ...updates }
        : customer
    ));
    console.log('📝 Customer updated:', customerId);
  };

  // Engineer management
  const updateEngineer = (engineerName: string, updates: Partial<Engineer>) => {
    setEngineers(prev => prev.map(engineer => 
      engineer.name === engineerName 
        ? { ...engineer, ...updates }
        : engineer
    ));
    console.log('📝 Engineer updated:', engineerName);
  };

  // Stats & Analytics
  const getJobStats = () => {
    const total = jobs.length;
    const completed = jobs.filter(job => job.status === 'completed').length;
    const pending = jobs.filter(job => job.status !== 'completed').length;
    const critical = jobs.filter(job => job.priority === 'Critical').length;
    const red = jobs.filter(job => job.status === 'red').length;
    const amber = jobs.filter(job => job.status === 'amber').length;
    const green = jobs.filter(job => job.status === 'green').length;

    return { total, completed, pending, critical, red, amber, green };
  };

  // Utility functions
  const refreshData = () => {
    initializeData();
    console.log('🔄 Data refreshed from storage');
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.ENGINEERS);
    localStorage.removeItem(STORAGE_KEYS.VERSION);
    
    setJobs(mockJobs);
    setCustomers(mockCustomers);
    setEngineers(mockEngineers);
    
    console.log('🧹 All data cleared, reset to defaults');
  };

  const exportData = (): string => {
    const exportData = {
      version: CURRENT_VERSION,
      timestamp: new Date().toISOString(),
      jobs,
      customers,
      engineers
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.jobs) setJobs(data.jobs);
      if (data.customers) setCustomers(data.customers);
      if (data.engineers) setEngineers(data.engineers);
      
      console.log('📥 Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  };

  const contextValue: JobContextType = {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobsByCustomer,
    getJobsByEngineer,
    getJobsByStatus,
    customers,
    addCustomer,
    updateCustomer,
    engineers,
    updateEngineer,
    getJobStats,
    refreshData,
    clearAllData,
    exportData,
    importData
  };

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
