import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useJobContext } from '@/hooks/useJobContext';
import { Job } from '@/types/job';

interface DashboardFilters {
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  customerFilter: string;
  engineerFilter: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export const useDashboard = () => {
  const { settings, updateSettings } = useSettings();
  const { jobs } = useJobContext();
  
  // Dashboard state
  const [filters, setFilters] = useState<DashboardFilters>({
    searchTerm: '',
    statusFilter: 'all',
    priorityFilter: 'all',
    customerFilter: 'all',
    engineerFilter: 'all',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  // Load saved filters if enabled
  useEffect(() => {
    if (settings.privacy.rememberFilters) {
      const savedFilters = localStorage.getItem('dashboard_filters');
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(parsedFilters);
        } catch (error) {
          console.error('Failed to load saved filters:', error);
        }
      }
    }
  }, [settings.privacy.rememberFilters]);

  // Save filters when they change (if enabled)
  useEffect(() => {
    if (settings.privacy.rememberFilters) {
      localStorage.setItem('dashboard_filters', JSON.stringify(filters));
    }
  }, [filters, settings.privacy.rememberFilters]);

  // Auto-refresh functionality
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (settings.dashboard.autoRefresh && isAutoRefreshing) {
      intervalId = setInterval(() => {
        // Trigger a refresh - this would typically refetch data
        console.log('Auto-refreshing dashboard data...');
        // In a real app, you would call a refresh function here
        // For now, we'll just log it
      }, settings.dashboard.refreshInterval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [settings.dashboard.autoRefresh, settings.dashboard.refreshInterval, isAutoRefreshing]);

  // Filter and sort jobs based on settings
  const getFilteredAndSortedJobs = useCallback(() => {
    const filteredJobs = jobs.filter(job => {
      // Apply search filter
      const matchesSearch = filters.searchTerm === '' || 
        job.customer.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.site.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.engineer.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.jobNumber.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus = filters.statusFilter === 'all' || job.status === filters.statusFilter;

      // Apply priority filter
      const matchesPriority = filters.priorityFilter === 'all' || job.priority === filters.priorityFilter;

      // Apply customer filter
      const matchesCustomer = filters.customerFilter === 'all' || job.customer === filters.customerFilter;

      // Apply engineer filter
      const matchesEngineer = filters.engineerFilter === 'all' || job.engineer === filters.engineerFilter;

      // Apply completed jobs filter
      const showCompleted = settings.dashboard.showCompletedJobs || job.status !== 'completed';

      return matchesSearch && matchesStatus && matchesPriority && 
             matchesCustomer && matchesEngineer && showCompleted;
    });

    // Sort jobs based on settings
    filteredJobs.sort((a, b) => {
      let comparison = 0;

      switch (settings.dashboard.sortBy) {
        case 'date': {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        }
        case 'priority': {
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
                      (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
          break;
        }
        case 'status': {
          const statusOrder = { 'red': 3, 'amber': 2, 'green': 1, 'completed': 0 };
          comparison = (statusOrder[a.status as keyof typeof statusOrder] || 0) - 
                      (statusOrder[b.status as keyof typeof statusOrder] || 0);
          break;
        }
        case 'customer': {
          comparison = a.customer.localeCompare(b.customer);
          break;
        }
        default:
          comparison = 0;
      }

      return settings.dashboard.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filteredJobs;
  }, [jobs, filters, settings.dashboard]);

  // Pagination logic
  const getPaginatedJobs = useCallback(() => {
    const filteredJobs = getFilteredAndSortedJobs();
    const jobsPerPage = settings.dashboard.jobsPerPage;
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = Math.min(startIndex + jobsPerPage, filteredJobs.length);
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const paginationInfo: PaginationInfo = {
      currentPage,
      totalPages,
      startIndex: startIndex + 1, // 1-based for display
      endIndex,
    };

    return {
      jobs: paginatedJobs,
      pagination: paginationInfo,
      totalJobs: filteredJobs.length,
    };
  }, [getFilteredAndSortedJobs, currentPage, settings.dashboard.jobsPerPage]);

  // Filter update functions
  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      priorityFilter: 'all',
      customerFilter: 'all',
      engineerFilter: 'all',
    });
    setCurrentPage(1);
  };

  // Pagination functions
  const goToPage = (page: number) => {
    const { pagination } = getPaginatedJobs();
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    const { pagination } = getPaginatedJobs();
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Settings shortcuts
  const toggleAutoRefresh = () => {
    updateSettings('dashboard', 'autoRefresh', !settings.dashboard.autoRefresh);
  };

  const setJobsPerPage = (count: number) => {
    updateSettings('dashboard', 'jobsPerPage', count);
    setCurrentPage(1); // Reset to first page
  };

  const setSortBy = (sortBy: string) => {
    updateSettings('dashboard', 'sortBy', sortBy);
  };

  const setSortOrder = (order: 'asc' | 'desc') => {
    updateSettings('dashboard', 'sortOrder', order);
  };

  const toggleShowCompletedJobs = () => {
    updateSettings('dashboard', 'showCompletedJobs', !settings.dashboard.showCompletedJobs);
    setCurrentPage(1); // Reset to first page
  };

  // Auto-refresh controls
  const startAutoRefresh = () => setIsAutoRefreshing(true);
  const stopAutoRefresh = () => setIsAutoRefreshing(false);

  return {
    // Data
    ...getPaginatedJobs(),
    
    // Filters
    filters,
    updateFilter,
    clearFilters,
    
    // Pagination
    currentPage,
    goToPage,
    nextPage,
    previousPage,
    
    // Settings
    dashboardSettings: settings.dashboard,
    toggleAutoRefresh,
    setJobsPerPage,
    setSortBy,
    setSortOrder,
    toggleShowCompletedJobs,
    
    // Auto-refresh
    isAutoRefreshing,
    startAutoRefresh,
    stopAutoRefresh,
    
    // Utilities
    refreshData: () => {
      // This would trigger a data refresh in a real app
      console.log('Refreshing dashboard data...');
    },
  };
};
