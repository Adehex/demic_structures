import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CameraIcon, InfoIcon } from 'lucide-react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { PageHeader } from '../../components/admin/PageHeader';

export function Overview() {
  const { content } = useSiteContent();
  const liveSites = content.caseStudies.filter((s) => s.status === 'In progress');
  const draftProjects = content.projects.filter((p) => !p.image).length;

  const sections = [
  {
    to: '/admin/sites',
    title: 'Live sites',
    detail: `${content.caseStudies.length} site diar${content.caseStudies.length === 1 ? 'y' : 'ies'} · ${liveSites.length} in progress`
  },
  {
    to: '/admin/projects',
    title: 'Projects gallery',
    detail: `${content.projects.length} projects${draftProjects ? ` · ${draftProjects} missing a photo` : ''}`
  },
  { to: '/admin/business', title: 'Business details', detail: `${content.company.phones.join(', ')} · ${content.company.email}` },
  { to: '/admin/services', title: 'Services', detail: `${content.services.length} service packages · ${content.processSteps.length} process steps` }];


  return (
    <div>
      <PageHeader title="Welcome back" description="Keep the website current: post progress from site, add finished projects and update your details." />

      {/* Primary task: posting site progress */}
      <section aria-labelledby="live-heading" className="rounded-lg bg-ink-950 p-5 sm:p-7">
        <h2 id="live-heading" className="font-display text-lg font-bold text-white">
          On site now
        </h2>
        {liveSites.length > 0 ?
        <ul className="mt-5 divide-y divide-white/10">
            {liveSites.map((site) => {
            const current = site.stages.find((s) => s.status === 'current');
            const photos = site.stages.reduce((n, s) => n + s.photos.length, 0);
            return (
              <li key={site.id} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-[17px] font-semibold text-white">{site.name}</p>
                    <p className="mt-1 text-sm text-bone-100/70">
                      {site.location} · {current ? `Now: ${current.label}` : 'No stage marked in progress'} · {photos} photos
                    </p>
                  </div>
                  <Link
                  to={`/admin/sites?site=${site.id}`}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors duration-150 ease-out hover:bg-white">
                  
                    <CameraIcon className="h-4 w-4" />
                    Post an update
                  </Link>
                </li>);

          })}
          </ul> :

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-bone-100/70">No sites are marked in progress.</p>
            <Link
            to="/admin/sites"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink-950">
            
              Start a site diary
            </Link>
          </div>
        }
      </section>

      <section aria-label="Website sections" className="mt-8 rounded-lg border border-bone-200 bg-white">
        <ul className="divide-y divide-bone-200">
          {sections.map((section) =>
          <li key={section.to}>
              <Link
              to={section.to}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-150 ease-out hover:bg-bone-50 sm:px-6">
              
                <div className="min-w-0">
                  <p className="font-display text-[15px] font-semibold text-ink-900">{section.title}</p>
                  <p className="mt-0.5 truncate text-sm text-ink-600">{section.detail}</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink-400 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-ink-900" />
              </Link>
            </li>
          )}
        </ul>
      </section>

      <aside className="mt-8 flex gap-3 rounded-lg border border-bone-200 bg-bone-50 p-5 text-sm leading-relaxed text-ink-700">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
        <p>
          Changes save automatically and appear on the website straight away in this browser. To publish them for every
          visitor, the portal needs to be connected to an online database — ask your web developer to connect one.
        </p>
      </aside>
    </div>);

}