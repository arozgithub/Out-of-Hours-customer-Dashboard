import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, Job } from '@/types/job';
import { 
  Search, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Briefcase, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Filter,
  Grid3x3,
  List
} from 'lucide-react';

interface CustomersPageProps {
  customers: Customer[];
  jobs: Job[];
  onCustomerSelect: (customer: Customer) => void;
}

export default function CustomersPage({ customers, jobs, onCustomerSelect }: CustomersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<string>('all');

  // Get job stats for each customer
  const getCustomerStats = (customer: Customer) => {
    const customerJobs = jobs.filter(job => job.customer === customer.name);
    return {
      totalJobs: customerJobs.length,
      activeJobs: customerJobs.filter(job => job.status !== 'completed').length,
      completedJobs: customerJobs.filter(job => job.status === 'completed').length,
      criticalJobs: customerJobs.filter(job => job.priority === 'Critical').length,
      sites: customer.sites?.length || 0
    };
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const stats = getCustomerStats(customer);
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'active' && stats.activeJobs > 0) ||
        (filterBy === 'inactive' && stats.activeJobs === 0) ||
        (filterBy === 'critical' && stats.criticalJobs > 0);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'jobs':
          return getCustomerStats(b).totalJobs - getCustomerStats(a).totalJobs;
        case 'sites':
          return getCustomerStats(b).sites - getCustomerStats(a).sites;
        default:
          return 0;
      }
    });

  const totalStats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(customer => getCustomerStats(customer).activeJobs > 0).length,
    totalSites: customers.reduce((sum, customer) => sum + (customer.sites?.length || 0), 0),
    totalJobs: jobs.length
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => {
    const stats = getCustomerStats(customer);
    
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="group-hover:text-blue-600 transition-colors">{customer.name}</span>
            </CardTitle>
            {stats.criticalJobs > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {stats.criticalJobs}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact Info */}
          <div className="space-y-2">
            {customer.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">{stats.sites}</div>
              <div className="text-xs text-blue-600">Sites</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">{stats.totalJobs}</div>
              <div className="text-xs text-green-600">Total Jobs</div>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-lg">
              <div className="text-lg font-bold text-amber-700">{stats.activeJobs}</div>
              <div className="text-xs text-amber-600">Active</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-700">{stats.completedJobs}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full mt-4"
            onClick={() => onCustomerSelect(customer)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  };

  const CustomerListItem = ({ customer }: { customer: Customer }) => {
    const stats = getCustomerStats(customer);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {customer.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </span>
                    )}
                    {customer.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-blue-700">{stats.sites}</div>
                  <div className="text-xs text-muted-foreground">Sites</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-700">{stats.totalJobs}</div>
                  <div className="text-xs text-muted-foreground">Jobs</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-amber-700">{stats.activeJobs}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
              
              {stats.criticalJobs > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {stats.criticalJobs}
                </Badge>
              )}
              
              <Button 
                size="sm"
                onClick={() => onCustomerSelect(customer)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all your customer accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalStats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Customers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalStats.activeCustomers}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total Sites</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{totalStats.totalSites}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{totalStats.totalJobs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="active">Active Jobs</SelectItem>
            <SelectItem value="inactive">No Active Jobs</SelectItem>
            <SelectItem value="critical">Critical Jobs</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="jobs">Job Count</SelectItem>
            <SelectItem value="sites">Site Count</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>

      {/* Customers Display */}
      {filteredCustomers.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map(customer => (
              <CustomerListItem key={customer.id} customer={customer} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery || filterBy !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No customers available.'}
          </p>
        </div>
      )}
    </div>
  );
}
