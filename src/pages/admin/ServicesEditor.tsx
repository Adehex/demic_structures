import React from 'react';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import type { Service } from '../../data/services';
import type { ProcessStep } from '../../types/content';
import { PageHeader } from '../../components/admin/PageHeader';
import { EditorSection } from '../../components/admin/EditorSection';
import { Field } from '../../components/admin/Field';
import { LinesField } from '../../components/admin/LinesField';
import { IconButton } from '../../components/admin/IconButton';
import { makeId } from '../../utils/id';
import { moveItem, removeAt, replaceAt } from '../../utils/array';

export function ServicesEditor() {
  const { content, setContent } = useSiteContent();
  const { services, processSteps } = content;

  const setServices = (next: Service[]) => setContent((c) => ({ ...c, services: next }));
  const setSteps = (next: ProcessStep[]) =>
  setContent((c) => ({ ...c, processSteps: next.map((s, i) => ({ ...s, step: String(i + 1).padStart(2, '0') })) }));

  return (
    <div>
      <PageHeader title="Services" description="What you offer and how you work with clients." />

      <div className="space-y-6">
        <EditorSection
          title="Service packages"
          action={
          <button
            type="button"
            onClick={() => setServices([...services, { id: makeId('service'), title: 'New service', summary: '', includes: [] }])}
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-ink-900 hover:text-signal-dark">
            
              <PlusIcon className="h-4 w-4" />
              Add service
            </button>
          }>
          
          <ul className="space-y-4">
            {services.map((service, i) =>
            <li key={service.id} className="rounded-md border border-bone-200 p-4">
                <div className="flex items-start gap-2">
                  <Field
                  label="Service name"
                  value={service.title}
                  onChange={(title) => setServices(replaceAt(services, i, { ...service, title }))}
                  className="flex-1" />
                
                  <div className="mt-6 flex">
                    <IconButton label="Move up" onClick={() => setServices(moveItem(services, i, i - 1))} disabled={i === 0}>
                      <ArrowUpIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Move down" onClick={() => setServices(moveItem(services, i, i + 1))} disabled={i === services.length - 1}>
                      <ArrowDownIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                    label="Delete service"
                    tone="danger"
                    onClick={() => window.confirm(`Delete “${service.title}”?`) && setServices(removeAt(services, i))}>
                    
                      <Trash2Icon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                  label="Description"
                  value={service.summary}
                  onChange={(summary) => setServices(replaceAt(services, i, { ...service, summary }))}
                  multiline />
                
                  <LinesField
                  key={service.id}
                  label="Includes"
                  value={service.includes}
                  onChange={(includes) => setServices(replaceAt(services, i, { ...service, includes }))} />
                
                </div>
              </li>
            )}
          </ul>
        </EditorSection>

        <EditorSection
          title="How we work"
          description="Steps are numbered automatically."
          action={
          <button
            type="button"
            onClick={() => setSteps([...processSteps, { step: '', title: 'New step', body: '' }])}
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-ink-900 hover:text-signal-dark">
            
              <PlusIcon className="h-4 w-4" />
              Add step
            </button>
          }>
          
          <ol className="space-y-4">
            {processSteps.map((step, i) =>
            <li key={i} className="flex gap-3">
                <span className="mt-7 w-6 shrink-0 font-display text-sm font-bold text-signal-dark">{step.step}</span>
                <div className="grid flex-1 gap-3">
                  <Field label="Step title" value={step.title} onChange={(title) => setSteps(replaceAt(processSteps, i, { ...step, title }))} />
                  <Field label="Description" value={step.body} onChange={(body) => setSteps(replaceAt(processSteps, i, { ...step, body }))} multiline rows={2} />
                </div>
                <div className="mt-6">
                  <IconButton label="Delete step" tone="danger" onClick={() => setSteps(removeAt(processSteps, i))}>
                    <Trash2Icon className="h-4 w-4" />
                  </IconButton>
                </div>
              </li>
            )}
          </ol>
        </EditorSection>
      </div>
    </div>);

}