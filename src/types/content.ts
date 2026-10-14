import type { Project } from '../data/projects';
import type { CaseStudy } from '../data/caseStudy';
import type { Service } from '../data/services';

export type Company = {
  name: string;
  tagline: string;
  logo: string;
  email: string;
  phones: string[];
  hours: string;
  serviceAreas: string[];
};

export type Stat = {
  value: string;
  label: string;
  detail: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

export type SiteContent = {
  company: Company;
  stats: Stat[];
  projects: Project[];
  caseStudies: CaseStudy[];
  services: Service[];
  processSteps: ProcessStep[];
};