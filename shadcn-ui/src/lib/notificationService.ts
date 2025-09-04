import React from 'react';
import { toast } from 'sonner';
import { useSettings, UserSettings } from '@/contexts/SettingsContext';

export interface NotificationData {
  type: 'jobAssignment' | 'jobCompletion' | 'emergency' | 'dailyReport' | 'custom';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  jobId?: string;
  customerId?: string;
  engineerId?: string;
  data?: Record<string, unknown>;
}

class NotificationService {
  private static instance: NotificationService;
  private settings: UserSettings | null = null;
  private audioContext: AudioContext | null = null;
  private notificationSound: AudioBuffer | null = null;

  constructor() {
    // Initialize audio context for sound notifications
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
      this.loadNotificationSound();
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setSettings(settings: UserSettings) {
    this.settings = settings;
  }

  private async loadNotificationSound() {
    if (!this.audioContext) return;

    try {
      // Create a simple notification sound using Web Audio API
      const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < data.length; i++) {
        const t = i / this.audioContext.sampleRate;
        data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 3) * 0.3;
      }
      
      this.notificationSound = buffer;
    } catch (error) {
      console.warn('Failed to create notification sound:', error);
    }
  }

  private playNotificationSound() {
    if (!this.audioContext || !this.notificationSound || !this.settings?.notifications?.soundEnabled) {
      return;
    }

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.notificationSound;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  private shouldShowNotification(type: NotificationData['type']): boolean {
    if (!this.settings?.notifications) return false;

    const typeMap: Record<string, keyof UserSettings['notifications'] | true> = {
      jobAssignment: 'jobAssignments',
      jobCompletion: 'jobCompletions', 
      emergency: 'emergencyAlerts',
      dailyReport: 'dailyReports',
      custom: true
    };

    const settingKey = typeMap[type];
    if (settingKey === true) return true;
    return this.settings.notifications[settingKey];
  }

  private getToastVariant(priority: NotificationData['priority']) {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  }

  private getToastDescription(notification: NotificationData): string {
    const timestamp = new Date().toLocaleTimeString();
    let description = `${notification.message} (${timestamp})`;
    
    if (notification.jobId) {
      description += ` • Job #${notification.jobId}`;
    }
    
    return description;
  }

  async sendNotification(notification: NotificationData): Promise<boolean> {
    if (!this.shouldShowNotification(notification.type)) {
      return false;
    }

    // Play sound notification
    this.playNotificationSound();

    // Show toast notification
    if (this.settings?.notifications?.showToasts) {
      const variant = this.getToastVariant(notification.priority);
      const description = this.getToastDescription(notification);

      if (notification.priority === 'critical') {
        toast.error(notification.title, {
          description,
          duration: 10000, // 10 seconds for critical
        });
      } else if (notification.priority === 'high') {
        toast.error(notification.title, {
          description,
          duration: 8000, // 8 seconds for high
        });
      } else {
        toast(notification.title, {
          description,
          duration: 5000, // 5 seconds for normal
        });
      }
    }

    // Send email notification (simulated)
    if (this.settings?.notifications?.email) {
      console.log(`📧 Email notification sent: ${notification.title}`);
      this.simulateEmailNotification(notification);
    }

    // Send SMS notification (simulated)
    if (this.settings?.notifications?.sms) {
      console.log(`📱 SMS notification sent: ${notification.title}`);
      this.simulateSMSNotification(notification);
    }

    // Send push notification
    if (this.settings?.notifications?.push) {
      this.sendPushNotification(notification);
    }

    return true;
  }

  private simulateEmailNotification(notification: NotificationData) {
    // Simulate email sending with a delay
    setTimeout(() => {
      console.log(`📧 Email delivered: "${notification.title}" to ${this.settings?.profile?.email || 'user@example.com'}`);
    }, 1000);
  }

  private simulateSMSNotification(notification: NotificationData) {
    // Simulate SMS sending with a delay
    setTimeout(() => {
      console.log(`📱 SMS delivered: "${notification.title}" to ${this.settings?.profile?.phone || '+1234567890'}`);
    }, 500);
  }

  private async sendPushNotification(notification: NotificationData) {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: notification.jobId || 'general',
        requireInteraction: notification.priority === 'critical',
        silent: false,
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.sendPushNotification(notification);
      }
    }
  }

  // Convenience methods for different types of notifications
  async notifyJobAssignment(jobId: string, engineerName: string, customerName: string): Promise<boolean> {
    return this.sendNotification({
      type: 'jobAssignment',
      title: 'New Job Assignment',
      message: `Job #${jobId} assigned to ${engineerName} for ${customerName}`,
      priority: 'medium',
      jobId,
    });
  }

  async notifyJobCompletion(jobId: string, engineerName: string, customerName: string): Promise<boolean> {
    return this.sendNotification({
      type: 'jobCompletion',
      title: 'Job Completed',
      message: `Job #${jobId} completed by ${engineerName} for ${customerName}`,
      priority: 'low',
      jobId,
    });
  }

  async notifyEmergencyAlert(jobId: string, customerName: string, issue: string): Promise<boolean> {
    return this.sendNotification({
      type: 'emergency',
      title: '🚨 Emergency Alert',
      message: `Critical issue for ${customerName}: ${issue}`,
      priority: 'critical',
      jobId,
    });
  }

  async notifyDailyReport(completedJobs: number, pendingJobs: number): Promise<boolean> {
    return this.sendNotification({
      type: 'dailyReport',
      title: 'Daily Summary Report',
      message: `${completedJobs} jobs completed, ${pendingJobs} jobs pending`,
      priority: 'low',
    });
  }

  async testAllNotifications(): Promise<void> {
    if (!this.settings) {
      console.warn('Settings not available for notification test');
      return;
    }

    console.log('🔔 Testing all notification types...');

    // Test each type with a delay
    setTimeout(() => this.notifyJobAssignment('TEST001', 'John Doe', 'Acme Corp'), 500);
    setTimeout(() => this.notifyJobCompletion('TEST002', 'Jane Smith', 'TechCorp'), 1500);
    setTimeout(() => this.notifyEmergencyAlert('URGENT001', 'CriticalCorp', 'Server down'), 2500);
    setTimeout(() => this.notifyDailyReport(15, 3), 3500);
    
    // Test custom notification
    setTimeout(() => this.sendNotification({
      type: 'custom',
      title: 'Test Complete',
      message: 'All notification types have been tested!',
      priority: 'medium',
    }), 4500);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Hook for React components
export const useNotifications = () => {
  const { settings } = useSettings();
  
  // Update settings in notification service when they change
  React.useEffect(() => {
    notificationService.setSettings(settings);
  }, [settings]);

  return {
    sendNotification: (notification: NotificationData) => notificationService.sendNotification(notification),
    notifyJobAssignment: (jobId: string, engineerName: string, customerName: string) => 
      notificationService.notifyJobAssignment(jobId, engineerName, customerName),
    notifyJobCompletion: (jobId: string, engineerName: string, customerName: string) => 
      notificationService.notifyJobCompletion(jobId, engineerName, customerName),
    notifyEmergencyAlert: (jobId: string, customerName: string, issue: string) => 
      notificationService.notifyEmergencyAlert(jobId, customerName, issue),
    notifyDailyReport: (completedJobs: number, pendingJobs: number) => 
      notificationService.notifyDailyReport(completedJobs, pendingJobs),
    testNotifications: () => notificationService.testAllNotifications(),
  };
};
