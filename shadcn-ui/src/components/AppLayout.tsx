import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Job } from '@/types/job';

type View = 'master' | 'customer' | 'alerts' | 'wizard' | 'customerList' | 'globalAlerts' | 'engineerPortal' | 'dataManagement' | 'customerFilter' | 'engineerFilter' | 'settings';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  jobCount?: number;
  alertCount?: number;
  breadcrumbTitle?: string;
  jobs?: Job[];
}

const getViewTitle = (view: View): string => {
  switch (view) {
    case 'master':
      return 'Master Dashboard';
    case 'customer':
      return 'Customer Dashboard';
    case 'customerList':
      return 'All Customers';
    case 'alerts':
      return 'Customer Alerts';
    case 'globalAlerts':
      return 'Global Alerts Portal';
    case 'dataManagement':
      return 'Data Management';
    case 'customerFilter':
      return 'Customer Jobs Filter';
    case 'engineerFilter':
      return 'Engineer Jobs Filter';
    case 'wizard':
      return 'Create New Job';
    case 'engineerPortal':
      return 'Engineer Portal';
    case 'settings':
      return 'Settings';
    default:
      return 'Dashboard';
  }
};

export function AppLayout({ 
  children, 
  currentView, 
  onViewChange, 
  jobCount = 0, 
  alertCount = 0,
  breadcrumbTitle,
  jobs = []
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar 
        currentView={currentView}
        onViewChange={onViewChange}
        jobCount={jobCount}
        alertCount={alertCount}
        jobs={jobs}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {breadcrumbTitle || getViewTitle(currentView)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
