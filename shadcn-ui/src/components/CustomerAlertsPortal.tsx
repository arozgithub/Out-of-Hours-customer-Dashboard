import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Job, Customer, Engineer } from '@/types/job';
import { mockEngineers } from '@/lib/jobUtils';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Plus, 
  User, 
  Phone, 
  Clock,
  MapPin,
  Bell,
  CheckCircle
} from 'lucide-react';

interface CustomerAlertsPortalProps {
  customer: Customer;
  jobs: Job[];
  onBack: () => void;
}

interface Alert {
  id: string;
  jobId: string;
  engineerName: string;
  type: 'accepted' | 'onsite';
  timestamp: Date;
  status: 'active' | 'resolved';
}

export default function CustomerAlertsPortal({ 
  customer, 
  jobs, 
  onBack 
}: CustomerAlertsPortalProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [alertType, setAlertType] = useState<'accepted' | 'onsite'>('accepted');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter jobs for this customer and group by engineer
  const customerJobs = jobs.filter(job => job.customer === customer.name);
  const jobsByEngineer = customerJobs.reduce((acc, job) => {
    if (!acc[job.engineer]) {
      acc[job.engineer] = [];
    }
    acc[job.engineer].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  const handleAddAlert = () => {
    if (!selectedJob) return;

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      jobId: selectedJob.id,
      engineerName: selectedJob.engineer,
      type: alertType,
      timestamp: new Date(),
      status: 'active'
    };

    setAlerts(prev => [...prev, newAlert]);
    setIsDialogOpen(false);
    setSelectedJob(null);

    // Simulate helpdesk notification
    alert(`🚨 ALERT TRIGGERED!\n\nJob: ${selectedJob.jobNumber}\nEngineer: ${selectedJob.engineer}\nAlert Type: ${alertType.toUpperCase()}\n\nHelpdesk team has been notified to call the engineer.`);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' }
        : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Bell className="h-8 w-8 text-orange-600" />
              <span>Customer Alerts Portal</span>
            </h1>
            <p className="text-muted-foreground">{customer.name} - Alert Management</p>
          </div>
        </div>
        <Badge variant="destructive" className="text-lg px-3 py-1">
          {activeAlerts.length} Active Alerts
        </Badge>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map(alert => {
                const job = customerJobs.find(j => j.id === alert.jobId);
                return (
                  <div key={alert.id} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800">
                            {alert.type.toUpperCase()} Alert - {job?.jobNumber}
                          </p>
                          <p className="text-sm text-red-600">
                            Engineer: {alert.engineerName} • {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => resolveAlert(alert.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs by Engineer */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Engineer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(jobsByEngineer).map(([engineerName, engineerJobs]) => {
              const engineer = mockEngineers.find(e => e.name === engineerName);
              return (
                <div key={engineerName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-semibold text-lg">{engineerName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {engineerJobs.length} jobs • {engineer?.phone || 'No phone'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={engineer?.status === 'accept' ? 'default' : 'secondary'}>
                      {engineer?.status === 'accept' ? 'On Call' : 'OOH'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {engineerJobs.map(job => (
                      <div key={job.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{job.jobNumber}</p>
                            <p className="text-xs text-muted-foreground">{job.jobType}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              job.status === 'green' ? 'border-green-500 text-green-700' :
                              job.status === 'amber' ? 'border-amber-500 text-amber-700' :
                              'border-red-500 text-red-700'
                            }`}
                          >
                            {job.status === 'green' ? 'Completed' : 
                             job.status === 'amber' ? 'In Progress' : 'Overdue'}
                          </Badge>
                        </div>

                        <div className="space-y-1 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <p className="text-xs">{job.site}</p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        </div>

                        <Dialog open={isDialogOpen && selectedJob?.id === job.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setSelectedJob(job)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Alert
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Alert for {job.jobNumber}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Engineer: {job.engineer}
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Site: {job.site}
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Alert Type</label>
                                <Select value={alertType} onValueChange={(value: 'accepted' | 'onsite') => setAlertType(value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="accepted">Job Accepted Alert</SelectItem>
                                    <SelectItem value="onsite">On Site Alert</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {alertType === 'accepted' 
                                    ? 'Alert when engineer should have accepted the job'
                                    : 'Alert when engineer should be on site'
                                  }
                                </p>
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddAlert} className="bg-red-600 hover:bg-red-700">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Create Alert
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(jobsByEngineer).length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-muted-foreground">No jobs found for {customer.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice().reverse().map(alert => {
                const job = customerJobs.find(j => j.id === alert.jobId);
                return (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        alert.status === 'active' ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">
                          {alert.type.toUpperCase()} Alert - {job?.jobNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.engineerName} • {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={alert.status === 'active' ? 'destructive' : 'default'}>
                      {alert.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}