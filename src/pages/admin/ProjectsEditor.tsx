import React, { useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import type { Project } from '../../data/projects';
import { PageHeader } from '../../components/admin/PageHeader';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { IconButton } from '../../components/admin/IconButton';
import { makeId } from '../../utils/id';
import { moveItem, removeAt, replaceAt } from '../../utils/array';

export function ProjectsEditor() {
  const { content, setContent } = useSiteContent();
  const projects = content.projects;
  const [openId, setOpenId] = useState<string | null>(null);

  const setProjects = (next: Project[]) => setContent((c) => ({ ...c, projects: next }));

  const addProject = () => {
    const project: Project = {
      id: makeId('project'),
      name: 'New project',
      type: '',
      location: '',
      year: String(new Date().getFullYear()),
      status: 'Completed',
      duration: '',
      scope: '',
      image: '',
      highlights: []
    };
    setProjects([project, ...projects]);
    setOpenId(project.id);
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="The gallery in the “Selected projects” section. The first project is shown when the page loads."
        action={
        <button
          type="button"
          onClick={addProject}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-700 sm:self-auto">
          
            <PlusIcon className="h-4 w-4" />
            New project
          </button>
        } />
      

      {projects.length === 0 ?
      <div className="rounded-lg border border-dashed border-bone-200 bg-white px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold text-ink-900">No projects yet</p>
          <p className="mt-1 text-sm text-ink-600">The projects section is hidden until you add one with a photo.</p>
        </div> :

      <ul className="divide-y divide-bone-200 rounded-lg border border-bone-200 bg-white">
          {projects.map((project, i) => {
          const open = openId === project.id;
          return (
            <li key={project.id}>
                <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-bone-100">
                    {project.image ?
                  <img src={project.image} alt="" className="h-full w-full object-cover" /> :

                  <div className="grid h-full place-items-center text-ink-400">
                        <ImageIcon className="h-4 w-4" aria-hidden="true" />
                      </div>
                  }
                  </div>
                  <button
                  type="button"
                  onClick={() => setOpenId(open ? null : project.id)}
                  aria-expanded={open}
                  className="min-w-0 flex-1 text-left">
                  
                    <span className="block truncate font-display text-[15px] font-semibold text-ink-900">{project.name}</span>
                    <span className="mt-0.5 flex items-center gap-2 truncate text-xs text-ink-600">
                      <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${project.status === 'In progress' ? 'bg-signal' : 'bg-emerald-500'}`}
                      aria-hidden="true" />
                    
                      {project.image ? project.location || 'No location' : 'Hidden — needs a photo'}
                    </span>
                  </button>
                  <div className="hidden sm:flex">
                    <IconButton label="Move up" onClick={() => setProjects(moveItem(projects, i, i - 1))} disabled={i === 0}>
                      <ArrowUpIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                    label="Move down"
                    onClick={() => setProjects(moveItem(projects, i, i + 1))}
                    disabled={i === projects.length - 1}>
                    
                      <ArrowDownIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                  <IconButton label={open ? 'Close editor' : 'Edit project'} onClick={() => setOpenId(open ? null : project.id)}>
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                  label="Delete project"
                  tone="danger"
                  onClick={() => window.confirm(`Delete “${project.name}”?`) && setProjects(removeAt(projects, i))}>
                  
                    <Trash2Icon className="h-4 w-4" />
                  </IconButton>
                </div>
                {open &&
              <div className="border-t border-bone-200 bg-bone-50/60 px-4 py-5 sm:px-6">
                    <ProjectForm project={project} onChange={(next) => setProjects(replaceAt(projects, i, next))} />
                    <div className="mt-5 flex items-center justify-between sm:hidden">
                      <div className="flex">
                        <IconButton label="Move up" onClick={() => setProjects(moveItem(projects, i, i - 1))} disabled={i === 0}>
                          <ArrowUpIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                      label="Move down"
                      onClick={() => setProjects(moveItem(projects, i, i + 1))}
                      disabled={i === projects.length - 1}>
                      
                          <ArrowDownIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                      <button type="button" onClick={() => setOpenId(null)} className="text-sm font-semibold text-ink-900">
                        Done
                      </button>
                    </div>
                  </div>
              }
              </li>);

        })}
        </ul>
      }
    </div>);

}