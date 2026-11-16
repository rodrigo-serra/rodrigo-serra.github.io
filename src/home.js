// The homepage: all of its wording and layout are in this file.
import './home.css';

const BASE = import.meta.env.BASE_URL;
const photoUrl = (name) => `${BASE}photos/${name}.jpg`;          // full size: only the fallback portrait
const thumbUrl = (name) => `${BASE}photos/${name}.thumb.jpg`;    // card size: everything else

const PROFILE = {
  name: 'Rodrigo Serra',
  links: [
    { label: 'GitHub', url: 'https://github.com/rodrigo-serra' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rodrigo-fserra' },
  ],
};

const doi = (d) => `https://doi.org/${d}`;

// ---------------------------------------------------------------- content

const HERO = {
  eyebrow: 'Research Engineer · Robotics and Perception',
  lead: 'I build the perception and task skills that let service robots see, follow and help people at home.',
  sub: 'Research Engineer and SocRob@Home Team Leader at the Institute for Systems and Robotics (ISR), Instituto Superior Técnico, working across perception, software and system integration.',
  photo: { src: 'hub/portrait', alt: 'Rodrigo Serra' },
};

const ABOUT = {
  title: 'Hands-on robotics, from the camera to the competition floor.',
  text: [
    'I studied Electrical and Computer Engineering at Instituto Superior Técnico, specialising in control and robotics, and started my career as a web developer. Since 2022 I have been a research engineer at the Institute for Systems and Robotics, where I became Head of Perception in 2023 and Team Leader of SocRob@Home in 2024.',
    'My work combines engineering with international collaboration, student mentoring and science communication: I co-designed the euROBIN Coopetition framework, take our robots to RoboCup, and regularly show them to schools and the public.',
  ],
};

const EXPERIENCE = [
  {
    role: 'Research Engineer', when: 'Apr 2022 — Present',
    org: 'Institute for Systems and Robotics (ISR) · Instituto Superior Técnico', url: 'https://isr.tecnico.ulisboa.pt/',
    points: [
      'Develop perception, person tracking and recognition, and task execution for service robots. Integrate navigation and multi-robot cooperation, and contribute to the ROS 1 to ROS 2 migration.',
      'Head of Perception since 2023 and Team Leader since 2024: coordinate development, testing and competitions, and mentor bachelor’s and master’s students.',
      'Co-designed the euROBIN Coopetition framework and built its Nuxt-based platform for sharing software and data.',
      'Diagnose hardware, sensor, control and communication faults on TIAGo robots, and coordinate maintenance with PAL Robotics.',
    ],
  },
  {
    role: 'Junior Software Developer', when: 'Oct 2021 — Apr 2022',
    org: 'Magycal · Almada', url: 'https://magycal.com/',
    points: [
      'Developed the web backoffice and APIs of an over-the-top (OTT) media platform with Nuxt.js and Go.',
      'Built and maintained client websites, including online stores, with WordPress, OpenCart, HTML, CSS and JavaScript.',
    ],
  },
];

const SKILLS = [
  ['Perception', 'OpenCV, YOLO, SAM, RGB-D and 3D perception, object detection and segmentation, person tracking, re-identification, face recognition'],
  ['Robotics', 'ROS 1 and ROS 2, task state machines with YASMIN, integration of perception and task execution, RGB-D cameras and LiDAR, coordinate frames, fault diagnosis'],
  ['Software', 'Python, Go, JavaScript, C, MATLAB, SQL, Nuxt.js, HTML and CSS, Linux, Git, LaTeX, Roboflow'],
  ['Leadership and communication', 'Team leadership, technical planning, student mentoring, international collaboration, science outreach, photography and video. Portuguese (native), English (C2)'],
];

const PROJECTS = [
  {
    kicker: 'Oct 2022 — Present', title: 'euROBIN', cover: 'work/eurobin-brussels-2026-1',
    text: 'European network of excellence on AI-powered robotics, focused on making robotics methods transfer across robots and labs. I co-designed its Coopetition framework, tasks and scoring, built the Nuxt platform where teams share software and data, and coordinate integration with partner teams.',
    links: [['Project website', 'https://www.eurobin-project.eu/'], ['Paper', doi('10.1109/RAP.2026.3733849')]],
  },
  {
    kicker: 'Sep 2022 — Present', title: 'SocRob@Home', cover: 'work/portugal-open-2026-team',
    text: 'ISR team developing robots that assist people at home, evaluated at RoboCup@Home. I develop perception and person following, reusable ROS 2 interfaces and task state machines on TIAGo robots, and lead integration, testing and competition preparation.',
    links: [['Team website', 'https://irs-group.github.io/socrobwebsite/'], ['YouTube channel', 'https://www.youtube.com/@socrob_home']],
  },
  {
    kicker: '2025 · Case study', title: 'SocRob@Home–Oracle pilot', coverUrl: `${import.meta.env.BASE_URL}illustrations/oracle-pilot.svg`,
    coverAlt: 'Diagram: a spoken instruction goes to a language model in the cloud, which sends a task plan to the robot',
    text: 'Pilot evaluating cloud-hosted language models and LangGraph for robot task planning, alongside reinforcement learning for whole-body control with NVIDIA Isaac Lab. I contributed to the collaboration and co-authored the technical case study.',
    links: [['Oracle case study', 'https://blogs.oracle.com/ai-and-datascience/ai-driven-task-motion-planning-service-robots-with-oci']],
  },
  {
    kicker: 'Apr 2022 — Oct 2022', title: 'DURABLE', cover: 'work/durable-solar-1',
    text: 'Multi-partner project using robots to operate and maintain wind and solar farms. I developed ground-robot navigation and cooperative behaviours, and contributed to research on a drone that follows and lands on a moving ground robot.',
    links: [['Project website', 'https://www.durableproject.eu/'], ['Paper', doi('10.3390/s23020829')]],
  },
];

// [event, place, result, podium?]
const EVENTS = [
  ['2026', [
    ['RoboCup@Home, Open Platform League', 'Incheon, South Korea', '10th of 26', false],
    ['RoboCup@Home team poster', 'Incheon, South Korea', '2nd place', true],
    ['RoboCup Portugal Open', 'Barcelos, Portugal', '3rd place', true],
    ['euROBIN European Parliament demo', 'Brussels, Belgium', 'Demonstration', false],
  ]],
  ['2024', [
    ['euROBIN Coopetition', 'Nancy, France', '3rd place', true],
    ['RoboCup@Home, Open Platform League', 'Eindhoven, Netherlands', '3rd place', true],
    ['RoboCup Portugal Open', 'Paredes de Coura, Portugal', '2nd place', true],
    ['LARSyS pitch presentation', 'LARSyS annual meeting', 'Best pitch', true],
    ['European Robotics Forum', 'Rimini, Italy', 'Presentation', false],
  ]],
  ['2023', [
    ['RoboCup@Home, Open Platform League', 'Bordeaux, France', '2nd place · Best GPSR', true],
    ['RoboCup Portugal Open', 'Tomar, Portugal', '2nd place', true],
    ['euROBIN Hackathon', 'Seville, Spain', 'Joint demo', false],
  ]],
];

const EVENT_PHOTOS = [
  ['work/robocup-2023-podium', 'RoboCup 2023, Bordeaux'],
  ['work/eurobin-nancy-2024-arena', 'euROBIN Coopetition 2024, Nancy'],
  ['work/robocup-2024-team', 'RoboCup 2024, Eindhoven'],
];

const VIDEOS = [
  { label: 'RoboCup · 2027', title: 'RoboCup 2027 qualification video', cover: 'work/portugal-open-2026-2',
    text: 'SocRob@Home and our robot in action.', url: 'https://www.youtube.com/watch?v=yzsoa-J12Ks' },
  { label: 'euROBIN · Joint demonstration', title: 'euROBIN Parliament joint demo', cover: 'work/eurobin-brussels-2026-2',
    text: 'Our participation in the demonstration at the European Parliament.', url: 'https://www.youtube.com/watch?v=LpT9lbQYOMc' },
  { label: 'Interview · Digital EU', title: 'Domestic (Bob)', cover: 'work/bob-interview',
    text: 'On the present and future impact of robotics and AI, with our domestic robot.', url: 'https://www.youtube.com/watch?v=BaQrtOsDL7M' },
];

const OUTREACH = 'I also enjoy explaining what we do: robot demonstrations for schools, European Researchers’ Night at Pavilhão do Conhecimento, JEEC and Técnico Day. I run the team’s Instagram and LinkedIn, and in 2024 we appeared in the SIC documentary “Existe, IA Pensa”.';

const PUBLICATIONS = [
  ['R. Serra, C. Azevedo, A. Silva, K. Alcedo, Q. Rouxel, P. So, A. Suarez, A. Albu-Schaeffer, P. U. Lima', 'Transferability Through Cooperative Competitions', 'IEEE Robotics and Automation Practice, 2026 (early access)', '10.1109/RAP.2026.3733849'],
  ['P. U. Lima, C. Azevedo, R. Serra', 'Robot Contests as a Catalyst for Robotics Science', 'Annual Review of Control, Robotics, and Autonomous Systems, vol. 9, 2026', '10.1146/annurev-control-022624-012944'],
  ['A. Suarez et al. (co-author: R. Serra)', 'Door-to-Door Parcel Delivery From Supply Point to User’s Home With Heterogeneous Robot Team: The euROBIN First-Year Robotics Hackathon', 'IEEE Robotics & Automation Magazine, vol. 32, no. 3, 2025', '10.1109/MRA.2024.3501954'],
  ['R. Bettencourt, R. Serra, P. U. Lima, A. Vale', 'Comparison of Different LiDAR Sensors in SLAM: Criteria Formulation and Results', 'IEEE ICARSC, 2025', '10.1109/icarsc65809.2025.10970156'],
  ['R. Bettencourt, C. Caramalho, G. Nunes, R. Serra, A. Vale, P. U. Lima', 'Indoor 2.5D Navigation for Ground Robots', 'IEEE ICARSC, 2025', '10.1109/ICARSC65809.2025.10970157'],
  ['R. Bettencourt, J. Lewis, R. Serra, M. Basiri, A. Vale, P. U. Lima', 'GEERS: Georeferenced Enhanced EKF Using Point Cloud Registration and Segmentation', 'IEEE Robotics and Automation Letters, vol. 9, no. 2, 2024', '10.1109/lra.2024.3349828'],
  ['J. Morales, I. Castelo, R. Serra, P. U. Lima, M. Basiri', 'Vision-Based Autonomous Following of a Moving Platform and Landing for an Unmanned Aerial Vehicle', 'Sensors, vol. 23, no. 2, 2023', '10.3390/s23020829'],
];

const EDUCATION = [
  {
    when: '2014 — 2020', title: 'Integrated M.Sc. in Electrical and Computer Engineering', org: 'Instituto Superior Técnico, Universidade de Lisboa',
    text: 'Fields of study: Systems, Decision and Control, and Robotics. Thesis: Mosaicing with Pan-Tilt-Zoom Cameras.',
    link: { label: 'Thesis', url: 'https://fenix.tecnico.ulisboa.pt/cursos/meec/dissertacao/1409728525633020' },
  },
  {
    when: 'Sep 2023', title: 'EASE Fall School', org: 'University of Bremen, Germany',
    text: 'Training in cognition-enabled robot manipulation (3 ECTS).',
  },
  {
    when: 'Sep 2023 — Apr 2024', title: 'Elite Life Coach, Level 5 accredited training', org: 'Evolve Life Coaching College, London',
    text: 'Accredited by the International Authority for Professional Coaching & Mentoring (IAPC&M).',
  },
];

const BEYOND = [
  { kicker: '2017 — 2021', title: 'Middle-distance running', cover: 'personal/running-race',
    text: 'Raced the 800 m and 1500 m at national championships. National university champion over 1500 m in 2018/19, and assistant coach for under-18 and under-20 athletes.' },
  { kicker: 'Ongoing', title: 'Handpan and percussion', cover: 'personal/handpan',
    text: 'Percussionist and handpan player exploring Brazilian and Indian rhythms, with performances at community gatherings.' },
  { kicker: 'Aug 2023 · Olón, Ecuador', title: 'Volunteering', cover: 'personal/ecuador-2',
    text: 'Four weeks helping to build and maintain an eco-home.' },
];

// ---------------------------------------------------------------- rendering

const el = (tag, props = {}, ...kids) => {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids.flat().filter((k) => k != null));
  return e;
};
const ext = (label, url, cls = '') => el('a', { href: url, target: '_blank', rel: 'noopener', textContent: label, className: cls });

function card(c) {
  return el('article', { className: 'card' },
    el('div', { className: 'card-cover' }, el('img', { src: c.coverUrl ?? thumbUrl(c.cover), alt: c.coverAlt ?? '', loading: 'lazy' })),
    el('div', { className: 'card-body' },
      el('span', { className: 'kicker', textContent: c.kicker }),
      el('h3', { className: 'card-title', textContent: c.title }),
      el('p', { className: 'card-summary', textContent: c.text }),
      c.links ? el('p', { className: 'chips' }, c.links.map(([label, url]) => ext(label + ' ↗', url, 'chip'))) : null));
}

function videoCard(v) {
  const a = el('a', { className: 'card video', href: v.url, target: '_blank', rel: 'noopener' },
    el('div', { className: 'card-cover' }, el('img', { src: thumbUrl(v.cover), alt: '', loading: 'lazy' }), el('span', { className: 'play', ariaHidden: 'true', textContent: '▶' })),
    el('div', { className: 'card-body' },
      el('span', { className: 'kicker', textContent: v.label }),
      el('h3', { className: 'card-title', textContent: v.title }),
      el('p', { className: 'card-summary', textContent: v.text }),
      el('span', { className: 'card-action', textContent: 'Watch on YouTube ↗' })));
  return a;
}

function section(id, eyebrow, title, intro, ...body) {
  return el('section', { id, className: 'section' }, el('div', { className: 'container' },
    el('p', { className: 'eyebrow', textContent: eyebrow }),
    el('h2', { textContent: title }),
    intro ? el('p', { className: 'intro', textContent: intro }) : null,
    ...body));
}

const main = document.querySelector('main');
main.append(
  el('section', { id: 'home', className: 'hero' }, el('div', { className: 'container hero-grid' },
    el('div', {},
      el('p', { className: 'eyebrow', textContent: HERO.eyebrow }),
      el('h1', { textContent: PROFILE.name }),
      el('p', { className: 'lead', textContent: HERO.lead }),
      el('p', { className: 'sub', textContent: HERO.sub }),
      el('p', { className: 'actions' },
        el('a', { className: 'btn primary', href: '#contact', textContent: 'Get in touch' }),
        el('a', { className: 'btn', href: '#projects', textContent: 'See my work' }))),
    el('div', { className: 'stage' }))),

  section('about', 'About me', ABOUT.title, null, ...ABOUT.text.map((t) => el('p', { className: 'prose', textContent: t }))),

  section('experience', 'Experience', 'Work and research history', null,
    el('div', { className: 'stack' }, EXPERIENCE.map((x) => el('article', { className: 'panel' },
      el('div', { className: 'role-head' }, el('h3', { textContent: x.role }), el('span', { className: 'muted', textContent: x.when })),
      el('p', { className: 'org' }, ext(x.org, x.url)),
      el('ul', {}, x.points.map((p) => el('li', { textContent: p }))))))),

  section('skills', 'Skills', 'Tools for robots that work outside the lab.', null,
    el('div', { className: 'grid two' }, SKILLS.map(([name, text]) => el('article', { className: 'panel' }, el('h3', { textContent: name }), el('p', { textContent: text }))))),

  section('projects', 'Projects and research', 'Research projects with real robots.',
    'Selected projects in domestic service robotics, European collaboration and field robotics.',
    el('div', { className: 'grid two' }, PROJECTS.map(card))),

  section('competitions', 'Competitions and events', 'Where the work gets tested in public.', null,
    el('div', { className: 'photos' }, EVENT_PHOTOS.map(([src, cap]) => el('figure', {}, el('img', { src: thumbUrl(src), alt: '', loading: 'lazy' }), el('figcaption', { textContent: cap })))),
    EVENTS.map(([year, rows]) => el('div', { className: 'year' },
      el('h3', { textContent: year }),
      el('ul', { className: 'rows' }, rows.map(([name, place, result, podium]) => el('li', {},
        el('span', {}, el('strong', { textContent: name }), el('span', { className: 'muted', textContent: place })),
        el('span', { className: podium ? 'badge podium' : 'badge', textContent: result }))))))),

  section('media', 'Media and outreach', 'See the team in action.', OUTREACH,
    el('div', { className: 'grid three' }, VIDEOS.map(videoCard)),
    el('p', { className: 'actions' },
      ext('SocRob@Home on YouTube ↗', 'https://www.youtube.com/@socrob_home', 'btn'),
      ext('SIC documentary ↗', 'https://sicnoticias.pt/video/2024-04-04-Grande-Reportagem-SIC-Existe-IA-Pensa--Parte-II--365e8f51', 'btn'))),

  section('publications', 'Publications', 'Journal and conference papers', null,
    el('ol', { className: 'pubs' }, PUBLICATIONS.map(([authors, title, venue, d]) => el('li', {},
      ext(title, doi(d), 'pub-title'), el('span', { className: 'pub-authors', textContent: authors }), el('span', { className: 'muted', textContent: venue }))))),

  section('education', 'Education', 'Academic background and training', null,
    el('div', { className: 'stack' }, EDUCATION.map((x) => el('article', { className: 'panel edu' },
      el('span', { className: 'muted', textContent: x.when }),
      el('div', {}, el('h3', { textContent: x.title }), el('p', { className: 'org', textContent: x.org }),
        el('p', {}, x.text, x.link ? ' ' : null, x.link ? ext(x.link.label + ' ↗', x.link.url) : null)))))),

  section('beyond', 'Beyond work', 'Running and rhythm.', null,
    el('div', { className: 'grid three small' }, BEYOND.map(card))),

  section('contact', 'Contact', 'Let’s talk robots.',
    'Working on service robotics, robot perception or robotics competitions? I would be glad to hear from you.',
    el('p', { className: 'actions' }, PROFILE.links.map((l, i) => ext(l.label, l.url, i ? 'btn' : 'btn primary')))),
);

// ---------------------------------------------------------------- top bar

const SECTIONS = [['about', 'About'], ['experience', 'Experience'], ['skills', 'Skills'], ['projects', 'Projects'], ['competitions', 'Competitions'], ['media', 'Media'],
  ['publications', 'Publications'], ['education', 'Education'], ['beyond', 'Beyond work'], ['contact', 'Contact']];
const nav = document.querySelector('#nav');
nav.append(...SECTIONS.map(([id, name]) => el('a', { href: `#${id}`, textContent: name })));
const menuBtn = document.querySelector('#menu');
const setMenu = (open) => { nav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); };
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

const root = document.documentElement;
document.querySelector('#theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch { /* private mode */ }
});

// ---------------------------------------------------------------- motion

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero: a 3D scene fills the header. While its models download, the spot where the figures
// will stand shows a progress bar. The portrait photo is only a fallback: it is added to the
// page (and downloaded) only if the device cannot show the scene.
function canWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
const hero = document.querySelector('.hero'), stage = document.querySelector('.stage');
function showPhoto() {
  if (stage.querySelector('img')) return;
  stage.replaceChildren(el('img', { src: photoUrl(HERO.photo.src), alt: HERO.photo.alt, width: 1200, height: 1600, draggable: false }));
  stage.classList.add('portrait');
}
if (canWebGL() && !navigator.connection?.saveData) {
  const fill = el('i');
  const bar = el('div', { className: 'bar', role: 'progressbar', ariaLabel: 'Loading the 3D scene', ariaValueMin: '0', ariaValueMax: '100', ariaValueNow: '0' }, fill);
  const loader = el('div', { className: 'loader' }, el('span', { textContent: 'Loading Rodrigo’s world…' }), bar);
  stage.append(loader);
  // The first 10% is the scene's code arriving, the rest the two models.
  const progress = (f) => { const pct = Math.round(Math.min(1, f) * 100); fill.style.width = `${pct}%`; bar.ariaValueNow = String(pct); };
  progress(0.04);
  const giveUp = setTimeout(showPhoto, 20000);      // very slow connection: show the photo meanwhile
  import('./hero/scene.js')
    .then((m) => { progress(0.1); return m.mountHero(hero, stage, (f) => progress(0.1 + f * 0.9)); })
    .then(() => requestAnimationFrame(() => {
      clearTimeout(giveUp);
      stage.classList.remove('portrait');
      stage.replaceChildren();                      // drop the bar (and the photo, if it was shown)
      hero.classList.add('ready');
    }))
    .catch((err) => { clearTimeout(giveUp); showPhoto(); console.warn('3D hero unavailable, showing the photo.', err); });
} else {
  showPhoto();
}

// Sections and cards rise in as they scroll into view; siblings follow one after another.
if (!reduced && 'IntersectionObserver' in window) {
  root.classList.add('anim');
  const groups = ['.section .eyebrow, .section h2, .section .intro, .section .prose', '.stack > *', '.grid > *', '.photos > *', '.year', '.pubs li', '.section > .container > .actions'];
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  for (const sel of groups) {
    document.querySelectorAll(sel).forEach((n) => {
      const i = [...n.parentElement.children].indexOf(n);
      n.classList.add('reveal');
      n.style.setProperty('--d', `${Math.min(i, 6) * 70}ms`);
      io.observe(n);
    });
  }
}

// Highlight the section being read in the top bar.
const links = new Map([...nav.querySelectorAll('a')].map((a) => [a.hash.slice(1), a]));
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    links.forEach((a) => a.classList.remove('active'));
    links.get(e.target.id)?.classList.add('active');
  }
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main > section').forEach((s) => spy.observe(s));
