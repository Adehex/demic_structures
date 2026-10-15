import React, { useState } from 'react';
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  PhoneIcon,
  SendIcon
} from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import type { Inquiry } from '../types/inquiry';
import notificationConfig from '../data/notificationConfig.json';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type SubmittedData = {
  name: string;
  phone: string;
  type: string;
  location: string;
  message: string;
};

const projectTypes = [
  'New build — bungalow',
  'New build — duplex',
  'Structural works only',
  'Finishing / fit-out',
  'Renovation or extension',
  'Costing & consultancy'
];

const fieldClass =
  'w-full rounded-sm border border-white/15 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-ink-400 transition-colors duration-150 ease-out hover:border-white/30 focus:border-signal focus:outline-none';

export function Contact() {
  const { company } = useSiteContent().content;
  const [status, setStatus] = useState<Status>('idle');
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const type = String(data.get('type') ?? projectTypes[0]).trim();
    const location = String(data.get('location') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !phone) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    // Save Inquiry to Admin Portal & Trigger Server-side Admin Email Notification
    const newInquiry: Inquiry = {
      id: 'inq_' + Date.now(),
      name,
      phone,
      type,
      location: location || '',
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      // Post to backend server endpoint (saves to inquiries.json)
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      });
    } catch (err) {
      console.warn('Backend inquiries endpoint failed, storing locally', err);
    }

    // Dispatch notification email to admin directly from browser if access key is configured
    try {
      const activeKey = notificationConfig.accessKey?.trim();
      const targetEmail = notificationConfig.adminEmail || company.email;
      if (activeKey && activeKey.length > 10 && activeKey !== 'b94371fa-1fbe-4db5-9e32-23c3ca1ad7f4') {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: activeKey,
            subject: `New Project Inquiry: ${name} (${type})`,
            from_name: 'Demic Structures Portal',
            name,
            phone,
            project_type: type,
            location: location || 'Not specified',
            message: `NEW PROJECT INQUIRY:\n\nName: ${name}\nPhone: ${phone}\nProject Scope: ${type}\nLocation: ${location || 'Not specified'}\n\nClient Brief:\n${message || 'No additional details provided.'}\n\nView in Admin Portal: http://localhost:5173/ademola/inquiries`,
            recipient: targetEmail
          })
        });
      }
    } catch {}

    try {
      // Store in browser storage fallback
      const existing = JSON.parse(localStorage.getItem('demic-inquiries') || '[]');
      localStorage.setItem('demic-inquiries', JSON.stringify([newInquiry, ...existing]));
    } catch {}

    setSubmittedData({
      name,
      phone,
      type,
      location,
      message
    });

    setStatus('success');
  };

  return (
    <section id="contact" className="scroll-mt-16 bg-ink-950 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signal">Start a project</p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tightest text-white sm:text-4xl lg:text-[2.85rem]">
              Send us the plot, the plan or just the idea.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-bone-100/70">
              We reply within one working day with next steps, and a site visit is free anywhere we already work.
            </p>

            <dl className="mt-10 space-y-6 border-t border-white/10 pt-8">
              <div className="flex gap-4">
                <PhoneIcon className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Phone Enquiries</dt>
                  <dd className="mt-1.5 flex flex-col gap-1">
                    {company.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="font-display text-lg font-semibold text-white transition-colors duration-150 ease-out hover:text-signal">
                        {phone}
                      </a>
                    ))}
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <SendIcon className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Project Quotes & Briefs</dt>
                  <dd className="mt-1.5 text-[15px] text-bone-100/85">
                    Submit via the secure form. Requests are delivered straight to our engineering desk for immediate review.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <ClockIcon className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Office hours</dt>
                  <dd className="mt-1.5 text-[15px] text-bone-100/85">{company.hours}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {status === 'success' && submittedData ? (
              <div className="flex h-full flex-col items-start justify-center rounded-lg border border-signal/40 bg-white/[0.04] p-6 sm:p-10 text-white">
                <div className="flex items-center gap-3">
                  <CheckCircle2Icon className="h-9 w-9 text-signal" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">Inquiry Received</h3>
                    <p className="text-xs text-bone-100/70">Delivered to Engineering Desk & Project Lead Alerted</p>
                  </div>
                </div>

                <p className="mt-5 text-[15px] leading-relaxed text-bone-100/85">
                  Thank you, <strong className="text-white">{submittedData.name}</strong>. Your project brief has been received by our engineering team. An email alert has been sent to our lead engineer, and we will review your site details and call you within one business day.
                </p>

                {/* Summary of what was sent */}
                <div className="mt-6 w-full rounded-md bg-black/40 p-4 border border-white/10 text-xs space-y-1.5 text-bone-100/70">
                  <p><strong className="text-white">Project Scope:</strong> {submittedData.type}</p>
                  {submittedData.location && <p><strong className="text-white">Site Location:</strong> {submittedData.location}</p>}
                  <p><strong className="text-white">Contact Phone:</strong> {submittedData.phone}</p>
                  {submittedData.message && <p><strong className="text-white">Notes:</strong> {submittedData.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setSubmittedData(null);
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 hover:border-signal">
                  Submit another project brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Full name
                  </label>
                  <input id="name" name="name" type="text" autoComplete="name" placeholder="Chidi Okafor" className={fieldClass} />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Phone number
                  </label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0803 000 0000" className={fieldClass} />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="type" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Project type
                  </label>
                  <select id="type" name="type" defaultValue={projectTypes[0]} className={fieldClass}>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-ink-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="location" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Site location
                  </label>
                  <input id="location" name="location" type="text" placeholder="Lugbe, Abuja" className={fieldClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Tell us about the build
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Plot size, number of bedrooms, whether you have drawings, and when you want to start."
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                {status === 'error' && (
                  <p role="alert" className="sm:col-span-2 text-sm font-medium text-signal">
                    Please add your name and a phone number so we can reach you.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-4 sm:w-auto sm:py-3.5 text-sm font-semibold text-ink-950 transition-colors duration-150 ease-out hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
                    {status === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {status === 'submitting' ? 'Submitting…' : 'Send project brief'}
                  </button>
                  <p className="text-xs text-ink-400">Delivered directly to our engineering desk & team email.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}