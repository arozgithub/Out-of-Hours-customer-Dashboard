import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserSettings {
  profile: {
    displayName: string;
    email: string;
    phone: string;
    department: string;
    timezone: string;
    shiftPattern: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    jobAssignments: boolean;
    jobCompletions: boolean;
    emergencyAlerts: boolean;
    dailyReports: boolean;
    soundEnabled: boolean;
    showToasts: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    showAvatars: boolean;
    animationsEnabled: boolean;
    sidebarCollapsed: boolean;
  };
  dashboard: {
    defaultView: 'master' | 'customer' | 'engineer';
    jobsPerPage: number;
    autoRefresh: boolean;
    refreshInterval: number;
    showCompletedJobs: boolean;
    sortBy: 'date' | 'priority' | 'status' | 'customer';
    sortOrder: 'asc' | 'desc';
  };
  alerts: {
    criticalJobAlerts: boolean;
    overdueJobAlerts: boolean;
    engineerAssignmentAlerts: boolean;
    customerComplaintAlerts: boolean;
    systemMaintenanceAlerts: boolean;
    alertThreshold: number;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDataCollection: boolean;
    shareUsageStats: boolean;
    rememberFilters: boolean;
  };
  advanced: {
    developerMode: boolean;
    debugLogging: boolean;
    experimentalFeatures: boolean;
    autoBackup: boolean;
    backupInterval: number;
  };
}

export const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    displayName: '',
    email: '',
    phone: '',
    department: '',
    timezone: 'utc',
    shiftPattern: 'day',
  },
  notifications: {
    email: true,
    sms: true,
    push: true,
    jobAssignments: true,
    jobCompletions: true,
    emergencyAlerts: true,
    dailyReports: false,
    soundEnabled: true,
    showToasts: true,
  },
  appearance: {
    theme: 'system',
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true,
    sidebarCollapsed: false,
  },
  dashboard: {
    defaultView: 'master',
    jobsPerPage: 25,
    autoRefresh: true,
    refreshInterval: 30,
    showCompletedJobs: true,
    sortBy: 'date',
    sortOrder: 'desc',
  },
  alerts: {
    criticalJobAlerts: true,
    overdueJobAlerts: true,
    engineerAssignmentAlerts: true,
    customerComplaintAlerts: true,
    systemMaintenanceAlerts: false,
    alertThreshold: 5,
  },
  privacy: {
    showOnlineStatus: true,
    allowDataCollection: false,
    shareUsageStats: false,
    rememberFilters: true,
  },
  advanced: {
    developerMode: false,
    debugLogging: false,
    experimentalFeatures: false,
    autoBackup: true,
    backupInterval: 24,
  },
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (section: keyof UserSettings, key: string, value: unknown) => void;
  saveSettings: () => Promise<boolean>;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (data: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('user_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          // Merge with defaults to ensure all properties exist
          setSettings(prev => ({
            ...DEFAULT_SETTINGS,
            ...parsedSettings,
            profile: { ...DEFAULT_SETTINGS.profile, ...parsedSettings.profile },
            notifications: { ...DEFAULT_SETTINGS.notifications, ...parsedSettings.notifications },
            appearance: { ...DEFAULT_SETTINGS.appearance, ...parsedSettings.appearance },
            dashboard: { ...DEFAULT_SETTINGS.dashboard, ...parsedSettings.dashboard },
            alerts: { ...DEFAULT_SETTINGS.alerts, ...parsedSettings.alerts },
            privacy: { ...DEFAULT_SETTINGS.privacy, ...parsedSettings.privacy },
            advanced: { ...DEFAULT_SETTINGS.advanced, ...parsedSettings.advanced },
          }));
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (section: keyof UserSettings, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const saveSettings = async (): Promise<boolean> => {
    try {
      localStorage.setItem('user_settings', JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('user_settings');
  };

  const exportSettings = (): string => {
    const exportData = {
      userSettings: settings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importSettings = (data: string): boolean => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.userSettings) {
        setSettings(prev => ({
          ...DEFAULT_SETTINGS,
          ...parsedData.userSettings,
          profile: { ...DEFAULT_SETTINGS.profile, ...parsedData.userSettings.profile },
          notifications: { ...DEFAULT_SETTINGS.notifications, ...parsedData.userSettings.notifications },
          appearance: { ...DEFAULT_SETTINGS.appearance, ...parsedData.userSettings.appearance },
          dashboard: { ...DEFAULT_SETTINGS.dashboard, ...parsedData.userSettings.dashboard },
          alerts: { ...DEFAULT_SETTINGS.alerts, ...parsedData.userSettings.alerts },
          privacy: { ...DEFAULT_SETTINGS.privacy, ...parsedData.userSettings.privacy },
          advanced: { ...DEFAULT_SETTINGS.advanced, ...parsedData.userSettings.advanced },
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  const contextValue: SettingsContextType = {
    settings,
    updateSettings,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};
