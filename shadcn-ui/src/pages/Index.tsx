import { useState } from 'react';
import { Job, Customer } from '@/types/job';
import { mockJobs, mockCustomers, mockEngineers } from '@/lib/jobUtils';
import MasterDashboard from '@/components/MasterDashboard';
import CustomerDashboard from '@/components/CustomerDashboard';
import CustomerAlertsPortal from '@/components/CustomerAlertsPortal';
import GlobalAlertsPortal from '@/components/GlobalAlertsPortal';
import JobLogWizard from '@/components/JobLogWizard';
import JobEditModal from '@/components/JobEditModal';
import CustomerListPage from '@/pages/CustomerListPage';
import Dashboard from '@/components/Dashboard';
import EngineerInterface from '@/components/EngineerInterface';
import { AppLayout } from '@/components/AppLayout';

type View = 'master' | 'customer' | 'alerts' | 'wizard' | 'customerList' | 'globalAlerts' | 'engineerPortal' | 'engineerMode';

export default function Index() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [currentView, setCurrentView] = useState<View>('master');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleJobCreate = (newJob: Omit<Job, 'id'>) => {
    const jobWithId: Job = {
      ...newJob,
      id: `job-${Date.now()}`
    };
    setJobs(prev => [jobWithId, ...prev]);
    setCurrentView('master');
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleJobSave = (updatedJob: Job) => {
    setJobs(prev => prev.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    ));
    setSelectedJob(null);
  };

  const handleAcceptJob = (jobId: string, status: Job['status'], reason?: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status, 
            dateAccepted: status === 'green' ? new Date() : job.dateAccepted,
            reason: reason || job.reason 
          } 
        : job
    ));
  };

  const handleDeclineJob = (jobId: string, status: Job['status'], reason?: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status, 
            reason: reason || job.reason 
          } 
        : job
    ));
  };

  const handleSwitchToEngineerMode = () => {
    setCurrentView('engineerMode');
  };

  const handleBackToPortal = () => {
    setCurrentView('master');
  };

  const handleJobAccept = (jobId: string, status: Job['status'], reason?: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status, 
            dateAccepted: status === 'green' ? new Date() : job.dateAccepted,
            reason: reason || job.reason 
          } 
        : job
    ));
  };

  const handleJobDecline = (jobId: string, status: Job['status'], reason?: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: 'red', 
            reason: reason || 'Job declined by engineer' 
          } 
        : job
    ));
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentView('customer');
  };

  // Calculate counts for sidebar
  const alertCount = jobs.filter(job => job.priority === 'Critical' || job.priority === 'High').length;
  const jobCount = jobs.length;

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'customer':
        return selectedCustomer ? `${selectedCustomer.name} Dashboard` : 'Customer Dashboard';
      case 'customerList':
        return 'All Customers';
      case 'alerts':
        return selectedCustomer ? `${selectedCustomer.name} - Alerts` : 'Customer Alerts';
      case 'globalAlerts':
        return 'Global Alerts Portal';
      case 'engineerPortal':
        return 'Engineer Portal';
      case 'engineerMode':
        return 'Engineer Interface';
      default:
        return undefined;
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'master':
        return (
          <MasterDashboard
            jobs={jobs}
            customers={customers}
            onJobCreate={() => setCurrentView('wizard')}
            onJobClick={handleJobClick}
            onCustomerSelect={handleCustomerSelect}
            onAcceptJob={handleAcceptJob}
            onDeclineJob={handleDeclineJob}
            onSwitchToEngineerMode={handleSwitchToEngineerMode}
          />
        );
      
      case 'customerList':
        return (
          <CustomerListPage
            customers={customers}
            jobs={jobs}
            onCustomerSelect={handleCustomerSelect}
            onBack={() => setCurrentView('master')}
          />
        );
      
      case 'customer':
        return selectedCustomer ? (
          <CustomerDashboard
            customer={selectedCustomer}
            jobs={jobs}
            engineers={mockEngineers}
            onBack={() => setCurrentView('customerList')}
            onJobClick={handleJobClick}
            onAlertsPortal={() => setCurrentView('alerts')}
          />
        ) : null;
      
      case 'alerts':
        return selectedCustomer ? (
          <CustomerAlertsPortal
            customer={selectedCustomer}
            jobs={jobs}
            onBack={() => setCurrentView('customer')}
          />
        ) : null;
      
      case 'globalAlerts':
        return (
          <GlobalAlertsPortal
            jobs={jobs}
            customers={customers}
          />
        );
      
      case 'engineerMode':
        return (
          <EngineerInterface
            jobs={jobs}
            onAcceptJob={handleAcceptJob}
            onDeclineJob={handleDeclineJob}
            onBackToPortal={handleBackToPortal}
          />
        );
      
      case 'engineerPortal':
        return (
          <Dashboard
            jobs={jobs}
            onUpdateStatus={(jobId, status, reason) => {
              setJobs(prev => prev.map(job => 
                job.id === jobId ? { ...job, status, reason } : job
              ));
            }}
            onAcceptJob={handleJobAccept}
            onDeclineJob={handleJobDecline}
          />
        );
      
      case 'wizard':
        return (
          <JobLogWizard
            customers={customers}
            onJobCreate={handleJobCreate}
            onCancel={() => setCurrentView('master')}
          />
        );
      
      default:
        return null;
    }
  };

  // Handle Engineer Mode separately (no sidebar/layout)
  if (currentView === 'engineerMode') {
    return (
      <>
        {renderCurrentView()}
        
        <JobEditModal
          job={selectedJob}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedJob(null);
          }}
          onSave={handleJobSave}
        />
      </>
    );
  }

  return (
    <AppLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      jobCount={jobCount}
      alertCount={alertCount}
      breadcrumbTitle={getBreadcrumbTitle()}
      jobs={jobs}
    >
      {renderCurrentView()}
      
      <JobEditModal
        job={selectedJob}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedJob(null);
        }}
        onSave={handleJobSave}
      />
    </AppLayout>
  );
}
