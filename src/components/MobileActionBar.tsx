import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneIcon } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';

const ease = [0.23, 1, 0.32, 1] as const;

/** Thumb-reachable call / quote bar for phones. Appears after the hero and hides once the contact form is on screen. */
export function MobileActionBar() {
  const { company } = useSiteContent().content;
  const [pastHero, setPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const contact = document.getElementById('contact');
    let observer: IntersectionObserver | undefined;
    if (contact) {
      observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0.15 });
      observer.observe(contact);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !contactVisible;

  return (
    <AnimatePresence>
      {visible &&
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.22, ease }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        
          <div className="mx-auto flex max-w-md gap-3">
            <a
            href={`tel:${company.phones[0]}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 text-sm font-semibold text-white active:bg-white/10">
            
              <PhoneIcon className="h-4 w-4 text-signal" aria-hidden="true" />
              Call us
            </a>
            <a
            href="#contact"
            className="flex flex-1 items-center justify-center rounded-full bg-signal py-3.5 text-sm font-semibold text-ink-950 active:bg-signal-dark">
            
              Get a quote
            </a>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}