import React, { useState } from 'react';
import { CheckCircle2Icon, ClockIcon, Loader2Icon, MailIcon, PhoneIcon } from 'lucide-react';
import { company } from '../data/company';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const projectTypes = [
'New build — bungalow',
'New build — duplex',
'Structural works only',
'Finishing / fit-out',
'Renovation or extension',
'Costing & consultancy'];


const fieldClass =
'w-full rounded-sm border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-ink-400 transition-colors duration-150 ease-out hover:border-white/30 focus:border-signal focus:outline-none';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!String(data.get('name') ?? '').trim() || !String(data.get('phone') ?? '').trim()) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    window.setTimeout(() => setStatus('success'), 900);
  };

  return (
    <section id="contact" className="bg-ink-950 py-20 lg:py-28">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
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
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Call or WhatsApp</dt>
                  <dd className="mt-1.5 flex flex-col gap-1">
                    {company.phones.map((phone) =>
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="font-display text-lg font-semibold text-white transition-colors duration-150 ease-out hover:text-signal">
                      
                        {phone}
                      </a>
                    )}
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <MailIcon className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Email</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${company.email}`}
                      className="text-[15px] text-white transition-colors duration-150 ease-out hover:text-signal">
                      
                      {company.email}
                    </a>
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
            {status === 'success' ?
            <div className="flex h-full flex-col items-start justify-center rounded-sm border border-signal/40 bg-white/[0.04] p-10">
                <CheckCircle2Icon className="h-10 w-10 text-signal" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl font-bold text-white">Request received.</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-bone-100/75">
                  We'll call you within one working day to arrange the site visit. Need it sooner? Ring{' '}
                  {company.phones[0]}.
                </p>
                <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-7 text-sm font-semibold text-signal underline decoration-2 underline-offset-4">
                
                  Send another request
                </button>
              </div> :

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
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 803 000 0000" className={fieldClass} />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="type" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Project type
                  </label>
                  <select id="type" name="type" defaultValue={projectTypes[0]} className={fieldClass}>
                    {projectTypes.map((type) =>
                  <option key={type} value={type} className="bg-ink-900">
                        {type}
                      </option>
                  )}
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
                  className={`${fieldClass} resize-none`} />
                
                </div>

                {status === 'error' &&
              <p role="alert" className="sm:col-span-2 text-sm font-medium text-signal">
                    Please add your name and a phone number so we can reach you.
                  </p>
              }

                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors duration-150 ease-out hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
                  
                    {status === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {status === 'submitting' ? 'Sending…' : 'Send request'}
                  </button>
                  <p className="text-xs text-ink-400">No obligation. We don't share your details.</p>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </section>);

}
