import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Clock, 
  ArrowUpDown,
  Grid3X3,
  RefreshCw,
  Save,
  RotateCcw,
  Monitor,
  User,
  Building2,
  Calendar
} from 'lucide-react';

interface DashboardSettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSettings({ isOpen = true, onClose }: DashboardSettingsProps) {
  const { settings, updateSettings, saveSettings } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (section: string, key: string, value: unknown) => {
    updateSettings(section as keyof typeof settings, key, value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    const success = await saveSettings();
    if (success) {
      setHasChanges(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Dashboard Settings</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default View */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <Label className="font-medium">Default View</Label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'master', label: 'Master Dashboard', icon: Monitor },
              { value: 'customer', label: 'Customer View', icon: Building2 },
              { value: 'engineer', label: 'Engineer View', icon: User }
            ].map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={settings.dashboard.defaultView === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingChange('dashboard', 'defaultView', value)}
                className="flex items-center space-x-2 justify-start"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Display Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="h-4 w-4" />
            <Label className="font-medium">Display Options</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobsPerPage">Jobs per Page</Label>
              <Select 
                value={settings.dashboard.jobsPerPage.toString()}
                onValueChange={(value) => handleSettingChange('dashboard', 'jobsPerPage', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 jobs</SelectItem>
                  <SelectItem value="25">25 jobs</SelectItem>
                  <SelectItem value="50">50 jobs</SelectItem>
                  <SelectItem value="100">100 jobs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Show completed jobs</Label>
                <Switch
                  checked={settings.dashboard.showCompletedJobs}
                  onCheckedChange={(checked) => handleSettingChange('dashboard', 'showCompletedJobs', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Sorting Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4" />
            <Label className="font-medium">Sorting & Ordering</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy">Default Sort By</Label>
              <Select 
                value={settings.dashboard.sortBy}
                onValueChange={(value) => handleSettingChange('dashboard', 'sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Select 
                value={settings.dashboard.sortOrder}
                onValueChange={(value) => handleSettingChange('dashboard', 'sortOrder', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Auto-Refresh Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <Label className="font-medium">Auto-Refresh Settings</Label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable auto-refresh</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically refresh dashboard data
                </p>
              </div>
              <Switch
                checked={settings.dashboard.autoRefresh}
                onCheckedChange={(checked) => handleSettingChange('dashboard', 'autoRefresh', checked)}
              />
            </div>

            {settings.dashboard.autoRefresh && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Refresh Interval</Label>
                    <Badge variant="outline">
                      {settings.dashboard.refreshInterval} seconds
                    </Badge>
                  </div>
                  <Slider
                    value={[settings.dashboard.refreshInterval]}
                    onValueChange={(value) => handleSettingChange('dashboard', 'refreshInterval', value[0])}
                    min={15}
                    max={300}
                    step={15}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15s</span>
                    <span>5min</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Dashboard will refresh every {settings.dashboard.refreshInterval} seconds when active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Filter Memory */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <Label className="font-medium">Filter Memory</Label>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Remember filters between sessions</Label>
              <p className="text-xs text-muted-foreground">
                Keep your search and filter settings when you return
              </p>
            </div>
            <Switch
              checked={settings.privacy.rememberFilters}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'rememberFilters', checked)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              // Reset dashboard settings to defaults
              handleSettingChange('dashboard', 'defaultView', 'master');
              handleSettingChange('dashboard', 'jobsPerPage', 25);
              handleSettingChange('dashboard', 'sortBy', 'date');
              handleSettingChange('dashboard', 'sortOrder', 'desc');
              handleSettingChange('dashboard', 'autoRefresh', true);
              handleSettingChange('dashboard', 'refreshInterval', 30);
              handleSettingChange('dashboard', 'showCompletedJobs', true);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>

          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
