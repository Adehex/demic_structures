import React from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tightest text-ink-900 sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-600 sm:mt-1.5 sm:text-[15px]">{description}</p>
      </div>
      {action}
    </div>);

}