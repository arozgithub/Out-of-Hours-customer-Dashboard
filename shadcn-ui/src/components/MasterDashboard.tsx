import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job, Customer } from '@/types/job';
import { getStatusColor, getPriorityColor } from '@/lib/jobUtils';
import EngineerDashboard from '@/components/EngineerDashboard';
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
  Monitor
} from 'lucide-react';

interface MasterDashboardProps {
  jobs: Job[];
  customers: Customer[];
  onJobCreate: () => void;
  onJobClick: (job: Job) => void;
  onCustomerSelect: (customer: Customer) => void;
  onAcceptJob?: (jobId: string, status: Job['status'], reason?: string) => void;
  onDeclineJob?: (jobId: string, status: Job['status'], reason?: string) => void;
  onSwitchToEngineerMode?: () => void;
}

export default function MasterDashboard({ 
  jobs, 
  customers, 
  onJobCreate, 
  onJobClick,
  onCustomerSelect,
  onAcceptJob,
  onDeclineJob,
  onSwitchToEngineerMode
}: MasterDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('portal');

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.engineer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate statistics
  const stats = {
    total: jobs.length,
    active: jobs.filter(job => job.status === 'amber' || job.status === 'red').length,
    completed: jobs.filter(job => job.status === 'green').length,
    critical: jobs.filter(job => job.priority === 'Critical').length,
    overdue: jobs.filter(job => job.status === 'red').length
  };

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
                <p className="text-2xl font-bold">{stats.active}</p>
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
                <p className="text-2xl font-bold">{stats.overdue}</p>
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by customer, site, description, or engineer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="green">Completed</SelectItem>
              <SelectItem value="amber">In Progress</SelectItem>
              <SelectItem value="red">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
        {filteredJobs.map(job => (
          <Card 
            key={job.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onJobClick(job)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{job.jobNumber}</p>
                    <p className="text-xs text-muted-foreground">{job.customer}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(job.status)} text-white text-xs`}
                    >
                      {job.status === 'green' ? 'Completed' : 
                       job.status === 'amber' ? 'In Progress' : 'Overdue'}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${getPriorityColor(job.priority)} text-xs`}
                    >
                      {job.priority}
                    </Badge>
                  </div>
                </div>

                {/* Site and Description */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <p className="text-xs font-medium">{job.site}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                </div>

                {/* Engineer */}
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 text-gray-400" />
                  <p className="text-xs">{job.engineer}</p>
                </div>

                {/* SLA Information */}
                <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accept SLA:</span>
                    <span className="font-medium">{job.customAlerts?.acceptSLA || 30}min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Onsite SLA:</span>
                    <span className="font-medium">{job.customAlerts?.onsiteSLA || 90}min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Complete SLA:</span>
                    <span className="font-medium">{job.customAlerts?.completedSLA || 180}min</span>
                  </div>
                </div>

                {/* Alerts */}
                {(job.status === 'red' || job.priority === 'Critical') && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <p className="text-xs font-medium">Alert Active</p>
                  </div>
                )}

                {/* Time */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{job.createdAt.toLocaleDateString()}</span>
                  <span>{job.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
        </TabsContent>

        {/* Engineer View Content */}
        <TabsContent value="engineer" className="space-y-6">
          {onAcceptJob && onDeclineJob ? (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
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
              <EngineerDashboard
                jobs={jobs}
                onAcceptJob={onAcceptJob}
                onDeclineJob={onDeclineJob}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Engineer View Not Available</h3>
              <p className="text-muted-foreground">Engineer actions are not configured</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}