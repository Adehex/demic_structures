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
  id: 'warehouse-120',
  name: '120m Warehouse — Site Prep',
  type: '120m × 24m industrial warehouse',
  location: 'Interchange, Ogun State',
  year: '2026',
  status: 'In progress',
  duration: 'Ongoing — foundation trenches',
  scope: 'Clearing, grading, setting out, excavation',
  image: "/one.jpg",
  highlights: [
  'Full plot cleared and graded with a wheel loader',
  '2,880 m² footprint set out on profile boards and string lines',
  'Foundation trenches excavated to the engineer’s levels']

},
{
  id: 'seasoning-store',
  name: 'Seasoning Store',
  type: 'Industrial storage block',
  location: 'Interchange, Ogun State',
  year: '2026',
  status: 'Completed',
  duration: 'Built on a live factory site',
  scope: 'Blockwork, roofing, render, steel doors, finishing',
  image: "/WhatsApp_Image_2026-10-09_at_16.41.10_2.jpg",
  highlights: [
  'Built against an existing warehouse without halting production',
  'Three steel sliding doors fabricated and hung on overhead tracks',
  'Finished to match the facility’s colours and rooflines']

},
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