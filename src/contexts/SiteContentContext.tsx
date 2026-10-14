import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { company, stats } from '../data/company';
import { projects } from '../data/projects';
import { caseStudies } from '../data/caseStudy';
import { processSteps, services } from '../data/services';
import type { SiteContent } from '../types/content';

type SaveState = 'saved' | 'error';

type SiteContentContextValue = {
  content: SiteContent;
  setContent: (updater: (current: SiteContent) => SiteContent) => void;
  resetContent: () => void;
  saveState: SaveState;
  lastSaved: Date | null;
  isCustomised: boolean;
};

const STORAGE_KEY = 'demic-site-content-v1';

export const defaultContent: SiteContent = { company, stats, projects, caseStudies, services, processSteps };

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: {children: React.ReactNode;}) {
  const [content, setContentState] = useState<SiteContent>(loadContent);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isCustomised, setIsCustomised] = useState(() => hasStoredContent());
  const skipNextSave = useRef(true);

  // Persist every edit to this browser.
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setSaveState('saved');
      setLastSaved(new Date());
      setIsCustomised(true);
    } catch {
      setSaveState('error');
    }
  }, [content]);

  // Keep an open website tab in sync with edits made in the portal tab.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      skipNextSave.current = true;
      setContentState(loadContent());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setContent = useCallback((updater: (current: SiteContent) => SiteContent) => {
    setContentState((current) => updater(current));
  }, []);

  const resetContent = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    skipNextSave.current = true;
    setContentState(defaultContent);
    setLastSaved(null);
    setSaveState('saved');
    setIsCustomised(false);
  }, []);

  const value = useMemo(
    () => ({ content, setContent, resetContent, saveState, lastSaved, isCustomised }),
    [content, setContent, resetContent, saveState, lastSaved, isCustomised]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used inside SiteContentProvider');
  return ctx;
}

function hasStoredContent(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function loadContent(): SiteContent {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return { ...defaultContent, ...parsed };
  } catch {
    return defaultContent;
  }
}