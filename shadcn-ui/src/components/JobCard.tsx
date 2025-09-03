import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Job } from '@/types/job';
import { Clock, User, MapPin, Phone, Mail, AlertTriangle, CheckCircle, Wrench, Edit } from 'lucide-react';
import { format, isValid } from 'date-fns';

interface JobCardProps {
  job: Job;
  onUpdateStatus: (jobId: string, status: Job['status'], reason?: string) => void;
  onJobClick?: (job: Job) => void;
}

export default function JobCard({ job, onUpdateStatus, onJobClick }: JobCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusReason, setStatusReason] = useState('');

  const handleStatusUpdate = (newStatus: Job['status']) => {
    onUpdateStatus(job.id, newStatus, statusReason);
    setIsDialogOpen(false);
    setStatusReason('');
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'green':
        return 'bg-green-500';
      case 'amber':
        return 'bg-amber-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Job['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return 'Not set';
    
    // Ensure we have a valid Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    try {
      return format(dateObj, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Date formatting error:', error, 'Date:', date);
      return 'Invalid date';
    }
  };

  const formatTimeElapsed = (date: Date | null | undefined): string => {
    if (!date) return 'Unknown';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    try {
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `${hours}h ago`;
      } else {
        const days = Math.floor(diffMinutes / 1440);
        return `${days}d ago`;
      }
    } catch (error) {
      console.error('Time elapsed calculation error:', error, 'Date:', date);
      return 'Unknown';
    }
  };

  return (
    <Card 
      className={`shadow-sm hover:shadow-md transition-all duration-200 ${
        onJobClick ? 'cursor-pointer hover:bg-gray-50 hover:border-blue-300' : ''
      }`}
      onClick={onJobClick ? () => onJobClick(job) : undefined}
      title={onJobClick ? "Click to view job details" : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                {job.jobNumber}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {job.customer}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`${getPriorityColor(job.priority)} text-xs py-0 px-2`}>
              {job.priority}
            </Badge>
            {onJobClick && (
              <div className="ml-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Edit size={12} />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pt-0">
        {/* Job Description - Truncated */}
        <div>
          <p className="text-sm text-gray-700 line-clamp-2">
            {job.description}
          </p>
        </div>

        {/* Key Details - Compact Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <User size={12} className="text-blue-600" />
            <span className="truncate">{job.engineer}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-green-600" />
            <span className="truncate">{job.site}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Wrench size={12} className="text-purple-600" />
            <span className="truncate">{job.primaryJobTrade}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-amber-600" />
            <span>{formatTimeElapsed(job.createdAt)}</span>
          </div>
        </div>

        {/* Contact - Compact */}
        <div className="bg-gray-50 p-2 rounded text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">{job.contact.name}</span>
            <div className="flex items-center gap-1">
              <Phone size={10} />
              <span className="text-muted-foreground">{job.contact.number}</span>
            </div>
          </div>
        </div>

        {onJobClick && (
          <div className="text-center mt-2 text-blue-600 text-xs font-medium opacity-70">
            💡 Click to view details
          </div>
        )}
      </CardContent>
    </Card>
  );
}