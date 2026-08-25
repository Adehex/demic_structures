import React, { useEffect, useState } from 'react';
import { MenuIcon, PhoneIcon, XIcon } from 'lucide-react';
import { Wordmark } from './Wordmark';
import { company } from '../data/company';

const links = [
{ label: 'Projects', href: '#projects' },
{ label: 'Services', href: '#services' },
{ label: 'How we work', href: '#process' },
{ label: 'About', href: '#about' }];


export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ease-out ${
      scrolled ? 'border-b border-white/10 bg-ink-950/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'}`
      }>
      
      <div className="mx-auto flex h-20 max-w-shell items-center justify-between px-6 lg:px-10">
        <Wordmark tone="light" />

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="relative text-sm font-medium text-bone-100/80 transition-colors duration-150 ease-out hover:text-white">
            
              {link.label}
            </a>
          )}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href={`tel:${company.phones[0]}`}
            className="flex items-center gap-2 text-sm font-medium text-bone-100/80 transition-colors duration-150 ease-out hover:text-white">
            
            <PhoneIcon className="h-4 w-4 text-signal" aria-hidden="true" />
            {company.phones[0]}
          </a>
          <a
            href="#contact"
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors duration-150 ease-out hover:bg-white">
            
            Request a quote
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white lg:hidden">
          
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open &&
      <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-md lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-shell flex-col px-6 py-4">
            {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="border-b border-white/5 py-3.5 font-display text-lg font-semibold text-white">
            
                {link.label}
              </a>
          )}
            <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-5 rounded-full bg-signal px-5 py-3 text-center text-sm font-semibold text-ink-950">
            
              Request a quote
            </a>
          </nav>
        </div>
      }
    </header>);

}