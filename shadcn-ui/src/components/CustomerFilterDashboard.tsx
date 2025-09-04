import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import JobCard from './JobCard';
import { useJobContext } from '@/hooks/useJobContext';
import { Job } from '@/types/job';
import { Search, Users, Briefcase, AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

interface CustomerFilterDashboardProps {
  onJobClick?: (job: Job) => void;
  onUpdateStatus?: (jobId: string, status: Job['status'], reason?: string) => void;
}

export const CustomerFilterDashboard: React.FC<CustomerFilterDashboardProps> = ({ 
  onJobClick, 
  onUpdateStatus 
}) => {
  const { 
    jobs, 
    customers, 
    getJobsByCustomer, 
    getCustomerStats, 
    getFilteredJobs,
    getOverallStats,
    updateJob
  } = useJobContext();

  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Get overall stats
  const overallStats = getOverallStats();

  // Get filtered jobs based on selected customer and additional filters
  const filteredJobs = useMemo(() => {
    let jobsToFilter = selectedCustomer === 'all' ? jobs : getJobsByCustomer(selectedCustomer);
    
    // Apply additional filters
    if (statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery) {
      jobsToFilter = getFilteredJobs({
        customer: selectedCustomer === 'all' ? undefined : selectedCustomer,
        status: statusFilter === 'all' ? undefined : statusFilter as Job['status'],
        priority: priorityFilter === 'all' ? undefined : priorityFilter as Job['priority']
      }).filter(job => 
        searchQuery === '' || 
        job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.site.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return jobsToFilter;
  }, [selectedCustomer, statusFilter, priorityFilter, searchQuery, jobs, getJobsByCustomer, getFilteredJobs]);

  // Get customer-specific stats if a customer is selected
  const customerStats = selectedCustomer !== 'all' ? getCustomerStats(selectedCustomer) : null;

  // Get unique values for filters
  const uniqueCustomers = customers.map(c => c.name).sort();
  const uniqueStatuses = Array.from(new Set(jobs.map(job => job.status)));
  const uniquePriorities = Array.from(new Set(jobs.map(job => job.priority)));

  // Handle status updates
  const handleStatusUpdate = (jobId: string, status: Job['status'], reason?: string) => {
    updateJob(jobId, { status });
    if (onUpdateStatus) {
      onUpdateStatus(jobId, status, reason);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Customer Jobs Dashboard</h1>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredJobs.length} Jobs
        </Badge>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{overallStats.customers.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{overallStats.customers.active}</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{overallStats.jobs.total}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Jobs</p>
                <p className="text-2xl font-bold">{overallStats.jobs.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer-Specific Stats (when customer is selected) */}
      {customerStats && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedCustomer} - Customer Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{customerStats.totalJobs}</p>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{customerStats.completedJobs}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{customerStats.pendingJobs}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{customerStats.criticalJobs}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center gap-1">
                  <span className="text-sm font-medium text-red-600">R:{customerStats.statusBreakdown.red}</span>
                  <span className="text-sm font-medium text-amber-600">A:{customerStats.statusBreakdown.amber}</span>
                  <span className="text-sm font-medium text-green-600">G:{customerStats.statusBreakdown.green}</span>
                </div>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Customer Filter */}
            <div>
              <label className="text-sm font-medium">Customer</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {uniqueCustomers.map(customer => (
                    <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {uniquePriorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCustomer('all');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setSearchQuery('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onJobClick={onJobClick}
              onUpdateStatus={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Jobs Found</h3>
            <p className="text-sm text-muted-foreground">
              {selectedCustomer === 'all' 
                ? 'No jobs match your current filters. Try adjusting your search criteria.'
                : `No jobs found for ${selectedCustomer}. Try selecting a different customer or adjusting your filters.`
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
