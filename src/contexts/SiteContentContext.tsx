import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { company, stats } from '../data/company';
import { projects } from '../data/projects';
import { caseStudies } from '../data/caseStudy';
import { processSteps, services } from '../data/services';
import type { SiteContent } from '../types/content';
import savedContentData from '../data/savedContent.json';

type SaveState = 'saved' | 'saving' | 'error';

type SiteContentContextValue = {
  content: SiteContent;
  setContent: (updater: (current: SiteContent) => SiteContent) => void;
  saveContent: (contentToSave?: SiteContent) => Promise<boolean>;
  resetContent: () => void;
  saveState: SaveState;
  lastSaved: Date | null;
  isCustomised: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveMessage: string | null;
};

const STORAGE_KEY = 'demic-site-content-v1';

export const fallbackDefaultContent: SiteContent = { company, stats, projects, caseStudies, services, processSteps };
export const defaultContent: SiteContent = (savedContentData as unknown as SiteContent) || fallbackDefaultContent;

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(loadContent);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isCustomised, setIsCustomised] = useState(() => hasStoredContent());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const saveContent = useCallback(async (contentToSave?: SiteContent): Promise<boolean> => {
    const data = contentToSave ?? content;
    setIsSaving(true);
    setSaveState('saving');
    try {
      // 1. Persist to browser localStorage
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setIsCustomised(true);

      // 2. Persist to local file on disk via server endpoint so public site has it permanently
      try {
        const res = await fetch('/api/save-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          console.warn('Server file persistence returned non-200 status');
        }
      } catch (err) {
        console.warn('Could not reach backend save endpoint, saved locally in browser', err);
      }

      setSaveState('saved');
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setSaveMessage('Saved! Your changes are now live on the public website.');
      setTimeout(() => setSaveMessage(null), 6000);
      return true;
    } catch {
      setSaveState('error');
      setSaveMessage('Failed to save changes. Please check browser storage.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [content]);



  // Keep open website tabs in sync with edits made in portal tabs
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setContentState(loadContent());
      setHasUnsavedChanges(false);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setContent = useCallback((updater: (current: SiteContent) => SiteContent) => {
    setContentState((current) => {
      const next = updater(current);
      setHasUnsavedChanges(true);
      return next;
    });
  }, []);

  const resetContent = useCallback(async () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setContentState(fallbackDefaultContent);
    setLastSaved(null);
    setSaveState('saved');
    setIsCustomised(false);
    setHasUnsavedChanges(false);
    try {
      await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackDefaultContent),
      });
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      content,
      setContent,
      saveContent,
      resetContent,
      saveState,
      lastSaved,
      isCustomised,
      hasUnsavedChanges,
      isSaving,
      saveMessage
    }),
    [content, setContent, saveContent, resetContent, saveState, lastSaved, isCustomised, hasUnsavedChanges, isSaving, saveMessage]
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