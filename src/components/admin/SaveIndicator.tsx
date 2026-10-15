import React from 'react';
import { AlertTriangleIcon, CheckIcon, RefreshCwIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useSiteContent } from '../../contexts/SiteContentContext';

export function SaveIndicator() {
  const { saveState, lastSaved, hasUnsavedChanges, isSaving } = useSiteContent();

  if (saveState === 'error') {
    return (
      <p role="alert" className="flex items-center gap-2 text-xs font-medium text-red-700">
        <AlertTriangleIcon className="h-4 w-4 shrink-0" />
        Storage error — check browser storage or reset.
      </p>
    );
  }

  if (isSaving || saveState === 'saving') {
    return (
      <p className="flex items-center gap-2 text-xs font-medium text-ink-700" aria-live="polite">
        <RefreshCwIcon className="h-3.5 w-3.5 animate-spin text-signal" />
        Publishing changes to website...
      </p>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <p className="flex items-center gap-2 text-xs font-medium text-amber-700" aria-live="polite">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        Unsaved changes
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 text-xs font-medium text-ink-600" aria-live="polite">
      <CheckIcon className="h-4 w-4 text-emerald-600" />
      {lastSaved ? `Saved & published at ${format(lastSaved, 'h:mm a')}` : 'All changes saved to website'}
    </p>
  );
}