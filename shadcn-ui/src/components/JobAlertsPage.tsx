import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job, Customer } from '@/types/job';
import { getStatusColor, getPriorityColor } from '@/lib/jobUtils';
import { useNotifications } from '@/lib/notificationService';
import { 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  Smartphone,
  User,
  Bell,
  BellRing,
  Volume2,
  VolumeX
} from 'lucide-react';

interface JobAlertsPageProps {
  customer: Customer;
  jobs: Job[];
  onBack: () => void;
}

export default function JobAlertsPage({ customer, jobs, onBack }: JobAlertsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [alertHistory, setAlertHistory] = useState<Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    jobId?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const notifications = useNotifications();

  // Monitor for critical jobs and send alerts
  useEffect(() => {
    const criticalJobs = jobs.filter(job => 
      job.priority === 'Critical' && 
      (job.status === 'red' || job.status === 'amber')
    );

    criticalJobs.forEach(job => {
      const alertId = `${job.id}-${job.status}-${Date.now()}`;
      const existingAlert = alertHistory.find(alert => 
        alert.jobId === job.id && alert.type === `status-${job.status}`
      );

      if (!existingAlert) {
        const alertMessage = `Job ${job.jobNumber} requires immediate attention - Status: ${job.status.toUpperCase()}`;
        
        // Add to alert history
        setAlertHistory(prev => [...prev, {
          id: alertId,
          type: `status-${job.status}`,
          message: alertMessage,
          timestamp: new Date(),
          jobId: job.id,
          priority: job.status === 'red' ? 'critical' : 'high'
        }]);

        // Send notification
        if (job.status === 'red') {
          notifications.notifyEmergencyAlert(
            job.jobNumber, 
            customer.name, 
            `Critical status - ${job.description}`
          );
        } else {
          notifications.sendNotification({
            type: 'emergency',
            title: 'Job Alert',
            message: alertMessage,
            priority: 'high',
            jobId: job.id,
            customerId: customer.id
          });
        }
      }
    });
  }, [jobs, customer, notifications, alertHistory]);

  // Auto-notify on job completions
  useEffect(() => {
    const completedJobs = jobs.filter(job => job.status === 'completed');
    
    completedJobs.forEach(job => {
      const alertId = `${job.id}-completed`;
      const existingAlert = alertHistory.find(alert => 
        alert.jobId === job.id && alert.type === 'completed'
      );

      if (!existingAlert) {
        setAlertHistory(prev => [...prev, {
          id: alertId,
          type: 'completed',
          message: `Job ${job.jobNumber} completed by ${job.engineer}`,
          timestamp: new Date(),
          jobId: job.id,
          priority: 'low'
        }]);

        notifications.notifyJobCompletion(job.jobNumber, job.engineer, customer.name);
      }
    });
  }, [jobs, customer, notifications, alertHistory]);

  // Test notifications function
  const handleTestNotifications = () => {
    notifications.testNotifications();
    
    // Add test alert to history
    setAlertHistory(prev => [...prev, {
      id: `test-${Date.now()}`,
      type: 'test',
      message: 'Test notification sent - Check your notification settings',
      timestamp: new Date(),
      priority: 'medium'
    }]);
  };

  // Clear alert history
  const clearAlertHistory = () => {
    setAlertHistory([]);
  };

  // Simulate engineer mobile sync notifications
  const simulateEngineerSync = (jobId: string, engineerName: string, syncStatus: string) => {
    const syncMessage = `${engineerName} mobile app sync: ${syncStatus}`;
    
    setAlertHistory(prev => [...prev, {
      id: `sync-${jobId}-${Date.now()}`,
      type: 'engineer-sync',
      message: syncMessage,
      timestamp: new Date(),
      jobId,
      priority: 'low' as const
    }]);

    notifications.sendNotification({
      type: 'custom',
      title: 'Engineer Mobile Sync',
      message: syncMessage,
      priority: 'low',
      jobId,
    });
  };

  // Trigger emergency alert for specific job
  const triggerEmergencyAlert = (job: Job) => {
    const emergencyMessage = `EMERGENCY: ${job.jobNumber} requires immediate attention`;
    
    setAlertHistory(prev => [...prev, {
      id: `emergency-${job.id}-${Date.now()}`,
      type: 'emergency',
      message: emergencyMessage,
      timestamp: new Date(),
      jobId: job.id,
      priority: 'critical' as const
    }]);

    notifications.notifyEmergencyAlert(job.jobNumber, customer.name, job.description);
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.engineer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get engineer sync status icon
  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'traveling':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'onsite':
        return <MapPin className="h-4 w-4 text-orange-600" />;
      case 'revisit required':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get engineer sync status color
  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'traveling':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'onsite':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'revisit required':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 p-0 h-auto font-normal"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-xl font-bold text-gray-900">Job Alerts</h2>
          <p className="text-sm text-gray-600">{customer.name}</p>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Notification Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Alerts Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="h-6 w-6 p-0"
                >
                  {soundEnabled ? 
                    <Volume2 className="h-3 w-3 text-purple-600" /> : 
                    <VolumeX className="h-3 w-3 text-gray-400" />
                  }
                </Button>
                <BellRing className="h-4 w-4 text-purple-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotifications}
                className="w-full text-xs"
              >
                Test All Notifications
              </Button>
              
              {alertHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAlertHistory}
                  className="w-full text-xs text-gray-500"
                >
                  Clear Alert History ({alertHistory.length})
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total Jobs</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{jobs.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {jobs.filter(job => job.status === 'completed').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <span className="text-lg font-bold text-amber-600">
                {jobs.filter(job => job.status !== 'completed').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Critical</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {jobs.filter(job => job.priority === 'Critical').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <BellRing className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium">Alerts Sent</span>
              </div>
              <span className="text-lg font-bold text-indigo-600">
                {alertHistory.length}
              </span>
            </div>
          </div>

          {/* Notification Activity Feed */}
          {alertHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {alertHistory.slice(-10).reverse().map(alert => (
                  <div 
                    key={alert.id}
                    className="p-2 text-xs bg-gray-50 rounded border-l-2 border-l-gray-300"
                  >
                    <div className="font-medium text-gray-900 truncate">
                      {alert.message}
                    </div>
                    <div className="text-gray-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Alerts - {customer.name}</h1>
                <p className="text-gray-600">Monitor job status and engineer mobile app sync</p>
              </div>
              
              {/* Real-time Alert Badge */}
              <div className="flex items-center space-x-4">
                {alertHistory.length > 0 && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                    <BellRing className="h-4 w-4" />
                    <span className="text-sm font-medium">{alertHistory.length} Active Alerts</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert History Panel */}
          {alertHistory.length > 0 && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-amber-800">Recent Alerts</CardTitle>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    {alertHistory.length} alerts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {alertHistory.slice(-5).reverse().map(alert => (
                    <div 
                      key={alert.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        alert.priority === 'critical' ? 'bg-red-100 border border-red-200' :
                        alert.priority === 'high' ? 'bg-orange-100 border border-orange-200' :
                        alert.priority === 'medium' ? 'bg-blue-100 border border-blue-200' :
                        'bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.priority === 'critical' ? 'bg-red-600' :
                          alert.priority === 'high' ? 'bg-orange-600' :
                          alert.priority === 'medium' ? 'bg-blue-600' :
                          'bg-gray-600'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-600">
                            {alert.timestamp.toLocaleTimeString()} • {alert.type}
                          </p>
                        </div>
                      </div>
                      
                      {alert.jobId && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          Job ID: {alert.jobId}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, descriptions, or engineers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="amber">Amber</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Jobs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Job Status & Engineer Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-900">Job Number</th>
                      <th className="text-left p-4 font-medium text-gray-900">Assigned Engineer</th>
                      <th className="text-left p-4 font-medium text-gray-900">Job Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Engineer Mobile Sync</th>
                      <th className="text-left p-4 font-medium text-gray-900">Priority</th>
                      <th className="text-left p-4 font-medium text-gray-900">Site</th>
                      <th className="text-left p-4 font-medium text-gray-900">Created</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map(job => {
                      const hasAlert = alertHistory.some(alert => alert.jobId === job.id);
                      const criticalAlert = alertHistory.find(alert => 
                        alert.jobId === job.id && alert.priority === 'critical'
                      );
                      
                      return (
                        <tr key={job.id} className={`border-b hover:bg-gray-50 ${
                          criticalAlert ? 'bg-red-50' : hasAlert ? 'bg-amber-50' : ''
                        }`}>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {hasAlert && (
                                <div className="flex items-center">
                                  <BellRing className={`h-4 w-4 ${
                                    criticalAlert ? 'text-red-600' : 'text-amber-600'
                                  }`} />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{job.jobNumber}</div>
                                <div className="text-sm text-gray-600 truncate max-w-xs">
                                  {job.description}
                                </div>
                                {hasAlert && (
                                  <div className="text-xs text-amber-600 font-medium">
                                    Alert triggered
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{job.engineer}</div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                Contact available
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(job.status)}`}
                          >
                            {job.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getSyncStatusIcon('accepted')}
                            <Badge 
                              variant="outline" 
                              className={`${getSyncStatusColor('accepted')} text-xs`}
                            >
                              Accepted
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Smartphone className="h-3 w-3 mr-1" />
                            Last sync: 2 min ago
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant="outline" 
                            className={`${getPriorityColor(job.priority)}`}
                          >
                            {job.priority}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">{job.site}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(job.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => simulateEngineerSync(job.id, job.engineer, 'Status updated')}
                              className="text-xs"
                            >
                              <Smartphone className="h-3 w-3 mr-1" />
                              Sync
                            </Button>
                            
                            {(job.priority === 'Critical' || job.status === 'red') && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => triggerEmergencyAlert(job)}
                                className="text-xs"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Alert
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredJobs.length === 0 && (
                  <div className="text-center py-12">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}