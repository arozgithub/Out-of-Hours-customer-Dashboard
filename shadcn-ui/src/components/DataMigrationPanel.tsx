import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useJobContext } from '@/hooks/useJobContext';
import { 
  Download, 
  Upload, 
  Database, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  HardDrive
} from 'lucide-react';

export default function DataMigrationPanel() {
  const { 
    jobs, 
    exportData, 
    importData, 
    backupData, 
    restoreFromBackup, 
    migrateFromOldKeys,
    clearAllData 
  } = useJobContext();
  
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' });
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setMessage({ type: 'error', text: 'Please paste some data to import' });
      return;
    }

    setIsProcessing(true);
    try {
      const success = importData(importText);
      if (success) {
        setMessage({ type: 'success', text: 'Data imported successfully!' });
        setImportText('');
      } else {
        setMessage({ type: 'error', text: 'Failed to import data - invalid format' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import data' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackup = () => {
    try {
      backupData();
      setMessage({ type: 'success', text: 'Data backed up successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to backup data' });
    }
  };

  const handleRestore = () => {
    setIsProcessing(true);
    try {
      const success = restoreFromBackup();
      if (success) {
        setMessage({ type: 'success', text: 'Data restored from backup!' });
      } else {
        setMessage({ type: 'info', text: 'No backups found to restore from' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to restore from backup' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMigration = () => {
    setIsProcessing(true);
    try {
      const success = migrateFromOldKeys();
      if (success) {
        setMessage({ type: 'success', text: 'Data migrated from old storage!' });
      } else {
        setMessage({ type: 'info', text: 'No old data found to migrate' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to migrate old data' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        clearAllData();
        setMessage({ type: 'success', text: 'All data cleared and reset to defaults' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to clear data' });
      }
    }
  };

  const getBackupKeys = () => {
    return Object.keys(localStorage).filter(key => 
      key.startsWith('out_of_hours_dashboard_backup_')
    );
  };

  const getOldDataKeys = () => {
    return Object.keys(localStorage).filter(key => 
      key.includes('jobdashboard_') || 
      key.includes('job_tracker_') || 
      key.includes('dashboard_jobs')
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management & Migration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Current Data Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
                  <div className="text-sm text-gray-600">Current Jobs</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{getBackupKeys().length}</div>
                  <div className="text-sm text-gray-600">Available Backups</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{getOldDataKeys().length}</div>
                  <div className="text-sm text-gray-600">Old Data Sources</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Recovery Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Recovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleRestore} 
                  disabled={isProcessing || getBackupKeys().length === 0}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
                
                <Button 
                  onClick={handleMigration} 
                  disabled={isProcessing || getOldDataKeys().length === 0}
                  className="w-full"
                  variant="outline"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Migrate Old Data
                </Button>

                {getOldDataKeys().length > 0 && (
                  <div className="text-xs text-gray-500">
                    Found: {getOldDataKeys().join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleBackup} 
                  className="w-full"
                  variant="outline"
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
                
                <Button 
                  onClick={handleExport} 
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>

                <Button 
                  onClick={handleClearAll} 
                  className="w-full"
                  variant="destructive"
                >
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Import Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Import Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Paste exported JSON data here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <Button 
                onClick={handleImport} 
                disabled={!importText.trim() || isProcessing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </CardContent>
          </Card>

          {/* Help Text */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Port Change Issue:</strong> When switching localhost ports, your data might seem to disappear because 
              localStorage is port-specific. Use "Migrate Old Data" to recover data from previous ports, or 
              "Restore from Backup" to recover from automatic backups.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
