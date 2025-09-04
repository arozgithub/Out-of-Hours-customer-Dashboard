import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Settings, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Play,
  Pause,
  Clock
} from 'lucide-react';

interface DashboardControlBarProps {
  // Filter states
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  customerFilter: string;
  onCustomerFilterChange: (value: string) => void;
  engineerFilter: string;
  onEngineerFilterChange: (value: string) => void;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalJobs: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  
  // Settings
  jobsPerPage: number;
  onJobsPerPageChange: (count: number) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  showCompletedJobs: boolean;
  onToggleShowCompleted: () => void;
  
  // Auto-refresh
  autoRefresh: boolean;
  refreshInterval: number;
  isAutoRefreshing: boolean;
  onToggleAutoRefresh: () => void;
  onStartAutoRefresh: () => void;
  onStopAutoRefresh: () => void;
  onRefreshData: () => void;
  
  // Actions
  onClearFilters: () => void;
  
  // Available options
  customers?: string[];
  engineers?: string[];
}

export default function DashboardControlBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  customerFilter,
  onCustomerFilterChange,
  engineerFilter,
  onEngineerFilterChange,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalJobs,
  onPageChange,
  onNextPage,
  onPreviousPage,
  jobsPerPage,
  onJobsPerPageChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  showCompletedJobs,
  onToggleShowCompleted,
  autoRefresh,
  refreshInterval,
  isAutoRefreshing,
  onToggleAutoRefresh,
  onStartAutoRefresh,
  onStopAutoRefresh,
  onRefreshData,
  onClearFilters,
  customers = [],
  engineers = []
}: DashboardControlBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters = searchTerm !== '' || 
    statusFilter !== 'all' || 
    priorityFilter !== 'all' || 
    customerFilter !== 'all' || 
    engineerFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Main Control Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, customers, engineers, sites..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="green">Completed</SelectItem>
                  <SelectItem value="amber">In Progress</SelectItem>
                  <SelectItem value="red">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? 'Simple' : 'Advanced'}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Select value={customerFilter} onValueChange={onCustomerFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Customers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      {customers.map(customer => (
                        <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Engineer</Label>
                  <Select value={engineerFilter} onValueChange={onEngineerFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Engineers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Engineers</SelectItem>
                      {engineers.map(engineer => (
                        <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={onSortByChange}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Items per Page</Label>
                  <Select value={jobsPerPage.toString()} onValueChange={(value) => onJobsPerPageChange(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Status and Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Results Info & Active Filters */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex}-{endIndex} of {totalJobs} jobs
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {searchTerm && <Badge variant="secondary" className="text-xs">Search: {searchTerm}</Badge>}
              {statusFilter !== 'all' && <Badge variant="secondary" className="text-xs">Status: {statusFilter}</Badge>}
              {priorityFilter !== 'all' && <Badge variant="secondary" className="text-xs">Priority: {priorityFilter}</Badge>}
              {customerFilter !== 'all' && <Badge variant="secondary" className="text-xs">Customer: {customerFilter}</Badge>}
              {engineerFilter !== 'all' && <Badge variant="secondary" className="text-xs">Engineer: {engineerFilter}</Badge>}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Show Completed Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={showCompletedJobs}
              onCheckedChange={onToggleShowCompleted}
              id="show-completed"
            />
            <Label htmlFor="show-completed" className="text-sm">
              {showCompletedJobs ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Label>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Auto-refresh Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={autoRefresh ? onToggleAutoRefresh : onRefreshData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={onToggleAutoRefresh}
                id="auto-refresh"
              />
              <Label htmlFor="auto-refresh" className="text-sm flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {refreshInterval}s
              </Label>
            </div>

            {autoRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={isAutoRefreshing ? onStopAutoRefresh : onStartAutoRefresh}
              >
                {isAutoRefreshing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            )}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
