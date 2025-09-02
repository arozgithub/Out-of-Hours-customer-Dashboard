import {
  LayoutDashboard,
  Users,
  Wrench,
  AlertTriangle,
  Settings,
  Plus,
  FileText,
  Calendar,
  Bell,
  Search,
  Home,
  Building2,
  UserCheck,
  Clock,
  ChevronRight,
  Filter,
  User
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Job } from '@/types/job';

type View = 'master' | 'customer' | 'alerts' | 'wizard' | 'customerList' | 'globalAlerts' | 'engineerPortal';

interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  jobCount?: number;
  alertCount?: number;
  jobs?: Job[];
}

export function AppSidebar({ currentView, onViewChange, jobCount = 0, alertCount = 0, jobs = [] }: AppSidebarProps) {
  // Calculate real-time stats from jobs
  const emergencyJobs = jobs.filter(job => job.priority === 'Critical').length;
  const redStatusJobs = jobs.filter(job => job.status === 'red').length;
  const amberStatusJobs = jobs.filter(job => job.status === 'amber').length;
  const greenStatusJobs = jobs.filter(job => job.status === 'green').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const highPriorityJobs = jobs.filter(job => job.priority === 'High' || job.priority === 'Critical').length;
  
  // Get recent jobs (latest 4)
  const recentJobs = jobs
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 4);

  const navigation = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      view: 'master' as View,
      badge: jobCount > 0 ? jobCount.toString() : undefined,
    },
    {
      title: 'Create Job',
      icon: Plus,
      view: 'wizard' as View,
    },
    {
      title: 'Customers',
      icon: Building2,
      view: 'customerList' as View,
    },
    {
      title: 'Global Alerts',
      icon: AlertTriangle,
      view: 'globalAlerts' as View,
      badge: alertCount > 0 ? alertCount.toString() : undefined,
    },
  ];

  const quickActions = [
    {
      title: 'Emergency Jobs',
      icon: AlertTriangle,
      color: 'text-red-600',
      count: emergencyJobs,
    },
    {
      title: 'Overdue (Red)',
      icon: Clock,
      color: 'text-red-600',
      count: redStatusJobs,
    },
    {
      title: 'At Risk (Amber)',
      icon: UserCheck,
      color: 'text-amber-600',
      count: amberStatusJobs,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Job Management</span>
            <span className="truncate text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Search */}
        <SidebarGroup>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs, customers..." 
              className="pl-8 h-9 bg-background border-0 shadow-none focus-visible:ring-1"
            />
          </div>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={currentView === item.view}
                    onClick={() => onViewChange(item.view)}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton className="w-full">
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                    <span className="flex-1">{action.title}</span>
                    <Badge variant="outline" className="ml-auto">
                      {action.count}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Items */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent Jobs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentJobs.length > 0 ? recentJobs.map((job) => (
                <SidebarMenuItem key={job.id}>
                  <SidebarMenuButton size="sm" className="w-full text-xs">
                    <FileText className="h-3 w-3" />
                    <span className="truncate">{job.description}</span>
                    <div className={`ml-auto h-2 w-2 rounded-full ${
                      job.status === 'completed' ? 'bg-green-500' :
                      job.status === 'green' ? 'bg-green-400' :
                      job.status === 'amber' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )) : (
                <SidebarMenuItem>
                  <SidebarMenuButton size="sm" className="w-full text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>No recent jobs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Job Filters */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Filter className="h-4 w-4" />
            Filters
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>High Priority</span>
                  <Badge variant="outline" className="ml-auto text-xs">{highPriorityJobs}</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>At Risk</span>
                  <Badge variant="outline" className="ml-auto text-xs">{amberStatusJobs}</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Completed</span>
                  <Badge variant="outline" className="ml-auto text-xs">{completedJobs}</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              {alertCount > 0 && (
                <Badge variant="destructive" className="ml-auto h-4 w-4 p-0 text-xs">
                  {alertCount}
                </Badge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
