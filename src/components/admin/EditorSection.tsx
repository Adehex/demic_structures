import React from 'react';

type EditorSectionProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function EditorSection({ title, description, action, children }: EditorSectionProps) {
  return (
    <section className="rounded-lg border border-bone-200 bg-white">
      <header className="flex flex-col gap-3 border-b border-bone-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-display text-base font-bold text-ink-900">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink-600">{description}</p>}
        </div>
        {action}
      </header>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>);

}