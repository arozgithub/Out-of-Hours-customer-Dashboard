import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job, Engineer } from '@/types/job';
import { mockEngineers } from '@/lib/jobUtils';
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isToday, isPast } from 'date-fns';

interface CalendarPlannerProps {
  jobs: Job[];
  customer: string;
  onJobAssign: (jobId: string, engineerId: string, date: Date) => void;
  onJobUpdate: (job: Job) => void;
}

interface DraggedJob {
  job: Job;
  sourceElement: HTMLElement;
}

interface ScheduledJob extends Job {
  scheduledDate: Date;
  assignedEngineer: string;
}

export default function CalendarPlanner({ jobs, customer, onJobAssign, onJobUpdate }: CalendarPlannerProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [draggedJob, setDraggedJob] = useState<DraggedJob | null>(null);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);

  // Get week days starting from Monday
  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays(currentWeek);
  const availableEngineers = mockEngineers.filter(engineer => 
    engineer.status !== 'completed'
  );

  // Filter unscheduled jobs for this customer
  const unscheduledJobs = jobs.filter(job => 
    job.customer === customer && 
    !scheduledJobs.some(scheduled => scheduled.id === job.id)
  );

  const handleDragStart = (e: React.DragEvent, job: Job) => {
    const element = e.currentTarget as HTMLElement;
    setDraggedJob({ job, sourceElement: element });
    
    // Add visual feedback
    element.style.opacity = '0.5';
    
    // Set drag data
    e.dataTransfer.setData('text/plain', job.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '1';
    setDraggedJob(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, date: Date, engineerId: string) => {
    e.preventDefault();
    
    if (!draggedJob) return;

    const newScheduledJob: ScheduledJob = {
      ...draggedJob.job,
      scheduledDate: date,
      assignedEngineer: engineerId,
      engineer: engineerId,
      status: 'amber' as const
    };

    setScheduledJobs(prev => [...prev, newScheduledJob]);
    onJobAssign(draggedJob.job.id, engineerId, date);
    onJobUpdate(newScheduledJob);
    
    // Visual feedback
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.add('bg-green-100', 'border-green-300');
    setTimeout(() => {
      dropZone.classList.remove('bg-green-100', 'border-green-300');
    }, 500);
  };

  const getJobsForDateAndEngineer = (date: Date, engineerId: string) => {
    return scheduledJobs.filter(job => 
      isSameDay(job.scheduledDate, date) && 
      job.assignedEngineer === engineerId
    );
  };

  const getEngineerWorkload = (engineerId: string, date: Date) => {
    return getJobsForDateAndEngineer(date, engineerId).length;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const getPriorityColor = (priority: Job['priority']) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Unscheduled Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Unscheduled Jobs - {customer}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unscheduledJobs.map((job) => (
              <Card
                key={job.id}
                draggable
                onDragStart={(e) => handleDragStart(e, job)}
                onDragEnd={handleDragEnd}
                className="cursor-grab hover:shadow-md transition-shadow border-l-4"
                style={{ borderLeftColor: job.priority === 'Critical' ? '#ef4444' : 
                                         job.priority === 'High' ? '#f97316' :
                                         job.priority === 'Medium' ? '#eab308' : '#22c55e' }}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {job.jobNumber}
                      </Badge>
                      <Badge className={`${getPriorityColor(job.priority)} text-white text-xs`}>
                        {job.priority}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">{job.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{job.site}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{job.targetCompletionTime} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {unscheduledJobs.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                All jobs for {customer} are scheduled
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Planner */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule Planner
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-4">
                {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {/* Header Row */}
            <div className="p-2 font-medium text-sm">Engineer</div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`p-2 text-center text-sm font-medium ${
                  isToday(day) ? 'bg-blue-100 text-blue-800 rounded' : ''
                } ${isPast(day) && !isToday(day) ? 'text-muted-foreground' : ''}`}
              >
                <div>{format(day, 'EEE')}</div>
                <div className="text-xs">{format(day, 'd')}</div>
              </div>
            ))}

            {/* Engineer Rows */}
            {availableEngineers.map((engineer) => (
              <div key={engineer.name} className="contents">
                {/* Engineer Name Column */}
                <div className="p-3 border rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      engineer.status === 'accept' ? 'bg-green-500' :
                      engineer.status === 'onsite' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm font-medium">{engineer.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {engineer.currentJobs} active jobs
                  </div>
                </div>

                {/* Day Columns */}
                {weekDays.map((day) => {
                  const dayJobs = getJobsForDateAndEngineer(day, engineer.name);
                  const workload = getEngineerWorkload(engineer.name, day);
                  const isPastDay = isPast(day) && !isToday(day);

                  return (
                    <div
                      key={`${engineer.name}-${day.toISOString()}`}
                      className={`min-h-[80px] p-2 border-2 border-dashed border-gray-200 rounded-md transition-colors ${
                        isPastDay ? 'bg-gray-50 opacity-50' : 'hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                      onDragOver={!isPastDay ? handleDragOver : undefined}
                      onDrop={!isPastDay ? (e) => handleDrop(e, day, engineer.name) : undefined}
                    >
                      {/* Workload Indicator */}
                      {workload > 0 && (
                        <div className={`text-xs mb-2 px-2 py-1 rounded-full text-center ${
                          workload > 2 ? 'bg-red-100 text-red-600' :
                          workload > 1 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {workload} job{workload !== 1 ? 's' : ''}
                        </div>
                      )}

                      {/* Scheduled Jobs */}
                      <div className="space-y-1">
                        {dayJobs.map((job) => (
                          <div
                            key={job.id}
                            className="text-xs p-2 bg-white border rounded shadow-sm"
                          >
                            <div className="font-medium line-clamp-1">{job.jobNumber}</div>
                            <div className="text-muted-foreground line-clamp-1">{job.description}</div>
                            <Badge className={`${getPriorityColor(job.priority)} text-white mt-1 text-xs`}>
                              {job.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Drop Zone Indicator */}
                      {!isPastDay && (
                        <div className="text-xs text-muted-foreground text-center mt-2 opacity-0 hover:opacity-100 transition-opacity">
                          Drop job here
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2">How to use the Calendar Planner:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Drag unscheduled jobs from the top section</li>
                <li>• Drop them onto specific engineer/date combinations</li>
                <li>• Red/Yellow indicators show engineer workload</li>
                <li>• Past dates are disabled for scheduling</li>
                <li>• Jobs are automatically assigned and updated</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
