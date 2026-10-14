import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import type { Company, Stat } from '../../types/content';
import { PageHeader } from '../../components/admin/PageHeader';
import { EditorSection } from '../../components/admin/EditorSection';
import { Field } from '../../components/admin/Field';
import { LinesField } from '../../components/admin/LinesField';
import { IconButton } from '../../components/admin/IconButton';
import { removeAt, replaceAt } from '../../utils/array';

export function BusinessEditor() {
  const { content, setContent } = useSiteContent();
  const { company, stats } = content;

  const updateCompany = (patch: Partial<Company>) => setContent((c) => ({ ...c, company: { ...c.company, ...patch } }));
  const setStats = (next: Stat[]) => setContent((c) => ({ ...c, stats: next }));

  return (
    <div>
      <PageHeader title="Business details" description="Contact details used in the header, contact section, footer and call buttons." />

      <div className="space-y-6">
        <EditorSection title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business name" value={company.name} onChange={(name) => updateCompany({ name })} />
            <Field label="Email" type="email" value={company.email} onChange={(email) => updateCompany({ email })} />
            <Field label="Tagline" value={company.tagline} onChange={(tagline) => updateCompany({ tagline })} className="sm:col-span-2" />
            <LinesField
              label="Phone numbers"
              value={company.phones}
              onChange={(phones) => updateCompany({ phones })}
              hint="One per line. The first number is used for the call buttons."
              rows={2} />
            
            <Field label="Office hours" value={company.hours} onChange={(hours) => updateCompany({ hours })} />
            <LinesField
              label="Areas you work in"
              value={company.serviceAreas}
              onChange={(serviceAreas) => updateCompany({ serviceAreas })}
              rows={5}
              className="sm:col-span-2" />
            
          </div>
        </EditorSection>

        <EditorSection title="Headline numbers" description="The figures in the “Who we are” section.">
          <ul className="space-y-4">
            {stats.map((stat, i) =>
            <li key={i} className="grid gap-3 rounded-md border border-bone-200 p-3 sm:grid-cols-[6rem_1fr_auto] sm:items-start">
                <Field label="Number" value={stat.value} onChange={(value) => setStats(replaceAt(stats, i, { ...stat, value }))} />
                <div className="grid gap-3">
                  <Field label="Label" value={stat.label} onChange={(label) => setStats(replaceAt(stats, i, { ...stat, label }))} />
                  <Field label="Detail" value={stat.detail} onChange={(detail) => setStats(replaceAt(stats, i, { ...stat, detail }))} />
                </div>
                <div className="justify-self-end sm:mt-6">
                  <IconButton label="Remove number" tone="danger" onClick={() => setStats(removeAt(stats, i))}>
                    <Trash2Icon className="h-4 w-4" />
                  </IconButton>
                </div>
              </li>
            )}
          </ul>
          <button
            type="button"
            onClick={() => setStats([...stats, { value: '', label: '', detail: '' }])}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 hover:text-signal-dark">
            
            <PlusIcon className="h-4 w-4" />
            Add number
          </button>
        </EditorSection>
      </div>
    </div>);

}