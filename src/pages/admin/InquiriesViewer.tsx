import React, { useEffect, useState } from 'react';
import {
  BellIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  ExternalLinkIcon,
  FilterIcon,
  FolderOpenIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  Settings2Icon,
  Trash2Icon,
  UserIcon,
  XIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '../../components/admin/PageHeader';
import type { Inquiry, NotificationConfig } from '../../types/inquiry';

export function InquiriesViewer() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Notification Config state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [config, setConfig] = useState<NotificationConfig>({
    adminEmail: 'demicstructures@gmail.com',
    enableEmailNotification: true,
    provider: 'web3forms',
    accessKey: '',
    fromName: 'Demics Homes Portal'
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      } else {
        const local = JSON.parse(localStorage.getItem('demic-inquiries') || '[]');
        setInquiries(local);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('demic-inquiries') || '[]');
      setInquiries(local);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/notification-config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.warn('Could not load notification config', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchConfig();
  }, []);

  const saveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notification-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setTestResult({ success: true, message: 'Notification settings saved successfully!' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: 'Failed to save settings: ' + err.message });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleTestNotification = async () => {
    setTestingNotification(true);
    setTestResult(null);

    // If using Web3Forms, dispatch directly from the browser to avoid server Cloudflare bot blocks
    if (config.provider === 'web3forms') {
      const key = (config.accessKey || '').trim();
      if (!key || key.length < 10) {
        setTestResult({
          success: false,
          message: 'Please paste your Web3Forms Access Key into the box below first (get one free at web3forms.com).'
        });
        setTestingNotification(false);
        return;
      }

      try {
        const resp = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: key,
            subject: 'Test Email Alert: Demics Homes Admin Portal',
            from_name: config.fromName || 'Demics Homes Portal',
            name: 'Ademola (Portal Admin)',
            phone: '09055428446',
            project_type: 'Test Project Notification',
            location: 'Guzape, Abuja',
            message: `This is a test notification email from your Demics Homes Admin Portal.\n\nTarget email: ${config.adminEmail}\nTime: ${new Date().toLocaleString()}\n\nIf you see this, your email alert system is working properly!`,
            recipient: config.adminEmail
          })
        });

        const data = await resp.json();
        if (data.success) {
          setTestResult({
            success: true,
            message: `Test email sent to ${config.adminEmail}! Please check your inbox (and spam/junk folder).`
          });
        } else {
          setTestResult({
            success: false,
            message: data.message || 'Web3Forms rejected the key. Please verify your access key at web3forms.com.'
          });
        }
      } catch (err: any) {
        setTestResult({
          success: false,
          message: 'Error sending test email: ' + (err.message || 'Network error')
        });
      } finally {
        setTestingNotification(false);
      }
      return;
    }

    // For Resend or custom webhook, dispatch via backend
    try {
      const res = await fetch('/api/send-test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          message: `Test alert dispatched to ${config.adminEmail}!`
        });
      } else {
        const rawErr = data.details?.error || data.error || 'Failed to dispatch test alert.';
        const cleanErr = rawErr.includes('<!DOCTYPE') || rawErr.includes('<html')
          ? 'Cloudflare bot check detected on server. Use client-side Web3Forms or Resend API key.'
          : rawErr;
        setTestResult({
          success: false,
          message: cleanErr
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Network error sending test: ' + err.message
      });
    } finally {
      setTestingNotification(false);
    }
  };

  const saveUpdatedInquiries = async (updated: Inquiry[]) => {
    setInquiries(updated);
    try {
      localStorage.setItem('demic-inquiries', JSON.stringify(updated));
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Could not persist inquiries update to server', err);
    }
  };

  const updateStatus = (id: string, status: Inquiry['status']) => {
    const updated = inquiries.map((item) => (item.id === id ? { ...item, status } : item));
    saveUpdatedInquiries(updated);
  };

  const deleteInquiry = (id: string) => {
    if (window.confirm('Delete this inquiry?')) {
      const updated = inquiries.filter((item) => item.id !== id);
      saveUpdatedInquiries(updated);
    }
  };

  const formatClientWhatsApp = (phone: string, name: string, type: string, location: string) => {
    const clean = phone.replace(/\D/g, '');
    const intl = clean.startsWith('0') ? '234' + clean.slice(1) : clean;
    const greeting = encodeURIComponent(
      `Hello ${name}, thank you for contacting Demics Homes regarding your ${type}${
        location ? ` in ${location}` : ''
      }! We received your project brief through our website.`
    );
    return `https://wa.me/${intl}?text=${greeting}`;
  };

  const filtered = inquiries.filter((inq) => {
    const matchesFilter = filter === 'all' ? true : inq.status === filter;
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone.includes(search) ||
      (inq.location && inq.location.toLowerCase().includes(search.toLowerCase())) ||
      (inq.message && inq.message.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const contactedCount = inquiries.filter((i) => i.status === 'contacted').length;
  const closedCount = inquiries.filter((i) => i.status === 'closed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Inquiries"
        description="Public website project briefs submitted directly to your portal, with automatic email alerts dispatched to your inbox."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTestResult(null);
                setSettingsOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-bone-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-800 transition hover:border-ink-900 hover:text-ink-900 shadow-sm">
              <BellIcon className="h-3.5 w-3.5 text-signal-dark" />
              Email Alerts Setup
            </button>
            <button
              type="button"
              onClick={fetchInquiries}
              className="inline-flex items-center gap-2 rounded-full border border-bone-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-800 transition hover:border-ink-900 hover:text-ink-900 shadow-sm">
              <RefreshCwIcon className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-lg border p-4 text-left transition-all ${
            filter === 'all' ? 'border-ink-900 bg-ink-900 text-white' : 'border-bone-200 bg-white text-ink-900 hover:border-ink-400'
          }`}>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Total Inquiries</p>
          <p className="mt-1 text-2xl font-bold font-display">{inquiries.length}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilter('new')}
          className={`rounded-lg border p-4 text-left transition-all ${
            filter === 'new' ? 'border-signal bg-signal/15 text-ink-950 font-bold' : 'border-bone-200 bg-white text-ink-900 hover:border-ink-400'
          }`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal-dark">New / Unread</p>
            {newCount > 0 && <span className="h-2.5 w-2.5 rounded-full bg-signal animate-pulse" />}
          </div>
          <p className="mt-1 text-2xl font-bold font-display text-signal-dark">{newCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilter('contacted')}
          className={`rounded-lg border p-4 text-left transition-all ${
            filter === 'contacted' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-bone-200 bg-white text-ink-900 hover:border-ink-400'
          }`}>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Contacted</p>
          <p className="mt-1 text-2xl font-bold font-display text-blue-700">{contactedCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilter('closed')}
          className={`rounded-lg border p-4 text-left transition-all ${
            filter === 'closed' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-bone-200 bg-white text-ink-900 hover:border-ink-400'
          }`}>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Closed / Won</p>
          <p className="mt-1 text-2xl font-bold font-display text-emerald-700">{closedCount}</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, phone, location or project specs..."
            className="w-full rounded-md border border-bone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Inquiries List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-bone-300 bg-white p-12 text-center">
          <FolderOpenIcon className="h-10 w-10 text-ink-300" />
          <h3 className="mt-3 font-display text-base font-bold text-ink-900">No inquiries found</h3>
          <p className="mt-1 max-w-sm text-xs text-ink-500">
            {search ? 'No requests match your current search query.' : 'Project requests submitted through the public website will appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            let formattedDate = 'Recently';
            try {
              formattedDate = format(new Date(inq.createdAt), 'MMM d, yyyy · h:mm a');
            } catch {}

            return (
              <div
                key={inq.id}
                className={`rounded-xl border bg-white p-5 sm:p-6 transition-shadow shadow-sm hover:shadow-md ${
                  inq.status === 'new' ? 'border-signal ring-1 ring-signal/40' : 'border-bone-200'
                }`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Client info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-lg font-bold text-ink-950 flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-ink-400" />
                        {inq.name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          inq.status === 'new'
                            ? 'bg-signal text-ink-950'
                            : inq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                        {inq.status === 'new' ? 'New Request' : inq.status === 'contacted' ? 'Contacted' : 'Closed'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-600">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-ink-400" />
                        {formattedDate}
                      </span>
                      {inq.location && (
                        <span className="flex items-center gap-1 font-medium text-ink-800">
                          <MapPinIcon className="h-3.5 w-3.5 text-signal-dark" />
                          {inq.location}
                        </span>
                      )}

                      {/* Email Alert Status Badge */}
                      {inq.notificationSent ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800 border border-emerald-200">
                          <MailIcon className="h-3 w-3 text-emerald-600" />
                          Email alert delivered to {inq.notifiedEmail || config.adminEmail}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-bone-100 px-2 py-0.5 font-medium text-ink-600">
                          <MailIcon className="h-3 w-3 text-ink-400" />
                          Logged to Admin Portal
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Admin Response Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={formatClientWhatsApp(inq.phone, inq.name, inq.type, inq.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700">
                      <MessageCircleIcon className="h-3.5 w-3.5" />
                      Contact Client on WhatsApp
                    </a>

                    <a
                      href={`tel:${inq.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-bone-200 bg-white px-3 py-2 text-xs font-semibold text-ink-800 transition-colors hover:border-ink-900 hover:text-ink-900">
                      <PhoneIcon className="h-3.5 w-3.5 text-ink-500" />
                      Call {inq.phone}
                    </a>

                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq.id, e.target.value as Inquiry['status'])}
                      className="rounded-full border border-bone-200 bg-bone-50 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-ink-400 focus:outline-none">
                      <option value="new">Mark as New</option>
                      <option value="contacted">Mark as Contacted</option>
                      <option value="closed">Mark as Closed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => deleteInquiry(inq.id)}
                      aria-label="Delete inquiry"
                      className="grid h-8 w-8 place-items-center rounded-full text-ink-400 transition-colors hover:bg-red-50 hover:text-red-700">
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Project Details */}
                <div className="mt-4 rounded-lg bg-bone-50 p-4 border border-bone-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    <span>Project Scope:</span>
                    <span className="font-bold text-ink-900 normal-case">{inq.type}</span>
                  </div>
                  {inq.message ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink-800 whitespace-pre-wrap">{inq.message}</p>
                  ) : (
                    <p className="mt-2 text-xs italic text-ink-400">No additional message provided.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-bone-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-signal/20 text-signal-dark">
                  <BellIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-950">Email Alert Settings</h3>
                  <p className="text-xs text-ink-500">Get notified immediately when clients send a project brief.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-md p-1.5 text-ink-400 hover:bg-bone-100 hover:text-ink-900">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveConfig} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">
                  Admin Notification Email
                </label>
                <input
                  type="email"
                  value={config.adminEmail}
                  onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
                  placeholder="e.g. demicstructures@gmail.com"
                  required
                  className="w-full rounded-md border border-bone-200 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-ink-400">
                  New project inquiries submitted on the public website will trigger an alert to this email address.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-bone-200 bg-bone-50 p-3">
                <div>
                  <p className="text-xs font-semibold text-ink-900">Automatic Email Alerts</p>
                  <p className="text-[11px] text-ink-500">Send an instant email notification on each new form submission.</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableEmailNotification}
                  onChange={(e) => setConfig({ ...config, enableEmailNotification: e.target.checked })}
                  className="h-4 w-4 rounded border-bone-300 text-ink-900 focus:ring-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">
                  Notification Dispatch Service
                </label>
                <select
                  value={config.provider}
                  onChange={(e) => setConfig({ ...config, provider: e.target.value as any })}
                  className="w-full rounded-md border border-bone-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:border-ink-900 focus:outline-none">
                  <option value="web3forms">Web3Forms (Built-in Free Email Dispatcher)</option>
                  <option value="resend">Resend API</option>
                  <option value="custom_webhook">Custom Webhook (Zapier / Make / Slack)</option>
                </select>
              </div>

              {config.provider === 'web3forms' && (
                <div className="rounded-lg border border-signal/30 bg-signal/10 p-3.5 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold text-ink-950">
                        Web3Forms Access Key
                      </label>
                      <p className="text-[11px] text-ink-600">
                        Web3Forms ties notifications to a unique key for <strong>{config.adminEmail}</strong>.
                      </p>
                    </div>
                    <a
                      href="https://web3forms.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-ink-800 transition">
                      Get Free Key on web3forms.com <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  </div>

                  <input
                    type="text"
                    value={config.accessKey || ''}
                    onChange={(e) => setConfig({ ...config, accessKey: e.target.value.trim() })}
                    placeholder="Paste the key you received by email here (e.g. 7c9e-4b...)"
                    className="w-full rounded-md border border-bone-300 bg-white px-3 py-2 text-xs font-mono text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
                  />

                  <div className="rounded bg-white/70 p-2.5 text-[11px] text-ink-700 space-y-1 border border-bone-200">
                    <p className="font-semibold text-ink-900">How to get your key in 15 seconds:</p>
                    <ol className="list-decimal pl-4 space-y-0.5">
                      <li>Open <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="font-medium text-signal-dark underline">web3forms.com</a></li>
                      <li>Type <code className="bg-bone-100 px-1 py-0.5 rounded font-mono text-ink-900">{config.adminEmail}</code> into their box and click "Create Access Key"</li>
                      <li>Check your email inbox, copy the key they sent you, and paste it into the box above.</li>
                    </ol>
                  </div>
                </div>
              )}

              {config.provider === 'resend' && (
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Resend API Key
                  </label>
                  <input
                    type="password"
                    value={config.accessKey || ''}
                    onChange={(e) => setConfig({ ...config, accessKey: e.target.value })}
                    placeholder="re_..."
                    className="w-full rounded-md border border-bone-200 px-3.5 py-2 text-xs font-mono text-ink-900 focus:border-ink-900 focus:outline-none"
                  />
                </div>
              )}

              {config.provider === 'custom_webhook' && (
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={config.webhookUrl || ''}
                    onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                    placeholder="https://hooks.zapier.com/..."
                    className="w-full rounded-md border border-bone-200 px-3.5 py-2 text-xs font-mono text-ink-900 focus:border-ink-900 focus:outline-none"
                  />
                </div>
              )}

              {testResult && (
                <div
                  className={`rounded-lg p-3 text-xs font-medium ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                  {testResult.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-bone-100">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  disabled={testingNotification || savingConfig}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-bone-300 bg-white px-4 py-2 text-xs font-semibold text-ink-900 transition hover:bg-bone-50 disabled:opacity-60">
                  {testingNotification ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : <SendIcon className="h-3.5 w-3.5 text-signal-dark" />}
                  {testingNotification ? 'Testing dispatch…' : 'Send Test Alert'}
                </button>

                <div className="flex w-full sm:w-auto items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="flex-1 sm:flex-none rounded-md px-3 py-2 text-xs font-semibold text-ink-600 hover:text-ink-900">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-md bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink-700 disabled:opacity-60">
                    {savingConfig ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : null}
                    {savingConfig ? 'Saving…' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
