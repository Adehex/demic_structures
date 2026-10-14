import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import type { BuildStage, CaseStudy } from '../../data/caseStudy';
import { PageHeader } from '../../components/admin/PageHeader';
import { EditorSection } from '../../components/admin/EditorSection';
import { Field } from '../../components/admin/Field';
import { ImageInput } from '../../components/admin/ImageInput';
import { FactsEditor } from '../../components/admin/FactsEditor';
import { StageEditor } from '../../components/admin/StageEditor';
import { VideoListEditor } from '../../components/admin/VideoListEditor';
import { makeId } from '../../utils/id';
import { moveItem, removeAt, replaceAt } from '../../utils/array';

export function SitesEditor() {
  const { content, setContent } = useSiteContent();
  const [params, setParams] = useSearchParams();
  const sites = content.caseStudies;
  const site = sites.find((s) => s.id === params.get('site')) ?? sites[0];

  const selectSite = (id: string) => setParams({ site: id }, { replace: true });

  const updateSite = (patch: Partial<CaseStudy>) => {
    if (!site) return;
    setContent((c) => ({ ...c, caseStudies: c.caseStudies.map((s) => s.id === site.id ? { ...s, ...patch } : s) }));
  };

  const addSite = () => {
    const newSite: CaseStudy = {
      id: makeId('site'),
      tabLabel: 'New site',
      eyebrow: 'On site now',
      name: 'New site',
      headline: 'New site headline',
      location: '',
      status: 'In progress',
      summary: '',
      facts: [],
      comparison: [
      { label: 'Before', src: '', alt: '' },
      { label: 'Now', src: '', alt: '' }],

      stages: [],
      videos: [],
      videoNote: 'Clips sent to the client from site.'
    };
    setContent((c) => ({ ...c, caseStudies: [newSite, ...c.caseStudies] }));
    selectSite(newSite.id);
  };

  const deleteSite = () => {
    if (!site || !window.confirm(`Delete “${site.name}” and all of its stages and photos?`)) return;
    setContent((c) => ({ ...c, caseStudies: c.caseStudies.filter((s) => s.id !== site.id) }));
    setParams({}, { replace: true });
  };

  const addStage = () => {
    if (!site) return;
    const stage: BuildStage = {
      id: makeId('stage'),
      label: 'New stage',
      title: 'New stage',
      status: 'current',
      summary: '',
      works: [],
      photos: []
    };
    updateSite({ stages: [...site.stages, stage] });
  };

  return (
    <div>
      <PageHeader
        title="Live sites"
        description="Each site diary appears in the “Live sites” section of the website, stage by stage."
        action={
        <button
          type="button"
          onClick={addSite}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-700 sm:self-auto">
          
            <PlusIcon className="h-4 w-4" />
            New site
          </button>
        } />
      

      {sites.length > 1 &&
      <div role="tablist" aria-label="Choose a site" className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {sites.map((s) =>
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={s.id === site?.id}
          onClick={() => selectSite(s.id)}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150 ease-out ${
          s.id === site?.id ? 'border-ink-900 bg-ink-900 text-white' : 'border-bone-200 bg-white text-ink-700 hover:border-ink-400'}`
          }>
          
              <span className={`h-2 w-2 rounded-full ${s.status === 'In progress' ? 'bg-signal' : 'bg-emerald-500'}`} aria-hidden="true" />
              {s.name}
            </button>
        )}
        </div>
      }

      {!site ?
      <div className="rounded-lg border border-dashed border-bone-200 bg-white px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold text-ink-900">No site diaries yet</p>
          <p className="mt-1 text-sm text-ink-600">Start one to show clients your progress from day one.</p>
          <button type="button" onClick={addSite} className="mt-5 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink-950">
            Start a site diary
          </button>
        </div> :

      <div key={site.id} className="space-y-6">
          <EditorSection title="Stages" description="Mark what’s complete, what’s happening now, and add photos from site.">
            {site.stages.length > 0 ?
          <ol className="space-y-2">
                {site.stages.map((stage, i) =>
            <StageEditor
              key={stage.id}
              stage={stage}
              index={i}
              total={site.stages.length}
              onChange={(next) => updateSite({ stages: replaceAt(site.stages, i, next) })}
              onMove={(dir) => updateSite({ stages: moveItem(site.stages, i, i + dir) })}
              onDelete={() => updateSite({ stages: removeAt(site.stages, i) })} />

            )}
              </ol> :

          <p className="text-sm text-ink-600">No stages yet. Add the first one to start the diary.</p>
          }
            <button
            type="button"
            onClick={addStage}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-bone-200 px-4 py-2.5 text-sm font-semibold text-ink-900 hover:border-ink-900">
            
              <PlusIcon className="h-4 w-4" />
              Add stage
            </button>
          </EditorSection>

          <EditorSection title="Site details" description="The heading block shown above the stages.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Site name" value={site.name} onChange={(name) => updateSite({ name })} />
              <Field
              label="Status"
              value={site.status}
              onChange={(status) => updateSite({ status: status as CaseStudy['status'] })}
              options={[
              { value: 'In progress', label: 'In progress' },
              { value: 'Completed', label: 'Completed' }]
              } />
            
              <Field label="Headline" value={site.headline} onChange={(headline) => updateSite({ headline })} className="sm:col-span-2" />
              <Field label="Location" value={site.location} onChange={(location) => updateSite({ location })} />
              <Field label="Small label above headline" value={site.eyebrow} onChange={(eyebrow) => updateSite({ eyebrow })} />
              <Field
              label="Quick-link label"
              value={site.tabLabel}
              onChange={(tabLabel) => updateSite({ tabLabel })}
              hint="Shown on the jump buttons at the top of the section."
              className="sm:col-span-2" />
            
              <Field label="Summary" value={site.summary} onChange={(summary) => updateSite({ summary })} multiline className="sm:col-span-2" />
            </div>
            <div className="mt-6 border-t border-bone-200 pt-6">
              <FactsEditor facts={site.facts} onChange={(facts) => updateSite({ facts })} />
            </div>
            <div className="mt-6 grid gap-4 border-t border-bone-200 pt-6 sm:grid-cols-2">
              <Field
              label="Building length (m)"
              type="number"
              value={site.footprint?.length ?? ''}
              onChange={(v) => updateSite({ footprint: v ? { length: Number(v), width: site.footprint?.width ?? 0 } : undefined })}
              hint="Optional. Draws the footprint to scale." />
            
              <Field
              label="Building width (m)"
              type="number"
              value={site.footprint?.width ?? ''}
              onChange={(v) => site.footprint && updateSite({ footprint: { ...site.footprint, width: Number(v) || 0 } })} />
            
            </div>
          </EditorSection>

          <EditorSection title="Headline photos" description="The two photos shown side by side next to the summary.">
            <div className="space-y-6">
              {site.comparison.map((img, i) =>
            <div key={i} className="grid gap-4 sm:grid-cols-[10rem_1fr]">
                  <Field
                label={`Photo ${i + 1} tag`}
                value={img.label}
                onChange={(label) =>
                updateSite({ comparison: replaceAt(site.comparison, i, { ...img, label }) as CaseStudy['comparison'] })
                } />
              
                  <ImageInput
                label={`Photo ${i + 1}`}
                value={img.src}
                onChange={(src) =>
                updateSite({
                  comparison: replaceAt(site.comparison, i, { ...img, src, alt: img.alt || `${site.name} — ${img.label}` }) as CaseStudy['comparison']
                })
                } />
              
                </div>
            )}
            </div>
          </EditorSection>

          <EditorSection title="Site videos" description="Shown in the “Straight from site” strip.">
            <VideoListEditor videos={site.videos} onChange={(videos) => updateSite({ videos })} />
          </EditorSection>

          <div className="flex justify-end">
            <button
            type="button"
            onClick={deleteSite}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
            
              <Trash2Icon className="h-4 w-4" />
              Delete this site
            </button>
          </div>
        </div>
      }
    </div>);

}