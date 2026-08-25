import React from 'react';
import { Wordmark } from './Wordmark';
import { company } from '../data/company';

const columns = [
{
  title: 'Company',
  links: [
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'How we work', href: '#process' },
  { label: 'About', href: '#about' }]

},
{
  title: 'Services',
  links: [
  { label: 'Residential construction', href: '#services' },
  { label: 'Structural works', href: '#services' },
  { label: 'Finishing & fit-out', href: '#services' },
  { label: 'Project management', href: '#services' }]

}];


export function Footer() {
  return (
    <footer className="border-t border-bone-200 bg-bone-50 py-14">
      <div className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark tone="dark" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-600">{company.tagline}</p>
            <p className="mt-4 text-sm text-ink-600">
              {company.phones.join(' · ')}
              <br />
              <a href={`mailto:${company.email}`} className="hover:text-ink-900">
                {company.email}
              </a>
            </p>
          </div>

          {columns.map((column) =>
          <nav key={column.title} aria-label={column.title} className="lg:col-span-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-900">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) =>
              <li key={link.label}>
                    <a
                  href={link.href}
                  className="text-sm text-ink-600 transition-colors duration-150 ease-out hover:text-ink-900">
                  
                      {link.label}
                    </a>
                  </li>
              )}
              </ul>
            </nav>
          )}

          <div className="lg:col-span-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-900">Areas</h2>
            <ul className="mt-4 space-y-2.5">
              {company.serviceAreas.map((area) =>
              <li key={area} className="text-sm text-ink-600">
                  {area}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-bone-200 pt-6 text-xs text-ink-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p>Registered building contractor · Nigeria</p>
        </div>
      </div>
    </footer>);

}