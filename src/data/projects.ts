export type Project = {
  id: string;
  name: string;
  type: string;
  location: string;
  year: string;
  status: 'Completed' | 'In progress';
  duration: string;
  scope: string;
  image: string;
  highlights: string[];
};

export const projects: Project[] = [
{
  id: 'ridgeview',
  name: 'Ridgeview Duplex',
  type: '5-bedroom duplex + penthouse',
  location: 'Guzape, Abuja',
  year: '2025',
  status: 'Completed',
  duration: '14 months',
  scope: 'Design, structure, roofing, finishing',
  image: "/photo_2026-08-25_13-33-03.jpg",
  highlights: [
  'Reinforced raft foundation on reactive soil',
  'Exposed brick feature walls with cast cornice detail',
  'Full external lighting and perimeter fence works']

},
{
  id: 'alcove',
  name: 'Alcove Contemporary Villa',
  type: '4-bedroom contemporary home',
  location: 'Lekki Phase 1, Lagos',
  year: '2024',
  status: 'Completed',
  duration: '16 months',
  scope: 'Structure, cladding, glazing, fit-out',
  image: "/photo_2026-08-25_13-33-14.jpg",
  highlights: [
  'Double-height structural glazing to the stair core',
  'Cantilevered balcony slabs with concealed drainage',
  'Slatted steel gate and screen fabricated in-house']

},
{
  id: 'nnamdi',
  name: 'Nnamdi Bungalow Residence',
  type: '4-bedroom detached bungalow',
  location: 'Independence Layout, Enugu',
  year: '2024',
  status: 'Completed',
  duration: '9 months',
  scope: 'Foundation to finishing, landscaping',
  image: "/image1.jpg",
  highlights: [
  'Hipped roof in architectural shingle over timber trusses',
  'Interlocking paved driveway and soft landscaping',
  'Delivered three weeks ahead of programme']

},
{
  id: 'cedar',
  name: 'Cedar Terraces — Shell & Core',
  type: '6-unit terrace development',
  location: 'Lugbe, Abuja',
  year: '2026',
  status: 'In progress',
  duration: 'Ongoing — 60% complete',
  scope: 'Substructure, frame, blockwork',
  image: "/75798f36-6e46-4044-9e78-e106b6482e8e.jpg",
  highlights: [
  'Six units built in two phased pours to protect cash flow',
  'Concrete cube tests logged at every slab stage',
  'Weekly photo report issued to the client']

},
{
  id: 'harmony',
  name: 'Harmony Court Fit-out',
  type: 'Interior finishing package',
  location: 'Wuse II, Abuja',
  year: '2025',
  status: 'Completed',
  duration: '5 months',
  scope: 'Screeding, POP, tiling, painting, electrical',
  image: "/0bf36022-88d0-4583-b62c-3b4be3c29cb0.jpg",
  highlights: [
  'Coffered POP ceilings with recessed lighting layout',
  'Large-format porcelain tiling with 2mm joints',
  'Handed over snag-free at first inspection']

}];