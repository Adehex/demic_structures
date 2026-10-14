import React from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tightest text-ink-900 sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink-600">{description}</p>
      </div>
      {action}
    </div>);

}