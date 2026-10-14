import React from 'react';
import type { Project } from '../../data/projects';
import { Field } from './Field';
import { LinesField } from './LinesField';
import { ImageInput } from './ImageInput';

type ProjectFormProps = {
  project: Project;
  onChange: (project: Project) => void;
};

export function ProjectForm({ project, onChange }: ProjectFormProps) {
  const update = (patch: Partial<Project>) => onChange({ ...project, ...patch });

  return (
    <div className="space-y-5">
      <ImageInput
        label="Main photo"
        value={project.image}
        onChange={(image) => update({ image })}
        hint={project.image ? undefined : 'Projects without a photo stay hidden from the website.'} />
      
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project name" value={project.name} onChange={(name) => update({ name })} />
        <Field label="Building type" value={project.type} onChange={(type) => update({ type })} placeholder="4-bedroom duplex" />
        <Field label="Location" value={project.location} onChange={(location) => update({ location })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Year" value={project.year} onChange={(year) => update({ year })} />
          <Field
            label="Status"
            value={project.status}
            onChange={(status) => update({ status: status as Project['status'] })}
            options={[
            { value: 'Completed', label: 'Completed' },
            { value: 'In progress', label: 'In progress' }]
            } />
          
        </div>
        <Field label="Duration" value={project.duration} onChange={(duration) => update({ duration })} placeholder="9 months" />
        <Field label="Scope of work" value={project.scope} onChange={(scope) => update({ scope })} />
      </div>
      <LinesField key={project.id} label="Highlights" value={project.highlights} onChange={(highlights) => update({ highlights })} rows={3} />
    </div>);

}