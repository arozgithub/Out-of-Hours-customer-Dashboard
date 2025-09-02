import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job } from '@/types/job';
import EngineerDashboard from '@/components/EngineerDashboard';
import { 
  User, 
  Monitor, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Settings,
  LogOut
} from 'lucide-react';

interface EngineerInterfaceProps {
  jobs: Job[];
  onAcceptJob: (jobId: string, status: Job['status'], reason?: string) => void;
  onDeclineJob: (jobId: string, status: Job['status'], reason?: string) => void;
  onBackToPortal: () => void;
}

export default function EngineerInterface({ 
  jobs, 
  onAcceptJob, 
  onDeclineJob,
  onBackToPortal 
}: EngineerInterfaceProps) {
  const [activeTab, setActiveTab] = useState('jobs');

  // Engineer-specific job stats
  const engineerStats = {
    total: jobs.length,
    pending: jobs.filter(job => job.status === 'amber').length,
    accepted: jobs.filter(job => job.status === 'green').length,
    completed: jobs.filter(job => job.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Engineer Header - No Sidebar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Engineer Portal</h1>
                <p className="text-sm text-gray-500">Job Management Interface</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">{engineerStats.pending}</span>
                  <span className="text-sm text-gray-500">Pending</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{engineerStats.accepted}</span>
                  <span className="text-sm text-gray-500">Accepted</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{engineerStats.total}</span>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <Button variant="outline" size="sm" onClick={onBackToPortal}>
                <Monitor className="h-4 w-4 mr-2" />
                Portal View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-2xl font-bold">{engineerStats.pending}</p>
                      <p className="text-sm text-gray-600">Pending Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{engineerStats.accepted}</p>
                      <p className="text-sm text-gray-600">Accepted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{engineerStats.completed}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{engineerStats.total}</p>
                      <p className="text-sm text-gray-600">Total Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <EngineerDashboard
              jobs={jobs}
              onAcceptJob={onAcceptJob}
              onDeclineJob={onDeclineJob}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.filter(job => job.status === 'completed').map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{job.jobNumber}</p>
                        <p className="text-sm text-gray-600">{job.customer} - {job.site}</p>
                        <p className="text-xs text-gray-500">{job.description}</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Completed
                      </Badge>
                    </div>
                  ))}
                  {jobs.filter(job => job.status === 'completed').length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No completed jobs yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engineer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Notification Preferences</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SMS Alerts</span>
                          <Badge>Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Email Notifications</span>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Push Notifications</span>
                          <Badge>Enabled</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Availability Status</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Current Status</span>
                          <Badge className="bg-green-500">Available</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Shift Pattern</span>
                          <span className="text-sm text-gray-600">24/7 On-Call</span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full mt-2">
                          Update Availability
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
