import React from 'react';
import { AlertTriangleIcon, CheckIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useSiteContent } from '../../contexts/SiteContentContext';

export function SaveIndicator() {
  const { saveState, lastSaved } = useSiteContent();

  if (saveState === 'error') {
    return (
      <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-700">
        <AlertTriangleIcon className="h-4 w-4 shrink-0" />
        Storage full — remove some uploaded photos or use photo links.
      </p>);

  }

  return (
    <p className="flex items-center gap-2 text-sm text-ink-600" aria-live="polite">
      <CheckIcon className="h-4 w-4 text-emerald-600" />
      {lastSaved ? `Saved at ${format(lastSaved, 'h:mm a')}` : 'All changes saved'}
    </p>);

}