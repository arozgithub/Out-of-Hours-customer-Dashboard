import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';
import JobEditModal from './JobEditModal';
import { 
  X, 
  Edit, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  Wrench,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface JobViewModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onJobUpdate: (updatedJob: Job) => void;
}

export default function JobViewModal({ job, isOpen, onClose, onJobUpdate }: JobViewModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!job) return null;

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
    const dateObj = date instanceof Date ? date : new Date(date);
    try {
      return format(dateObj, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleEditSave = (updatedJob: Job) => {
    onJobUpdate(updatedJob);
    setIsEditMode(false);
  };

  const handleEditClose = () => {
    setIsEditMode(false);
  };

  const handleModalClose = () => {
    setIsEditMode(false);
    onClose();
  };

  // Show edit modal if in edit mode
  if (isEditMode) {
    return (
      <JobEditModal
        job={job}
        isOpen={isOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    );
  }

  // Show view-only modal
  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                {job.status === 'green' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : job.status === 'amber' ? (
                  <Clock className="h-5 w-5 text-amber-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <span className="text-lg font-semibold">Job Details</span>
                <p className="text-sm text-muted-foreground font-normal">
                  {job.jobNumber} - {job.customer}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                <Edit size={16} className="mr-2" />
                Edit Job
              </Button>
              <Button variant="ghost" size="sm" onClick={handleModalClose} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className={getStatusColor(job.status)}>
                  {job.status === 'green' ? 'Completed' : 
                   job.status === 'amber' ? 'In Progress' : 'Overdue'}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(job.priority)}>
                  {job.priority} Priority
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                  {job.jobType}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Created: {formatDate(job.createdAt)}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="text-base font-medium">{job.customer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Site</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-base">{job.site}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Engineer</label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <p className="text-base">{job.engineer}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Trade</label>
                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-gray-400" />
                  <p className="text-base">{job.primaryJobTrade}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-base">{job.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Target Time</label>
                <p className="text-base">{job.targetCompletionTime} minutes</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <p className="text-base leading-relaxed">{job.description}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-4 flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span>Contact Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-base">{job.contact?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-base">{job.contact?.number}</p>
                </div>
              </div>
              {job.contact?.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{job.contact.email}</p>
                  </div>
                </div>
              )}
              {job.contact?.relationship && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="text-base">{job.contact.relationship}</p>
                </div>
              )}
            </div>
          </div>

          {/* SLA Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>SLA Targets</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Accept</p>
                <p className="text-lg font-bold text-blue-600">
                  {job.customAlerts?.acceptSLA || 30}min
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">On Site</p>
                <p className="text-lg font-bold text-blue-600">
                  {job.customAlerts?.onsiteSLA || 90}min
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Complete</p>
                <p className="text-lg font-bold text-blue-600">
                  {job.customAlerts?.completedSLA || 180}min
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span>Timeline</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <p className="font-medium">{formatDate(job.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <p className="font-medium">{formatDate(job.updatedAt)}</p>
              </div>
              {job.startDate && (
                <div>
                  <span className="text-gray-500">Started:</span>
                  <p className="font-medium">{formatDate(job.startDate)}</p>
                </div>
              )}
              {job.endDate && (
                <div>
                  <span className="text-gray-500">Target End:</span>
                  <p className="font-medium">{formatDate(job.endDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
