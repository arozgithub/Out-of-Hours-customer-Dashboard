import React from 'react';
import JobCard from './JobCard';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';

interface EngineerDashboardProps {
  jobs: Job[];
  onAcceptJob: (jobId: string, status: Job['status'], reason?: string) => void;
  onDeclineJob: (jobId: string, status: Job['status'], reason?: string) => void;
}

export default function EngineerDashboard({ jobs, onAcceptJob, onDeclineJob }: EngineerDashboardProps) {
  const currentJob = jobs.find(j => j.status === 'amber' || j.status === 'green');

  return (
    <div className="space-y-6">
      {/* Current Job Card */}
      {currentJob && (
        <JobCard job={currentJob} onUpdateStatus={() => {}} />
      )}
      {/* Incoming Jobs */}
      <div className="grid grid-cols-1 gap-4">
        {jobs.filter(j => j.status === 'amber').map(job => (
          <div key={job.id} className="flex items-center gap-2">
            <JobCard job={job} onUpdateStatus={() => {}} />
            <Button onClick={() => onAcceptJob(job.id, 'amber')}>Accept</Button>
            <Button 
              onClick={() => onDeclineJob(job.id, 'red')}
              className="border border-gray-300 bg-white hover:bg-gray-50"
            >
              Decline
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
