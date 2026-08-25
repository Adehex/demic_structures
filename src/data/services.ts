export type Service = {
  id: string;
  title: string;
  summary: string;
  includes: string[];
};

export const services: Service[] = [
{
  id: 'build',
  title: 'Residential construction',
  summary:
  'Bungalows, duplexes and contemporary homes taken from a cleared plot to keys in hand, with one team accountable for every stage.',
  includes: ['Setting out & excavation', 'Foundation and slab works', 'Blockwork & roofing', 'Handover with as-built records']
},
{
  id: 'structure',
  title: 'Structural works',
  summary:
  'Foundations, columns, beams and slabs built to the engineer’s drawings, with concrete tested and logged before the next pour.',
  includes: ['Raft, pad & strip foundations', 'Rebar detailing & fixing', 'Formwork and casting', 'Cube testing records']
},
{
  id: 'finishing',
  title: 'Finishing & fit-out',
  summary:
  'The stage most builds fall apart on. Screeding, POP, tiling, painting and joinery sequenced so trades never undo each other’s work.',
  includes: ['Screed & plaster', 'POP ceilings', 'Tiling & joinery', 'Painting and snagging']
},
{
  id: 'renovation',
  title: 'Renovation & extension',
  summary:
  'Opening up old walls, adding floors and correcting inherited defects on occupied properties without taking the whole house offline.',
  includes: ['Structural alterations', 'Roof replacement', 'Extensions & annexes', 'Defect rectification']
},
{
  id: 'management',
  title: 'Project management',
  summary:
  'For clients building from abroad or juggling work. We hold the programme, the budget and the subcontractors, and report weekly.',
  includes: ['Programme of works', 'Cost tracking', 'Subcontractor vetting', 'Weekly photo reports']
},
{
  id: 'consult',
  title: 'Costing & consultancy',
  summary:
  'A measured bill of quantities before you commit, so the number you plan around is the number you actually spend.',
  includes: ['Bill of quantities', 'Material schedules', 'Site & soil assessment', 'Buildability review']
}];


export const processSteps = [
{
  step: '01',
  title: 'Site visit & brief',
  body:
  'We walk the plot with you, check access, soil and levels, and write down exactly what you want the finished building to do.'
},
{
  step: '02',
  title: 'Costing & programme',
  body:
  'You receive a measured bill of quantities and a dated programme of works. No allowances hidden in a single lump sum.'
},
{
  step: '03',
  title: 'Build & report',
  body:
  'Work starts with a fixed team on site. Every week you get progress photos, materials used and the next stage in writing.'
},
{
  step: '04',
  title: 'Snag & handover',
  body:
  'We walk the building with you, close every item on the snag list, then hand over drawings, warranties and as-built records.'
}];