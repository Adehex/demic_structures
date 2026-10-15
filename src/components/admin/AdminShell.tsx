import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  BriefcaseIcon,
  Building2Icon,
  CheckIcon,
  ExternalLinkIcon,
  HardHatIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessageSquareIcon,
  RotateCcwIcon,
  UploadCloudIcon,
  WrenchIcon } from
'lucide-react';
import { Wordmark } from '../Wordmark';
import { SaveIndicator } from './SaveIndicator';
import { useSiteContent } from '../../contexts/SiteContentContext';

type AdminShellProps = {
  onLogout: () => void;
};

const navItems = [
{ to: '/ademola', label: 'Overview', icon: LayoutDashboardIcon, end: true },
{ to: '/ademola/media', label: 'Media Library', icon: ImageIcon },
{ to: '/ademola/inquiries', label: 'Inquiries', icon: MessageSquareIcon },
{ to: '/ademola/sites', label: 'Live sites', icon: HardHatIcon },
{ to: '/ademola/projects', label: 'Projects', icon: Building2Icon },
{ to: '/ademola/business', label: 'Business details', icon: BriefcaseIcon },
{ to: '/ademola/services', label: 'Services', icon: WrenchIcon }];


export function AdminShell({ onLogout }: AdminShellProps) {
  const { resetContent, isCustomised, saveContent, isSaving, hasUnsavedChanges, saveMessage } = useSiteContent();

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

        <div className="sticky top-0 z-20 border-b border-bone-200 bg-white/95 backdrop-blur-md shadow-sm">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-2.5 lg:px-10">
            <div className="flex items-center gap-3">
              <SaveIndicator />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => saveContent()}
                disabled={isSaving || !hasUnsavedChanges}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  hasUnsavedChanges
                    ? 'bg-signal text-ink-950 shadow-md hover:bg-signal-dark active:scale-95 ring-2 ring-signal/50 cursor-pointer'
                    : 'bg-bone-100 text-ink-400 cursor-default'
                }`}>
                {isSaving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <UploadCloudIcon className="h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 text-emerald-600" />
                    Saved
                  </>
                )}
              </button>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-bone-200 bg-white px-3 py-2 text-xs font-semibold text-ink-800 transition-colors hover:border-ink-900 hover:text-ink-900">
                <ExternalLinkIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">View Website</span>
              </a>
              {isCustomised && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-ink-500 hover:text-red-700">
                  <RotateCcwIcon className="h-3 w-3" />
                  <span className="hidden md:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
          {saveMessage && (
            <div className="border-t border-emerald-200 bg-emerald-50 px-5 py-2 text-center text-xs font-medium text-emerald-800">
              {saveMessage}
            </div>
          )}
        </div>

        <main className="mx-auto max-w-4xl px-5 py-8 lg:px-10 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>);

}