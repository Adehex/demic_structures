import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, PhoneIcon, XIcon } from 'lucide-react';
import { Wordmark } from './Wordmark';
import { useSiteContent } from '../contexts/SiteContentContext';

const links = [
{ label: 'Live sites', href: '#case-study' },
{ label: 'Projects', href: '#projects' },
{ label: 'Services', href: '#services' },
{ label: 'How we work', href: '#process' },
{ label: 'About', href: '#about' }];


const ease = [0.23, 1, 0.32, 1] as const;

export function Nav() {
  const { company } = useSiteContent().content;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open; close it if the viewport grows to desktop.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 ease-out ${
      solid ? 'border-b border-white/10 bg-ink-950/95 backdrop-blur-md' : 'border-b border-transparent bg-transparent'}`
      }>
      
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-5 sm:h-20 sm:px-6 lg:px-10">
        <Wordmark tone="light" />

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {links.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-bone-100/80 transition-colors duration-150 ease-out hover:text-white">
            
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

        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white">
            
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open &&
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease }}
          className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-ink-950 sm:h-[calc(100svh-5rem)] lg:hidden">
          
            <nav aria-label="Mobile" className="mx-auto flex max-w-shell flex-col px-5 py-4 sm:px-6">
              {links.map((link) =>
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 font-display text-2xl font-semibold text-white active:text-signal">
              
                  {link.label}
                </a>
            )}

              <div className="mt-8 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Call or WhatsApp</p>
                {company.phones.map((phone) =>
              <a key={phone} href={`tel:${phone}`} className="block font-display text-lg font-semibold text-white">
                    {phone}
                  </a>
              )}
                <a href={`mailto:${company.email}`} className="block break-all pt-1 text-[15px] text-bone-100/80">
                  {company.email}
                </a>
              </div>

              <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-full bg-signal px-5 py-4 text-center text-base font-semibold text-ink-950">
              
                Request a quote
              </a>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}