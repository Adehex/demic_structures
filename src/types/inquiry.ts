export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  type: string;
  location: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
  notificationSent?: boolean;
  notifiedEmail?: string;
  notificationError?: string;
};

export type NotificationConfig = {
  adminEmail: string;
  enableEmailNotification: boolean;
  provider: 'web3forms' | 'formsubmit' | 'resend' | 'custom_webhook';
  accessKey?: string;
  fromName?: string;
  webhookUrl?: string;
  lastNotificationSentAt?: string | null;
};
