import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Customer, Job } from '@/types/job';
import { 
  Search, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface CustomerListPageProps {
  customers: Customer[];
  jobs: Job[];
  onCustomerSelect: (customer: Customer) => void;
  onBack: () => void;
}

export default function CustomerListPage({ 
  customers, 
  jobs, 
  onCustomerSelect,
  onBack 
}: CustomerListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.sites?.some(site => site.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get job stats for each customer
  const getCustomerStats = (customer: Customer) => {
    const customerJobs = jobs.filter(job => job.customer === customer.name);
    const activeJobs = customerJobs.filter(job => job.status !== 'completed');
    const highPriorityJobs = customerJobs.filter(job => job.priority === 'High' || job.priority === 'Critical');
    
    return {
      totalJobs: customerJobs.length,
      activeJobs: activeJobs.length,
      highPriorityJobs: highPriorityJobs.length,
      sites: customer.sites?.length || 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Customers</h1>
          <p className="text-muted-foreground">
            Manage and view all customer accounts and their job history
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Dashboard
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by customer name, email, or site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(job => job.status !== 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Across all customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => {
            const stats = getCustomerStats(customer);
            
            return (
              <Card 
                key={customer.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
                onClick={() => onCustomerSelect(customer)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                    </div>
                    {stats.highPriorityJobs > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {stats.highPriorityJobs} urgent
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{stats.sites}</div>
                      <div className="text-xs text-muted-foreground">Sites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{stats.totalJobs}</div>
                      <div className="text-xs text-muted-foreground">Total Jobs</div>
                    </div>
                  </div>

                  {/* Active Jobs Badge */}
                  {stats.activeJobs > 0 && (
                    <div className="flex items-center justify-center pt-2">
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {stats.activeJobs} active jobs
                      </Badge>
                    </div>
                  )}

                  {/* Sites List */}
                  {customer.sites && customer.sites.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Sites:</div>
                      <div className="flex flex-wrap gap-1">
                        {customer.sites.slice(0, 3).map((site, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {site}
                          </Badge>
                        ))}
                        {customer.sites.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{customer.sites.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="md:col-span-3">
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No customers found matching your search.' : 'No customers available.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Summary */}
      {searchTerm && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      )}
    </div>
  );
}
