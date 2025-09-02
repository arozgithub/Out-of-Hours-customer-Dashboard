import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Job, Customer, Engineer } from '@/types/job';
import { mockEngineers, mockJobTrades, generateJobNumber } from '@/lib/jobUtils';
import { ArrowLeft, ArrowRight, CheckCircle, User, Briefcase, Settings, Users, Check, FileText } from 'lucide-react';

interface JobLogWizardProps {
  customers: Customer[];
  onJobCreate: (job: Omit<Job, 'id'>) => void;
  onCancel: () => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface JobFormData {
  customer: string;
  site: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  reporterRelationship: string;
  description: string;
  jobNature: string;
  skillsRequired: string[];
  tags: string[];
  jobOwner: string;
  isEmergency: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactRelationship: string;
  jobType: 'OOH' | 'CallOut';
  primaryTrade: string;
  responseTime: number;
  priority: Job['priority'];
  availableEngineers: Engineer[];
  selectedEngineer: string;
  callConfirmed: boolean;
  finalEngineer: string;
  jobNumber: string;
}

export default function JobLogWizard({ customers, onJobCreate, onCancel }: JobLogWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<JobFormData>({
    customer: '',
    site: '',
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    reporterRelationship: '',
    description: '',
    jobNature: '',
    skillsRequired: [],
    tags: [],
    jobOwner: '',
    isEmergency: false,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactRelationship: '',
    jobType: 'OOH',
    primaryTrade: '',
    responseTime: 60,
    priority: 'Medium',
    availableEngineers: [],
    selectedEngineer: '',
    callConfirmed: false,
    finalEngineer: '',
    jobNumber: generateJobNumber()
  });

  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getSLATimes = (priority: Job['priority'], isEmergency: boolean) => {
    if (isEmergency) {
      return { accept: 5, onsite: 15, completed: 30 };
    }
    
    switch (priority) {
      case 'Critical':
        return { accept: 10, onsite: 30, completed: 60 };
      case 'High':
        return { accept: 20, onsite: 60, completed: 120 };
      case 'Medium':
        return { accept: 30, onsite: 90, completed: 180 };
      case 'Low':
        return { accept: 60, onsite: 180, completed: 360 };
      default:
        return { accept: 30, onsite: 90, completed: 180 };
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
      
      if (currentStep === 3) {
        const filteredEngineers = mockEngineers.filter(engineer => {
          if (formData.jobType === 'OOH') {
            return engineer.status === 'accept' || engineer.status === 'onsite';
          } else {
            return engineer.status !== 'completed';
          }
        });
        updateFormData({ availableEngineers: filteredEngineers });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleLogDraftJob = () => {
    const draftJob: Omit<Job, 'id'> = {
      jobNumber: formData.jobNumber,
      customer: formData.customer,
      site: formData.site,
      description: formData.description,
      engineer: 'Unassigned',
      status: 'amber',
      priority: formData.priority,
      category: (formData.primaryTrade || 'General') as Job['category'],
      jobType: 'Draft',
      targetCompletionTime: 240,
      dateLogged: new Date(),
      dateAccepted: null,
      dateOnSite: null,
      dateCompleted: null,
      reason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      contact: {
        name: formData.contactName,
        number: formData.contactPhone,
        email: formData.contactEmail,
        relationship: formData.contactRelationship
      },
      reporter: {
        name: formData.reporterName,
        number: formData.reporterPhone,
        email: formData.reporterEmail,
        relationship: formData.reporterRelationship
      },
      primaryJobTrade: formData.primaryTrade || 'General',
      secondaryJobTrades: formData.skillsRequired,
      tags: [...formData.tags, 'Draft'],
      customAlerts: {
        acceptSLA: 60,
        onsiteSLA: 240,
        completedSLA: 480
      },
      project: '',
      customerOrderNumber: '',
      referenceNumber: '',
      jobOwner: formData.jobOwner,
      jobRef1: '',
      jobRef2: '',
      requiresApproval: true,
      preferredAppointmentDate: null,
      startDate: new Date(),
      endDate: null,
      lockVisitDateTime: false,
      deployToMobile: false,
      isRecurringJob: false,
      completionTimeFromEngineerOnsite: false
    };

    onJobCreate(draftJob);
  };

  const handleSubmit = () => {
    const slaTime = getSLATimes(formData.priority, formData.isEmergency);
    
    const newJob: Omit<Job, 'id'> = {
      jobNumber: formData.jobNumber,
      customer: formData.customer,
      site: formData.site,
      description: formData.description,
      engineer: formData.finalEngineer,
      status: 'amber',
      priority: formData.priority,
      category: formData.primaryTrade as Job['category'],
      jobType: formData.jobType === 'OOH' ? 'Out of Hours' : 'Call Out',
      targetCompletionTime: formData.responseTime,
      dateLogged: new Date(),
      dateAccepted: null,
      dateOnSite: null,
      dateCompleted: null,
      reason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      contact: {
        name: formData.contactName,
        number: formData.contactPhone,
        email: formData.contactEmail,
        relationship: formData.contactRelationship
      },
      reporter: {
        name: formData.reporterName,
        number: formData.reporterPhone,
        email: formData.reporterEmail,
        relationship: formData.reporterRelationship
      },
      primaryJobTrade: formData.primaryTrade,
      secondaryJobTrades: formData.skillsRequired,
      tags: formData.tags,
      customAlerts: {
        acceptSLA: slaTime.accept,
        onsiteSLA: slaTime.onsite,
        completedSLA: slaTime.completed
      },
      project: '',
      customerOrderNumber: '',
      referenceNumber: '',
      jobOwner: formData.jobOwner,
      jobRef1: '',
      jobRef2: '',
      requiresApproval: false,
      preferredAppointmentDate: null,
      startDate: new Date(),
      endDate: null,
      lockVisitDateTime: formData.isEmergency,
      deployToMobile: true,
      isRecurringJob: false,
      completionTimeFromEngineerOnsite: false
    };

    onJobCreate(newJob);
  };

  const isStepValid = (step: WizardStep): boolean => {
    switch (step) {
      case 1:
        return !!(formData.customer && formData.site && formData.reporterName);
      case 2:
        return !!(formData.description && formData.jobNature && formData.jobOwner && formData.contactName);
      case 3:
        return !!(formData.jobType && formData.primaryTrade && formData.responseTime && formData.priority);
      case 4:
        return !!(formData.selectedEngineer && formData.callConfirmed);
      case 5:
        return !!(formData.finalEngineer);
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Job Log Wizard</CardTitle>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep ? 'bg-green-500 text-white' : step === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 5 && <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Reporter Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold">Reporter Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer *</label>
                  <Select value={formData.customer} onValueChange={(value) => updateFormData({ customer: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site *</label>
                  <Input
                    placeholder="Enter site location"
                    value={formData.site}
                    onChange={(e) => updateFormData({ site: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reporter Name *</label>
                  <Input
                    placeholder="Enter reporter name"
                    value={formData.reporterName}
                    onChange={(e) => updateFormData({ reporterName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reporter Phone *</label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.reporterPhone}
                    onChange={(e) => updateFormData({ reporterPhone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reporter Email</label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.reporterEmail}
                    onChange={(e) => updateFormData({ reporterEmail: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship</label>
                  <Input
                    placeholder="e.g., Site Manager"
                    value={formData.reporterRelationship}
                    onChange={(e) => updateFormData({ reporterRelationship: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold">Job Details</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description *</label>
                  <Textarea
                    placeholder="Describe the issue or work required..."
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Nature *</label>
                    <Select value={formData.jobNature} onValueChange={(value) => updateFormData({ jobNature: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reactive">Reactive</SelectItem>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Owner *</label>
                    <Input
                      placeholder="Enter job owner name"
                      value={formData.jobOwner}
                      onChange={(e) => updateFormData({ jobOwner: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills Required</label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 min-h-[60px]">
                    {mockJobTrades.map(trade => (
                      <Badge
                        key={trade}
                        variant={formData.skillsRequired.includes(trade) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          const skills = formData.skillsRequired.includes(trade)
                            ? formData.skillsRequired.filter(s => s !== trade)
                            : [...formData.skillsRequired, trade];
                          updateFormData({ skillsRequired: skills });
                        }}
                      >
                        {trade}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Name *</label>
                    <Input
                      placeholder="Enter contact name"
                      value={formData.contactName}
                      onChange={(e) => updateFormData({ contactName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Phone *</label>
                    <Input
                      type="tel"
                      placeholder="Enter contact phone"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input
                      type="email"
                      placeholder="Enter contact email"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Relationship</label>
                    <Input
                      placeholder="e.g., Maintenance Manager"
                      value={formData.contactRelationship}
                      onChange={(e) => updateFormData({ contactRelationship: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergency"
                    checked={formData.isEmergency}
                    onCheckedChange={(checked) => updateFormData({ isEmergency: !!checked })}
                  />
                  <label htmlFor="emergency" className="text-sm font-medium">
                    Mark as Emergency
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Job Type & KPI */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold">Job Type & KPI</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Type *</label>
                  <Select value={formData.jobType} onValueChange={(value) => updateFormData({ jobType: value as 'OOH' | 'CallOut' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OOH">Out of Hours (OOH)</SelectItem>
                      <SelectItem value="CallOut">Call Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Trade *</label>
                  <Select value={formData.primaryTrade} onValueChange={(value) => updateFormData({ primaryTrade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockJobTrades.map(trade => (
                        <SelectItem key={trade} value={trade}>
                          {trade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Response Time (minutes) *</label>
                  <Input
                    type="number"
                    min="15"
                    max="480"
                    value={formData.responseTime}
                    onChange={(e) => updateFormData({ responseTime: parseInt(e.target.value) || 60 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority *</label>
                  <Select value={formData.priority} onValueChange={(value) => updateFormData({ priority: value as Job['priority'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.isEmergency && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <span className="font-medium">Emergency Job - Enhanced SLA</span>
                    </div>
                    <div className="text-sm text-red-700">
                      Accept: 5 min | On Site: 15 min | Completed: 30 min
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Engineer Selection */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold">Engineer Selection</h3>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Available Engineers ({formData.jobType})</h4>
                <div className="space-y-3">
                  {formData.availableEngineers.map((engineer) => (
                    <Card
                      key={engineer.name}
                      className={`cursor-pointer transition-colors ${
                        formData.selectedEngineer === engineer.name ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => updateFormData({ selectedEngineer: engineer.name })}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              engineer.status === 'accept' ? 'bg-green-500' :
                              engineer.status === 'onsite' ? 'bg-blue-500' :
                              engineer.status === 'completed' ? 'bg-gray-400' : 'bg-yellow-500'
                            }`} />
                            <div>
                              <div className="font-medium">{engineer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Status: {engineer.status.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {engineer.currentJobs} active job{engineer.currentJobs !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {formData.selectedEngineer && (
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="callConfirmed"
                      checked={formData.callConfirmed}
                      onCheckedChange={(checked) => updateFormData({ callConfirmed: !!checked })}
                    />
                    <label htmlFor="callConfirmed" className="text-sm font-medium">
                      Engineer call confirmed
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Job Allocation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold">Job Allocation</h3>
              </div>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <h4 className="font-medium text-green-800 mb-4">Job Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Job Number:</span> {formData.jobNumber}</div>
                    <div><span className="font-medium">Customer:</span> {formData.customer}</div>
                    <div><span className="font-medium">Site:</span> {formData.site}</div>
                    <div><span className="font-medium">Type:</span> {formData.jobType}</div>
                    <div><span className="font-medium">Priority:</span> {formData.priority}</div>
                    <div><span className="font-medium">Selected Engineer:</span> {formData.selectedEngineer}</div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Final Engineer Assignment *</label>
                <Select value={formData.finalEngineer} onValueChange={(value) => updateFormData({ finalEngineer: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Confirm engineer assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.availableEngineers.map((engineer) => (
                      <SelectItem key={engineer.name} value={engineer.name}>
                        {engineer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </Button>
            
            {currentStep === 2 && !formData.isEmergency && (
              <Button onClick={handleLogDraftJob} variant="secondary">
                <FileText size={16} className="mr-2" />
                Log Draft Job
              </Button>
            )}
            
            {currentStep < 5 && (
              <Button 
                onClick={nextStep} 
                disabled={!isStepValid(currentStep)}
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
            
            {currentStep === 5 && (
              <Button onClick={handleSubmit}>
                <CheckCircle size={16} className="mr-2" />
                Create Job
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
