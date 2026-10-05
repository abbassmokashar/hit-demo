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
    <div class="site-header__inner">${brand(prefix)}<nav class="desktop-nav" aria-label="Primary navigation">${item('Programs', 'programs')}${item('Admissions', 'admissions')}${item('Student support', 'student-services')}${item('Fees', 'financing/fees-expenses')}</nav><div class="header-actions"><a class="header-brochure" href="${SITE.brochureUrl}">Request brochure</a><a class="header-cta" href="${SITE.applyUrl}" data-magnetic data-cursor="Apply">Apply <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-open><span>Menu</span><b aria-hidden="true"><i></i><i></i></b></button></div></div>
  </header>
  <aside class="menu" role="dialog" aria-modal="true" aria-label="Website navigation" aria-hidden="true" data-menu><div class="menu__head">${brand(prefix)}<button type="button" aria-label="Close menu" data-menu-close><span>Close</span><i aria-hidden="true">×</i></button></div><nav class="menu-accordion" aria-label="Full website navigation">
    ${group('01', 'Institute', [['About', 'institute'], ['Faculty', 'faculty'], ['Governance', 'governance'], ['FAQ', 'faq'], ['Policies', 'policies']])}
    ${group('02', 'Programs', [['View all programs', 'programs'], ['Bachelor in Artificial Intelligence', 'programs/bachelor-in-artificial-intelligence'], ['Bachelor in Cybersecurity', 'programs/bachelor-in-cybersecurity'], ['Bachelor in Blockchain', 'programs/bachelor-in-blockchain'], ['Master in Artificial Intelligence', 'programs/master-in-artificial-intelligence'], ['Master in Cybersecurity', 'programs/master-in-cybersecurity'], ['Master in Blockchain', 'programs/master-in-blockchain']])}
    ${group('03', 'Students', [['Student support', 'student-services'], ['Student community', 'students'], ['Campus life', 'campus-life']])}
    ${group('04', 'Career impact', [['Career outcomes', 'career-impact'], ['Institutional development', 'institutional-development'], ['Alumni', 'alumni']])}
    ${group('05', 'Admissions & Financing', [['Admissions', 'admissions'], ['International student support', 'student-services'], ['Fees & expenses', 'financing/fees-expenses'], ['Scholarships', 'financing/scholarships'], ['Contact us', 'contact']])}
  </nav></aside><div class="menu-scrim" data-menu-scrim></div>`;
}

export function footer(prefix) {
  return `<footer class="site-footer"><div class="shell footer-main"><div>${brand(prefix)}<p>Developing future leaders on the shores of Lake Geneva.</p></div><div><span class="label">Visit us</span><address>${SITE.address.join('<br>')}</address></div><div><span class="label">Contact</span><a href="mailto:info@helvetictech.ch">info@helvetictech.ch</a><a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a><a href="${localHref(prefix, 'contact')}">Contact us</a></div><div><span class="label">Quick links</span><a href="${localHref(prefix, 'admissions')}">Admissions</a><a href="${localHref(prefix, 'financing/fees-expenses')}">Fees &amp; expenses</a><a href="${localHref(prefix, 'financing/scholarships')}">Scholarships</a><a href="${localHref(prefix, 'job-vacancies')}">Job vacancies</a></div></div><div class="shell footer-bottom"><span>Helvetic Institute of Technology</span><span>La Tour-de-Peilz · Switzerland</span><a href="https://www.helvetictech.ch/privacy">Privacy policy</a></div></footer>`;
}

/* --------------------------------------------------------------- primitives */

const heading = (label, plain, italic) => `<div class="shell chapter-heading reveal"><p class="label">${esc(label)}</p><h2><span>${esc(plain)}</span><em>${esc(italic)}</em></h2></div>`;

const ctaBand = (label, plain, italic, href) => `<section class="final-cta dark" data-chapter="${esc(label)}"><span class="registration-mark registration-mark--light" aria-hidden="true"></span><div class="shell"><p class="label reveal">${esc(label)}</p><h2 class="reveal"><a href="${href}" data-magnetic data-cursor="Apply"><span>${esc(plain)}</span><em>${esc(italic)}</em><i>↗</i></a></h2></div></section>`;

const nextBand = (label, title, href) => `<section class="next-band" data-chapter="${esc(label)}"><a class="shell next-band__link reveal" href="${href}"><span class="label">${esc(label)}</span><strong>${esc(title)}</strong><i aria-hidden="true">↗</i></a></section>`;

const valueLedger = (items) => `<div class="shell value-ledger">${items.map((item, index) => `<article class="value-row reveal"><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></article>`).join('')}</div>`;

/* ------------------------------------------------------------ hero variants */

const heroSplit = ({ label, plain, italic, lead, index = [] }) => `<section class="page-hero hero-split dark"><div class="shell hero-split__grid">
  <div class="hero-split__copy"><p class="label reveal">${esc(label)}</p><h1 class="reveal"><span>${esc(plain)}</span><em>${esc(italic)}</em></h1><p class="hero-lead reveal">${esc(lead)}</p></div>
  ${index.length ? `<ol class="hero-split__index reveal">${index.map((item, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p></li>`).join('')}</ol>` : ''}
</div></section>`;

const heroEditorial = ({ label, plain, italic, lead, meta = [] }) => `<section class="page-hero hero-editorial dark"><div class="shell hero-editorial__inner">
  <p class="label reveal">${esc(label)}</p>
  <h1 class="reveal"><span>${esc(plain)}</span><em>${esc(italic)}</em></h1>
  <p class="hero-lead reveal">${esc(lead)}</p>${meta.length ? `<dl class="hero-editorial__meta reveal">${meta.map((item) => `<div><dt>${esc(item.term)}</dt><dd>${esc(item.value)}</dd></div>`).join('')}</dl>` : ''}
</div></section>`;

const heroMedia = ({ prefix, label, plain, italic, lead, image, alt }) => `<section class="page-hero hero-media dark"><div class="shell hero-media__inner">
  <div class="hero-media__copy"><p class="label reveal">${esc(label)}</p><h1 class="reveal"><span>${esc(plain)}</span><em>${esc(italic)}</em></h1><p class="hero-lead reveal">${esc(lead)}</p></div>
  <figure class="hero-media__figure reveal" data-media-hover><img src="${prefix}assets/images/${image}" alt="${esc(alt)}" decoding="async" fetchpriority="high"><span aria-hidden="true"></span></figure>
</div></section>`;

const heroCompact = ({ label, plain, italic, lead }) => `<section class="page-hero hero-compact dark"><div class="shell hero-compact__inner"><p class="label reveal">${esc(label)}</p><h1 class="reveal"><span>${esc(plain)}</span><em>${esc(italic)}</em></h1><p class="hero-lead reveal">${esc(lead)}</p></div></section>`;

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

const cardGrid = ({ items, className = '' }) => `<div class="shell card-grid${className ? ` ${className}` : ''}">${items.map((item) => `<article class="card reveal">${item.tag ? `<span class="card__tag">${esc(item.tag)}</span>` : ''}<h3>${esc(item.title)}</h3>${item.text ? `<p>${esc(item.text)}</p>` : ''}</article>`).join('')}</div>`;

const mediaFeature = ({ prefix, img, alt, caption, eyebrow, title, text }) => `<section class="chapter media-section dark"><div class="shell media-grid"><figure class="media-grid__figure reveal" data-media-hover><img src="${prefix}assets/images/${img}" alt="${esc(alt)}" data-parallax="0.45"><figcaption>${esc(caption)}</figcaption></figure><div class="media-grid__copy reveal">${eyebrow ? `<p class="label">${esc(eyebrow)}</p>` : ''}<h2>${esc(title)}</h2><p>${esc(text)}</p></div></div></section>`;

const factStrip = (items) => `<div class="shell fact-strip">${items.map((item) => `<div class="fact reveal"><strong>${esc(item.title)}</strong><span>${esc(item.text)}</span></div>`).join('')}</div>`;

const docList = (items) => `<div class="shell doc-list reveal">${items.map((item) => `<span>${esc(item)}</span>`).join('')}</div>`;

const accordionStack = (items) => `<div class="shell accordion-stack reveal">${items.map((item) => `<div class="accordion" data-accordion><button type="button" aria-expanded="false">${esc(item.title)} <span>+</span></button><div><p>${esc(item.text)}</p></div></div>`).join('')}</div>`;

const policyIndex = (groups) => `<div class="shell policy-index">${groups.map((group) => `<section class="policy-group reveal"><p class="label">${esc(group.title)}</p><ul>${group.items.map((item) => `<li><span>${esc(item)}</span><i aria-hidden="true">↗</i></li>`).join('')}</ul></section>`).join('')}</div>`;

const faqGroups = (groups) => `<section class="chapter faq"><div class="shell" data-tabset>
  <div class="faq-head reveal"><p class="label">Questions</p><div class="faq-tabs" role="tablist" aria-label="FAQ categories">${groups.map((group, i) => `<button class="${i === 0 ? 'is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-tab="${esc(group.id)}">${esc(group.title)}</button>`).join('')}</div></div>
  <div class="faq-panels">${groups.map((group, i) => `<div role="tabpanel" data-panel="${esc(group.id)}"${i === 0 ? '' : ' hidden'}>${group.items.map((item) => `<div class="accordion" data-accordion><button type="button" aria-expanded="false">${esc(item.q)} <span>+</span></button><div><p>${esc(item.a)}</p></div></div>`).join('')}</div>`).join('')}</div>
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

const programRows = (prefix) => PROGRAMS.map((program) => {
  const href = program.local ? localHref(prefix, program.href) : program.href;
  return `<a class="program-row reveal" href="${href}" data-level="${program.level.toLowerCase()}" data-cursor="View"><span class="program-row__number">/${program.number}</span><span class="program-row__level">${esc(program.level)}</span><strong>${esc(program.title)}</strong><span class="program-row__discipline">${esc(program.discipline)}</span><span class="program-row__arrow" aria-hidden="true">↗</span></a>`;
}).join('');

const disciplineDeck = (prefix) => [
  { key: 'ai', number: '01', title: 'Artificial Intelligence', symbol: 'AI' },
  { key: 'cybersecurity', number: '02', title: 'Cybersecurity', symbol: 'CY' },
  { key: 'blockchain', number: '03', title: 'Blockchain', symbol: 'BC' },
].map((field) => {
  const programs = PROGRAMS.filter((program) => program.discipline === (field.key === 'cybersecurity' ? 'cyber' : field.key));
  return `<article class="study-project study-project--${field.key} reveal" data-study-project data-cursor="Explore"><div class="study-project__top"><span>/${field.number}</span><span>${field.title}</span><i>Open ↘</i></div><div class="study-project__stage" aria-hidden="true"><span>${field.symbol}</span><div></div></div><div class="study-project__body"><h3>${field.title}</h3><div>${programs.map((program) => `<a href="${localHref(prefix, program.href)}"><span>${program.level}</span>${program.title}<i>↗</i></a>`).join('')}</div></div></article>`;
}).join('');

const whyTabs = () => `<div class="chapter-tabs" data-tabset><div class="chapter-tabs__nav" role="tablist" aria-label="Why Helvetic Tech"><button type="button" role="tab" aria-selected="true" data-tab="industry"><span>01</span>Programs built for the industry <i>→</i></button><button type="button" role="tab" aria-selected="false" data-tab="switzerland"><span>02</span>Study in a leading innovation hub <i>↗</i></button><button type="button" role="tab" aria-selected="false" data-tab="experts"><span>03</span>Learn from industry experts <i>↗</i></button></div><div class="chapter-tabs__panels"><article role="tabpanel" data-panel="industry"><span class="chapter-number">01</span><p class="label">Programs built for the industry</p><h3>Develop expertise aligned with the expectations of today’s most in-demand technology sectors.</h3></article><article role="tabpanel" data-panel="switzerland" hidden><span class="chapter-number">02</span><p class="label">Study in a leading innovation hub</p><h3>Benefit from Switzerland’s reputation for academic excellence, innovation, and global competitiveness.</h3></article><article role="tabpanel" data-panel="experts" hidden><span class="chapter-number">03</span><p class="label">Learn from industry experts</p><h3>Follow a structured path that prepares you for real opportunities in high-demand tech roles.</h3></article></div></div>`;

const locationTabs = (prefix) => `<div class="location-tabs" data-tabset data-location-tabs><div class="location-gallery reveal" aria-live="polite"><figure data-location-image="housing"><img src="${prefix}assets/images/student-accommodation.webp" alt="Illustrative view of student accommodation near Lake Geneva" loading="lazy" decoding="async"><figcaption>Illustrative image</figcaption></figure><figure data-location-image="lake" hidden><img src="${prefix}assets/images/lake-geneva.webp" alt="Lake Geneva and the Swiss Alps" loading="lazy" decoding="async"><figcaption>Lake Geneva, Switzerland</figcaption></figure><figure data-location-image="lifestyle" hidden><img src="${prefix}assets/images/swiss-student-life.webp" alt="Illustrative image of student life beside Lake Geneva" loading="lazy" decoding="async"><figcaption>Illustrative image</figcaption></figure></div><div class="location-tabs__copy"><div role="tablist" aria-label="Living in Switzerland"><button type="button" role="tab" aria-selected="true" data-tab="housing">Student accommodation</button><button type="button" role="tab" aria-selected="false" data-tab="lake">Lake Geneva, Switzerland</button><button type="button" role="tab" aria-selected="false" data-tab="lifestyle">Student life</button></div><article role="tabpanel" data-panel="housing"><p>A limited number of accommodation options are reserved for students and allocated on a first-come, first-served basis. Available options include both private and shared housing within a convenient distance of the campus. Early application is strongly recommended.</p></article><article role="tabpanel" data-panel="lake" hidden><p>Helvetic Tech is located in La Tour-de-Peilz, within the Swiss Riviera. The area offers a balance between a calm, safe environment and access to nearby cities such as Lausanne and Geneva.</p></article><article role="tabpanel" data-panel="lifestyle" hidden><p>Campus life combines focused academic study, an international environment, and a location on the shores of Lake Geneva. Students have opportunities to take part in outdoor sports, lake activities, cultural visits, and local events.</p></article></div></div>`;

export function renderHome(page, prefix) {
  const facts = page.facts.map((fact) => `<div class="home-fact reveal"><strong>${esc(fact.title)}</strong><span>${esc(fact.text)}</span></div>`).join('');
  return `<main id="main-content"><section class="home-hero dark" data-hero data-chapter="Introduction"><canvas class="hero-signal" data-network aria-hidden="true"></canvas><figure class="home-hero__photo" aria-hidden="true"><img src="${prefix}assets/images/official-community.webp" alt="" fetchpriority="high" decoding="async"></figure><div class="shell hero-meta"><span>Helvetic Institute of Technology</span><span>La Tour-de-Peilz · Lake Geneva</span></div><div class="shell hero-content"><p class="label reveal">School of technology, Switzerland</p><h1 class="reveal"><span>AI, Cybersecurity</span><em>and Blockchain</em></h1><p class="hero-intro reveal">${esc(page.description)}</p><div class="hero-actions reveal"><a class="button-primary" href="${SITE.applyUrl}" data-cursor="Apply">Apply <span>↗</span></a><a class="button-secondary" href="${SITE.brochureUrl}" data-cursor="Open">Request brochure <span>↓</span></a></div></div><div class="hero-bottom"><span>Swiss-based education · Bachelor and Master programs</span><a href="#facts">Key facts ↓</a></div></section>
  <section class="home-facts" id="facts" data-chapter="Key facts"><div class="shell home-facts__grid">${facts}</div></section>
  <section class="home-evidence chapter" id="why" data-chapter="Why Helvetic Tech"><div class="shell evidence-layout"><div class="evidence-heading reveal"><p class="label">Why Helvetic Tech</p><h2><span>Clear facts.</span><em>Practical support.</em></h2></div><div class="evidence-list"><article class="evidence-row reveal"><span>01</span><div><h3>Dual-degree structure</h3><p>Programs are delivered in partnership between Helvetic Tech and Tiffin University. Upon successful completion, students receive a Swiss qualification from Helvetic Tech and an American degree from Tiffin University.</p><a href="${localHref(prefix, 'faq')}">Read the program FAQ ↗</a></div></article><article class="evidence-row reveal"><span>02</span><div><h3>International student support</h3><p>Student Services provides guidance on accommodation, visa procedures, health insurance, academic advising, orientation, and everyday life in Switzerland.</p><a href="${localHref(prefix, 'student-services')}">Explore student support ↗</a></div></article><article class="evidence-row reveal"><span>03</span><div><h3>Transparent study costs</h3><p>Bachelor tuition is CHF 6’850 per term and Master tuition is CHF 7’350 per term. Living-cost guidance is published in CHF.</p><a href="${localHref(prefix, 'financing/fees-expenses')}">View fees &amp; expenses ↗</a></div></article></div></div></section>
  <section class="programs chapter" id="programs" data-chapter="Programs" data-study-scroll><div class="programs-pin"><div class="study-deck" data-study-deck><div class="projects-heading study-intro reveal"><p class="label">Programs</p><h2><span>Bachelor and Master</span><em>programs.</em></h2><p class="study-intro__note">Dual Swiss and US degree pathways in artificial intelligence, cybersecurity, and blockchain.</p><a class="line-link" href="${localHref(prefix, 'programs')}">Explore all programs <span>↗</span></a></div>${disciplineDeck(prefix)}</div><div class="study-progress" aria-hidden="true"><span data-study-current>01</span><i><b data-study-progress></b></i><span>03</span></div></div></section>
  <section class="education chapter" id="education" data-chapter="Applied education"><div class="shell education-grid"><div class="education-copy reveal"><p class="label">Applied education</p><h2><span>Education designed for</span><em>real-world impact.</em></h2><p>Programs are built around practical learning, industry relevance, and skills that employers are actively looking for.</p><p>Students work on real use cases, develop problem-solving skills, and build expertise in AI, cybersecurity, and emerging technologies. Smaller class sizes and close interaction with instructors support a more personal and hands-on learning experience.</p><div class="education-steps" aria-label="Education approach"><span>Academic foundations</span><span>Applied learning</span><span>Industry relevance</span><span>Real-world impact</span></div></div><figure class="education-photo reveal" data-media-hover><img src="${prefix}assets/images/applied-technology-lab.webp" alt="Illustrative image of applied technology learning" loading="lazy" decoding="async" data-parallax="0.2"><figcaption>Illustrative image</figcaption></figure></div></section>
  <section class="location chapter" id="location" data-chapter="Lake Geneva"><div class="shell chapter-heading reveal"><p class="label">Lake Geneva, Switzerland</p><h2><span>Study and live on</span><em>Lake Geneva.</em></h2></div><div class="shell">${locationTabs(prefix)}</div></section>
  <section class="international chapter" id="international" data-chapter="International students"><div class="shell international-layout"><div class="international-copy reveal"><p class="label">International students</p><h2><span>Support for your move</span><em>to Switzerland.</em></h2><p>Applications are open to candidates of all nationalities. Student Services provides personalized guidance from your offer through arrival and study in Switzerland.</p><div class="international-links"><a href="${localHref(prefix, 'student-services')}">Student support <span>↗</span></a><a href="${localHref(prefix, 'financing/fees-expenses')}">Fees &amp; expenses <span>↗</span></a><a href="${localHref(prefix, 'financing/scholarships')}">Scholarships <span>↗</span></a></div></div><div class="international-points"><article class="reveal"><span>Visa &amp; immigration</span><p>Guidance on student visa applications, residence permits, and renewals.</p></article><article class="reveal"><span>Accommodation</span><p>Limited student accommodation is allocated on a first-come, first-served basis. Early application is recommended.</p></article><article class="reveal"><span>Health insurance</span><p>Health insurance is mandatory in Switzerland. Student Services provides guidance on compliant coverage.</p></article><article class="reveal"><span>Intakes</span><p>Programs begin in January, April, and September.</p></article></div></div></section>
  <section class="home-admissions chapter" id="admissions" data-chapter="Admissions"><div class="shell"><div class="chapter-heading reveal"><p class="label">Admissions</p><h2><span>A clear path from application</span><em>to arrival.</em></h2></div><div class="admission-path"><article class="reveal"><span>01</span><h3>Apply</h3><p>Complete the application form and upload the required documents.</p></article><article class="reveal"><span>02</span><h3>Review</h3><p>The admissions team reviews your application and may invite you to an online interview.</p></article><article class="reveal"><span>03</span><h3>Decision</h3><p>Successful applicants receive an offer and the steps required to confirm their place.</p></article><article class="reveal"><span>04</span><h3>Visa and arrival</h3><p>Helvetic Tech provides guidance and supporting documentation for the visa process.</p></article></div><a class="line-link" href="${localHref(prefix, 'admissions')}">Admissions requirements and documents <span>↗</span></a></div></section>
  <section class="home-close" data-chapter="Apply"><div class="shell home-close__inner"><div class="reveal"><p class="label">Your next step</p><h2>Applications are open to candidates of all nationalities.</h2></div><div class="home-close__actions reveal"><a class="button-primary" href="${SITE.applyUrl}">Apply <span>↗</span></a><a class="button-secondary" href="${localHref(prefix, 'contact')}">Contact us <span>↗</span></a></div></div></section></main>`;
}

/* ---------------------------------------------------------------- programs */

export function renderPrograms(page, prefix) {
  return `<main id="main-content">${heroMedia({ prefix, label: 'Degree programs', plain: 'Bachelor and Master', italic: 'programs', lead: page.description, image: 'student-collaboration.webp', alt: 'Illustrative image of university students collaborating' })}
  <section class="catalogue chapter"><div class="shell catalogue-head reveal"><div><p class="label">Program pathways</p><h2><span>Choose your</span><em>specialization.</em></h2><p class="catalogue-note">Programs are delivered in partnership between Helvetic Tech and Tiffin University, combining a Swiss qualification with an American degree.</p></div><div class="level-filter" role="group" aria-label="Filter programs"><button class="is-active" type="button" data-program-filter="all" aria-pressed="true">All</button><button type="button" data-program-filter="bachelor" aria-pressed="false">Bachelor</button><button type="button" data-program-filter="master" aria-pressed="false">Master</button></div></div><div class="program-list" data-program-grid>${programRows(prefix)}</div></section>
  ${nextBand('Admissions', 'Admissions', localHref(prefix, 'admissions'))}</main>`;
}

export function renderProgram(page, prefix) {
  const facts = page.facts.map((item) => `<div class="program-fact reveal"><span>${esc(item.title)}</span><strong>${esc(item.text)}</strong></div>`).join('');
  const outcomes = page.outcomes.map((title) => ({ title }));
  const code = page.discipline === 'Cybersecurity' ? 'CY' : page.discipline === 'Blockchain' ? 'BC' : 'AI';
  const number = page.level === 'Master' ? '02' : '01';
  const bachelorImages = { AI: 'coding-detail.webp', CY: 'cyber-code.webp', BC: 'infrastructure.webp' };
  const programImage = page.level === 'Bachelor' ? bachelorImages[code] : null;
  const heroVisual = programImage ? `<figure class="program-hero__visual" aria-hidden="true"><img src="${prefix}assets/images/${programImage}" alt="" fetchpriority="high" decoding="async"><span>${number} · ${code}</span></figure>` : `<div class="program-hero__graphic" aria-hidden="true"><span>${code}</span><i></i><i></i><i></i><b>${number}</b></div>`;
  return `<main id="main-content"><section class="program-hero" data-discipline="${code.toLowerCase()}">${heroVisual}<div class="shell program-hero__content"><p class="label reveal">Dual ${esc(page.level)} Degree program</p><h1 class="reveal"><span>${esc(page.level)} of Science in</span><em>${esc(page.discipline)}</em></h1><p class="reveal">${esc(page.description)}</p><p class="program-hero__more reveal">${esc(page.descriptionMore)}</p><a class="line-link reveal" href="${SITE.applyUrl}">Start your application <span>↗</span></a></div></section><nav class="program-nav" aria-label="On this page"><div class="shell"><a href="#overview">Program overview</a><a href="#outcomes">Program learning outcomes</a><a href="#curriculum">Curriculum outline</a><a href="#careers">Career opportunities</a></div></nav>
  <section class="program-facts chapter--mint"><div class="shell program-facts__grid">${facts}</div></section>
  <section class="program-overview chapter" id="overview">${heading('Program overview', `${page.level} of Science in`, page.discipline)}<div class="shell program-copy"><div class="program-copy__lead reveal"><p>${esc(page.overview)}</p><p>${esc(page.overviewMore)}</p></div><dl class="degree-pair reveal"><div><dt>Helvetic Tech degree</dt><dd>${esc(page.title)}</dd></div><div><dt>TU degree</dt><dd>${esc(page.title)}</dd></div></dl></div></section>
  <section class="chapter chapter--mint" id="outcomes">${heading('Program learning outcomes', 'Program learning', 'outcomes')}${indexList(outcomes)}</section>
  <section class="chapter" id="curriculum">${heading('Curriculum outline', 'Curriculum', 'outline')}${timeline(page.curriculum)}</section>
  <section class="career chapter" id="careers"><div class="shell career-grid"><div class="career-signal reveal" aria-hidden="true"><span>${code}</span><i></i><b>${page.careers.length}</b></div><div class="reveal"><p class="label">Career opportunities</p><h2><span>Career</span><em>opportunities.</em></h2><div class="career-paths">${page.careers.map((career) => `<span>${esc(career)}</span>`).join('')}</div><a class="line-link" href="${localHref(prefix, 'admissions')}">Admissions <span>↗</span></a></div></div></section></main>`;
}

/* -------------------------------------------------------------- admissions */

export function renderAdmissions(page, prefix) {
  return `<main id="main-content">${heroMedia({ prefix, label: 'Admissions', plain: 'Admissions', italic: 'Overview', lead: page.description, image: 'students-classroom.webp', alt: 'University students studying in a classroom' })}
  ${split({ num: '01', label: 'Overview', title: 'Overview', body: `${page.intro} ${page.body}`, id: 'overview' })}
  ${factStrip(page.facts)}
  <section class="chapter" id="process">${heading('Application process', 'Application', 'process')}${timeline(page.steps)}</section>
  <section class="chapter chapter--mint" id="documents">${heading('Required documents', 'Required', 'documents')}${docList(page.documents)}<div class="shell doc-note reveal"><p>${esc(page.documentsNote)}</p></div></section>
  <section class="chapter" id="eligibility">${heading('Eligibility requirements', 'Eligibility', 'requirements')}${cardGrid({ items: page.eligibility, className: 'card-grid--three' })}</section>
  <section class="chapter" id="enrolment">${heading('Offer and enrollment', 'Offer and', 'enrollment')}${accordionStack(page.notes)}</section>
  ${ctaBand('Start your application', 'Start your', 'application.', SITE.applyUrl)}</main>`;
}

/* --------------------------------------------------------------- institute */

export function renderInstitute(page, prefix) {
  return `<main id="main-content">${heroEditorial({ label: 'About', plain: 'Helvetic Institute', italic: 'of Technology', lead: page.description })}
  ${editorialCols({ label: 'About Helvetic Tech', title: 'About Helvetic Institute of Technology', paras: [page.intro, page.body] })}
  ${pullQuote(page.mission)}
  ${split({ num: '02', label: 'Vision', title: 'Vision', body: page.vision, id: 'vision' })}
  <section class="chapter chapter--mint values-section" id="values">${heading('Values', 'Values', '')}${valueLedger(page.values)}</section>
  <section class="chapter" id="community">${heading('Community', 'Alumni &', 'Professional Network')}${cardGrid({ items: page.community, className: 'card-grid--two' })}</section>
  ${nextBand('Faculty', 'Learn from industry professionals', localHref(prefix, 'faculty'))}</main>`;
}

/* ------------------------------------------------------------------ campus */

export function renderCampus(page, prefix) {
  return `<main id="main-content">${heroMedia({ prefix, label: 'Campus Life', plain: 'Life on the', italic: 'Swiss Riviera', lead: page.description, image: 'lake-montreux.webp', alt: 'Lake Geneva and the Swiss Alps from Montreux' })}
  ${editorialCols({ label: 'Introduction', title: 'Introduction', paras: [page.intro, page.body] })}
  ${split({ num: '01', label: page.riviera.title, title: page.riviera.title, body: page.riviera.text, id: 'riviera' })}
  ${split({ num: '02', label: 'Campus environment', title: page.campus.title, body: page.campus.text, id: 'campus' })}
  <section class="chapter chapter--mint" id="activities">${heading('Activities and lifestyle', 'Activities and', 'lifestyle')}${indexList(page.activities.map((title) => ({ title })))}</section>
  ${pullQuote(page.quote)}
  ${mediaFeature({ prefix, img: 'campus-walk.webp', alt: 'Students walking together on campus', caption: 'Student life', eyebrow: page.cultural.title, title: page.cultural.title, text: page.cultural.text })}
  <section class="chapter" id="town">${heading('Student life', 'Student life &', 'Living in La Tour-de-Peilz')}${cardGrid({ items: [page.studentLife, { title: page.town.title, text: page.town.text }, { title: page.switzerland.title, text: page.switzerland.text }], className: 'card-grid--three' })}</section>
  ${nextBand('Admissions', 'Admissions', localHref(prefix, 'admissions'))}</main>`;
}

/* ----------------------------------------------------------------- faculty */

export function renderFaculty(page, prefix) {
  const people = page.people.map((person) => ({ title: person.name, tag: person.role || 'Faculty' }));
  return `<main id="main-content">${heroMedia({ prefix, label: 'Helvetic Tech Faculty', plain: 'Learn from', italic: 'industry professionals.', lead: page.description, image: 'faculty-seminar.webp', alt: 'Editorial illustration of a technology seminar' })}
  ${editorialCols({ label: 'Learn from industry professionals', title: 'Learn from industry professionals', paras: [page.intro] })}
  <section class="chapter chapter--mint" id="people">${heading('Faculty', 'Helvetic Tech', 'Faculty')}${cardGrid({ items: people, className: 'card-grid--three' })}</section>
  ${pullQuote('Our faculty bring current industry experience into the classroom, ensuring that teaching is grounded in real-world practice.')}
  ${nextBand('Programs', 'Dual Bachelor & Master Degrees', localHref(prefix, 'programs'))}</main>`;
}

/* ---------------------------------------------------------------- policies */

export function renderPolicies(page, prefix) {
  return `<main id="main-content">${heroCompact({ label: 'Policies', plain: 'Helvetic Institute', italic: 'of Technology', lead: page.description })}
  <section class="chapter policy-source" id="compliance">${heading('Compliance Policy', 'View Compliance', 'Policy')}<div class="shell reveal"><a class="compliance-card" href="${page.complianceUrl}" data-cursor="View"><span>Helvetic Institute of Technology complies with applicable global laws and regulations.</span><i aria-hidden="true">↗</i></a></div></section>
  ${nextBand('Request More Information', 'Request More Information', SITE.brochureUrl)}</main>`;
}

/* --------------------------------------------------------------------- FAQ */

export function renderFaq(page, prefix) {
  return `<main id="main-content">${heroCompact({ label: 'Frequently Asked Questions', plain: 'Frequently Asked', italic: 'Questions', lead: 'Shaping the next generation of professionals in a rapidly evolving technological landscape.' })}
  ${faqGroups(page.groups)}
  ${nextBand('Request More Information', 'Request More Information', SITE.brochureUrl)}</main>`;
}

/* ----------------------------------------------------------------- contact */

export function renderContact(page, prefix) {
  const details = page.details.map((item) => {
    let value = esc(item.value);
    if (item.term === 'Phone') value = `<a href="tel:${SITE.phoneHref}">${esc(item.value)}</a>`;
    return `<div><dt>${esc(item.term)}</dt><dd>${value}</dd></div>`;
  }).join('');
  return `<main id="main-content">${heroCompact({ label: 'Visit Us', plain: 'Helvetic Institute', italic: 'of Technology', lead: page.description })}
  <section class="chapter" id="details">${heading('Visit Us', 'Visit', 'Us')}<div class="shell contact-grid"><dl class="degree-pair reveal">${details}</dl></div></section>
  ${nextBand('Contact us', 'Request More Information', SITE.applyUrl)}</main>`;
}

/* ---------------------------------------------------------------- insights */

export function renderInsights(page, prefix) {
  return `<main id="main-content">${heroCompact({ label: 'Career outcomes', plain: 'The Helvetic Tech', italic: 'career advantage', lead: page.description })}${scrollStory(page.chapters, 'Career outcomes', 'Your career', 'starts here')}${nextBand('Programs', 'Dual Bachelor & Master Degrees', localHref(prefix, 'programs'))}</main>`;
}

/* ----------------------------------------------------------- source pages */

export function renderContent(page, prefix) {
  const [lead, ...rest] = page.sections;
  const type = page.route.startsWith('financing/') ? 'finance' : ['students', 'student-services', 'alumni'].includes(page.route) ? 'community' : 'academy';
  const visuals = {
    governance: ['governance-leadership.webp', 'Editorial illustration of academic leadership'],
    'student-services': ['student-support.webp', 'Editorial illustration of student support'],
    'institutional-development': ['institutional-campus.webp', 'Editorial illustration of a lakeside educational campus'],
    alumni: ['alumni-network.webp', 'Editorial illustration of alumni and professionals'],
  };
  const visual = visuals[page.route];
  const heroVisual = visual ? `<figure class="source-hero__image reveal"><img src="${prefix}assets/images/${visual[0]}" alt="${esc(visual[1])}" fetchpriority="high" decoding="async"><figcaption>Editorial illustration</figcaption></figure>` : `<div class="source-hero__index reveal" aria-hidden="true"><span>01</span><span>${String(page.sections.length).padStart(2, '0')}</span></div>`;
  const sectionBody = (section) => `${section.text ? `<p class="reveal">${esc(section.text)}</p>` : ''}${section.items ? `<ul class="source-ledger__list reveal">${section.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}${section.link ? `<a class="line-link reveal" href="${section.link.href}">${esc(section.link.label)} <span>↗</span></a>` : ''}`;
  const feature = lead ? `<section class="source-feature source-feature--${type}" id="section-1" data-chapter="${esc(lead.title)}"><div class="shell source-feature__grid"><span class="source-feature__number">01</span><div><p class="label reveal">${esc(lead.title)}</p><h2 class="reveal">${esc(lead.title)}</h2>${sectionBody(lead)}</div></div></section>` : '';
  const rows = rest.map((section, index) => `<article class="source-ledger__row reveal" id="section-${index + 2}"><span>${String(index + 2).padStart(2, '0')}</span><div><h2>${esc(section.title)}</h2>${sectionBody(section)}</div></article>`).join('');
  return `<main id="main-content"><section class="source-hero source-hero--${type}${visual ? ' source-hero--visual' : ' source-hero--typographic'}" data-chapter="${esc(page.title)}"><div class="shell source-hero__inner"><div class="source-hero__copy"><p class="label reveal">${esc(page.title)}</p><h1 class="reveal">${esc(page.title)}</h1><p class="reveal">${esc(page.description)}</p></div>${heroVisual}</div></section>${feature}${rows ? `<section class="source-ledger chapter" data-chapter="Explore"><div class="shell">${rows}</div></section>` : ''}</main>`;
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
};

export function documentFor(page) {
  const prefix = prefixFor(page.route);
  const render = RENDERERS[page.kind] || renderHome;
  const body = render(page, prefix);
  const active = page.route;
  const structuredData = JSON.stringify({ '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE.name, alternateName: SITE.short, url: SITE.url, telephone: SITE.phoneDisplay, address: { '@type': 'PostalAddress', streetAddress: SITE.address[0], postalCode: '1814', addressLocality: 'La Tour-de-Peilz', addressCountry: 'CH' } });
  return `<!doctype html><html lang="en" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(page.title)} | ${SITE.short}</title><meta name="description" content="${esc(page.description)}"><meta name="theme-color" content="#032f58"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="${esc(page.source || SITE.url)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&amp;family=Newsreader:ital,opsz,wght@1,6..72,300;1,6..72,400&amp;display=swap" rel="stylesheet"><link rel="stylesheet" href="${prefix}assets/styles.css?v=19"><script type="application/ld+json">${structuredData}</script><script>document.documentElement.classList.replace('no-js','js')</script></head><body data-page="${page.kind}"><a class="skip-link" href="#main-content">Skip to main content</a>${header(prefix, active)}${body}${footer(prefix)}<button class="back-top" type="button" aria-label="Back to top" data-back-top>↑</button><script defer src="${prefix}assets/main.js?v=19"></script><!-- Content source: ${page.source} --></body></html>`;
}
