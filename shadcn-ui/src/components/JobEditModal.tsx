import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';
import { Save, X, Edit, User, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface JobEditModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
}

export default function JobEditModal({ job, isOpen, onClose, onSave }: JobEditModalProps) {
  const [formData, setFormData] = useState<Job | null>(job);
  const [isSaving, setIsSaving] = useState(false);

  // Update formData when job prop changes
  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const handleSave = async () => {
    if (formData) {
      setIsSaving(true);
      try {
        // Simulate save delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        onSave({ ...formData, updatedAt: new Date() });
        onClose();
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!job || !formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">Edit Job</span>
                <p className="text-sm text-muted-foreground font-normal">{job.jobNumber} - {job.customer}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="outline" 
                  className={`${
                    formData.status === 'green' ? 'bg-green-100 text-green-800 border-green-300' :
                    formData.status === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-red-100 text-red-800 border-red-300'
                  }`}
                >
                  {formData.status === 'green' ? 'Completed' : 
                   formData.status === 'amber' ? 'In Progress' : 'Overdue'}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  {formData.priority} Priority
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Created: {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Job Number</label>
              <Input
                value={formData.jobNumber}
                onChange={(e) => setFormData(prev => prev ? { ...prev, jobNumber: e.target.value } : null)}
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'green' | 'amber' | 'red') => 
                  setFormData(prev => prev ? { ...prev, status: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">Completed</SelectItem>
                  <SelectItem value="amber">In Progress</SelectItem>
                  <SelectItem value="red">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Customer</label>
              <Input
                value={formData.customer}
                onChange={(e) => setFormData(prev => prev ? { ...prev, customer: e.target.value } : null)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Site</label>
              <Input
                value={formData.site}
                onChange={(e) => setFormData(prev => prev ? { ...prev, site: e.target.value } : null)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => prev ? { ...prev, description: e.target.value } : null)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Engineer</label>
              <Input
                value={formData.engineer}
                onChange={(e) => setFormData(prev => prev ? { ...prev, engineer: e.target.value } : null)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: Job['priority']) => 
                  setFormData(prev => prev ? { ...prev, priority: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Job Type</label>
              <Select 
                value={formData.jobType} 
                onValueChange={(value: Job['jobType']) => 
                  setFormData(prev => prev ? { ...prev, jobType: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Installation">Installation</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Out of Hours">Out of Hours</SelectItem>
                  <SelectItem value="Call Out">Call Out</SelectItem>
                </SelectContent>
              </Select>
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
                <label className="text-sm font-medium">Contact Name</label>
                <Input
                  value={formData.contact?.name || ''}
                  onChange={(e) => setFormData(prev => prev ? { 
                    ...prev, 
                    contact: { ...prev.contact, name: e.target.value }
                  } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contact Phone</label>
                <Input
                  value={formData.contact?.number || ''}
                  onChange={(e) => setFormData(prev => prev ? { 
                    ...prev, 
                    contact: { ...prev.contact, number: e.target.value }
                  } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contact Email</label>
                <Input
                  value={formData.contact?.email || ''}
                  onChange={(e) => setFormData(prev => prev ? { 
                    ...prev, 
                    contact: { ...prev.contact, email: e.target.value }
                  } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Relationship</label>
                <Input
                  value={formData.contact?.relationship || ''}
                  onChange={(e) => setFormData(prev => prev ? { 
                    ...prev, 
                    contact: { ...prev.contact, relationship: e.target.value }
                  } : null)}
                />
              </div>
            </div>
          </div>

          {/* SLA Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-4 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>SLA Configuration</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Accept SLA (minutes)</label>
                <Input
                  type="number"
                  value={formData.customAlerts?.acceptSLA || 30}
                  onChange={(e) => setFormData(prev => prev ? { 
                    ...prev, 
                    customAlerts: { 
                      ...prev.customAlerts, 
                      acceptSLA: parseInt(e.target.value) || 30 
                    }
                  } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Onsite SLA (minutes)</label>
                <Input
                  type="number"
                  value={formData.customAlerts?.onsiteSLA || 90}
                  onChange={(e) => setFormData(prev => prev ? { 
                    ...prev, 
                    customAlerts: { 
                      ...prev.customAlerts, 
                      onsiteSLA: parseInt(e.target.value) || 90 
                    }
                  } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Completion SLA (minutes)</label>
                <Input
                  type="number"
                  value={formData.customAlerts?.completedSLA || 180}
                  onChange={(e) => setFormData(prev => prev ? { 
                    ...prev, 
                    customAlerts: { 
                      ...prev.customAlerts, 
                      completedSLA: parseInt(e.target.value) || 180 
                    }
                  } : null)}
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Job Owner</label>
              <Input
                value={formData.jobOwner || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, jobOwner: e.target.value } : null)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Primary Trade</label>
              <Input
                value={formData.primaryJobTrade || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, primaryJobTrade: e.target.value } : null)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
