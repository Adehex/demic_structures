import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BriefcaseIcon,
  Building2Icon,
  CheckIcon,
  ExternalLinkIcon,
  HardHatIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MessageSquareIcon,
  MonitorIcon,
  RotateCcwIcon,
  SmartphoneIcon,
  UploadCloudIcon,
  WrenchIcon,
  XIcon
} from 'lucide-react';
import { Wordmark } from '../Wordmark';
import { SaveIndicator } from './SaveIndicator';
import { useSiteContent } from '../../contexts/SiteContentContext';

type AdminShellProps = {
  onLogout: () => void;
};

const navItems = [
  { to: '/ademola', label: 'Overview', shortLabel: 'Home', icon: LayoutDashboardIcon, end: true },
  { to: '/ademola/sites', label: 'Live sites', shortLabel: 'Sites', icon: HardHatIcon },
  { to: '/ademola/projects', label: 'Projects', shortLabel: 'Projects', icon: Building2Icon },
  { to: '/ademola/inquiries', label: 'Inquiries', shortLabel: 'Inquiries', icon: MessageSquareIcon },
  { to: '/ademola/media', label: 'Media Library', shortLabel: 'Media', icon: ImageIcon },
  { to: '/ademola/business', label: 'Business details', shortLabel: 'Business', icon: BriefcaseIcon },
  { to: '/ademola/services', label: 'Services', shortLabel: 'Services', icon: WrenchIcon }
];

const mobileBottomItems = navItems.slice(0, 5);

export function AdminShell({ onLogout }: AdminShellProps) {
  const { resetContent, isCustomised, saveContent, isSaving, hasUnsavedChanges, saveMessage } = useSiteContent();
  const location = useLocation();
  const isEmbeddedPhoneFrame = new URLSearchParams(location.search).get('phoneFrame') === '1';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneViewMode, setPhoneViewMode] = useState(false);
  const [phoneTarget, setPhoneTarget] = useState<'admin' | 'site'>('admin');

  const handleReset = () => {
    if (window.confirm('Undo every change made in the portal and restore the original website content?')) resetContent();
  };

  const currentNav =
    navItems.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    ) ?? navItems[0];

  const iframeSrc =
    phoneTarget === 'admin'
      ? `${location.pathname}${location.search ? `${location.search}&phoneFrame=1` : '?phoneFrame=1'}`
      : '/';

  return (
    <div className="min-h-screen w-full bg-bone-100 font-sans">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ink-950 px-4 py-6 lg:flex">
        <div className="px-2">
          <Wordmark tone="light" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Client portal</p>
        </div>
        <nav aria-label="Portal" className="mt-8 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-out ${
                  isActive ? 'bg-white/10 text-white' : 'text-bone-100/70 hover:bg-white/5 hover:text-white'
                }`
              }>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-bone-100/70 hover:bg-white/5 hover:text-white">
            <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
            View website
          </Link>
          {isCustomised && (
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-bone-100/70 hover:bg-white/5 hover:text-white">
              <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
              Restore original
            </button>
          )}
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
        {/* Unified Mobile Header (< lg) */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950 shadow-md lg:hidden">
          <div className="flex h-14 items-center justify-between gap-2 px-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <img
                src="/demics-homes-logo.png"
                alt=""
                aria-hidden="true"
                className="h-9 w-9 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-white">{currentNav.label}</p>
                <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-ink-400">
                  Demics Homes Admin
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => saveContent()}
                disabled={isSaving || !hasUnsavedChanges}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  hasUnsavedChanges
                    ? 'bg-signal text-ink-950 shadow ring-2 ring-signal/40 active:scale-95'
                    : 'bg-white/10 text-bone-100/80'
                }`}>
                {isSaving ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <UploadCloudIcon className="h-3.5 w-3.5" />
                    Save
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    Saved
                  </>
                )}
              </button>

              <Link
                to="/"
                target="_blank"
                aria-label="View website"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-bone-100/80 hover:text-white">
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {saveMessage && (
            <div className="border-t border-emerald-500/30 bg-emerald-950/90 px-4 py-1.5 text-center text-[11px] font-medium text-emerald-200">
              {saveMessage}
            </div>
          )}
        </header>

        {/* Desktop Top Action Bar (>= lg) */}
        <div className="sticky top-0 z-20 hidden border-b border-bone-200 bg-white/95 shadow-sm backdrop-blur-md lg:block">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-2.5 lg:px-10">
            <div className="flex items-center gap-3">
              <SaveIndicator />
            </div>
            <div className="flex items-center gap-2">
              {!isEmbeddedPhoneFrame && (
                <button
                  type="button"
                  onClick={() => setPhoneViewMode((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    phoneViewMode
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-bone-200 bg-bone-50 text-ink-800 hover:border-ink-900 hover:text-ink-900'
                  }`}>
                  {phoneViewMode ? (
                    <>
                      <MonitorIcon className="h-3.5 w-3.5" />
                      Desktop View
                    </>
                  ) : (
                    <>
                      <SmartphoneIcon className="h-3.5 w-3.5 text-leaf-dark" />
                      Phone View
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => saveContent()}
                disabled={isSaving || !hasUnsavedChanges}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-150 sm:text-sm ${
                  hasUnsavedChanges
                    ? 'cursor-pointer bg-signal text-ink-950 shadow-md ring-2 ring-signal/50 hover:bg-signal-dark active:scale-95'
                    : 'cursor-default bg-bone-100 text-ink-400'
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

        {/* Main Content or Interactive Phone View Simulator */}
        {phoneViewMode && !isEmbeddedPhoneFrame ? (
          <div className="flex flex-col items-center justify-center px-4 py-8">
            <div className="mb-4 flex items-center gap-2 rounded-full border border-bone-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setPhoneTarget('admin')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  phoneTarget === 'admin' ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900'
                }`}>
                Admin Portal (Phone)
              </button>
              <button
                type="button"
                onClick={() => setPhoneTarget('site')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  phoneTarget === 'site' ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900'
                }`}>
                Public Website (Phone)
              </button>
            </div>

            {/* Realistic Phone Frame (390x820) */}
            <div className="relative overflow-hidden rounded-[44px] border-[12px] border-ink-950 bg-ink-950 shadow-2xl ring-1 ring-black/10">
              {/* Top speaker notch */}
              <div className="mx-auto flex h-6 w-36 items-center justify-center rounded-b-2xl bg-ink-950">
                <span className="h-1.5 w-14 rounded-full bg-white/20" />
              </div>
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                title="Demics Homes Phone View"
                className="h-[780px] w-[390px] rounded-t-[28px] bg-bone-100 border-0"
              />
            </div>
          </div>
        ) : (
          <main className="mx-auto max-w-4xl px-4 pb-24 pt-5 sm:px-6 sm:pt-8 lg:px-10 lg:py-12">
            <Outlet />
          </main>
        )}

        {/* Floating "More" Pop-up Modal (< lg) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="More portal options">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-ink-950/55 backdrop-blur-[2px]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Pop-up Card anchored above the bottom bar */}
            <div className="fixed inset-x-3 bottom-16 z-50 mx-auto max-w-md rounded-2xl border border-white/15 bg-ink-950 p-4 shadow-2xl ring-1 ring-black/20">
              <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                <Wordmark tone="light" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close pop-up"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-bone-100 hover:bg-white/20 hover:text-white">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                Portal Sections
              </p>
              <nav aria-label="More Portal Sections" className="grid grid-cols-2 gap-1.5">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-signal text-ink-950 shadow-sm'
                          : 'bg-white/5 text-bone-100/85 hover:bg-white/10 hover:text-white'
                      }`
                    }>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                <Link
                  to="/"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15">
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                  Open Public Website
                </Link>

                <div className="flex items-center gap-2">
                  {isCustomised && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleReset();
                      }}
                      className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-medium text-bone-100/70 hover:bg-white/5 hover:text-white">
                      <RotateCcwIcon className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/30">
                    <LogOutIcon className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Mobile Bottom Tab Bar (< lg) */}
        <nav
          aria-label="Mobile Quick Navigation"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-bone-200 bg-white/95 px-1.5 py-1 shadow-[0_-4px_16px_rgba(11,42,31,0.06)] backdrop-blur-md lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-6 gap-0.5">
            {mobileBottomItems.map(({ to, shortLabel, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold transition-colors ${
                    isActive && !mobileMenuOpen ? 'bg-leaf-soft text-leaf-dark' : 'text-ink-600 hover:text-ink-900'
                  }`
                }>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{shortLabel}</span>
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold transition-colors ${
                mobileMenuOpen ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-600 hover:text-ink-900'
              }`}>
              {mobileMenuOpen ? (
                <XIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}