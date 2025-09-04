import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job, Customer } from '@/types/job';
import { getStatusColor, getPriorityColor } from '@/lib/jobUtils';
import { useJobContext } from '@/hooks/useJobContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useSettings } from '@/contexts/SettingsContext';
import EngineerDashboard from '@/components/EngineerDashboard';
import JobCard from '@/components/JobCard';
import DashboardControlBar from '@/components/DashboardControlBar';
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Settings,
  Monitor,
  Eye,
  EyeOff
} from 'lucide-react';

interface MasterDashboardProps {
  onJobCreate: () => void;
  onJobClick: (job: Job) => void;
  onCustomerSelect: (customer: Customer) => void;
  onSwitchToEngineerMode?: () => void;
  selectedEngineer?: string;
}

export default function MasterDashboard({ 
  onJobCreate, 
  onJobClick,
  onCustomerSelect,
  onSwitchToEngineerMode,
  selectedEngineer = 'John Smith' // Default engineer for demo
}: MasterDashboardProps) {
  const { jobs, customers, engineers, getJobStats } = useJobContext();
  const { settings } = useSettings();
  const dashboard = useDashboard();
  
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [currentSelectedEngineer, setCurrentSelectedEngineer] = useState<string>(selectedEngineer);

  // Calculate statistics from context
  const stats = getJobStats();

  // Get unique customer and engineer names for filters
  const uniqueCustomers = Array.from(new Set(jobs.map(job => job.customer))).sort();
  const uniqueEngineers = Array.from(new Set(jobs.map(job => job.engineer))).sort();

  // Generate end of shift report
  const generateEndOfShiftReport = () => {
    const today = new Date().toDateString();
    const todayJobs = jobs.filter(job => 
      job.createdAt.toDateString() === today
    );

    const report = {
      date: today,
      totalJobsLogged: todayJobs.length,
      completedJobs: todayJobs.filter(job => job.status === 'green').length,
      pendingJobs: todayJobs.filter(job => job.status === 'amber').length,
      overdueJobs: todayJobs.filter(job => job.status === 'red').length,
      emergencyJobs: todayJobs.filter(job => job.tags?.includes('Emergency')).length,
      followUpRequired: todayJobs.filter(job => 
        job.status === 'amber' || job.status === 'red'
      ),
      summary: `${todayJobs.length} jobs logged today. ${todayJobs.filter(job => job.status === 'green').length} completed, ${todayJobs.filter(job => job.status !== 'green').length} require follow-up.`
    };

    return report;
  };

  const endOfShiftReport = generateEndOfShiftReport();

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsContent value="portal" className="m-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-muted-foreground">Out of Hours Support Management</p>
            </div>
          </TabsContent>
          <TabsContent value="engineer" className="m-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Engineer Dashboard</h1>
              <p className="text-muted-foreground">Manage your assigned jobs</p>
            </div>
          </TabsContent>
          
          <div className="flex items-center space-x-4">
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="portal" className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Portal</span>
              </TabsTrigger>
              <TabsTrigger value="engineer" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Engineer</span>
              </TabsTrigger>
            </TabsList>
            {activeTab === "portal" && (
              <Button onClick={onJobCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                Log New Job
              </Button>
            )}
          </div>
        </div>

        {/* Portal View Content */}
        <TabsContent value="portal" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{stats.red}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* End of Shift Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>End of Shift Report</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{endOfShiftReport.totalJobsLogged}</p>
              <p className="text-sm text-muted-foreground">Jobs Logged Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{endOfShiftReport.completedJobs}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{endOfShiftReport.pendingJobs}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{endOfShiftReport.overdueJobs}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm"><strong>Summary:</strong> {endOfShiftReport.summary}</p>
            {endOfShiftReport.followUpRequired.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-600">Jobs requiring follow-up:</p>
                <ul className="text-xs space-y-1 mt-1">
                  {endOfShiftReport.followUpRequired.slice(0, 3).map(job => (
                    <li key={job.id}>• {job.jobNumber} - {job.customer} - {job.engineer}</li>
                  ))}
                  {endOfShiftReport.followUpRequired.length > 3 && (
                    <li className="text-muted-foreground">... and {endOfShiftReport.followUpRequired.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <DashboardControlBar
        searchTerm={dashboard.filters.searchTerm}
        onSearchChange={(value) => dashboard.updateFilter('searchTerm', value)}
        statusFilter={dashboard.filters.statusFilter}
        onStatusFilterChange={(value) => dashboard.updateFilter('statusFilter', value)}
        priorityFilter={dashboard.filters.priorityFilter}
        onPriorityFilterChange={(value) => dashboard.updateFilter('priorityFilter', value)}
        customerFilter={dashboard.filters.customerFilter}
        onCustomerFilterChange={(value) => dashboard.updateFilter('customerFilter', value)}
        engineerFilter={dashboard.filters.engineerFilter}
        onEngineerFilterChange={(value) => dashboard.updateFilter('engineerFilter', value)}
        currentPage={dashboard.currentPage}
        totalPages={dashboard.pagination.totalPages}
        startIndex={dashboard.pagination.startIndex}
        endIndex={dashboard.pagination.endIndex}
        totalJobs={dashboard.totalJobs}
        onPageChange={dashboard.goToPage}
        onNextPage={dashboard.nextPage}
        onPreviousPage={dashboard.previousPage}
        jobsPerPage={dashboard.dashboardSettings.jobsPerPage}
        onJobsPerPageChange={dashboard.setJobsPerPage}
        sortBy={dashboard.dashboardSettings.sortBy}
        onSortByChange={dashboard.setSortBy}
        sortOrder={dashboard.dashboardSettings.sortOrder}
        onSortOrderChange={dashboard.setSortOrder}
        showCompletedJobs={dashboard.dashboardSettings.showCompletedJobs}
        onToggleShowCompleted={dashboard.toggleShowCompletedJobs}
        autoRefresh={dashboard.dashboardSettings.autoRefresh}
        refreshInterval={dashboard.dashboardSettings.refreshInterval}
        isAutoRefreshing={dashboard.isAutoRefreshing}
        onToggleAutoRefresh={dashboard.toggleAutoRefresh}
        onStartAutoRefresh={dashboard.startAutoRefresh}
        onStopAutoRefresh={dashboard.stopAutoRefresh}
        onRefreshData={dashboard.refreshData}
        onClearFilters={dashboard.clearFilters}
        customers={uniqueCustomers}
        engineers={uniqueEngineers}
      />

      {/* Customer Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Customer Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customers.slice(0, 6).map(customer => (
              <Button
                key={customer.id}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => onCustomerSelect(customer)}
              >
                <div className="text-left">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.sites?.length || 0} sites
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dashboard.jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onUpdateStatus={(jobId, status, reason) => {
              // Handle status updates in master dashboard context
              console.log('Status update requested:', jobId, status, reason);
            }}
            onJobClick={onJobClick}
          />
        ))}
      </div>

      {dashboard.jobs.length === 0 && dashboard.totalJobs === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {dashboard.jobs.length === 0 && dashboard.totalJobs > 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs match your filters</h3>
          <p className="text-muted-foreground mb-4">Try clearing your filters or adjusting your search criteria</p>
          <Button onClick={dashboard.clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
        </TabsContent>

        {/* Engineer View Content */}
        <TabsContent value="engineer" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <Select value={currentSelectedEngineer} onValueChange={setCurrentSelectedEngineer}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select Engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineers.map((engineer) => (
                        <SelectItem key={engineer.name} value={engineer.name}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              engineer.status === 'accept' ? 'bg-green-500' :
                              engineer.status === 'onsite' ? 'bg-blue-500' :
                              engineer.status === 'travel' ? 'bg-yellow-500' :
                              engineer.status === 'completed' ? 'bg-gray-400' :
                              'bg-orange-500'
                            }`} />
                            <span>{engineer.name}</span>
                            <span className="text-xs text-gray-500">({engineer.currentJobs} jobs)</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {onSwitchToEngineerMode && (
                <Button 
                  onClick={onSwitchToEngineerMode}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Full Engineer Mode
                </Button>
              )}
            </div>
            
            {currentSelectedEngineer ? (
              <EngineerDashboard
                engineerName={currentSelectedEngineer}
                onBack={() => setActiveTab('portal')}
                onJobClick={onJobClick}
              />
            ) : (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Engineer Selected</h3>
                <p className="text-muted-foreground">Please select an engineer to view their dashboard</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}