import { SITE, PROGRAMS } from '../data/site.mjs';

export const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const prefixFor = (route) => '../'.repeat(route.split('/').filter(Boolean).length);
export const localHref = (prefix, route = '') => `${prefix}${route ? `${route}/` : 'index.html'}`;

const brand = (prefix) => `<a class="brand" href="${localHref(prefix)}" aria-label="Helvetic Institute of Technology home">
  <img src="${prefix}${SITE.logo}" width="150" height="60" alt="Helvetic Institute of Technology">
</a>`;

export function header(prefix, active = '') {
  const item = (label, route) => `<a href="${localHref(prefix, route)}"${route === active ? ' aria-current="page"' : ''}>${label}</a>`;
  const group = (number, title, routes) => {
    const open = routes.some(([, route]) => route === active);
    return `<section class="menu-group${open ? ' is-open' : ''}" data-menu-group><button class="menu-group__toggle" type="button" aria-expanded="${open ? 'true' : 'false'}"><span>${number}</span><strong>${title}</strong><i aria-hidden="true"></i></button><div class="menu-group__panel" aria-hidden="${open ? 'false' : 'true'}"><div>${routes.map(([label, route]) => item(label, route)).join('')}</div></div></section>`;
  };
  return `<header class="site-header" data-header>
    <div class="site-header__progress" aria-hidden="true"><span></span></div>
    <div class="site-header__inner">${brand(prefix)}<nav class="desktop-nav" aria-label="Primary navigation">${item('Programs', 'programs')}${item('Program tools', 'tools/program-signal')}${item('Admissions', 'admissions')}${item('Student support', 'student-services')}${item('Fees', 'financing/fees-expenses')}</nav><div class="header-actions"><a class="header-brochure" href="${SITE.brochureUrl}">Request brochure</a><a class="header-cta" href="${SITE.applyUrl}" data-magnetic data-cursor="Apply">Apply <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-open><span>Menu</span><b aria-hidden="true"><i></i><i></i></b></button></div></div>
  </header>
  <aside class="menu" role="dialog" aria-modal="true" aria-label="Website navigation" aria-hidden="true" data-menu><div class="menu__head">${brand(prefix)}<button type="button" aria-label="Close menu" data-menu-close><span>Close</span><i aria-hidden="true">×</i></button></div><nav class="menu-accordion" aria-label="Full website navigation">
    ${group('01', 'Institute', [['About', 'institute'], ['Faculty', 'faculty'], ['Governance', 'governance'], ['FAQ', 'faq'], ['Policies', 'policies']])}
    ${group('02', 'Programs', [['View all programs', 'programs'], ['Bachelor in Artificial Intelligence', 'programs/bachelor-in-artificial-intelligence'], ['Bachelor in Cybersecurity', 'programs/bachelor-in-cybersecurity'], ['Bachelor in Blockchain', 'programs/bachelor-in-blockchain'], ['Master in Artificial Intelligence', 'programs/master-in-artificial-intelligence'], ['Master in Cybersecurity', 'programs/master-in-cybersecurity'], ['Master in Blockchain', 'programs/master-in-blockchain']])}
    ${group('03', 'Decision tools', [['Program Signal — find your direction', 'tools/program-signal'], ['Program Matrix — compare degrees', 'tools/program-matrix'], ['Study Cost Model — plan in CHF', 'tools/study-cost-model']])}
    ${group('04', 'Students', [['Student support', 'student-services'], ['Student community', 'students'], ['Campus life', 'campus-life']])}
    ${group('05', 'Career impact', [['Career outcomes', 'career-impact'], ['Institutional development', 'institutional-development'], ['Alumni', 'alumni']])}
    ${group('06', 'Admissions & Financing', [['Admissions', 'admissions'], ['International student support', 'student-services'], ['Fees & expenses', 'financing/fees-expenses'], ['Scholarships', 'financing/scholarships'], ['Contact us', 'contact']])}
  </nav></aside><div class="menu-scrim" data-menu-scrim></div>`;
}

export function footer(prefix) {
  return `<footer class="site-footer"><div class="shell footer-main"><div>${brand(prefix)}<p>Developing future leaders on the shores of Lake Geneva.</p></div><div><span class="label">Visit us</span><address>${SITE.address.join('<br>')}</address></div><div><span class="label">Contact</span><a href="mailto:info@helvetictech.ch">info@helvetictech.ch</a><a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a><a href="${localHref(prefix, 'contact')}">Contact us</a></div><div><span class="label">Quick links</span><a href="${localHref(prefix, 'admissions')}">Admissions</a><a href="${localHref(prefix, 'tools/program-signal')}">Program tools</a><a href="${localHref(prefix, 'financing/fees-expenses')}">Fees &amp; expenses</a><a href="${localHref(prefix, 'financing/scholarships')}">Scholarships</a></div></div><div class="shell footer-bottom"><span>Helvetic Institute of Technology</span><span>La Tour-de-Peilz · Switzerland</span><a href="https://www.helvetictech.ch/privacy">Privacy policy</a></div></footer>`;
}

/* --------------------------------------------------------------- primitives */

const heading = (label, plain, italic) => `<div class="shell chapter-heading reveal"><p class="label">${esc(label)}</p><h2><span>${esc(plain)}</span><em>${esc(italic)}</em></h2></div>`;

const ctaBand = (label, plain, italic, href) => `<section class="final-cta" data-chapter="${esc(label)}"><span class="registration-mark" aria-hidden="true"></span><div class="shell"><p class="label reveal">${esc(label)}</p><h2 class="reveal"><a href="${href}" data-magnetic data-cursor="Apply"><span>${esc(plain)}</span><em>${esc(italic)}</em><i>↗</i></a></h2></div></section>`;

const nextBand = (label, title, href) => `<section class="next-band" data-chapter="${esc(label)}"><a class="shell next-band__link reveal" href="${href}"><span class="label">${esc(label)}</span><strong>${esc(title)}</strong><i aria-hidden="true">↗</i></a></section>`;

const decisionToolsBand = (prefix) => `<section class="decision-tools-band chapter" data-chapter="Decision tools"><div class="shell"><div class="decision-tools-band__head reveal"><p class="label">Decision tools</p><h2><span>Move from interest</span><em>to a clear plan.</em></h2><p>Match your direction, compare the details, then model the published study costs in CHF.</p></div><div class="decision-tools-grid"><a class="decision-tool-card decision-tool-card--signal reveal" href="${localHref(prefix, 'tools/program-signal')}"><span>01 · Match</span><strong>Program Signal</strong><p>Three focused questions produce a ranked HIT program shortlist.</p><i aria-hidden="true">↗</i></a><a class="decision-tool-card decision-tool-card--matrix reveal" href="${localHref(prefix, 'tools/program-matrix')}"><span>02 · Compare</span><strong>Program Matrix</strong><p>Place up to three programs side by side and expose the differences.</p><i aria-hidden="true">↗</i></a><a class="decision-tool-card decision-tool-card--cost reveal" href="${localHref(prefix, 'tools/study-cost-model')}"><span>03 · Plan</span><strong>Study Cost Model</strong><p>Build an indicative CHF scenario from published tuition and living costs.</p><i aria-hidden="true">↗</i></a></div></div></section>`;

const valueLedger = (items) => `<div class="shell value-ledger">${items.map((item, index) => `<article class="value-row reveal"><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></article>`).join('')}</div>`;

/* ------------------------------------------------------------ hero variants */

// Full-bleed image hero: the photograph is a background, never a panel set
// beside the copy. Scrim keeps the headline legible over the image.
const heroMedia = ({ prefix, label, plain, italic, lead, image, alt }) => `<section class="page-hero hero-media dark">
  <figure class="hero-media__bg"><img src="${prefix}assets/images/${image}" alt="${esc(alt)}" decoding="async" fetchpriority="high"></figure>
  <span class="hero-media__scrim" aria-hidden="true"></span>
  <div class="shell hero-media__inner">
    <div class="hero-media__copy"><p class="label reveal">${esc(label)}</p><h1 class="reveal"><span>${esc(plain)}</span><em>${esc(italic)}</em></h1><p class="hero-lead reveal">${esc(lead)}</p>
    <div class="hero-media__actions reveal"><a class="button-primary" href="${SITE.applyUrl}">Start your application <span>↗</span></a><a class="button-secondary" href="${localHref(prefix, 'admissions')}">Admissions <span>↗</span></a></div></div>
  </div>
</section>`;

const heroCompact = ({ prefix, label, plain, italic, lead, image, alt }) => `<section class="page-hero hero-media hero-compact dark">
  <figure class="hero-media__bg"><img src="${prefix}assets/images/${image}" alt="${esc(alt)}" fetchpriority="high" decoding="async"></figure>
  <span class="hero-media__scrim" aria-hidden="true"></span>
  <div class="shell hero-compact__inner"><div class="hero-media__copy"><p class="label reveal">${esc(label)}</p><h1 class="reveal"><span>${esc(plain)}</span><em>${esc(italic)}</em></h1><p class="hero-lead reveal">${esc(lead)}</p></div></div>
</section>`;

const ICON = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h13"/><path d="m12.5 6.5 6 5.5-6 5.5"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5H6.5A2.5 2.5 0 0 0 4 21Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19"/></svg>',
};

/* -------------------------------------------------------------- section kit */

const split = ({ num, label, title, body, id = '' }) => `<section class="split-section" data-chapter="${esc(label)}"${id ? ` id="${id}"` : ''}>
  <div class="shell split">
    <aside class="split__aside reveal"><span class="split__num">${esc(num)}</span><p class="label">${esc(label)}</p></aside>
    <div class="split__main"><h2 class="split__title reveal">${esc(title)}</h2><p class="split__body reveal">${esc(body)}</p></div>
  </div>
</section>`;

const editorialCols = ({ label, title, paras }) => `<section class="chapter"><div class="shell editorial">
  <p class="label reveal editorial__label">${esc(label)}</p>
  <h2 class="editorial__title reveal">${esc(title)}</h2>
  <div class="editorial__cols reveal">${paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
</div></section>`;

const pullQuote = (text) => `<section class="quote-section"><div class="shell reveal"><blockquote class="pull-quote"><p>${esc(text)}</p></blockquote></div></section>`;

const timeline = (items) => `<div class="shell timeline">${items.map((item, i) => `<article class="timeline__item reveal"><span class="timeline__index">${String(i + 1).padStart(2, '0')}</span><div class="timeline__body"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></article>`).join('')}</div>`;

const indexList = (rows) => `<div class="shell index-list">${rows.map((row, i) => {
  const num = `<span class="index-row__num">${String(i + 1).padStart(2, '0')}</span>`;
  const meta = row.meta ? `<span class="index-row__meta">${esc(row.meta)}</span>` : '';
  if (!row.href) return `<div class="index-row reveal">${num}<strong>${esc(row.title)}</strong>${meta}</div>`;
  const attrs = row.external ? ' target="_blank" rel="noopener"' : '';
  return `<a class="index-row reveal" href="${row.href}"${attrs} data-cursor="${esc(row.cursor || 'View')}">${num}<strong>${esc(row.title)}</strong>${meta}<i aria-hidden="true">↗</i></a>`;
}).join('')}</div>`;

const cardGrid = ({ items, className = '', numbered = false }) => `<div class="shell card-grid${className ? ` ${className}` : ''}">${items.map((item, index) => `<article class="card reveal">${numbered ? `<span class="card__index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>` : ''}${item.tag ? `<span class="card__tag">${esc(item.tag)}</span>` : ''}<h3>${esc(item.title)}</h3>${item.text ? `<p>${esc(item.text)}</p>` : ''}</article>`).join('')}</div>`;

const mediaFeature = ({ prefix, img, alt, caption, eyebrow, title, text }) => `<section class="chapter media-section dark"><div class="shell media-grid"><figure class="media-grid__figure reveal" data-media-hover><img src="${prefix}assets/images/${img}" alt="${esc(alt)}" data-parallax="0.45"><figcaption>${esc(caption)}</figcaption></figure><div class="media-grid__copy reveal">${eyebrow ? `<p class="label">${esc(eyebrow)}</p>` : ''}<h2>${esc(title)}</h2><p>${esc(text)}</p></div></div></section>`;

const carousel = ({ label, title, items }) => `<div class="shell carousel reveal" data-carousel>
  <div class="carousel__head"><div>${label ? `<p class="label">${esc(label)}</p>` : ''}${title ? `<h2 class="carousel__title">${esc(title)}</h2>` : ''}</div><div class="carousel__nav"><button type="button" data-carousel-prev aria-label="Previous">←</button><button type="button" data-carousel-next aria-label="Next">→</button></div></div>
  <div class="carousel__track" data-carousel-track>${items.map((item) => `<article class="carousel__item">${item.tag ? `<span class="card__tag">${esc(item.tag)}</span>` : ''}<h3>${esc(item.title)}</h3>${item.text ? `<p>${esc(item.text)}</p>` : ''}${item.href ? `<a class="line-link" href="${item.href}">${esc(item.linkLabel || 'Explore')} <span>↗</span></a>` : ''}</article>`).join('')}</div>
</div>`;

const factStrip = (items) => `<div class="shell fact-strip">${items.map((item) => `<div class="fact reveal"><strong>${esc(item.title)}</strong><span>${esc(item.text)}</span></div>`).join('')}</div>`;

const docList = (items) => `<div class="shell doc-list reveal">${items.map((item) => `<span>${esc(item)}</span>`).join('')}</div>`;

const accordionStack = (items) => `<div class="shell accordion-stack reveal">${items.map((item) => `<div class="accordion" data-accordion><button type="button" aria-expanded="false">${esc(item.title)} <span>+</span></button><div><p>${esc(item.text)}</p></div></div>`).join('')}</div>`;

const policyIndex = (groups) => `<div class="shell policy-index">${groups.map((group) => `<section class="policy-group reveal"><p class="label">${esc(group.title)}</p><ul>${group.items.map((item) => `<li><span>${esc(item)}</span><i aria-hidden="true">↗</i></li>`).join('')}</ul></section>`).join('')}</div>`;

const faqGroups = (groups) => `<section class="chapter faq" data-chapter="Questions"><div class="shell faq-inner" data-tabset>
  <aside class="faq-aside reveal">
    <p class="label">Questions</p>
    <h2 class="faq-title"><span>Questions,</span><em>answered.</em></h2>
    <label class="faq-search"><input type="search" data-faq-search placeholder="Search questions" aria-label="Search frequently asked questions" autocomplete="off"></label>
    <div class="faq-tabs" role="tablist" aria-label="FAQ categories">${groups.map((group, i) => `<button class="${i === 0 ? 'is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-tab="${esc(group.id)}"><span>${esc(group.title)}</span><b>${String(group.items.length).padStart(2, '0')}</b></button>`).join('')}</div>
  </aside>
  <div class="faq-panels">${groups.map((group, i) => `<div role="tabpanel" data-panel="${esc(group.id)}"${i === 0 ? '' : ' hidden'}>${group.items.map((item) => `<div class="accordion" data-accordion><button type="button" aria-expanded="false">${esc(item.q)} <span>+</span></button><div><p>${esc(item.a)}</p></div></div>`).join('')}</div>`).join('')}<p class="faq-empty" hidden data-faq-empty>No questions match your search.</p></div>
</div></section>`;

const scrollStory = (chapters, label = 'Career outcomes', plain = 'Your career', italic = 'starts here') => `<section class="story chapter" id="story">
  <div class="shell chapter-heading reveal"><p class="label">${esc(label)}</p><h2><span>${esc(plain)}</span><em>${esc(italic)}</em></h2></div>
  <div class="shell story-layout">
    <aside class="story-index" aria-hidden="true"><span class="story-index__now" data-story-now>${chapters[0] ? chapters[0].number : '01'}</span><span class="story-index__total">/ ${String(chapters.length).padStart(2, '0')}</span><span class="story-index__track"><i data-story-bar></i></span></aside>
    <div class="story-chapters" data-story>
      ${chapters.map((chapter) => `<article class="story-chapter reveal" data-story-chapter="${esc(chapter.number)}">
        <p class="story-chapter__label"><span>${esc(chapter.number)}</span>${esc(chapter.label)}</p>
        <h3>${esc(chapter.title)}</h3>
        <p>${esc(chapter.text)}</p>
      </article>`).join('')}
    </div>
  </div>
</section>`;

/* -------------------------------------------------------------------- home */

const pathwayImage = (prefix, program) => `${prefix}assets/images/pathway-${program.level.toLowerCase()}-${program.discipline}.webp`;

const programRows = (prefix) => PROGRAMS.map((program) => {
  const href = program.local ? localHref(prefix, program.href) : program.href;
  return `<a class="program-row reveal" href="${href}" data-level="${program.level.toLowerCase()}" data-preview="${pathwayImage(prefix, program)}" data-cursor="View"><span class="program-row__number">/${program.number}</span><span class="program-row__level">${esc(program.level)}</span><strong>${esc(program.title)}</strong><span class="program-row__discipline">${esc(program.discipline)}</span><span class="program-row__arrow" aria-hidden="true">↗</span></a>`;
}).join('');

const disciplineDeck = (prefix) => [
  { key: 'ai', number: '01', title: 'Artificial Intelligence', image: 'discipline-ai.webp' },
  { key: 'cybersecurity', number: '02', title: 'Cybersecurity', image: 'discipline-cyber.webp' },
  { key: 'blockchain', number: '03', title: 'Blockchain', image: 'discipline-blockchain.webp' },
].map((field) => {
  const programs = PROGRAMS.filter((program) => program.discipline === (field.key === 'cybersecurity' ? 'cyber' : field.key));
  return `<article class="study-project study-project--${field.key} reveal" data-study-project data-cursor="Explore"><figure class="study-project__media" aria-hidden="true"><img src="${prefix}assets/images/${field.image}" alt="" loading="lazy" decoding="async"></figure><span class="study-project__scrim" aria-hidden="true"></span><div class="study-project__top"><span>/${field.number}</span><span>${field.title}</span><i>Open ↘</i></div><div class="study-project__body"><h3>${field.title}</h3><div>${programs.map((program) => `<a href="${localHref(prefix, program.href)}"><span>${program.level}</span>${program.title}<i>↗</i></a>`).join('')}</div></div></article>`;
}).join('');

const whyTabs = () => `<div class="chapter-tabs" data-tabset><div class="chapter-tabs__nav" role="tablist" aria-label="Why Helvetic Tech"><button type="button" role="tab" aria-selected="true" data-tab="industry"><span>01</span>Programs built for the industry <i>→</i></button><button type="button" role="tab" aria-selected="false" data-tab="switzerland"><span>02</span>Study in a leading innovation hub <i>↗</i></button><button type="button" role="tab" aria-selected="false" data-tab="experts"><span>03</span>Learn from industry experts <i>↗</i></button></div><div class="chapter-tabs__panels"><article role="tabpanel" data-panel="industry"><span class="chapter-number">01</span><p class="label">Programs built for the industry</p><h3>Develop expertise aligned with the expectations of today’s most in-demand technology sectors.</h3></article><article role="tabpanel" data-panel="switzerland" hidden><span class="chapter-number">02</span><p class="label">Study in a leading innovation hub</p><h3>Benefit from Switzerland’s reputation for academic excellence, innovation, and global competitiveness.</h3></article><article role="tabpanel" data-panel="experts" hidden><span class="chapter-number">03</span><p class="label">Learn from industry experts</p><h3>Follow a structured path that prepares you for real opportunities in high-demand tech roles.</h3></article></div></div>`;

const locationTabs = (prefix) => `<div class="location-tabs" data-tabset data-location-tabs><div class="location-gallery reveal" aria-live="polite"><figure data-location-image="housing"><img src="${prefix}assets/images/student-accommodation.webp" alt="Student accommodation near Lake Geneva" loading="lazy" decoding="async"></figure><figure data-location-image="lake" hidden><img src="${prefix}assets/images/lake-geneva.webp" alt="Lake Geneva and the Swiss Alps" loading="lazy" decoding="async"><figcaption>Lake Geneva, Switzerland</figcaption></figure><figure data-location-image="lifestyle" hidden><img src="${prefix}assets/images/swiss-student-life.webp" alt="Student life beside Lake Geneva" loading="lazy" decoding="async"></figure></div><div class="location-tabs__copy"><div role="tablist" aria-label="Living in Switzerland"><button type="button" role="tab" aria-selected="true" data-tab="housing">Student accommodation</button><button type="button" role="tab" aria-selected="false" data-tab="lake">Lake Geneva, Switzerland</button><button type="button" role="tab" aria-selected="false" data-tab="lifestyle">Student life</button></div><article role="tabpanel" data-panel="housing"><p>A limited number of accommodation options are reserved for students and allocated on a first-come, first-served basis. Available options include both private and shared housing within a convenient distance of the campus. Early application is strongly recommended.</p></article><article role="tabpanel" data-panel="lake" hidden><p>Helvetic Tech is located in La Tour-de-Peilz, within the Swiss Riviera. The area offers a balance between a calm, safe environment and access to nearby cities such as Lausanne and Geneva.</p></article><article role="tabpanel" data-panel="lifestyle" hidden><p>Campus life combines focused academic study, an international environment, and a location on the shores of Lake Geneva. Students have opportunities to take part in outdoor sports, lake activities, cultural visits, and local events.</p></article></div></div>`;

export function renderHome(page, prefix) {
  const facts = page.facts.map((fact) => `<div class="home-fact reveal"><strong>${esc(fact.title)}</strong><span>${esc(fact.text)}</span></div>`).join('');
  return `<main id="main-content"><section class="home-hero dark" data-hero data-chapter="Introduction"><figure class="home-hero__photo" aria-hidden="true"><img src="${prefix}assets/images/official-community.webp" alt="" fetchpriority="high" decoding="async"></figure><canvas class="hero-signal" data-network aria-hidden="true"></canvas><div class="shell hero-content"><p class="label reveal">School of technology, Switzerland</p><h1 class="reveal"><span>AI, Cybersecurity</span><em>and Blockchain</em></h1><div class="hero-lower"><p class="hero-intro reveal">${esc(page.description)}</p><div class="hero-actions reveal"><a class="button-primary" href="${SITE.applyUrl}" data-cursor="Apply">Apply <span>↗</span></a><a class="button-secondary" href="${SITE.brochureUrl}" data-cursor="Open">Request brochure <span>↗</span></a></div></div></div></section>
  <section class="home-facts" id="facts" data-chapter="Key facts"><div class="shell home-facts__grid">${facts}</div></section>
  <section class="home-evidence chapter" id="why" data-chapter="Why Helvetic Tech"><div class="shell evidence-layout"><div class="evidence-heading reveal"><p class="label">Why Helvetic Tech</p><h2><span>Clear facts.</span><em>Practical support.</em></h2></div><div class="evidence-list"><article class="evidence-row reveal"><span>01</span><div><h3>Dual-degree structure</h3><p>Programs are delivered in partnership between Helvetic Tech and Tiffin University. Upon successful completion, students receive a Swiss qualification from Helvetic Tech and an American degree from Tiffin University.</p><a href="${localHref(prefix, 'faq')}">Read the program FAQ ↗</a></div></article><article class="evidence-row reveal"><span>02</span><div><h3>International student support</h3><p>Student Services provides guidance on accommodation, visa procedures, health insurance, academic advising, orientation, and everyday life in Switzerland.</p><a href="${localHref(prefix, 'student-services')}">Explore student support ↗</a></div></article><article class="evidence-row reveal"><span>03</span><div><h3>Transparent study costs</h3><p>Bachelor tuition is CHF 6’850 per term and Master tuition is CHF 7’350 per term. Living-cost guidance is published in CHF.</p><a href="${localHref(prefix, 'financing/fees-expenses')}">View fees &amp; expenses ↗</a></div></article></div></div></section>
  <section class="programs chapter" id="programs" data-chapter="Programs" data-study-scroll><div class="programs-pin"><div class="study-deck" data-study-deck><div class="projects-heading study-intro reveal"><p class="label">Programs</p><h2><span>Bachelor and Master</span><em>programs.</em></h2><p class="study-intro__note">Dual Swiss and US degree pathways in artificial intelligence, cybersecurity, and blockchain.</p><a class="line-link" href="${localHref(prefix, 'programs')}">Explore all programs <span>↗</span></a></div>${disciplineDeck(prefix)}</div><div class="study-progress" aria-hidden="true"><span data-study-current>01</span><i><b data-study-progress></b></i><span>03</span></div></div></section>
  <section class="education chapter" id="education" data-chapter="Applied education"><div class="shell education-grid"><div class="education-copy reveal"><p class="label">Applied education</p><h2><span>Education designed for</span><em>real-world impact.</em></h2><p>Programs are built around practical learning, industry relevance, and skills that employers are actively looking for.</p><p>Students work on real use cases, develop problem-solving skills, and build expertise in AI, cybersecurity, and emerging technologies. Smaller class sizes and close interaction with instructors support a more personal and hands-on learning experience.</p><div class="education-steps" aria-label="Education approach"><span>Academic foundations</span><span>Applied learning</span><span>Industry relevance</span><span>Real-world impact</span></div></div><figure class="education-photo reveal" data-media-hover><img src="${prefix}assets/images/applied-technology-lab.webp" alt="Applied technology learning at the Helvetic Institute of Technology" loading="lazy" decoding="async" data-parallax="0.2"></figure></div></section>
  <section class="location chapter" id="location" data-chapter="Lake Geneva"><div class="shell chapter-heading reveal"><p class="label">Lake Geneva, Switzerland</p><h2><span>Study and live on</span><em>Lake Geneva.</em></h2></div><div class="shell">${locationTabs(prefix)}</div></section>
  <section class="international chapter" id="international" data-chapter="International students"><div class="shell international-layout"><div class="international-copy reveal"><p class="label">International students</p><h2><span>Support for your move</span><em>to Switzerland.</em></h2><p>Applications are open to candidates of all nationalities. Student Services provides personalized guidance from your offer through arrival and study in Switzerland.</p><div class="international-links"><a href="${localHref(prefix, 'student-services')}">Student support <span>↗</span></a><a href="${localHref(prefix, 'financing/fees-expenses')}">Fees &amp; expenses <span>↗</span></a><a href="${localHref(prefix, 'financing/scholarships')}">Scholarships <span>↗</span></a></div></div><div class="international-points"><article class="reveal"><span>Visa &amp; immigration</span><p>Guidance on student visa applications, residence permits, and renewals.</p></article><article class="reveal"><span>Accommodation</span><p>Limited student accommodation is allocated on a first-come, first-served basis. Early application is recommended.</p></article><article class="reveal"><span>Health insurance</span><p>Health insurance is mandatory in Switzerland. Student Services provides guidance on compliant coverage.</p></article><article class="reveal"><span>Intakes</span><p>Programs begin in January, April, and September.</p></article></div></div></section>
  <section class="home-admissions chapter" id="admissions" data-chapter="Admissions"><div class="shell"><div class="chapter-heading reveal"><p class="label">Admissions</p><h2><span>A clear path from application</span><em>to arrival.</em></h2></div><div class="admission-path"><article class="reveal"><span>01</span><h3>Apply</h3><p>Complete the application form and upload the required documents.</p></article><article class="reveal"><span>02</span><h3>Review</h3><p>The admissions team reviews your application and may invite you to an online interview.</p></article><article class="reveal"><span>03</span><h3>Decision</h3><p>Successful applicants receive an offer and the steps required to confirm their place.</p></article><article class="reveal"><span>04</span><h3>Visa and arrival</h3><p>Helvetic Tech provides guidance and supporting documentation for the visa process.</p></article></div><a class="line-link" href="${localHref(prefix, 'admissions')}">Admissions requirements and documents <span>↗</span></a></div></section>
  <section class="home-close" data-chapter="Apply"><div class="shell home-close__inner"><div class="reveal"><p class="label">Your next step</p><h2>Applications are open to candidates of all nationalities.</h2></div><div class="home-close__actions reveal"><a class="button-primary" href="${SITE.applyUrl}">Apply <span>↗</span></a><a class="button-secondary" href="${localHref(prefix, 'contact')}">Contact us <span>↗</span></a></div></div></section></main>`;
}

/* ---------------------------------------------------------------- programs */

export function renderPrograms(page, prefix) {
  const fields = [
    { tag: 'Field 01', title: 'Artificial Intelligence', text: 'Machine learning, neural networks, and generative systems applied to real-world problems.', href: localHref(prefix, 'programs/bachelor-in-artificial-intelligence'), linkLabel: 'Bachelor ↗' },
    { tag: 'Field 02', title: 'Cybersecurity', text: 'Network defence, threat analysis, and secure systems for an increasingly connected world.', href: localHref(prefix, 'programs/bachelor-in-cybersecurity'), linkLabel: 'Bachelor ↗' },
    { tag: 'Field 03', title: 'Blockchain', text: 'Distributed systems, cryptographic principles, and decentralised applications.', href: localHref(prefix, 'programs/bachelor-in-blockchain'), linkLabel: 'Bachelor ↗' },
    { tag: 'Master', title: 'Artificial Intelligence', text: 'Advanced AI systems, model deployment, and applied research for specialists.', href: localHref(prefix, 'programs/master-in-artificial-intelligence'), linkLabel: 'Master ↗' },
    { tag: 'Master', title: 'Cybersecurity', text: 'Advanced security architecture, governance, and incident response.', href: localHref(prefix, 'programs/master-in-cybersecurity'), linkLabel: 'Master ↗' },
    { tag: 'Master', title: 'Blockchain', text: 'Advanced distributed systems and enterprise blockchain engineering.', href: localHref(prefix, 'programs/master-in-blockchain'), linkLabel: 'Master ↗' },
  ];
  return `<main id="main-content">${heroMedia({ prefix, label: 'Degree programs', plain: 'Bachelor and Master', italic: 'programs', lead: page.description, image: 'student-collaboration.webp', alt: 'Students collaborating at the Helvetic Institute of Technology' })}
  ${carousel({ label: 'Explore by field', title: 'Six programs, three fields.', items: fields })}
  <section class="catalogue chapter"><div class="shell catalogue-head reveal"><div><p class="label">Program pathways</p><h2><span>Choose your</span><em>specialization.</em></h2><p class="catalogue-note">Programs are delivered in partnership between Helvetic Tech and Tiffin University, combining a Swiss qualification with an American degree.</p></div><div class="level-filter" role="group" aria-label="Filter programs"><button class="is-active" type="button" data-program-filter="all" aria-pressed="true">All</button><button type="button" data-program-filter="bachelor" aria-pressed="false">Bachelor</button><button type="button" data-program-filter="master" aria-pressed="false">Master</button></div></div><div class="program-list" data-program-grid>${programRows(prefix)}</div><div class="pathway-preview" data-pathway-preview aria-hidden="true"><span></span></div></section>
  ${decisionToolsBand(prefix)}
  ${nextBand('Admissions', 'Admissions', localHref(prefix, 'admissions'))}</main>`;
}

const HERO_IMAGES = {
  'Bachelor:AI': 'coding-detail.webp', 'Bachelor:CY': 'cyber-code.webp', 'Bachelor:BC': 'infrastructure.webp',
  'Master:AI': 'brand-master-ai.webp', 'Master:CY': 'brand-master-cyber.webp', 'Master:BC': 'brand-master-blockchain.webp',
};
const BODY_IMAGES = {
  'Bachelor:AI': 'program-bachelor-ai.webp', 'Bachelor:CY': 'program-bachelor-cyber.webp', 'Bachelor:BC': 'program-bachelor-blockchain.webp',
  'Master:AI': 'program-master-ai.webp', 'Master:CY': 'program-master-cyber.webp', 'Master:BC': 'program-master-blockchain.webp',
};

export function renderProgram(page, prefix) {
  const facts = page.facts.map((item) => `<div class="program-fact reveal"><span>${esc(item.title)}</span><strong>${esc(item.text)}</strong></div>`).join('');
  const code = page.discipline === 'Cybersecurity' ? 'CY' : page.discipline === 'Blockchain' ? 'BC' : 'AI';
  const number = page.level === 'Master' ? '02' : '01';
  const key = `${page.level}:${code}`;
  const heroImage = HERO_IMAGES[key];
  const bodyImage = BODY_IMAGES[key];
  const outcomes = page.outcomes.map((title, index) => `<article class="outcome reveal"><span class="outcome__mark" aria-hidden="true">✓</span><span class="outcome__index">${String(index + 1).padStart(2, '0')}</span><p>${esc(title)}</p></article>`).join('');
  const modules = page.curriculum.map((item, index) => `<article class="module reveal"><span class="module__index">${String(index + 1).padStart(2, '0')}</span><div class="module__body"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></article>`).join('');
  const careers = page.careers.map((career) => `<li class="career-chip reveal">${esc(career)}</li>`).join('');
  const navLinks = [['#overview', 'Program overview'], ['#outcomes', 'Program learning outcomes'], ['#curriculum', 'Curriculum outline'], ['#careers', 'Career opportunities']]
    .map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
  return `<main id="main-content">
  <section class="program-hero" data-discipline="${code.toLowerCase()}"><figure class="program-hero__visual" aria-hidden="true"><img src="${prefix}assets/images/${heroImage}" alt="" fetchpriority="high" decoding="async"><span>${number} · ${code}</span></figure>
    <div class="shell program-hero__content"><p class="label reveal">Dual ${esc(page.level)} Degree program</p><h1 class="reveal"><span>${esc(page.level)} of Science in</span><em>${esc(page.discipline)}</em></h1><p class="reveal">${esc(page.description)}</p><p class="program-hero__more reveal">${esc(page.descriptionMore)}</p><div class="hero-media__actions reveal"><a class="button-primary" href="${SITE.applyUrl}">Start your application <span>↗</span></a><a class="button-secondary" href="${localHref(prefix, 'admissions')}">Admissions <span>↗</span></a></div></div>
  </section>
  <nav class="program-nav" aria-label="On this page"><div class="shell">${navLinks}</div></nav>
  <section class="program-facts"><div class="shell program-facts__grid">${facts}</div></section>
  <section class="chapter program-intro" id="overview"><div class="shell program-intro__grid">
    <div class="program-intro__copy"><p class="label reveal">Program overview</p><h2 class="reveal"><span>${esc(page.level)} of Science in</span><em>${esc(page.discipline)}</em></h2><p class="reveal">${esc(page.overview)}</p><p class="reveal">${esc(page.overviewMore)}</p><dl class="degree-pair reveal"><div><dt>Helvetic Tech degree</dt><dd>${esc(page.title)}</dd></div><div><dt>TU degree</dt><dd>${esc(page.title)}</dd></div></dl></div>
    <figure class="program-intro__media reveal" data-media-hover><img src="${prefix}assets/images/${bodyImage}" alt="${esc(page.discipline)} facilities at the Helvetic Institute of Technology" loading="lazy" decoding="async"></figure>
  </div></section>
  <section class="chapter chapter--mint" id="outcomes"><div class="shell section-split"><div class="section-split__aside reveal"><p class="label">Program learning outcomes</p><h2><span>Program learning</span><em>outcomes</em></h2></div><div class="section-split__main"><div class="outcome-grid">${outcomes}</div></div></div></section>
  <section class="chapter program-curriculum" id="curriculum"><div class="shell section-split"><div class="section-split__aside reveal"><p class="label">Curriculum outline</p><h2><span>Curriculum</span><em>outline</em></h2><p class="section-split__note">${page.curriculum.length} study stages across the ${page.level.toLowerCase()} program.</p></div><div class="section-split__main"><div class="module-list">${modules}</div></div></div></section>
  <section class="chapter program-careers" id="careers"><div class="shell section-split"><div class="section-split__aside reveal"><p class="label">Career opportunities</p><h2><span>Career</span><em>opportunities.</em></h2><p class="section-split__note">Roles graduates can target with this ${page.level.toLowerCase()} degree.</p></div><div class="section-split__main"><ul class="career-chips">${careers}</ul><a class="line-link" href="${localHref(prefix, 'career-impact')}">Explore career outcomes <span>↗</span></a></div></div></section>
  ${ctaBand('Start your application', 'Start your', 'application.', SITE.applyUrl)}</main>`;
}

/* -------------------------------------------------------------- admissions */

export function renderAdmissions(page, prefix) {
  return `<main id="main-content">${heroMedia({ prefix, label: 'Admissions', plain: 'Admissions', italic: 'Overview', lead: page.description, image: 'students-classroom.webp', alt: 'Students studying in a classroom at the Helvetic Institute of Technology' })}
  ${split({ num: '01', label: 'Overview', title: 'Overview', body: `${page.intro} ${page.body}`, id: 'overview' })}
  ${factStrip(page.facts)}
  <section class="chapter" id="process">${heading('Application process', 'Application', 'process')}${timeline(page.steps)}</section>
  <section class="chapter chapter--mint" id="documents">${heading('Required documents', 'Required', 'documents')}${docList(page.documents)}<div class="shell doc-note reveal"><p>${esc(page.documentsNote)}</p></div></section>
  <section class="chapter" id="eligibility">${heading('Eligibility requirements', 'Eligibility', 'requirements')}${cardGrid({ items: page.eligibility, className: 'card-grid--three', numbered: true })}</section>
  <section class="chapter" id="enrolment">${heading('Offer and enrollment', 'Offer and', 'enrollment')}${accordionStack(page.notes)}</section>
  ${ctaBand('Start your application', 'Start your', 'application.', SITE.applyUrl)}</main>`;
}

/* --------------------------------------------------------------- institute */

export function renderInstitute(page, prefix) {
  return `<main id="main-content">${heroMedia({ prefix, label: 'About', plain: 'Helvetic Institute', italic: 'of Technology', lead: page.description, image: 'about-institute.webp', alt: 'Modern campus architecture at the Helvetic Institute of Technology' })}
  ${editorialCols({ label: 'About Helvetic Tech', title: 'About Helvetic Institute of Technology', paras: [page.intro, page.body] })}
  ${pullQuote(page.mission)}
  ${split({ num: '02', label: 'Vision', title: 'Vision', body: page.vision, id: 'vision' })}
  <section class="chapter chapter--mint values-section" id="values">${heading('Values', 'Values', '')}${valueLedger(page.values)}</section>
  <section class="chapter" id="community">${heading('Community', 'Alumni &', 'Professional Network')}${cardGrid({ items: page.community, className: 'card-grid--two', numbered: true })}</section>
  ${nextBand('Faculty', 'Learn from industry professionals', localHref(prefix, 'faculty'))}</main>`;
}

/* ------------------------------------------------------------------ campus */

export function renderCampus(page, prefix) {
  return `<main id="main-content">${heroMedia({ prefix, label: 'Campus Life', plain: 'Life on the', italic: 'Swiss Riviera', lead: page.description, image: 'lake-montreux.webp', alt: 'Lake Geneva and the Swiss Alps near Montreux' })}
  ${editorialCols({ label: 'Introduction', title: 'Introduction', paras: [page.intro, page.body] })}
  ${split({ num: '01', label: page.riviera.title, title: page.riviera.title, body: page.riviera.text, id: 'riviera' })}
  ${split({ num: '02', label: 'Campus environment', title: page.campus.title, body: page.campus.text, id: 'campus' })}
  <section class="chapter chapter--mint" id="activities">${heading('Activities and lifestyle', 'Activities and', 'lifestyle')}${indexList(page.activities.map((title) => ({ title })))}</section>
  ${pullQuote(page.quote)}
  ${mediaFeature({ prefix, img: 'campus-walk.webp', alt: 'Students walking together on campus', caption: 'Student life', eyebrow: page.cultural.title, title: page.cultural.title, text: page.cultural.text })}
  <section class="chapter" id="town">${heading('Student life', 'Student life &', 'Living in La Tour-de-Peilz')}${cardGrid({ items: [page.studentLife, { title: page.town.title, text: page.town.text }, { title: page.switzerland.title, text: page.switzerland.text }], className: 'card-grid--three', numbered: true })}</section>
  ${nextBand('Admissions', 'Admissions', localHref(prefix, 'admissions'))}</main>`;
}

/* ----------------------------------------------------------------- faculty */

export function renderFaculty(page, prefix) {
  const people = page.people.map((person) => ({ title: person.name, tag: person.role || 'Faculty' }));
  return `<main id="main-content">${heroMedia({ prefix, label: 'Helvetic Tech Faculty', plain: 'Learn from', italic: 'industry professionals.', lead: page.description, image: 'faculty-seminar.webp', alt: 'A technology seminar at the Helvetic Institute of Technology' })}
  ${editorialCols({ label: 'Learn from industry professionals', title: 'Learn from industry professionals', paras: [page.intro] })}
  <section class="chapter chapter--mint" id="people">${heading('Faculty', 'Helvetic Tech', 'Faculty')}${cardGrid({ items: people, className: 'card-grid--three', numbered: true })}</section>
  ${pullQuote('Our faculty bring current industry experience into the classroom, ensuring that teaching is grounded in real-world practice.')}
  ${nextBand('Programs', 'Dual Bachelor & Master Degrees', localHref(prefix, 'programs'))}</main>`;
}

/* ---------------------------------------------------------------- policies */

export function renderPolicies(page, prefix) {
  const blocks = page.policyGroups.map((group) => `<div class="shell policy-block"><p class="label reveal">${esc(group.title)}</p><div class="card-grid card-grid--three">${group.items.map((item) => `<article class="card reveal"><span class="card__tag">${esc(group.title)}</span><h3>${esc(item)}</h3></article>`).join('')}</div></div>`).join('');
  return `<main id="main-content">${heroCompact({ prefix, label: 'Privacy Policy', plain: 'Privacy', italic: 'Policy', lead: page.description, image: 'page-policies.webp', alt: 'Institutional records at the Helvetic Institute of Technology' })}
  ${editorialCols({ label: 'Privacy Policy', title: 'Privacy Policy', paras: [page.intro, page.introMore] })}
  <section class="chapter policy-index-section" id="policies" data-chapter="Policies">${blocks}</section>
  <section class="chapter policy-source" id="compliance" data-chapter="Privacy policy">${heading('Privacy policy', 'Read the full', 'privacy policy')}<div class="shell reveal"><a class="compliance-card" href="${page.complianceUrl}" target="_blank" rel="noopener"><span>The complete privacy policy is published on helvetictech.ch.</span><i aria-hidden="true">↗</i></a></div></section>
  ${nextBand('Request More Information', 'Request More Information', SITE.brochureUrl)}</main>`;
}

/* --------------------------------------------------------------------- FAQ */

export function renderFaq(page, prefix) {
  return `<main id="main-content">${heroCompact({ prefix, label: 'Frequently Asked Questions', plain: 'Frequently Asked', italic: 'Questions', lead: 'Shaping the next generation of professionals in a rapidly evolving technological landscape.', image: 'page-faq.webp', alt: 'Advisors answering questions at the Helvetic Institute of Technology' })}
  ${faqGroups(page.groups)}
  ${nextBand('Request More Information', 'Request More Information', SITE.brochureUrl)}</main>`;
}

/* ----------------------------------------------------------------- contact */

export function renderContact(page, prefix) {
  const MAP = 'https://www.openstreetmap.org/?mlat=46.4555&mlon=6.8595#map=16/46.4555/6.8595';
  const labels = { Address: 'Campus address', Phone: 'Call us' };
  const icons = { Address: ICON.pin, Phone: ICON.phone };
  const links = { Address: MAP, Phone: `tel:${SITE.phoneHref}` };
  const tiles = page.details.map((item) => `<a class="visit-tile reveal" href="${links[item.term] || MAP}"${item.term === 'Phone' ? '' : ' target="_blank" rel="noopener"'}><span class="visit-tile__icon" aria-hidden="true">${icons[item.term] || ICON.pin}</span><span class="visit-tile__label">${esc(labels[item.term] || item.term)}</span><strong>${esc(item.value)}</strong><i aria-hidden="true">↗</i></a>`).join('');
  return `<main id="main-content">${heroCompact({ prefix, label: 'Visit Us', plain: 'Visit', italic: 'Us', lead: page.description, image: 'page-contact.webp', alt: 'The Helvetic Institute of Technology in La Tour-de-Peilz, Switzerland' })}
  <section class="chapter visit-section" id="details" data-chapter="Visit us"><div class="shell">
    <div class="visit-head reveal"><p class="label">Visit Us</p><h2><span>Visit</span><em>Us</em></h2><p class="visit-head__note">Come and see the campus on the shores of Lake Geneva. Reach the admissions team before you travel.</p></div>
    <div class="visit-grid">${tiles}<a class="visit-tile visit-tile--action reveal" href="${SITE.applyUrl}"><span class="visit-tile__icon" aria-hidden="true">${ICON.arrow}</span><span class="visit-tile__label">Start your application</span><strong>Apply online</strong><i aria-hidden="true">↗</i></a><a class="visit-tile visit-tile--action reveal" href="${SITE.brochureUrl}"><span class="visit-tile__icon" aria-hidden="true">${ICON.book}</span><span class="visit-tile__label">Request a brochure</span><strong>Programs and fees</strong><i aria-hidden="true">↗</i></a></div>
    <figure class="visit-map reveal"><iframe title="Map of the Helvetic Institute of Technology, La Tour-de-Peilz, Switzerland" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=6.8405%2C46.4475%2C6.8785%2C46.4635&amp;layer=mapnik&amp;marker=46.4555%2C6.8595"></iframe><figcaption><span class="label">La Tour-de-Peilz, Switzerland</span><a href="${MAP}" target="_blank" rel="noopener">Open in OpenStreetMap <span aria-hidden="true">↗</span></a></figcaption></figure>
  </div></section>
  ${nextBand('Contact us', 'Request More Information', SITE.applyUrl)}</main>`;
}

/* ---------------------------------------------------------------- insights */

export function renderInsights(page, prefix) {
  return `<main id="main-content">${heroCompact({ prefix, label: 'Career outcomes', plain: 'The Helvetic Tech', italic: 'career advantage', lead: page.description, image: 'page-career.webp', alt: 'Graduates of the Helvetic Institute of Technology' })}${scrollStory(page.chapters, 'Career outcomes', 'Your career', 'starts here')}${nextBand('Programs', 'Dual Bachelor & Master Degrees', localHref(prefix, 'programs'))}</main>`;
}

/* ----------------------------------------------------------- source pages */

export function renderContent(page, prefix) {
  const [lead, ...rest] = page.sections;
  const type = page.route.startsWith('financing/') ? 'finance' : ['students', 'student-services', 'alumni'].includes(page.route) ? 'community' : 'academy';
  const visuals = {
    governance: ['governance-leadership.webp', 'Academic leadership at the Helvetic Institute of Technology'],
    'student-services': ['student-support.webp', 'Student support services at the Helvetic Institute of Technology'],
    'institutional-development': ['institutional-campus.webp', 'The Helvetic Institute of Technology campus on Lake Geneva'],
    alumni: ['alumni-network.webp', 'The Helvetic Tech alumni and professional network'],
    students: ['page-students.webp', 'Students at the Helvetic Institute of Technology'],
    'job-vacancies': ['page-vacancies.webp', 'A professional working environment at the Helvetic Institute of Technology'],
    'financing/fees-expenses': ['brand-fees.webp', 'Helvetic Institute of Technology campus life'],
    'financing/scholarships': ['brand-scholarships.webp', 'Helvetic Institute of Technology students'],
  };
  const visual = visuals[page.route];
  const heroFigure = visual ? `<figure class="source-hero__bg"><img src="${prefix}assets/images/${visual[0]}" alt="${esc(visual[1])}" fetchpriority="high" decoding="async"></figure><span class="source-hero__scrim" aria-hidden="true"></span>` : '';
  const heroIndex = visual ? '' : `<div class="source-hero__index reveal" aria-hidden="true"><span>01</span><span>${String(page.sections.length).padStart(2, '0')}</span></div>`;
  const sectionBody = (section) => `${section.text ? `<p class="reveal">${esc(section.text)}</p>` : ''}${section.items ? `<ul class="source-ledger__list reveal">${section.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}${section.link ? `<a class="line-link reveal" href="${section.link.href}">${esc(section.link.label)} <span>↗</span></a>` : ''}`;
  const feature = lead ? `<section class="source-feature source-feature--${type}" id="section-1" data-chapter="${esc(lead.title)}"><div class="shell source-feature__grid"><span class="source-feature__number">01</span><div><p class="label reveal">${esc(lead.title)}</p><h2 class="reveal">${esc(lead.title)}</h2>${sectionBody(lead)}</div></div></section>` : '';
  const rows = rest.map((section, index) => `<article class="source-ledger__row reveal" id="section-${index + 2}"><span>${String(index + 2).padStart(2, '0')}</span><div><h2>${esc(section.title)}</h2>${sectionBody(section)}</div></article>`).join('');
  return `<main id="main-content"><section class="source-hero source-hero--${type}${visual ? ' source-hero--visual' : ' source-hero--typographic'}" data-chapter="${esc(page.title)}">${heroFigure}<div class="shell source-hero__inner"><div class="source-hero__copy"><p class="label reveal">${esc(page.title)}</p><h1 class="reveal">${esc(page.title)}</h1><p class="reveal">${esc(page.description)}</p></div>${heroIndex}</div></section>${feature}${rows ? `<section class="source-ledger chapter" data-chapter="Explore"><div class="shell">${rows}</div></section>` : ''}</main>`;
}

/* ---------------------------------------------------------- decision tools */

const toolLinks = (prefix, current) => {
  const tools = [
    ['signal', '01', 'Program Signal', 'tools/program-signal'],
    ['matrix', '02', 'Program Matrix', 'tools/program-matrix'],
    ['cost', '03', 'Study Cost Model', 'tools/study-cost-model'],
  ];
  return `<nav class="tool-switcher" aria-label="Program decision tools"><div class="shell">${tools.map(([key, number, label, route]) => `<a href="${localHref(prefix, route)}"${key === current ? ' aria-current="page"' : ''}><span>${number}</span><strong>${label}</strong><i aria-hidden="true">${key === current ? '●' : '↗'}</i></a>`).join('')}</div></nav>`;
};

const toolHeroVisual = (tool) => {
  if (tool === 'signal') return `<div class="decision-visual decision-visual--signal" aria-hidden="true"><div class="signal-core"><span>HIT</span><i></i><i></i><i></i></div><b class="signal-node signal-node--one">AI</b><b class="signal-node signal-node--two">CY</b><b class="signal-node signal-node--three">BC</b><small>CALIBRATING DIRECTION</small></div>`;
  if (tool === 'matrix') return `<div class="decision-visual decision-visual--matrix" aria-hidden="true"><span>PROGRAM / INPUT</span><div><b>AI</b><i style="--value:82%"></i><em>180</em></div><div><b>CY</b><i style="--value:68%"></i><em>120</em></div><div><b>BC</b><i style="--value:92%"></i><em>180</em></div><small>LIVE COMPARISON MATRIX</small></div>`;
  return `<div class="decision-visual decision-visual--cost" aria-hidden="true"><span>PUBLISHED TUITION / TERM</span><div><small>BACHELOR</small><strong>6’850</strong><em>CHF</em></div><div><small>MASTER</small><strong>7’350</strong><em>CHF</em></div><i><b></b></i></div>`;
};

export function renderTool(page, prefix) {
  const meta = {
    signal: { number: '01', eyebrow: 'Program matching', plain: 'Read your', italic: 'Program Signal', note: 'A guided starting point — not an admissions decision.' },
    matrix: { number: '02', eyebrow: 'Program comparison', plain: 'See the', italic: 'Program Matrix', note: 'Select up to three programs. Differences are highlighted automatically.' },
    cost: { number: '03', eyebrow: 'Study planning', plain: 'Model your', italic: 'Study costs', note: 'Indicative planning only. Published fees and your own assumptions remain visible.' },
  }[page.tool];
  const programData = JSON.stringify(PROGRAMS).replaceAll('<', '\\u003c');
  const method = page.tool === 'signal'
    ? `<div><span>01</span><strong>Academic stage</strong><p>Start with the study level that fits your current qualification.</p></div><div><span>02</span><strong>Technology field</strong><p>Choose the subject area that holds your attention.</p></div><div><span>03</span><strong>Problem type</strong><p>Refine the signal through the work you want to explore.</p></div>`
    : page.tool === 'matrix'
      ? `<div><span>01</span><strong>Select</strong><p>Choose one to three programs from the complete HIT catalogue.</p></div><div><span>02</span><strong>Compare</strong><p>Review level, duration, credits, format, tuition, and intakes.</p></div><div><span>03</span><strong>Continue</strong><p>Open the program page or carry your choice into the cost model.</p></div>`
      : `<div><span>01</span><strong>Choose a program</strong><p>Tuition, duration, and academic terms update automatically.</p></div><div><span>02</span><strong>Shape living costs</strong><p>Adjust accommodation, insurance, food, transport, and personal costs.</p></div><div><span>03</span><strong>Keep the model</strong><p>Print the result or save it as a PDF from your browser.</p></div>`;
  return `<main id="main-content" class="decision-page decision-page--${page.tool}"><section class="decision-hero" data-chapter="${esc(page.title)}"><div class="shell decision-hero__grid"><div class="decision-hero__copy"><p class="label reveal">Decision tool ${meta.number} · ${meta.eyebrow}</p><h1 class="reveal"><span>${meta.plain}</span><em>${meta.italic}.</em></h1><p class="reveal">${esc(page.description)}</p><small class="reveal">${meta.note}</small></div>${toolHeroVisual(page.tool)}</div></section>${toolLinks(prefix, page.tool)}<section class="tool-stage chapter" data-chapter="Interactive tool"><div class="shell"><div class="hit-tool" data-hit-tool="${page.tool}" data-base="${prefix}"><noscript><p class="tool-alert">Please enable JavaScript to use this interactive planning tool.</p></noscript></div><script type="application/json" data-hit-programs>${programData}</script></div></section><section class="tool-method chapter" data-chapter="How it works"><div class="shell"><div class="tool-method__head reveal"><p class="label">How it works</p><h2><span>Clear inputs.</span><em>Useful next steps.</em></h2></div><div class="tool-method__grid">${method}</div><p class="tool-source-note">Program and fee information follows the published Helvetic Tech program and Fees &amp; Expenses pages. Confirm current figures with Admissions before making a financial commitment.</p></div></section>${decisionToolsBand(prefix)}</main>`;
}

/* ------------------------------------------------------------------ output */

const RENDERERS = {
  home: renderHome,
  programs: renderPrograms,
  program: renderProgram,
  admissions: renderAdmissions,
  institute: renderInstitute,
  campus: renderCampus,
  faculty: renderFaculty,
  policies: renderPolicies,
  faq: renderFaq,
  contact: renderContact,
  insights: renderInsights,
  content: renderContent,
  tool: renderTool,
};

const ACTIVE = {
  programs: 'programs',
  program: 'programs',
  admissions: 'admissions',
  institute: 'institute',
  campus: 'campus-life',
  faculty: 'faculty',
  policies: 'policies',
  faq: 'faq',
  contact: 'contact',
  insights: 'career-impact',
  tool: 'tools/program-signal',
};

export function documentFor(page) {
  const prefix = prefixFor(page.route);
  const render = RENDERERS[page.kind] || renderHome;
  const body = render(page, prefix);
  const active = page.route;
  const structuredData = JSON.stringify({ '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE.name, alternateName: SITE.short, url: SITE.url, telephone: SITE.phoneDisplay, address: { '@type': 'PostalAddress', streetAddress: SITE.address[0], postalCode: '1814', addressLocality: 'La Tour-de-Peilz', addressCountry: 'CH' } });
  return `<!doctype html><html lang="en" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(page.title)} | ${SITE.short}</title><meta name="description" content="${esc(page.description)}"><meta name="theme-color" content="#0b2641"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="${esc(page.source || SITE.url)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;family=Instrument+Serif:ital@0;1&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"><link rel="stylesheet" href="${prefix}assets/styles.css?v=25"><script type="application/ld+json">${structuredData}</script><script>document.documentElement.classList.replace('no-js','js')</script></head><body data-page="${page.kind}"><a class="skip-link" href="#main-content">Skip to main content</a>${header(prefix, active)}${body}${footer(prefix)}<button class="back-top" type="button" aria-label="Back to top" data-back-top>↑</button><script defer src="${prefix}assets/main.js?v=25"></script><!-- Content source: ${page.source} --></body></html>`;
}
