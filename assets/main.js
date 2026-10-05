/* Helvetic Tech prototype — "Precision in Motion" interaction layer.
   Vanilla, dependency-free. Every behaviour degrades to a usable static state
   when JavaScript, canvas, or motion is unavailable. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced = () => reduceQuery.matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches && window.matchMedia('(hover: hover)').matches;

  // Cap the expensive motion layer on low-power and data-saving clients.
  const nav = navigator;
  const saveData = Boolean(nav.connection && nav.connection.saveData);
  const lowCores = (nav.hardwareConcurrency || 8) <= 4;
  const lowMemory = (nav.deviceMemory || 8) <= 4;
  const smallScreen = window.matchMedia('(max-width: 900px)').matches;
  const liteMotion = prefersReduced() || saveData || (smallScreen && (lowCores || lowMemory));

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const escapeHtml = (value = '') =>
    String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

  /* ------------------------------------------------------------ scroll bus */

  const scrollHandlers = new Set();
  let scrollTicking = false;

  function onScroll(handler) {
    scrollHandlers.add(handler);
    handler();
  }

  function attachScroll() {
    window.addEventListener(
      'scroll',
      () => {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(() => {
          scrollTicking = false;
          scrollHandlers.forEach((handler) => handler());
        });
      },
      { passive: true }
    );
    window.addEventListener('resize', () => scrollHandlers.forEach((handler) => handler()));
  }

  /* ---------------------------------------------------------------- reveals */

  function initReveals() {
    const targets = Array.from(document.querySelectorAll('.reveal'));
    if (!targets.length) return;

    const showAll = () => targets.forEach((el) => el.classList.add('is-visible'));

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('is-visible');
      else observer.observe(el);
    });

    // Safety net: never leave content invisible if the observer goes quiet.
    window.setTimeout(() => {
      if (!document.querySelector('.reveal.is-visible')) showAll();
    }, 2500);

    // A deep link can move the viewport before observers settle. Recheck the
    // final position so a directly linked chapter can never arrive invisible.
    if (window.location.hash) {
      window.setTimeout(() => {
        targets.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) el.classList.add('is-visible');
        });
      }, 180);
    }
  }

  /* --------------------------------------------------------- Swiss signal */

  function initSwissTime() {
    const clocks = document.querySelectorAll('[data-swiss-time]');
    if (!clocks.length || !('Intl' in window)) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Zurich',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const update = () => {
      const value = formatter.format(new Date());
      clocks.forEach((clock) => { clock.textContent = `Switzerland · ${value}`; });
    };

    update();
    window.setInterval(update, 30000);
  }

  function initHeroMotion() {
    const hero = document.querySelector('[data-hero]');
    if (!hero || prefersReduced() || liteMotion) return;

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
      const y = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
      hero.style.setProperty('--hero-x', x.toFixed(3));
      hero.style.setProperty('--hero-y', y.toFixed(3));
      hero.style.setProperty('--hero-active', '1');
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hero-x', '0');
      hero.style.setProperty('--hero-y', '0');
      hero.style.setProperty('--hero-active', '0');
    });
  }

  /* ----------------------------------------------------------------- header */

  function initHeader() {
    const header = document.querySelector('[data-header]');
    const bar = header && header.querySelector('.site-header__progress span');
    if (!header && !bar) return;

    let lastY = window.scrollY;

    onScroll(() => {
      const y = window.scrollY;

      if (header) {
        if (y > lastY + 4 && y > 140) header.classList.add('is-hidden');
        else if (y < lastY - 4 || y <= 140) header.classList.remove('is-hidden');
      }

      if (bar) {
        const span = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${span > 0 ? clamp(y / span, 0, 1) : 0})`;
      }

      lastY = y;
    });
  }

  /* ------------------------------------------------------------ mobile menu */

  function initMenu() {
    const menu = document.querySelector('[data-menu]');
    const scrim = document.querySelector('[data-menu-scrim]');
    if (!menu) return;

    const openBtn = document.querySelector('[data-menu-open]');
    const closeBtn = document.querySelector('[data-menu-close]');
    const groups = Array.from(menu.querySelectorAll('[data-menu-group]'));
    let lastFocused = null;

    groups.forEach((group) => {
      const toggle = group.querySelector('.menu-group__toggle');
      const panel = group.querySelector('.menu-group__panel');
      if (!toggle || !panel) return;
      toggle.addEventListener('click', () => {
        const willOpen = !group.classList.contains('is-open');
        groups.forEach((entry) => {
          entry.classList.remove('is-open');
          entry.querySelector('.menu-group__toggle')?.setAttribute('aria-expanded', 'false');
          entry.querySelector('.menu-group__panel')?.setAttribute('aria-hidden', 'true');
        });
        if (willOpen) {
          group.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
    });

    const setOpen = (open) => {
      menu.classList.toggle('is-open', open);
      if (scrim) scrim.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);

      if (open) {
        lastFocused = document.activeElement;
        const first = menu.querySelector('a, button');
        if (first) first.focus({ preventScroll: true });
      } else if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus({ preventScroll: true });
      }
    };

    if (openBtn) openBtn.addEventListener('click', () => setOpen(true));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    if (scrim) scrim.addEventListener('click', () => setOpen(false));

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab' || !menu.classList.contains('is-open')) return;

      const focusable = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });

    window.matchMedia('(min-width: 1101px)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* ------------------------------------------------------------- back to top */

  function initBackToTop() {
    const button = document.querySelector('[data-back-top]');
    if (!button) return;

    onScroll(() => button.classList.toggle('is-visible', window.scrollY > 700));

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------ chapter rail */

  function chapterLabel(section, index) {
    if (section.dataset.chapter) return section.dataset.chapter;
    const source = section.querySelector('.chapter-heading .label, .hero-meta span, .label, h2');
    let text = source ? source.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!text) text = `Section ${index + 1}`;
    return text.length > 34 ? `${text.slice(0, 33).trim()}…` : text;
  }

  function initChapterRail() {
    const main = document.querySelector('main');
    if (!main) return;

    const allSections = Array.from(main.querySelectorAll(':scope > section'));
    const markedSections = allSections.filter((section) => section.dataset.chapter);
    const sections = markedSections.length >= 2 ? markedSections : allSections;
    if (sections.length < 2) return;

    const nav = document.createElement('nav');
    nav.className = 'chapter-rail';
    nav.setAttribute('aria-label', 'Page sections');
    const toggle = document.createElement('button');
    toggle.className = 'chapter-rail__toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span data-rail-current>01</span><strong data-rail-label>Introduction</strong><i>Sections</i><b class="chapter-rail__progress" aria-hidden="true"><u data-rail-progress></u></b>';
    const list = document.createElement('ol');
    const links = [];

    sections.forEach((section, index) => {
      if (!section.id) section.id = `chapter-${index + 1}`;

      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.innerHTML = `<span class="chapter-rail__label">${escapeHtml(chapterLabel(section, index))}</span><span class="chapter-rail__num">${String(index + 1).padStart(2, '0')}</span>`;
      link.setAttribute('aria-label', `Go to ${chapterLabel(section, index)}`);
      link.addEventListener('click', (event) => {
        event.preventDefault();
        section.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
        if (history.replaceState) history.replaceState(null, '', `#${section.id}`);
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });

      const item = document.createElement('li');
      item.appendChild(link);
      list.appendChild(item);
      links.push({ link, section });
    });

    let closeTimer = null;
    const setOpen = (open) => {
      window.clearTimeout(closeTimer);
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      nav.addEventListener('pointerenter', () => setOpen(true));
      nav.addEventListener('pointerleave', () => {
        closeTimer = window.setTimeout(() => setOpen(false), 140);
      });
    }
    nav.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggle.focus();
    });

    nav.append(toggle, list);
    document.body.appendChild(nav);
    const railProgress = toggle.querySelector('[data-rail-progress]');

    document.addEventListener('pointerdown', (event) => {
      if (!nav.classList.contains('is-open') || nav.contains(event.target)) return;
      setOpen(false);
    });

    onScroll(() => {
      const line = window.innerHeight * 0.38;
      let active = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= line) active = index;
      });
      links.forEach((entry, index) => {
        const current = index === active;
        entry.link.classList.toggle('is-active', current);
        if (current) entry.link.setAttribute('aria-current', 'true');
        else entry.link.removeAttribute('aria-current');
      });
      const currentNumber = toggle.querySelector('[data-rail-current]');
      const currentLabel = toggle.querySelector('[data-rail-label]');
      if (currentNumber) currentNumber.textContent = `${String(active + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
      if (currentLabel) currentLabel.textContent = chapterLabel(sections[active], active);
      if (railProgress) {
        const rect = sections[active].getBoundingClientRect();
        const distance = Math.max(1, rect.height - window.innerHeight * 0.38);
        const progress = clamp((line - rect.top) / distance, 0, 1);
        railProgress.style.transform = `scaleX(${progress.toFixed(3)})`;
      }
    });
  }

  /* ----------------------------------------------------- expressive sections */

  function initStudyDeck() {
    const cards = Array.from(document.querySelectorAll('[data-study-project]'));
    if (!cards.length) return;

    const activate = (card) => cards.forEach((item) => item.classList.toggle('is-active', item === card));
    activate(cards[0]);

    cards.forEach((card) => {
      card.addEventListener('pointerenter', () => activate(card));
      card.addEventListener('focusin', () => activate(card));
      card.addEventListener('pointermove', (event) => {
        if (!finePointer || prefersReduced()) return;
        const rect = card.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
        const y = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
        card.style.setProperty('--card-x', x.toFixed(3));
        card.style.setProperty('--card-y', y.toFixed(3));
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--card-x', '0');
        card.style.setProperty('--card-y', '0');
      });
    });
  }

  function initStudyScroll() {
    const section = document.querySelector('[data-study-scroll]');
    const deck = section && section.querySelector('[data-study-deck]');
    if (!section || !deck) return;

    const cards = Array.from(deck.querySelectorAll('[data-study-project]'));
    const progressBar = section.querySelector('[data-study-progress]');
    const progressCurrent = section.querySelector('[data-study-current]');
    let travel = 0;

    const measure = () => {
      if (window.innerWidth <= 900 || prefersReduced()) {
        travel = 0;
        section.style.height = '';
        deck.style.transform = '';
        return;
      }
      travel = Math.max(0, deck.scrollWidth - window.innerWidth);
      section.style.height = `${Math.round(window.innerHeight + travel)}px`;
    };

    const update = () => {
      if (window.innerWidth <= 900 || prefersReduced()) {
        deck.style.transform = '';
        return;
      }
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / range, 0, 1);
      deck.style.transform = `translate3d(${(-progress * travel).toFixed(2)}px,0,0)`;
      if (progressBar) progressBar.style.transform = `scaleX(${progress.toFixed(3)})`;

      if (cards.length) {
        const centre = window.innerWidth * 0.55;
        let activeIndex = 0;
        let nearest = Infinity;
        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect();
          const distance = Math.abs(cardRect.left + cardRect.width / 2 - centre);
          if (distance < nearest) {
            nearest = distance;
            activeIndex = index;
          }
        });
        cards.forEach((card, index) => card.classList.toggle('is-active', index === activeIndex));
        if (progressCurrent) progressCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
      }
    };

    measure();
    onScroll(update);
    window.addEventListener('resize', () => {
      measure();
      update();
    }, { passive: true });
  }

  function initProgressRows() {
    const rows = Array.from(document.querySelectorAll('[data-progress-row]'));
    if (!rows.length || prefersReduced()) return;

    onScroll(() => {
      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const progress = clamp((window.innerHeight * 0.88 - rect.top) / (window.innerHeight * 0.7), 0, 1);
        row.style.setProperty('--row-progress', progress.toFixed(3));
      });
    });
  }

  /* ------------------------------------------------------------------- tabs */

  function activateTab(tabset, key, focus) {
    const tabs = Array.from(tabset.querySelectorAll('[role="tab"][data-tab]'));
    const panels = Array.from(tabset.querySelectorAll('[data-panel]'));

    for (const tab of tabs) {
      const active = tab.dataset.tab === key;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus({ preventScroll: true });
    }
    for (const panel of panels) {
      const active = panel.dataset.panel === key;
      panel.hidden = !active;
      if (active) {
        panel.style.animation = 'none';
        void panel.offsetWidth;
        panel.style.animation = '';
      }
    }

    if (tabset.hasAttribute('data-ribbon-tabs')) {
      const activeTab = tabs.find((tab) => tab.dataset.tab === key);
      const names = { ai: 'Artificial Intelligence', cyber: 'Cybersecurity', blockchain: 'Blockchain' };
      const code = activeTab?.dataset.fieldCode || key.slice(0, 2).toUpperCase();
      const codeNode = tabset.querySelector('[data-field-status-code]');
      const nameNode = tabset.querySelector('[data-field-status-name]');
      if (codeNode) codeNode.textContent = code;
      if (nameNode) nameNode.textContent = names[key] || '';
      if (window.HIT_NETWORK) window.HIT_NETWORK.setMode(key);
    }
    if (tabset.hasAttribute('data-location-tabs')) {
      tabset.querySelectorAll('[data-location-image]').forEach((figure) => {
        const active = figure.dataset.locationImage === key;
        figure.hidden = !active;
        figure.classList.toggle('is-active', active);
      });
    }
  }

  function initTabs() {
    document.querySelectorAll('[data-tabset]').forEach((tabset) => {
      const tabs = Array.from(tabset.querySelectorAll('[role="tab"][data-tab]'));
      if (!tabs.length) return;

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => activateTab(tabset, tab.dataset.tab, false));
        tab.addEventListener('keydown', (event) => {
          if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const index = tabs.indexOf(tab);
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
          if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = tabs.length - 1;
          activateTab(tabset, tabs[next].dataset.tab, true);
        });
      });

      const current = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
      activateTab(tabset, current.dataset.tab, false);
    });
  }

  /* -------------------------------------------------------------- accordions */

  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach((accordion) => {
      const trigger = accordion.querySelector('button');
      const panel = accordion.querySelector(':scope > div');
      if (!trigger || !panel) return;

      trigger.setAttribute('aria-expanded', 'false');
      if (!panel.id) panel.id = `accordion-${Math.random().toString(36).slice(2, 8)}`;
      trigger.setAttribute('aria-controls', panel.id);

      trigger.addEventListener('click', () => {
        const open = !accordion.classList.contains('is-open');
        accordion.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  /* ---------------------------------------------------------- program filter */

  function initProgramFilters() {
    const buttons = document.querySelectorAll('[data-program-filter]');
    const grid = document.querySelector('[data-program-grid]');
    if (!buttons.length || !grid) return;

    const rows = Array.from(grid.querySelectorAll('.program-row, .program-card'));

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const level = button.dataset.programFilter;

        buttons.forEach((other) => {
          const active = other === button;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        rows.forEach((row) => {
          const match = level === 'all' || row.dataset.level === level;
          row.classList.toggle('is-filtered', !match);
          row.hidden = !match;
        });
      });
    });
  }

  /* ------------------------------------------------------------ custom cursor */

  function initCursor() {
    if (!finePointer || prefersReduced() || liteMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.opacity = '0';

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.style.opacity = '0';
    const label = document.createElement('span');
    ring.appendChild(label);

    document.body.append(dot, ring);
    root.classList.add('has-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let seen = false;

    window.addEventListener(
      'pointermove',
      (event) => {
        mx = event.clientX;
        my = event.clientY;
        if (!seen) {
          seen = true;
          rx = mx;
          ry = my;
          dot.style.opacity = '1';
          ring.style.opacity = '1';
        }
        dot.style.transform = `translate(${mx}px, ${my}px)`;
      },
      { passive: true }
    );

    // The trailing rAF is paused whenever the tab is hidden.
    let trailing = true;
    const trail = () => {
      if (!trailing) return;
      rx = lerp(rx, mx, 0.18);
      ry = lerp(ry, my, 0.18);
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      window.requestAnimationFrame(trail);
    };
    window.requestAnimationFrame(trail);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trailing = false;
      } else if (!trailing) {
        trailing = true;
        window.requestAnimationFrame(trail);
      }
    });

    document.addEventListener('pointerover', (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest('[data-cursor]');
      if (!target) return;
      ring.classList.add('is-active');
      label.textContent = target.dataset.cursor || '';
    });
    document.addEventListener('pointerout', (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest('[data-cursor]');
      if (!target) return;
      ring.classList.remove('is-active');
      label.textContent = '';
    });
  }

  /* --------------------------------------------------------------- magnetic */

  function initMagnetic() {
    if (!finePointer || prefersReduced()) return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const pull = (event) => {
        const rect = el.getBoundingClientRect();
        const x = clamp((event.clientX - (rect.left + rect.width / 2)) * 0.24, -16, 16);
        const y = clamp((event.clientY - (rect.top + rect.height / 2)) * 0.24, -12, 12);
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      };
      const reset = () => {
        el.style.transform = '';
      };
      el.addEventListener('pointermove', pull);
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset);
    });
  }

  /* --------------------------------------------------------------- parallax */

  function initParallax() {
    if (prefersReduced() || liteMotion) return;

    const items = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
      el,
      strength: Number.parseFloat(el.dataset.parallax) || 0.5,
    }));
    if (!items.length) return;

    onScroll(() => {
      const vh = window.innerHeight;
      for (const item of items) {
        const rect = item.el.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > vh + 120) continue;
        const centre = rect.top + rect.height / 2;
        const progress = clamp((centre - vh / 2) / (vh / 2), -1.2, 1.2);
        const offset = -progress * item.strength * 46;
        item.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      }
    });
  }

  /* -------------------------------------------------------- media response */

  function initMediaHover() {
    if (!finePointer || prefersReduced() || liteMotion) return;

    document.querySelectorAll('[data-media-hover]').forEach((figure) => {
      figure.addEventListener('pointermove', (event) => {
        const rect = figure.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
        const y = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
        figure.style.setProperty('--media-x', `${(x * -12).toFixed(2)}px`);
        figure.style.setProperty('--media-y', `${(y * -9).toFixed(2)}px`);
        figure.style.setProperty('--media-active', '1');
      });
      figure.addEventListener('pointerleave', () => {
        figure.style.setProperty('--media-x', '0px');
        figure.style.setProperty('--media-y', '0px');
        figure.style.setProperty('--media-active', '0');
      });
    });
  }

  /* --------------------------------------------------------------- story rail */

  function initStory() {
    const story = document.querySelector('[data-story]');
    if (!story) return;

    const chapters = Array.from(story.querySelectorAll('[data-story-chapter]'));
    if (!chapters.length) return;

    const now = document.querySelector('[data-story-now]');
    const bar = document.querySelector('[data-story-bar]');

    onScroll(() => {
      const line = window.innerHeight * 0.42;
      let active = 0;
      let best = Infinity;
      chapters.forEach((chapter, index) => {
        const distance = Math.abs(chapter.getBoundingClientRect().top - line);
        if (distance < best) {
          best = distance;
          active = index;
        }
      });
      if (now) now.textContent = chapters[active].dataset.storyChapter;
      if (bar) {
        const rect = story.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        bar.style.height = `${(total > 0 ? clamp((line - rect.top) / total, 0, 1) * 100 : 100).toFixed(1)}%`;
      }
    });
  }

  /* ------------------------------------------------- signal field (canvas) */

  class SignalField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) return;
      this.mode = canvas.dataset.mode || 'ai';
      this.quality = liteMotion ? 'low' : 'high';
      this.slowFrames = 0;
      this.dpr = 1;
      this.width = 0;
      this.height = 0;
      this.pointer = { x: 0.5, y: 0.5, active: false };
      this.time = 0;
      this.dt = 0.016;
      this.boost = 0;
      this.blend = 1;
      this.from = this.target();
      this.frame = null;
      this.visible = true;
      this.resize();
      this.bind();
      if (prefersReduced()) this.render();
      else this.start();
    }

    resize() {
      if (!this.ctx) return;
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, this.quality === 'low' ? 1 : 2);
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.round(rect.width * this.dpr);
      this.canvas.height = Math.round(rect.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    bind() {
      window.addEventListener('resize', () => {
        this.resize();
        if (prefersReduced()) this.render();
      });

      if (finePointer && !prefersReduced()) {
        const area = this.canvas.parentElement || this.canvas;
        area.addEventListener('pointermove', (event) => {
          const rect = area.getBoundingClientRect();
          this.pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
          this.pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
          this.pointer.active = true;
        });
        area.addEventListener('pointerleave', () => {
          this.pointer.active = false;
        });
      }

      // Scroll velocity feeds the field, so reading the page moves the signal.
      window.addEventListener(
        'scroll',
        () => {
          this.boost = Math.min(1, this.boost + 0.28);
        },
        { passive: true }
      );

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stop();
        else if (!prefersReduced()) this.start();
      });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(
          (entries) => {
            const inView = entries[0].isIntersecting;
            if (inView && !this.visible) {
              this.visible = true;
              if (!prefersReduced()) this.start();
            } else if (!inView && this.visible) {
              this.visible = false;
              this.stop();
            }
          },
          { threshold: 0.01 }
        ).observe(this.canvas);
      }
    }

    setMode(mode) {
      if (mode === this.mode) return;
      this.from = this.blended();
      this.blend = 0;
      this.mode = mode;
      this.canvas.dataset.mode = mode;
      if (prefersReduced()) {
        this.blend = 1;
        this.render();
      }
    }

    target() {
      if (this.mode === 'cyber')
        return { speed: 0.16, amp: 0.11, freq: 2.1, taper: 0.35, nodes: 9, snap: 1, block: 0 };
      if (this.mode === 'blockchain')
        return { speed: 0.3, amp: 0.13, freq: 0.85, taper: 0.42, nodes: 8, snap: 0, block: 1 };
      return { speed: 0.22, amp: 0.16, freq: 1.15, taper: 0.55, nodes: 7, snap: 0, block: 0 };
    }

    blended() {
      const to = this.target();
      if (this.blend >= 1) return to;
      const from = this.from || to;
      const k = this.blend;
      return {
        speed: lerp(from.speed, to.speed, k),
        amp: lerp(from.amp, to.amp, k),
        freq: lerp(from.freq, to.freq, k),
        taper: lerp(from.taper, to.taper, k),
        nodes: Math.max(2, Math.round(lerp(from.nodes, to.nodes, k))),
        snap: lerp(from.snap, to.snap, k),
        block: lerp(from.block, to.block, k),
      };
    }

    start() {
      if (this.frame) return;
      let last = performance.now();
      const loop = (now) => {
        this.frame = window.requestAnimationFrame(loop);
        const elapsed = now - last;
        if (this.quality === 'low' && elapsed < 33) return;
        this.dt = Math.min(elapsed / 1000, 0.05);
        last = now;
        this.time += this.dt * (1 + this.boost * 1.8);
        this.boost *= 0.94;
        if (this.blend < 1) this.blend = Math.min(1, this.blend + this.dt / 0.7);
        this.adapt();
        this.render();
      };
      this.frame = window.requestAnimationFrame(loop);
    }

    // Drop resolution and frame rate once if the device is struggling.
    adapt() {
      if (this.quality === 'low') return;
      if (this.dt > 0.045) this.slowFrames += 1;
      else if (this.dt < 0.032) this.slowFrames = Math.max(0, this.slowFrames - 1);
      if (this.slowFrames > 45) {
        this.quality = 'low';
        this.slowFrames = 0;
        this.resize();
      }
    }

    stop() {
      if (this.frame) window.cancelAnimationFrame(this.frame);
      this.frame = null;
    }

    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);
      const p = this.blended();
      const count = this.quality === 'low' ? 4 : 6;
      const mid = h * 0.5;
      const px = (this.pointer.x - 0.5) * 2;
      const py = (this.pointer.y - 0.5) * 2;
      const influence = this.pointer.active && finePointer ? 1 : 0;
      const focusX = 0.5 - px * 0.06 * influence;
      const yShift = py * h * 0.16 * influence;
      const segments = this.quality === 'low' ? Math.max(24, Math.round(w / 24)) : Math.max(36, Math.round(w / 14));
      const energy = 1 + this.boost * 0.6;

      for (let i = 0; i < count; i++) {
        const offset = (i - (count - 1) / 2) / Math.max(1, count - 1);
        const phase = i * 0.9 + this.time * p.speed * (1 + i * 0.08) * energy;
        const alpha = 0.16 + 0.4 * (1 - Math.abs(offset));

        ctx.beginPath();
        ctx.lineWidth = 0.6 + (1 - Math.abs(offset)) * 1.1;

        for (let s = 0; s <= segments; s++) {
          const u = s / segments;
          const envelope = Math.pow(Math.sin(Math.PI * u), p.taper);
          const wave = Math.sin(u * Math.PI * 2 * p.freq + phase) * p.amp * envelope;
          const local = (u - focusX) * Math.exp(-Math.pow((u - focusX) * 2.4, 2)) * 0.5 * influence;

          let y = mid + wave * h + offset * h * (0.16 + 0.05 * Math.sin(u * 6 + phase)) + local * h * 0.4 + yShift;
          let x = u * w;

          if (p.snap > 0.5) {
            const band = Math.round(y / (h / 8)) * (h / 8);
            const anomaly = Math.sin(u * 19 + this.time * 1.6 + i) > 0.93 ? 1 : 0;
            y = y * 0.35 + band * 0.65 + anomaly * h * 0.05;
          }

          if (p.block > 0.5) {
            const step = Math.floor(u * 12) / 12;
            y = mid + (Math.sin(step * Math.PI * 2 * p.freq + phase) * p.amp + offset * h * 0.18);
            x = step * w;
          }

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, 'rgba(201,236,232,0)');
        grad.addColorStop(0.18, `rgba(201,236,232,${alpha * 0.7})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.82, `rgba(201,236,232,${alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(201,236,232,0)');
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      const nodeCount = p.nodes;
      for (let n = 0; n < nodeCount; n++) {
        const u = (n + 0.5) / nodeCount;
        const envelope = Math.pow(Math.sin(Math.PI * u), p.taper);
        const y =
          mid +
          Math.sin(u * Math.PI * 2 * p.freq + this.time * p.speed * 2) * p.amp * envelope +
          (u - focusX) * h * 0.06 * influence;
        const x = u * w;
        const pulse = 0.5 + 0.5 * Math.sin(this.time * 1.8 - n * 0.8);

        ctx.beginPath();
        ctx.arc(x, y, 1.6 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.25 + pulse * 0.5})`;
        ctx.fill();

        if (p.block > 0.5) {
          ctx.strokeStyle = `rgba(201,236,232,${0.12 + pulse * 0.16})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x - 8, y - 8, 16, 16);
        }
      }

      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.1, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      vignette.addColorStop(0, 'rgba(5,47,89,0)');
      vignette.addColorStop(1, 'rgba(5,47,89,0.55)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function initSignalField() {
    const canvases = document.querySelectorAll('canvas[data-ribbon]');
    if (!canvases.length) return;
    if (!('getContext' in HTMLCanvasElement.prototype)) return;

    try {
      window.HIT_SIGNAL = new SignalField(canvases[0]);
    } catch (error) {
      /* Canvas unavailable — the surrounding stage is decorative only. */
    }
  }

  /* ----------------------------------------------- interactive node network */

  class NetworkField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) return;
      this.points = [];
      this.mode = 'ai';
      this.pointer = { x: 0, y: 0, active: false };
      this.frame = null;
      this.resize();
      this.seed();
      this.bind();
      if (prefersReduced()) this.render();
      else this.start();
    }

    setMode(mode) {
      this.mode = ['ai', 'cyber', 'blockchain'].includes(mode) ? mode : 'ai';
      this.canvas.dataset.mode = this.mode;
      this.points.forEach((point, index) => {
        point.accent = index % (this.mode === 'ai' ? 13 : this.mode === 'cyber' ? 9 : 7) === 0;
      });
      this.render();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, liteMotion ? 1 : 1.6);
      this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
      this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    seed() {
      const count = liteMotion ? 28 : Math.min(64, Math.max(42, Math.round(this.width / 22)));
      this.points = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        accent: index % 13 === 0,
        radius: 1.2 + Math.random() * 1.5,
      }));
    }

    bind() {
      window.addEventListener('resize', () => {
        this.resize();
        this.seed();
        if (prefersReduced()) this.render();
      });
      const area = this.canvas.parentElement || this.canvas;
      if (!prefersReduced()) {
        area.addEventListener('pointermove', (event) => {
          const rect = area.getBoundingClientRect();
          this.pointer.x = event.clientX - rect.left;
          this.pointer.y = event.clientY - rect.top;
          this.pointer.active = true;
        });
        area.addEventListener('pointerleave', () => { this.pointer.active = false; });
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stop();
        else if (!prefersReduced()) this.start();
      });
    }

    start() {
      if (this.frame) return;
      const loop = () => {
        this.frame = window.requestAnimationFrame(loop);
        this.update();
        this.render();
      };
      this.frame = window.requestAnimationFrame(loop);
    }

    stop() {
      if (this.frame) window.cancelAnimationFrame(this.frame);
      this.frame = null;
    }

    update() {
      for (const point of this.points) {
        if (this.pointer.active) {
          const dx = this.pointer.x - point.x;
          const dy = this.pointer.y - point.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < 190) {
            point.vx += (dx / distance) * 0.006;
            point.vy += (dy / distance) * 0.006;
          }
        }
        point.vx = clamp(point.vx, -0.25, 0.25);
        point.vy = clamp(point.vy, -0.25, 0.25);
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < -10) point.x = this.width + 10;
        if (point.x > this.width + 10) point.x = -10;
        if (point.y < -10) point.y = this.height + 10;
        if (point.y > this.height + 10) point.y = -10;
      }
    }

    render() {
      const { ctx, width, height } = this;
      const palettes = {
        ai: { line: '201,236,232', point: '255,255,255', accent: '255,31,47' },
        cyber: { line: '143,211,232', point: '222,244,249', accent: '89,191,219' },
        blockchain: { line: '224,213,187', point: '251,246,235', accent: '229,168,76' },
      };
      const palette = palettes[this.mode] || palettes.ai;
      ctx.clearRect(0, 0, width, height);
      const threshold = liteMotion ? 105 : 132;
      for (let i = 0; i < this.points.length; i += 1) {
        const point = this.points[i];
        for (let j = i + 1; j < this.points.length; j += 1) {
          const other = this.points[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance > threshold) continue;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(${palette.line},${(1 - distance / threshold) * 0.22})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        if (this.pointer.active) {
          const pointerDistance = Math.hypot(point.x - this.pointer.x, point.y - this.pointer.y);
          if (pointerDistance < 220) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(this.pointer.x, this.pointer.y);
            ctx.strokeStyle = `rgba(${palette.line},${(1 - pointerDistance / 220) * 0.48})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.accent ? point.radius + 1 : point.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.accent ? `rgba(${palette.accent},.95)` : `rgba(${palette.point},.72)`;
        ctx.fill();
      }
      if (this.pointer.active) {
        ctx.beginPath();
        ctx.arc(this.pointer.x, this.pointer.y, 13, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${palette.line},.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.pointer.x, this.pointer.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.accent},.95)`;
        ctx.fill();
      }
    }
  }

  function initNetworkField() {
    const canvas = document.querySelector('canvas[data-network]');
    if (!canvas || !('getContext' in HTMLCanvasElement.prototype)) return;
    try { window.HIT_NETWORK = new NetworkField(canvas); } catch (error) { /* Decorative canvas only. */ }
  }

  /* ------------------------------------------------------------------- init */

  function init() {
    attachScroll();
    initReveals();
    initSwissTime();
    initHeroMotion();
    initHeader();
    initMenu();
    initBackToTop();
    initChapterRail();
    initStudyDeck();
    initStudyScroll();
    initProgressRows();
    initStory();
    initTabs();
    initAccordions();
    initProgramFilters();
    initCursor();
    initMagnetic();
    initParallax();
    initMediaHover();
    initSignalField();
    initNetworkField();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
