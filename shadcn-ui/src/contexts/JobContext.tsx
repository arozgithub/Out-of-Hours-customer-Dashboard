import React, { createContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Job, Customer, Engineer } from '@/types/job';
import { mockJobs, mockCustomers, mockEngineers } from '@/lib/jobUtils';
import { notificationService } from '@/lib/notificationService';

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
  getJobsByPriority: (priority: Job['priority']) => Job[];
  getJobsByCategory: (category: string) => Job[];
  getJobsByDateRange: (startDate: Date, endDate: Date) => Job[];
  
  // Advanced filtering
  getFilteredJobs: (filters: {
    customer?: string;
    engineer?: string;
    status?: Job['status'];
    priority?: Job['priority'];
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => Job[];
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  getCustomerById: (customerId: string) => Customer | undefined;
  getCustomerByName: (customerName: string) => Customer | undefined;
  getCustomerStats: (customerName: string) => {
    totalJobs: number;
    completedJobs: number;
    pendingJobs: number;
    criticalJobs: number;
    statusBreakdown: { red: number; amber: number; green: number; };
  };
  
  // Engineers
  engineers: Engineer[];
  updateEngineer: (engineerName: string, updates: Partial<Engineer>) => void;
  getEngineerByName: (engineerName: string) => Engineer | undefined;
  getEngineerStats: (engineerName: string) => {
    totalJobs: number;
    completedJobs: number;
    pendingJobs: number;
    criticalJobs: number;
    statusBreakdown: { red: number; amber: number; green: number; };
    avgCompletionTime?: number;
  };
  
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
  
  getOverallStats: () => {
    jobs: {
      total: number;
      completed: number;
      pending: number;
      critical: number;
      statusBreakdown: { red: number; amber: number; green: number; };
    };
    customers: {
      total: number;
      active: number;
      mostActiveCustomer?: string;
    };
    engineers: {
      total: number;
      active: number;
      mostActiveEngineer?: string;
    };
  };
  
  // Utility functions
  refreshData: () => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  backupData: () => void;
  restoreFromBackup: () => boolean;
  migrateFromOldKeys: () => boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOBS: 'out_of_hours_dashboard_jobs',
  CUSTOMERS: 'out_of_hours_dashboard_customers', 
  ENGINEERS: 'out_of_hours_dashboard_engineers',
  VERSION: 'out_of_hours_dashboard_version'
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

  // Backup current data to a timestamped key
  const backupData = () => {
    try {
      const backupKey = `out_of_hours_dashboard_backup_${Date.now()}`;
      const dataToBackup = {
        timestamp: new Date().toISOString(),
        version: CURRENT_VERSION,
        jobs,
        customers,
        engineers
      };
      localStorage.setItem(backupKey, JSON.stringify(dataToBackup));
      console.log('💾 Data backed up to key:', backupKey);
    } catch (error) {
      console.error('❌ Error backing up data:', error);
    }
  };

  // Restore from the most recent backup
  const restoreFromBackup = (): boolean => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('out_of_hours_dashboard_backup_')
      );
      
      if (keys.length === 0) {
        console.log('📝 No backups found');
        return false;
      }

      // Get the most recent backup
      const latestBackupKey = keys.sort().pop();
      if (!latestBackupKey) return false;

      const backupData = localStorage.getItem(latestBackupKey);
      if (!backupData) return false;

      const data = JSON.parse(backupData);
      setJobs(data.jobs || []);
      setCustomers(data.customers || []);
      setEngineers(data.engineers || []);

      console.log('📦 Data restored from backup:', latestBackupKey);
      return true;
    } catch (error) {
      console.error('❌ Error restoring from backup:', error);
      return false;
    }
  };

  // Migrate data from old localStorage keys
  const migrateFromOldKeys = (): boolean => {
    try {
      const oldKeys = [
        'jobdashboard_jobs',
        'job_tracker_jobs', 
        'dashboard_jobs'
      ];

      let migrated = false;

      for (const oldKey of oldKeys) {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const parsedData = JSON.parse(oldData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              // Check if it looks like job data
              if (parsedData[0].jobNumber || parsedData[0].id) {
                setJobs(prevJobs => {
                  // Merge with existing jobs, avoiding duplicates
                  const existingIds = new Set(prevJobs.map(job => job.id));
                  const newJobs = parsedData.filter((job: Job) => !existingIds.has(job.id));
                  return [...prevJobs, ...newJobs];
                });
                migrated = true;
                console.log('🔄 Migrated jobs from:', oldKey);
              }
            }
          } catch (parseError) {
            console.warn('⚠️ Could not parse old data from:', oldKey);
          }
        }
      }

      if (migrated) {
        console.log('✅ Data migration completed');
      }

      return migrated;
    } catch (error) {
      console.error('❌ Error during migration:', error);
      return false;
    }
  };

  // Initialize data from localStorage or defaults
  useEffect(() => {
    const initializeData = () => {
      try {
        // Check version compatibility
        const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
        const isVersionCompatible = storedVersion === CURRENT_VERSION;

        // Load jobs
        const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
        
        // If no data found, try to migrate from old keys
        let parsedJobs = mockJobs;
        let parsedCustomers = mockCustomers;
        let parsedEngineers = mockEngineers;
        let dataSource = 'mock';

        if (storedJobs && isVersionCompatible) {
          parsedJobs = JSON.parse(storedJobs).map((job: Job) => ({
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
          }));
          dataSource = 'storage';
        } else if (!storedJobs) {
          // Try to restore from backup first
          const backupRestored = restoreFromBackup();
          if (backupRestored) {
            dataSource = 'backup';
            console.log('📦 Data restored from backup');
            return; // Early return as restoreFromBackup sets the state
          } else {
            // Try to migrate from old keys
            const migrated = migrateFromOldKeys();
            if (migrated) {
              dataSource = 'migration';
            }
          }
        }

        // Load customers
        const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
        if (storedCustomers && isVersionCompatible) {
          parsedCustomers = JSON.parse(storedCustomers);
        }

        // Load engineers
        const storedEngineers = localStorage.getItem(STORAGE_KEYS.ENGINEERS);
        if (storedEngineers && isVersionCompatible) {
          parsedEngineers = JSON.parse(storedEngineers);
        }

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
          dataSource
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
      
      // If no data found, try to migrate from old keys
      let parsedJobs = mockJobs;
      let parsedCustomers = mockCustomers;
      let parsedEngineers = mockEngineers;
      let dataSource = 'mock';

      if (storedJobs && isVersionCompatible) {
        parsedJobs = JSON.parse(storedJobs).map((job: Job) => ({
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
        }));
        dataSource = 'storage';
      } else if (!storedJobs) {
        // Try to restore from backup first
        const backupRestored = restoreFromBackup();
        if (backupRestored) {
          dataSource = 'backup';
          console.log('📦 Data restored from backup');
          return; // Early return as restoreFromBackup sets the state
        } else {
          // Try to migrate from old keys
          const migrated = migrateFromOldKeys();
          if (migrated) {
            dataSource = 'migration';
          }
        }
      }

      // Load customers
      const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (storedCustomers && isVersionCompatible) {
        parsedCustomers = JSON.parse(storedCustomers);
      }

      // Load engineers
      const storedEngineers = localStorage.getItem(STORAGE_KEYS.ENGINEERS);
      if (storedEngineers && isVersionCompatible) {
        parsedEngineers = JSON.parse(storedEngineers);
      }

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
        dataSource
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
    const oldJob = getJobById(jobId);
    
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, ...updates, updatedAt: new Date() }
        : job
    ));
    
    console.log('📝 Job updated:', jobId, updates);
    
    // Trigger notifications for specific updates
    if (oldJob && updates.status && oldJob.status !== updates.status) {
      const updatedJob = { ...oldJob, ...updates };
      const customer = getCustomerByName(updatedJob.customer);
      const engineer = getEngineerByName(updatedJob.engineer || '');
      
      // Job assignment notification
      if (updates.status === 'amber' && updates.engineer && !oldJob.engineer) {
        notificationService.notifyJobAssignment(
          jobId,
          engineer?.name || 'Unknown Engineer',
          customer?.name || 'Unknown Customer'
        );
      }
      
      // Job completion notification
      if (updates.status === 'green' && oldJob.status !== 'green') {
        notificationService.notifyJobCompletion(
          jobId,
          engineer?.name || 'Unknown Engineer',
          customer?.name || 'Unknown Customer'
        );
      }
      
      // Emergency alert notification
      if (updatedJob.priority === 'Critical' && updates.status === 'red') {
        notificationService.notifyEmergencyAlert(
          jobId,
          customer?.name || 'Unknown Customer',
          updatedJob.description
        );
      }
    }
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

  const getJobsByPriority = (priority: Job['priority']): Job[] => {
    return jobs.filter(job => job.priority === priority);
  };

  const getJobsByCategory = (category: string): Job[] => {
    return jobs.filter(job => job.category === category);
  };

  const getJobsByDateRange = (startDate: Date, endDate: Date): Job[] => {
    return jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      return jobDate >= startDate && jobDate <= endDate;
    });
  };

  const getFilteredJobs = (filters: {
    customer?: string;
    engineer?: string;
    status?: Job['status'];
    priority?: Job['priority'];
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Job[] => {
    return jobs.filter(job => {
      if (filters.customer && job.customer !== filters.customer) return false;
      if (filters.engineer && job.engineer !== filters.engineer) return false;
      if (filters.status && job.status !== filters.status) return false;
      if (filters.priority && job.priority !== filters.priority) return false;
      if (filters.category && job.category !== filters.category) return false;
      if (filters.dateFrom && new Date(job.createdAt) < filters.dateFrom) return false;
      if (filters.dateTo && new Date(job.createdAt) > filters.dateTo) return false;
      return true;
    });
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

  const getCustomerById = (customerId: string): Customer | undefined => {
    return customers.find(customer => customer.id === customerId);
  };

  const getCustomerByName = (customerName: string): Customer | undefined => {
    return customers.find(customer => customer.name === customerName);
  };

  const getCustomerStats = (customerName: string) => {
    const customerJobs = getJobsByCustomer(customerName);
    const totalJobs = customerJobs.length;
    const completedJobs = customerJobs.filter(job => job.status === 'completed').length;
    const pendingJobs = totalJobs - completedJobs;
    const criticalJobs = customerJobs.filter(job => job.priority === 'Critical').length;
    const red = customerJobs.filter(job => job.status === 'red').length;
    const amber = customerJobs.filter(job => job.status === 'amber').length;
    const green = customerJobs.filter(job => job.status === 'green').length;

    return {
      totalJobs,
      completedJobs,
      pendingJobs,
      criticalJobs,
      statusBreakdown: { red, amber, green }
    };
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

  const getEngineerByName = (engineerName: string): Engineer | undefined => {
    return engineers.find(engineer => engineer.name === engineerName);
  };

  const getEngineerStats = (engineerName: string) => {
    const engineerJobs = getJobsByEngineer(engineerName);
    const totalJobs = engineerJobs.length;
    const completedJobs = engineerJobs.filter(job => job.status === 'green').length;
    const pendingJobs = engineerJobs.filter(job => job.status === 'red').length;
    const criticalJobs = engineerJobs.filter(job => job.priority === 'Critical').length;
    const red = engineerJobs.filter(job => job.status === 'red').length;
    const amber = engineerJobs.filter(job => job.status === 'amber').length;
    const green = engineerJobs.filter(job => job.status === 'green').length;

    // Calculate average completion time for completed jobs
    const completedJobsWithDates = engineerJobs.filter(job => 
      job.status === 'green' && job.dateCompleted && job.createdAt
    );
    
    const avgCompletionTime = completedJobsWithDates.length > 0
      ? completedJobsWithDates.reduce((sum, job) => {
          const completionTime = new Date(job.dateCompleted!).getTime() - new Date(job.createdAt).getTime();
          return sum + completionTime;
        }, 0) / (completedJobsWithDates.length * 1000 * 60) // Convert to minutes
      : undefined;

    return {
      totalJobs,
      completedJobs,
      pendingJobs,
      criticalJobs,
      statusBreakdown: { red, amber, green },
      avgCompletionTime
    };
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

  const getOverallStats = () => {
    // Job stats
    const jobStats = getJobStats();
    
    // Customer stats
    const totalCustomers = customers.length;
    const activeCustomers = new Set(jobs.map(job => job.customer)).size;
    const customerJobCounts = jobs.reduce((acc, job) => {
      acc[job.customer] = (acc[job.customer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveCustomer = Object.keys(customerJobCounts).length > 0
      ? Object.keys(customerJobCounts).reduce((a, b) => 
          customerJobCounts[a] > customerJobCounts[b] ? a : b
        )
      : undefined;

    // Engineer stats
    const totalEngineers = engineers.length;
    const activeEngineers = new Set(jobs.map(job => job.engineer)).size;
    const engineerJobCounts = jobs.reduce((acc, job) => {
      acc[job.engineer] = (acc[job.engineer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveEngineer = Object.keys(engineerJobCounts).length > 0
      ? Object.keys(engineerJobCounts).reduce((a, b) => 
          engineerJobCounts[a] > engineerJobCounts[b] ? a : b
        )
      : undefined;

    return {
      jobs: {
        total: jobStats.total,
        completed: jobStats.completed,
        pending: jobStats.pending,
        critical: jobStats.critical,
        statusBreakdown: {
          red: jobStats.red,
          amber: jobStats.amber,
          green: jobStats.green
        }
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        mostActiveCustomer
      },
      engineers: {
        total: totalEngineers,
        active: activeEngineers,
        mostActiveEngineer
      }
    };
  };

  // Utility functions
  const refreshData = () => {
    // Force reload from localStorage
    const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
    const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    const storedEngineers = localStorage.getItem(STORAGE_KEYS.ENGINEERS);
    
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs).map((job: Job) => ({
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
      }));
      setJobs(parsedJobs);
    }
    if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
    if (storedEngineers) setEngineers(JSON.parse(storedEngineers));
    
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
    getJobsByPriority,
    getJobsByCategory,
    getJobsByDateRange,
    getFilteredJobs,
    customers,
    addCustomer,
    updateCustomer,
    getCustomerById,
    getCustomerByName,
    getCustomerStats,
    engineers,
    updateEngineer,
    getEngineerByName,
    getEngineerStats,
    getJobStats,
    getOverallStats,
    refreshData,
    clearAllData,
    exportData,
    importData,
    backupData,
    restoreFromBackup,
    migrateFromOldKeys
  };

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
