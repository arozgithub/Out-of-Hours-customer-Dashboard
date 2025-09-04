import React from 'react';
import JobCard from './JobCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job, Engineer } from '@/types/job';
import { useJobContext } from '@/hooks/useJobContext';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Activity,
  TrendingUp,
  Timer
} from 'lucide-react';

interface EngineerDashboardProps {
  engineerName: string;
  onBack: () => void;
  onJobClick?: (job: Job) => void;
}

export default function EngineerDashboard({ 
  engineerName, 
  onBack, 
  onJobClick 
}: EngineerDashboardProps) {
  const { 
    getJobsByEngineer, 
    getEngineerByName, 
    getEngineerStats, 
    updateJob 
  } = useJobContext();

  // Get engineer data from context
  const engineer = getEngineerByName(engineerName);
  if (!engineer) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Engineer not found</h3>
        <p className="text-muted-foreground">The engineer "{engineerName}" could not be found.</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Get jobs and stats from context
  const engineerJobs = getJobsByEngineer(engineerName);
  const engineerStats = getEngineerStats(engineerName);

  // Categorize jobs
  const pendingJobs = engineerJobs.filter(j => j.status === 'red'); // Jobs waiting for engineer response
  const currentJobs = engineerJobs.filter(j => j.status === 'amber'); // Jobs accepted and in progress  
  const completedJobs = engineerJobs.filter(j => j.status === 'green'); // Jobs completed

  const handleAcceptJob = (jobId: string) => {
    updateJob(jobId, { 
      status: 'amber', 
      dateAccepted: new Date()
    });
  };

  const handleDeclineJob = (jobId: string) => {
    updateJob(jobId, { 
      status: 'red',
      reason: 'Job declined by engineer'
    });
  };

  const handleCompleteJob = (jobId: string) => {
    updateJob(jobId, { 
      status: 'green',
      dateCompleted: new Date()
    });
  };

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
              <User className="h-8 w-8" />
              <span>{engineer.name}</span>
            </h1>
            <p className="text-muted-foreground">
              Status: <Badge variant={engineer.status === 'accept' ? 'default' : 'secondary'}>
                {engineer.status}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{engineerStats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{engineerStats.pendingJobs}</p>
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
                <p className="text-2xl font-bold">{engineerStats.completedJobs}</p>
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
                <p className="text-2xl font-bold">{engineerStats.criticalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">
                  {engineerStats.avgCompletionTime 
                    ? `${Math.round(engineerStats.avgCompletionTime)}m`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Active Jobs */}
      {currentJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {currentJobs.map(job => (
                <div key={job.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <JobCard 
                      job={job} 
                      onUpdateStatus={() => {}} 
                      onJobClick={onJobClick} 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => handleCompleteJob(job.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Complete Job
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Job Assignments */}
      {pendingJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Job Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingJobs.map(job => (
                <div key={job.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <JobCard 
                      job={job} 
                      onUpdateStatus={() => {}} 
                      onJobClick={onJobClick} 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => handleAcceptJob(job.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button 
                      onClick={() => handleDeclineJob(job.id)}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedJobs.slice(0, 6).map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onUpdateStatus={() => {}} 
                  onJobClick={onJobClick} 
                />
              ))}
            </div>
            {completedJobs.length > 6 && (
              <div className="text-center mt-4">
                <Button variant="outline">
                  View All Completed Jobs ({completedJobs.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {engineerStats.statusBreakdown.red}
              </div>
              <div className="text-sm text-red-700">Overdue/Issues</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {engineerStats.statusBreakdown.amber}
              </div>
              <div className="text-sm text-amber-700">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {engineerStats.statusBreakdown.green}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {engineerJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs assigned</h3>
            <p className="text-muted-foreground">
              This engineer currently has no jobs assigned.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
