import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  BriefcaseIcon,
  Building2Icon,
  ExternalLinkIcon,
  HardHatIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  RotateCcwIcon,
  WrenchIcon } from
'lucide-react';
import { Wordmark } from '../Wordmark';
import { SaveIndicator } from './SaveIndicator';
import { useSiteContent } from '../../contexts/SiteContentContext';

type AdminShellProps = {
  onLogout: () => void;
};

const navItems = [
{ to: '/admin', label: 'Overview', icon: LayoutDashboardIcon, end: true },
{ to: '/admin/sites', label: 'Live sites', icon: HardHatIcon },
{ to: '/admin/projects', label: 'Projects', icon: Building2Icon },
{ to: '/admin/business', label: 'Business details', icon: BriefcaseIcon },
{ to: '/admin/services', label: 'Services', icon: WrenchIcon }];


export function AdminShell({ onLogout }: AdminShellProps) {
  const { resetContent, isCustomised } = useSiteContent();

  const handleReset = () => {
    if (window.confirm('Undo every change made in the portal and restore the original website content?')) resetContent();
  };

  return (
    <div className="min-h-screen w-full bg-bone-100 font-sans">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ink-950 px-4 py-6 lg:flex">
        <div className="px-2">
          <Wordmark tone="light" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Client portal</p>
        </div>
        <nav aria-label="Portal" className="mt-8 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) =>
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-out ${
            isActive ? 'bg-white/10 text-white' : 'text-bone-100/70 hover:bg-white/5 hover:text-white'}`

            }>
            
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          )}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-bone-100/70 hover:bg-white/5 hover:text-white">
            
            <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
            View website
          </Link>
          {isCustomised &&
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-bone-100/70 hover:bg-white/5 hover:text-white">
            
              <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
              Restore original
            </button>
          }
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-bone-100/70 hover:bg-white/5 hover:text-white">
            
            <LogOutIcon className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-ink-950 lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Wordmark tone="light" />
            <div className="flex items-center gap-1">
              <Link to="/" aria-label="View website" className="grid h-10 w-10 place-items-center rounded-md text-bone-100/80">
                <ExternalLinkIcon className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={onLogout}
                aria-label="Sign out"
                className="grid h-10 w-10 place-items-center rounded-md text-bone-100/80">
                
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <nav
            aria-label="Portal"
            className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            
            {navItems.map(({ to, label, end }) =>
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
              `shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium ${
              isActive ? 'bg-signal text-ink-950' : 'text-bone-100/70'}`

              }>
              
                {label}
              </NavLink>
            )}
          </nav>
        </header>

        <div className="border-b border-bone-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3 lg:px-10">
            <SaveIndicator />
            {isCustomised &&
            <button type="button" onClick={handleReset} className="shrink-0 text-xs font-semibold text-ink-600 hover:text-ink-900 lg:hidden">
                Restore original
              </button>
            }
          </div>
        </div>

        <main className="mx-auto max-w-4xl px-5 py-8 lg:px-10 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>);

}