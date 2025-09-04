import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useJobContext } from '@/hooks/useJobContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useNotifications } from '@/lib/notificationService';
import { 
  Settings, 
  Bell, 
  User, 
  Shield, 
  Palette, 
  Database, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Upload,
  RefreshCw,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Monitor,
  Building2,
  Calendar,
  ArrowUpDown,
  Grid3X3,
  RotateCcw
} from 'lucide-react';

export default function SettingsPage() {
  const { exportData, importData, clearAllData } = useJobContext();
  const { settings, updateSettings, saveSettings, resetSettings, exportSettings, importSettings } = useSettings();
  const { testNotifications, notifyJobAssignment, notifyJobCompletion, notifyEmergencyAlert } = useNotifications();
  
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (section: string, key: string, value: unknown) => {
    updateSettings(section as keyof typeof settings, key, value);
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      const success = await saveSettings();
      if (success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleExportSettings = () => {
    try {
      const settingsData = exportSettings();
      const blob = new Blob([settingsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Settings exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export settings' });
    }
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importSettings(content);
        if (success) {
          setMessage({ type: 'success', text: 'Settings imported successfully!' });
        } else {
          setMessage({ type: 'error', text: 'Invalid settings file format' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to import settings file' });
      }
    };
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="h-8 w-8" />
            <span>Settings</span>
          </h1>
          <p className="text-muted-foreground">Manage your dashboard preferences and configuration</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            style={{ display: 'none' }}
            id="import-settings"
          />
          <Button 
            onClick={() => document.getElementById('import-settings')?.click()} 
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleExportSettings} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    placeholder="Your display name"
                    value={settings.profile.displayName}
                    onChange={(e) => updateSettings('profile', 'displayName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@company.com"
                    value={settings.profile.email}
                    onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    value={settings.profile.phone}
                    onChange={(e) => updateSettings('profile', 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={settings.profile.department}
                    onValueChange={(value) => updateSettings('profile', 'department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT Support</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Work Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.profile.timezone}
                    onValueChange={(value) => updateSettings('profile', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern (EST)</SelectItem>
                      <SelectItem value="cst">Central (CST)</SelectItem>
                      <SelectItem value="mst">Mountain (MST)</SelectItem>
                      <SelectItem value="pst">Pacific (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shiftPattern">Shift Pattern</Label>
                  <Select
                    value={settings.profile.shiftPattern}
                    onValueChange={(value) => updateSettings('profile', 'shiftPattern', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Shift (9 AM - 5 PM)</SelectItem>
                      <SelectItem value="evening">Evening Shift (5 PM - 1 AM)</SelectItem>
                      <SelectItem value="night">Night Shift (1 AM - 9 AM)</SelectItem>
                      <SelectItem value="oncall">24/7 On-Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  {Object.entries({
                    email: { icon: Mail, label: 'Email Notifications' },
                    sms: { icon: Smartphone, label: 'SMS Notifications' },
                    push: { icon: Bell, label: 'Push Notifications' }
                  }).map(([key, { icon: Icon, label }]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                      <Switch
                        checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                        onCheckedChange={(checked) => updateSettings('notifications', key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Alert Types</h4>
                <div className="space-y-3">
                  {Object.entries({
                    jobAssignments: 'New job assignments',
                    jobCompletions: 'Job completions',
                    emergencyAlerts: 'Emergency job alerts',
                    dailyReports: 'Daily summary reports'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span>{label}</span>
                      <Switch
                        checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                        onCheckedChange={(checked) => updateSettings('notifications', key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notification Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {settings.notifications.soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      <span>Sound notifications</span>
                    </div>
                    <Switch
                      checked={settings.notifications.soundEnabled}
                      onCheckedChange={(checked) => updateSettings('notifications', 'soundEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Show toast notifications</span>
                    </div>
                    <Switch
                      checked={settings.notifications.showToasts}
                      onCheckedChange={(checked) => updateSettings('notifications', 'showToasts', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Test Notifications</h4>
                    <p className="text-sm text-muted-foreground">Send sample notifications to test your settings</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      onClick={() => {
                        notifyJobAssignment('TEST001', 'John Doe', 'Acme Corp');
                        setMessage({ type: 'info', text: 'Job assignment test sent!' });
                        setTimeout(() => setMessage(null), 3000);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Test Assignment
                    </Button>
                    <Button 
                      onClick={() => {
                        notifyJobCompletion('TEST002', 'Jane Smith', 'TechCorp');
                        setMessage({ type: 'info', text: 'Job completion test sent!' });
                        setTimeout(() => setMessage(null), 3000);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Test Completion
                    </Button>
                    <Button 
                      onClick={() => {
                        notifyEmergencyAlert('URGENT001', 'CriticalCorp', 'Server down');
                        setMessage({ type: 'info', text: 'Emergency alert test sent!' });
                        setTimeout(() => setMessage(null), 3000);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Test Emergency
                    </Button>
                    <Button 
                      onClick={() => {
                        testNotifications();
                        setMessage({ type: 'info', text: 'All test notifications sent!' });
                        setTimeout(() => setMessage(null), 3000);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Test All
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance & Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Theme</div>
                  <div className="text-sm text-muted-foreground">Choose your preferred theme</div>
                </div>
                <ThemeToggle />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Display Options</h4>
                <div className="space-y-3">
                  {Object.entries({
                    compactMode: 'Compact mode',
                    showAvatars: 'Show user avatars',
                    animationsEnabled: 'Enable animations'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span>{label}</span>
                      <Switch
                        checked={settings.appearance[key as keyof typeof settings.appearance] as boolean}
                        onCheckedChange={(checked) => updateSettings('appearance', key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Settings */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Dashboard Configuration</span>
              </CardTitle>
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
                  <Label className="font-medium">Advanced Dashboard Options</Label>
                </div>

                <div className="space-y-3">
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
              </div>

              {/* Reset to Defaults */}
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
                    setMessage({ type: 'success', text: 'Dashboard settings reset to defaults!' });
                    setTimeout(() => setMessage(null), 3000);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Dashboard to Defaults
                </Button>

                {hasChanges && (
                  <Badge variant="secondary" className="text-xs">
                    Changes will be saved automatically
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries({
                  showOnlineStatus: 'Show online status to other users',
                  allowDataCollection: 'Allow anonymous usage data collection',
                  shareUsageStats: 'Share usage statistics for improvements'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span>{label}</span>
                    <Switch
                      checked={settings.privacy[key as keyof typeof settings.privacy] as boolean}
                      onCheckedChange={(checked) => updateSettings('privacy', key, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Alert Threshold</h4>
                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Critical alerts before notification</Label>
                  <Select
                    value={settings.alerts.alertThreshold.toString()}
                    onValueChange={(value) => updateSettings('alerts', 'alertThreshold', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 alert</SelectItem>
                      <SelectItem value="3">3 alerts</SelectItem>
                      <SelectItem value="5">5 alerts</SelectItem>
                      <SelectItem value="10">10 alerts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              <p className="text-sm text-muted-foreground">Advanced options for power users</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>

          {showAdvanced && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Developer Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries({
                      developerMode: 'Enable developer mode',
                      debugLogging: 'Enable debug logging',
                      experimentalFeatures: 'Enable experimental features'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span>{label}</span>
                        <Switch
                          checked={settings.advanced[key as keyof typeof settings.advanced] as boolean}
                          onCheckedChange={(checked) => updateSettings('advanced', key, checked)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Backup Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Enable automatic backups</span>
                        <Switch
                          checked={settings.advanced.autoBackup}
                          onCheckedChange={(checked) => updateSettings('advanced', 'autoBackup', checked)}
                        />
                      </div>
                      {settings.advanced.autoBackup && (
                        <div className="space-y-2">
                          <Label htmlFor="backupInterval">Backup Interval (hours)</Label>
                          <Select
                            value={settings.advanced.backupInterval.toString()}
                            onValueChange={(value) => updateSettings('advanced', 'backupInterval', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Every hour</SelectItem>
                              <SelectItem value="6">Every 6 hours</SelectItem>
                              <SelectItem value="12">Every 12 hours</SelectItem>
                              <SelectItem value="24">Daily</SelectItem>
                              <SelectItem value="168">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Data Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button onClick={() => {
                      const data = exportData();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      setMessage({ type: 'success', text: 'Job data exported successfully!' });
                    }} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Job Data
                    </Button>
                    <Button onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const data = event.target?.result as string;
                              if (importData(data)) {
                                setMessage({ type: 'success', text: 'Job data imported successfully!' });
                              } else {
                                setMessage({ type: 'error', text: 'Failed to import job data' });
                              }
                            } catch (error) {
                              setMessage({ type: 'error', text: 'Invalid data file format' });
                            }
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Job Data
                    </Button>
                    <Button onClick={() => {
                      if (window.confirm('Are you sure you want to clear all job data? This action cannot be undone.')) {
                        clearAllData();
                        setMessage({ type: 'info', text: 'All job data has been cleared.' });
                      }
                    }} variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Export your data regularly to prevent data loss. Imported data will merge with existing data.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    <span>Danger Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      These actions cannot be undone. Please proceed with caution.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button onClick={handleResetSettings} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset All Settings
                    </Button>
                    <Button onClick={() => {
                      if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                        clearAllData();
                        localStorage.removeItem('user_settings');
                        setMessage({ type: 'info', text: 'All data and settings have been cleared.' });
                        setTimeout(() => window.location.reload(), 2000);
                      }
                    }} variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset Everything
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
