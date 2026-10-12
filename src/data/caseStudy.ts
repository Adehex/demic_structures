export type StagePhoto = {
  src: string;
  alt: string;
};

export type StageStatus = 'done' | 'current' | 'upcoming';

export type BuildStage = {
  id: string;
  label: string;
  title: string;
  status: StageStatus;
  summary: string;
  works: string[];
  photos: StagePhoto[];
};

export type SiteVideo = {
  src: string;
  title: string;
};

export type CaseStudy = {
  id: string;
  tabLabel: string;
  eyebrow: string;
  name: string;
  headline: string;
  location: string;
  status: 'Completed' | 'In progress';
  summary: string;
  facts: {label: string;value: string;}[];
  footprint?: {length: number;width: number;};
  comparison: [StagePhoto & {label: string;}, StagePhoto & {label: string;}];
  stages: BuildStage[];
  videos: SiteVideo[];
  videoNote: string;
};

const u = (path: string) => `https://cdn.magicpatterns.com/uploads/${path}`;

const warehouse: CaseStudy = {
  id: 'warehouse',
  tabLabel: 'Warehouse — site preparation',
  eyebrow: 'On site now',
  name: '120m Warehouse',
  headline: 'Preparing ground for a 120m warehouse.',
  location: 'Interchange, Ogun State',
  status: 'In progress',
  summary:
  'Site preparation for a new 120m × 24m warehouse beside the client’s existing stores. The plot has been cleared and graded, the full footprint set out on profile boards, and foundation trenches are being excavated to the engineer’s levels.',
  facts: [
  { label: 'Footprint', value: '120m × 24m (2,880 m²)' },
  { label: 'Location', value: 'Interchange, Ogun State' },
  { label: 'Current stage', value: 'Foundation trench excavation' },
  { label: 'Plant on site', value: 'Wheel loader + excavation crew' }],

  footprint: { length: 120, width: 24 },
  comparison: [
  {
    label: 'Cleared',
    src: u('dubySufWcquUh6bNAjdZTd/one.jpg'),
    alt: 'Cleared plot beside the existing warehouse wall at Interchange, ready for setting out'
  },
  {
    label: 'This week',
    src: u('unarXwWh4rw6XnzKzN32JQ/WhatsApp_Image_2026-10-09_at_17.20.34.jpg'),
    alt: 'Long foundation trench excavated along the string line with blocks staged nearby'
  }],

  stages: [
  {
    id: 'clearing',
    label: 'Site clearing',
    title: 'Clearing & grading the plot',
    status: 'done',
    summary:
    'Vegetation, stumps and debris removed across the full plot, then a wheel loader graded the ground and opened a haul route along the existing warehouse so deliveries never block the client’s operations.',
    works: ['Bush clearing & grubbing', 'Stump & debris removal', 'Grading with wheel loader', 'Haul route for deliveries'],
    photos: [
    { src: u('dubySufWcquUh6bNAjdZTd/one.jpg'), alt: 'Cleared ground running the length of the existing warehouse' },
    { src: u('6G6Tw7yMAivqDkY92RRUJY/WhatsApp_Image_2026-10-09_at_17.08.49.jpg'), alt: 'Wheel loader grading the plot as the supervisor checks the ground' },
    { src: u('wbjuBefxs8KDkcgvqNeZE3/WhatsApp_Image_2026-10-09_at_17.09.00.jpg'), alt: 'Wheel loader on site beside the perimeter wall' }]

  },
  {
    id: 'setting-out',
    label: 'Setting out',
    title: 'Setting out 120m × 24m',
    status: 'done',
    summary:
    'The warehouse footprint pegged out from the client’s drawings, with timber profile boards and string lines fixing every wall and column line before a single trench was opened.',
    works: ['Survey & corner pegs', 'Timber profile boards', 'String lines to wall centres', 'Diagonals checked for square'],
    photos: [
    { src: u('wrB8fW6aX7tCvzK4Rtv8te/WhatsApp_Image_2026-10-09_at_17.21.39_3.jpg'), alt: 'Site team fixing timber profile boards for the warehouse footprint' },
    { src: u('fZ4QTNfqJiQAgxVu6TzT2H/WhatsApp_Image_2026-10-09_at_17.21.39_2.jpg'), alt: 'Worker opening the first trench between green string lines' },
    { src: u('bed5f8C5L1kDLnYYd1snfS/WhatsApp_Image_2026-10-09_at_17.21.39.jpg'), alt: 'Trench started at the corner tie-in to the existing building' }]

  },
  {
    id: 'excavation',
    label: 'Excavation',
    title: 'Foundation trench excavation',
    status: 'current',
    summary:
    'Strip foundation trenches dug along the string lines into firm laterite, with depth and width checked against the engineer’s levels and junctions squared off ready for blinding.',
    works: ['Trenches to engineer’s depth', 'Junctions squared & trimmed', 'Spoil kept clear of edges', 'Levels checked by site engineer'],
    photos: [
    { src: u('unarXwWh4rw6XnzKzN32JQ/WhatsApp_Image_2026-10-09_at_17.20.34.jpg'), alt: 'Long excavated trench running across the site' },
    { src: u('tvnk2D1PZfyXcr3eYQV7h8/WhatsApp_Image_2026-10-09_at_17.21.38.jpg'), alt: 'Labourer excavating a deep trench in red laterite' },
    { src: u('jyptDdWtJna6HW8dk9DtvT/WhatsApp_Image_2026-10-09_at_17.20.48.jpg'), alt: 'Squared trench junction ready for inspection' },
    { src: u('7p5iJ4WrzrN5LFwPeb4MYC/WhatsApp_Image_2026-10-09_at_17.21.38_2.jpg'), alt: 'Site supervisor on the trench line with the excavation crew' },
    { src: u('2ZEg1Sw3b3U5Qb9Vc1wFz9/WhatsApp_Image_2026-10-09_at_17.20.40.jpg'), alt: 'Site engineer directing works beside the excavated trench' }]

  },
  {
    id: 'foundation',
    label: 'Foundations',
    title: 'Blinding & foundation concrete',
    status: 'upcoming',
    summary:
    'Next on site: trenches inspected and blinded, reinforcement fixed and strip foundations cast, with concrete cubes taken from every pour.',
    works: ['Trench inspection sign-off', 'Blinding concrete', 'Rebar fixing', 'Foundation pour & cube tests'],
    photos: []
  },
  {
    id: 'substructure',
    label: 'Substructure',
    title: 'Blockwork & floor slab',
    status: 'upcoming',
    summary:
    'Substructure blockwork raised to DPC level, filled and compacted, then the warehouse floor slab cast ready for the steel frame.',
    works: ['Substructure blockwork', 'Laterite fill & compaction', 'DPC & hardcore', 'Ground floor slab'],
    photos: []
  }],

  videos: [
  { src: "/WhatsApp Video 2026-10-09 at 17.08.39.mp4", title: 'Site clip 1' },
  { src: "/WhatsApp Video 2026-10-09 at 17.08.49.mp4", title: 'Site clip 2' },
  { src: "/WhatsApp Video 2026-10-09 at 17.09.00 2.mp4", title: 'Site clip 3' },
  { src: "/WhatsApp Video 2026-10-09 at 17.09.00.mp4", title: 'Site clip 4' },
  { src: "/WhatsApp Video 2026-10-09 at 17.21.38.mp4", title: 'Site clip 5' }],

  videoNote: 'Clips sent to the client from site as the plot was cleared and the trenches went in.'
};

const seasoningStore: CaseStudy = {
  id: 'seasoning-store',
  tabLabel: 'Seasoning store — completed',
  eyebrow: 'Latest handover',
  name: 'Seasoning Store',
  headline: 'Seasoning Store, start to finish.',
  location: 'Interchange, Ogun State',
  status: 'Completed',
  summary:
  'A new storage block built against an existing warehouse inside a working food factory — blockwork, roofing, rendering, fabricated steel sliding doors and finishing, all delivered while the site kept running.',
  facts: [
  { label: 'Location', value: 'Interchange, Ogun State' },
  { label: 'Building type', value: 'Industrial storage block' },
  { label: 'Doors', value: '3 fabricated steel sliding doors' },
  { label: 'Site condition', value: 'Live factory — no shutdown' }],

  comparison: [
  {
    label: 'During',
    src: u('5YFQ5NKL99Lu9JW1aFYCbf/WhatsApp_Image_2026-10-09_at_16.32.31.jpg'),
    alt: 'Seasoning store under construction with rendered walls and unpainted steel door frames'
  },
  {
    label: 'Completed',
    src: u('6fofsj3xME458AENU2htii/WhatsApp_Image_2026-10-09_at_16.41.09.jpg'),
    alt: 'Completed seasoning store with painted render and red steel sliding doors'
  }],

  stages: [
  {
    id: 'setting-out',
    label: 'Setting out',
    title: 'Setting out & first courses',
    status: 'done',
    summary:
    'Blocks staged on site, the footprint marked against the existing warehouse wall and the first courses laid on a levelled base — without blocking forklift access to the loading bays.',
    works: ['Site clearing & levelling', 'Material staging', 'Setting out against existing wall', 'First block courses'],
    photos: [
    { src: u('f6J6fEVSKK62dkvDCn6dPN/WhatsApp_Image_2026-10-09_at_16.32.50.jpg'), alt: 'Sandcrete blocks staged on site beside the factory gate while workers set out the store' },
    { src: u('eP9dBGbqEFSGa1teTX8u8C/WhatsApp_Image_2026-10-09_at_16.32.53.jpg'), alt: 'Mason laying the first course of blocks beside warehouse FD2' },
    { src: u('sVz7zK5eVieBAQUuY6XoHY/WhatsApp_Image_2026-10-09_at_16.32.54.jpg'), alt: 'First block course completed along the planting bed' }]

  },
  {
    id: 'blockwork',
    label: 'Blockwork',
    title: 'Walls up to roof height',
    status: 'done',
    summary:
    'Hollow sandcrete blockwork raised in lifts on independent scaffolding, tied into the existing structure, with door openings formed to suit the sliding-door tracks.',
    works: ['9-inch hollow blockwork', 'Door openings & lintels', 'Tie-in to existing warehouse', 'Scaffold erection'],
    photos: [
    { src: u('c83xHyvJW5C1LMqdyy2JTG/WhatsApp_Image_2026-10-09_at_16.32.48.jpg'), alt: 'Blockwork walls rising on scaffolding next to the existing warehouse' }]

  },
  {
    id: 'roof-render',
    label: 'Roof & render',
    title: 'Roofing and rendering',
    status: 'done',
    summary:
    'Steel roof brackets and sheeting matched to the neighbouring buildings, then the walls rendered inside and out in a single smooth coat ready for paint.',
    works: ['Steel roof brackets', 'Roof sheeting', 'External rendering', 'Internal plastering'],
    photos: [
    { src: u('sNep5rNcYSMViAjjmQyA3F/WhatsApp_Image_2026-10-09_at_16.32.37.jpg'), alt: 'Store block roofed with openings formed and render in progress' },
    { src: u('wg72B2Vm4wmYHYV6LLgwgi/WhatsApp_Image_2026-10-09_at_16.32.40.jpg'), alt: 'Rendered store block with scaffolding and crew finishing the forecourt' },
    { src: u('33Qe5RUWeXtWFiCy4yiDF2/WhatsApp_Image_2026-10-09_at_16.32.45.jpg'), alt: 'Plasterer rendering the gable wall from a scaffold platform' },
    { src: u('e4Cagrj3C3gELQgnPwX8XH/WhatsApp_Image_2026-10-09_at_16.32.47.jpg'), alt: 'Freshly rendered internal wall corner' }]

  },
  {
    id: 'doors',
    label: 'Steel doors',
    title: 'Fabricated sliding doors',
    status: 'done',
    summary:
    'Three steel sliding doors fabricated and hung on overhead tracks, checked for alignment and free running before any paint went on.',
    works: ['Door frame fabrication', 'Overhead track installation', 'Alignment checks', 'Surface preparation'],
    photos: [
    { src: u('kKweDoB3RheC95ibr7J3fu/WhatsApp_Image_2026-10-09_at_16.32.35.jpg'), alt: 'Steel sliding door frames hung on the rendered store block' },
    { src: u('5YFQ5NKL99Lu9JW1aFYCbf/WhatsApp_Image_2026-10-09_at_16.32.31.jpg'), alt: 'Supervisor checking sliding door alignment with the work zone coned off' },
    { src: u('dsnYTF8x7p4zTdfHVh93aL/WhatsApp_Image_2026-10-09_at_16.30.46.jpg'), alt: 'Site engineer inspecting the sliding door frame and track' }]

  },
  {
    id: 'finishing',
    label: 'Finishing',
    title: 'Painting & finishing',
    status: 'done',
    summary:
    'Doors primed and finished in the facility’s signature red, walls painted to match the existing blocks, and the kerbs repainted in safety black and yellow.',
    works: ['Primer & gloss on steel', 'External wall paint', 'Kerb safety markings', 'Site clean-up'],
    photos: [
    { src: u('mtxeyFbPJQ51wJAiU9Mtsm/WhatsApp_Image_2026-10-09_at_16.30.35.jpg'), alt: 'Painter rolling red gloss onto the steel sliding door' }]

  },
  {
    id: 'handover',
    label: 'Handover',
    title: 'Completed & in use',
    status: 'done',
    summary:
    'Handed over and immediately put to work by the client’s team. The new store reads as part of the original facility — same colours, same rooflines, same detailing.',
    works: ['Final snagging', 'Door operation test', 'Client walkthrough', 'Store in daily use'],
    photos: [
    { src: u('wRujPVtydJeviSQuytfXtL/WhatsApp_Image_2026-10-09_at_16.41.10_2.jpg'), alt: 'Completed seasoning store beside warehouse FD2 with red sliding doors' },
    { src: u('9LHuEXPNWSXh4vfbMbDAZb/WhatsApp_Image_2026-10-09_at_16.41.09_2.jpg'), alt: 'Completed store with doors open and staff working inside' },
    { src: u('6fofsj3xME458AENU2htii/WhatsApp_Image_2026-10-09_at_16.41.09.jpg'), alt: 'Close view of the finished red steel sliding doors and kerb markings' }]

  }],

  videos: [
  { src: "/WhatsApp Video 2026-10-09 at 16.32.54 2.mp4", title: 'Site clip 1' },
  { src: "/WhatsApp Video 2026-10-09 at 16.32.54.mp4", title: 'Site clip 2' },
  { src: "/WhatsApp Video 2026-10-09 at 16.32.55 2.mp4", title: 'Site clip 3' },
  { src: "/WhatsApp Video 2026-10-09 at 16.32.55.mp4", title: 'Site clip 4' }],

  videoNote: 'Unedited clips our supervisor sent to the client during the build — the same updates every client receives.'
};

export const caseStudies: CaseStudy[] = [warehouse, seasoningStore];