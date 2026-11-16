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

const CV_URL = `${BASE}cv.pdf`;
const SOCROB_URL = 'https://socrob.github.io/';

const HERO = {
  eyebrow: 'Research Engineer · Robotics and Perception',
  lead: 'I build the perception and task skills that let service robots help people at home.',
  sub: 'Research Engineer and SocRob@Home Team Leader at the Institute for Systems and Robotics (ISR), Instituto Superior Técnico, working across perception, software and system integration.',
  photo: { src: 'hub/portrait', alt: 'Rodrigo Serra' },
};

const ABOUT = {
  title: 'Hands-on robotics, from the camera to the competition floor.',
  text: [
    'I studied Electrical and Computer Engineering at Instituto Superior Técnico, specialising in control and robotics, and started my career as a web developer. Since 2022 I have been a research engineer at the Institute for Systems and Robotics, where I became Head of Perception in 2023 and Team Leader of SocRob@Home in 2024.',
    'My work combines engineering with international collaboration, student mentoring and science communication. I co-designed the euROBIN Coopetition framework, take our robots to RoboCup, and regularly show them to schools and the public.',
  ],
  skills: ['Python', 'ROS 2', 'OpenCV', 'YOLO', 'SAM', 'RGB-D and 3D perception', 'Object detection and segmentation', 'Task state machines', 'Go', 'JavaScript and Nuxt', 'Linux', 'Team leadership'],
};

// Work and studies, one line each. The details are in the CV.
const BACKGROUND = [
  {
    when: 'Apr 2022 — Present', title: 'Research Engineer',
    org: 'Institute for Systems and Robotics (ISR) · Instituto Superior Técnico', url: 'https://isr.tecnico.ulisboa.pt/',
    text: 'Perception and task execution for service robots. Head of Perception since 2023 and SocRob@Home Team Leader since 2024.',
  },
  {
    when: 'Oct 2021 — Apr 2022', title: 'Junior Software Developer',
    org: 'Magycal · Almada', url: 'https://magycal.com/',
    text: 'Web backoffice and APIs for a media streaming platform, with Nuxt.js and Go.',
  },
  {
    when: '2014 — 2020', title: 'Integrated M.Sc. in Electrical and Computer Engineering',
    org: 'Instituto Superior Técnico, Universidade de Lisboa', url: 'https://tecnico.ulisboa.pt/',
    text: 'Systems, Decision and Control, and Robotics. Thesis on mosaicing with pan-tilt-zoom cameras.',
    link: { label: 'Thesis', url: 'https://fenix.tecnico.ulisboa.pt/cursos/meec/dissertacao/1409728525633020' },
  },
];

const PROJECTS = [
  {
    kicker: 'Oct 2022 — Present', title: 'euROBIN', cover: 'work/eurobin-brussels-2026-1',
    text: 'European network of excellence on AI-powered robotics. I co-designed its Coopetition framework and built the platform where teams share software and data.',
    links: [['Project website', 'https://www.eurobin-project.eu/'], ['Paper', doi('10.1109/RAP.2026.3733849')]],
  },
  {
    kicker: 'Sep 2022 — Present', title: 'SocRob@Home', cover: 'work/portugal-open-2026-team',
    text: 'ISR’s team for robots that help people at home, with podium finishes at RoboCup@Home in 2023 and 2024. I lead the team and develop its perception.',
    links: [['Team website and results', SOCROB_URL], ['YouTube channel', 'https://www.youtube.com/@socrob_home']],
  },
  {
    kicker: '2025 · Case study', title: 'SocRob@Home–Oracle pilot', coverUrl: `${BASE}illustrations/oracle-pilot.svg`,
    coverAlt: 'Diagram: a spoken instruction goes to a language model in the cloud, which sends a task plan to the robot',
    text: 'Pilot on cloud-hosted language models for robot task planning. I contributed to the collaboration and co-authored the case study.',
    links: [['Oracle case study', 'https://blogs.oracle.com/ai-and-datascience/ai-driven-task-motion-planning-service-robots-with-oci']],
  },
  {
    kicker: 'Apr 2022 — Oct 2022', title: 'DURABLE', cover: 'work/durable-solar-1',
    text: 'Robots that operate and maintain wind and solar farms. I worked on ground-robot navigation and on a drone that lands on a moving robot.',
    links: [['Project website', 'https://www.durableproject.eu/'], ['Paper', doi('10.3390/s23020829')]],
  },
];

const VIDEOS = [
  { label: 'RoboCup · 2027', title: 'RoboCup 2027 qualification video', cover: 'work/portugal-open-2026-2',
    text: 'SocRob@Home and our robot in action.', url: 'https://www.youtube.com/watch?v=yzsoa-J12Ks' },
  { label: 'euROBIN · Joint demonstration', title: 'euROBIN Parliament joint demo', cover: 'work/eurobin-brussels-2026-2',
    text: 'Our participation in the demonstration at the European Parliament.', url: 'https://www.youtube.com/watch?v=LpT9lbQYOMc' },
  { label: 'Interview · Digital EU', title: 'Domestic (Bob)', cover: 'work/bob-interview',
    text: 'On the present and future impact of robotics and AI, with our domestic robot.', url: 'https://www.youtube.com/watch?v=BaQrtOsDL7M' },
];

const OUTREACH = 'I also enjoy explaining what we do, from robot demonstrations for schools to the SIC documentary “Existe, IA Pensa”.';

const BEYOND = [
  { kicker: '2017 — 2021', title: 'Middle-distance running', cover: 'personal/running-race',
    text: 'Raced the 800 m and 1500 m at national level. National university champion over 1500 m in 2018/19.' },
  { kicker: 'Ongoing', title: 'Handpan and percussion', cover: 'personal/handpan',
    text: 'Percussionist and handpan player exploring Brazilian and Indian rhythms.' },
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
        el('a', { className: 'btn', href: '#projects', textContent: 'See my work' }),
        ext('CV (PDF)', CV_URL, 'btn'))),
    el('div', { className: 'stage' }))),

  section('about', 'About me', ABOUT.title, null,
    ...ABOUT.text.map((t) => el('p', { className: 'prose', textContent: t })),
    el('ul', { className: 'tags', ariaLabel: 'Main skills' }, ABOUT.skills.map((k) => el('li', { textContent: k })))),

  section('background', 'Background', 'Work and studies', null,
    el('div', { className: 'stack' }, BACKGROUND.map((x) => el('article', { className: 'panel edu' },
      el('span', { className: 'muted', textContent: x.when }),
      el('div', {}, el('h3', { textContent: x.title }), el('p', { className: 'org' }, ext(x.org, x.url)),
        el('p', {}, x.text, x.link ? ' ' : null, x.link ? ext(x.link.label + ' ↗', x.link.url) : null))))),
    el('p', { className: 'more' }, 'Publications, talks and training are in my CV. ', ext('Open the CV (PDF) ↗', CV_URL))),

  section('projects', 'Projects', 'Research projects with real robots.', null,
    el('div', { className: 'grid two' }, PROJECTS.map(card))),

  section('media', 'Media and outreach', 'See the team in action.', OUTREACH,
    el('div', { className: 'grid three' }, VIDEOS.map(videoCard)),
    el('p', { className: 'actions' },
      ext('SocRob@Home on YouTube ↗', 'https://www.youtube.com/@socrob_home', 'btn'),
      ext('SIC documentary ↗', 'https://sicnoticias.pt/video/2024-04-04-Grande-Reportagem-SIC-Existe-IA-Pensa--Parte-II--365e8f51', 'btn'))),

  section('beyond', 'Beyond work', 'Running and rhythm.', null,
    el('div', { className: 'grid three small' }, BEYOND.map(card))),

  section('contact', 'Contact', 'Let’s talk robots.',
    'Working on service robotics, robot perception or robotics competitions? I would be glad to hear from you.',
    el('p', { className: 'actions' }, PROFILE.links.map((l, i) => ext(l.label, l.url, i ? 'btn' : 'btn primary')), ext('CV (PDF)', CV_URL, 'btn'))),
);

// ---------------------------------------------------------------- top bar

const SECTIONS = [['about', 'About'], ['background', 'Background'], ['projects', 'Projects'], ['media', 'Media'], ['beyond', 'Beyond work'], ['contact', 'Contact']];
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
  const groups = ['.section .eyebrow, .section h2, .section .intro, .section .prose', '.stack > *', '.grid > *', '.tags', '.more', '.section > .container > .actions'];
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
