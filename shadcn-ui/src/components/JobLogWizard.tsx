import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      category: formData.primaryTrade || 'General',
      jobType: 'Draft',
      targetCompletionTime: 240,
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
      category: formData.primaryTrade,
      jobType: formData.jobType === 'OOH' ? 'Out of Hours' : 'Call Out',
      targetCompletionTime: formData.responseTime,
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

          {/* Step content rendered here - using simplified content for now */}
          <div className="text-center py-10 mb-6">
            <h3 className="text-xl font-bold">Step {currentStep}: {
              currentStep === 1 ? "Reporter Details" :
              currentStep === 2 ? "Job Details" :
              currentStep === 3 ? "Job Type & KPI" :
              currentStep === 4 ? "Engineer Selection" :
              "Job Allocation"
            }</h3>
            <p className="text-muted-foreground mt-2">
              This is a simplified version of step {currentStep}.<br/>
              Job Log Wizard is being fixed.
            </p>
          </div>

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
              <Button onClick={nextStep}>
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
