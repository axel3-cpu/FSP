const siteHeader = document.querySelector('.site-header');

function updateHeaderOnScroll() {
  if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
}

updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

// Site-wide search covers pages, sections, and interactive tools.
const searchItems = [
  { title: 'Home', detail: 'FS Panic builder collective and launchpad', href: 'index.html#home', keywords: 'homepage collective builder launchpad' },
  { title: 'Builder pathways', detail: 'Choose an idea, working build, or builder pathway', href: 'index.html#panic-pathways', keywords: 'pathway idea mvp build builder tabs selector' },
  { title: 'Venture showcase & filters', detail: 'Explore example AI, commerce, hardware, and DevTools builds', href: 'index.html#panic-showcase', keywords: 'ventures filter ai commerce hardware devtools showcase categories' },
  { title: 'PanicHack buildathon', detail: 'See the 36-hour buildathon concept and register interest', href: 'index.html#buildathon', keywords: 'event hackathon buildathon panic hack register' },
  { title: 'Quick project pitch', detail: 'Add a one-line idea to the project enquiry form', href: 'index.html#quick-pitch', keywords: 'pitch idea quick form submit project' },
  { title: 'Resource vault', detail: 'Cloud, commerce, legal, and maker-lab resources', href: 'index.html#panic-vault', keywords: 'resources cloud ai commerce legal tools lab' },
  { title: 'Design gallery filters', detail: 'Filter 420 concepts by business, shop, creative, wellness, food, or community', href: 'design.html#template-gallery', keywords: 'design gallery filter category business shop creative wellness food community' },
  { title: 'Temporary design preview', detail: 'Preview a design concept across the site for 10 seconds', href: 'design.html#template-gallery', keywords: 'preview templates concept theme color' },
  { title: 'Mobile navigation', detail: 'Open the site menu from the header menu button', href: 'index.html#home', keywords: 'mobile menu navigation hamburger header' },
  { title: 'Project enquiry form', detail: 'Share project details and contact information', href: 'index.html#project-enquiry', keywords: 'contact form enquiry pitch email project' },
  { title: 'Color themes', detail: 'Switch between Violet, Ocean, Rose, and Light themes', href: 'index.html#theme-heading', keywords: 'theme color appearance violet ocean rose light' },
  { title: 'About the team', detail: 'Learn about CORE FS PANIC and its approach', href: 'index.html#about', keywords: 'about company team approach' },
  { title: 'Meet the team', detail: 'Profiles for Axel, President, Designer, Tester, and Graphics Designer', href: 'index.html#team', keywords: 'people profiles president vice designer tester graphics' },
  { title: 'Services', detail: 'Strategy, website design, and web development', href: 'services.html', keywords: 'services offering' },
  { title: 'Strategy & direction', detail: 'Project discovery, planning, and website strategy', href: 'strategy.html', keywords: 'strategy discover planning direction' },
  { title: 'Website design', detail: 'Design service and 420-concept template gallery', href: 'design.html', keywords: 'design gallery templates concepts preview filters' },
  { title: 'Web development', detail: 'Responsive website development and build process', href: 'development.html', keywords: 'development build code responsive' },
  { title: 'Work & projects', detail: 'Browse project examples and case studies', href: 'work.html', keywords: 'work portfolio projects case studies' },
  { title: 'Order a project', detail: 'Go to the project enquiry form', href: 'services.html#project-enquiry', keywords: 'order start contact quote enquiry' },
  { title: 'Preview design concepts', detail: 'Explore template categories and temporary site previews', href: 'design.html#template-gallery', keywords: 'templates preview concept business shop creative wellness food community' },
  { title: 'Axel · President', detail: 'Leadership and project vision', href: 'president.html', keywords: 'axel president leadership' },
  { title: 'Vice President', detail: 'Planning and communication', href: 'vice-president.html', keywords: 'vice president coordination planning' },
  { title: 'Designer', detail: 'Web layouts and user experience', href: 'designer.html', keywords: 'designer creative ux user experience' },
  { title: 'Tester', detail: 'Usability and quality checks', href: 'tester.html', keywords: 'tester testing quality usability' },
  { title: 'Graphics Designer', detail: 'Visual identity and graphics', href: 'graphics-designer.html', keywords: 'graphics visual identity' }
];

if (siteHeader) {
  const searchButton = document.createElement('button');
  searchButton.className = 'site-search-toggle';
  searchButton.type = 'button';
  searchButton.setAttribute('aria-label', 'Open site search');
  searchButton.setAttribute('aria-expanded', 'false');
  searchButton.setAttribute('aria-haspopup', 'dialog');
  searchButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"></circle><path d="m16 16 4.2 4.2"></path></svg>';
  siteHeader.insertBefore(searchButton, menuToggle || navigation || null);

  const searchDialog = document.createElement('div');
  searchDialog.className = 'site-search-overlay';
  searchDialog.hidden = true;
  searchDialog.innerHTML = '<section class="site-search-dialog" role="dialog" aria-modal="true" aria-labelledby="site-search-title"><div class="site-search-heading"><div><p class="eyebrow">// GLOBAL_SEARCH</p><h2 id="site-search-title">Find anything.</h2></div><button class="site-search-close" type="button" aria-label="Close search">×</button></div><label class="site-search-field"><span aria-hidden="true">⌕</span><input type="search" autocomplete="off" placeholder="Search pages, services, tools…" aria-label="Search the website" aria-controls="site-search-results" /><kbd>ESC</kbd></label><p class="site-search-hint">Search pages, sections, people, and site features.</p><div class="site-search-results" id="site-search-results" role="listbox" aria-label="Search results" aria-live="polite"></div></section>';
  document.body.append(searchDialog);

  const searchInput = searchDialog.querySelector('input');
  const searchResults = searchDialog.querySelector('.site-search-results');
  const searchClose = searchDialog.querySelector('.site-search-close');

  function renderSearchResults(query = '') {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = searchItems.filter((item) => {
      const searchable = `${item.title} ${item.detail} ${item.keywords}`.toLowerCase();
      return terms.every((term) => searchable.includes(term));
    }).slice(0, 8);

    searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'site-search-empty';
      empty.textContent = 'No matching pages or features. Try another search.';
      searchResults.append(empty);
      return;
    }

    matches.forEach((item, index) => {
      const result = document.createElement('a');
      result.className = 'site-search-result';
      result.href = item.href;
      result.setAttribute('role', 'option');
      result.setAttribute('aria-selected', 'false');
      result.innerHTML = `<span class="site-search-result-icon" aria-hidden="true">${index === 0 ? '↗' : '⌕'}</span><span><strong></strong><small></small></span><span class="site-search-result-arrow" aria-hidden="true">↗</span>`;
      result.querySelector('strong').textContent = item.title;
      result.querySelector('small').textContent = item.detail;
      searchResults.append(result);
    });
  }

  function openSiteSearch() {
    searchDialog.hidden = false;
    searchButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('site-search-open');
    renderSearchResults(searchInput.value);
    window.setTimeout(() => searchInput.focus(), 0);
  }

  function closeSiteSearch() {
    searchDialog.hidden = true;
    searchButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('site-search-open');
    searchButton.focus();
  }

  searchButton.addEventListener('click', openSiteSearch);
  searchClose.addEventListener('click', closeSiteSearch);
  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  searchResults.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeSiteSearch();
  });
  searchDialog.addEventListener('click', (event) => {
    if (event.target === searchDialog) closeSiteSearch();
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (searchDialog.hidden) openSiteSearch();
      else closeSiteSearch();
    }
    if (event.key === 'Escape' && !searchDialog.hidden) closeSiteSearch();
  });
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.site-footer').forEach((footer) => {
  if (footer.querySelector('.footer-social-links')) return;

  const socialLinks = document.createElement('div');
  socialLinks.className = 'footer-social-links';
  socialLinks.setAttribute('aria-label', 'Contact and social links');
  socialLinks.innerHTML = `
    <a href="mailto:axel348347@gmail.com" aria-label="Email Axel" title="Email Axel">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path></svg>
    </a>
    <a href="https://github.com/axel3-cpu" target="_blank" rel="noopener noreferrer" aria-label="Visit Axel’s GitHub profile" title="GitHub">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 0 0-6.9 0C5.5 1.2 4.3 1.6 4.3 1.6a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22"></path></svg>
    </a>`;
  footer.append(socialLinks);
});

const validThemes = ['violet', 'ocean', 'rose', 'light'];

if (!document.querySelector('[data-theme-choice]')) {
  const themePicker = document.createElement('aside');
  themePicker.className = 'theme-picker theme-picker-floating';
  themePicker.setAttribute('aria-label', 'Site color theme');
  themePicker.innerHTML = `<div class="theme-picker-copy"><h3>Make it yours</h3><p>Choose a color theme for the site.</p></div><div class="theme-options" role="radiogroup" aria-label="Choose a color theme"><button class="theme-option" type="button" role="radio" aria-checked="true" data-theme-choice="violet"><span class="theme-swatch swatch-violet"></span>Violet</button><button class="theme-option" type="button" role="radio" aria-checked="false" data-theme-choice="ocean"><span class="theme-swatch swatch-ocean"></span>Ocean</button><button class="theme-option" type="button" role="radio" aria-checked="false" data-theme-choice="rose"><span class="theme-swatch swatch-rose"></span>Rose</button><button class="theme-option" type="button" role="radio" aria-checked="false" data-theme-choice="light"><span class="theme-swatch swatch-light"></span>Light</button></div>`;
  document.body.append(themePicker);
}

const themeOptions = document.querySelectorAll('[data-theme-choice]');
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  if (!validThemes.includes(theme)) return;

  document.body.dataset.theme = theme;
  themeOptions.forEach((option) => {
    option.setAttribute('aria-checked', String(option.dataset.themeChoice === theme));
  });
  if (themeColor) {
    const themeColors = { violet: '#090b12', ocean: '#07111a', rose: '#160b12', light: '#f4f3f8' };
    themeColor.setAttribute('content', themeColors[theme]);
  }

  try {
    localStorage.setItem('axel-portfolio-theme', theme);
  } catch (error) {
    // The theme still works for this visit if browser storage is unavailable.
  }
}

themeOptions.forEach((option) => {
  option.addEventListener('click', () => applyTheme(option.dataset.themeChoice));
  option.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = Array.from(themeOptions).indexOf(option);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextOption = themeOptions[(currentIndex + direction + themeOptions.length) % themeOptions.length];
    nextOption.focus();
    applyTheme(nextOption.dataset.themeChoice);
  });
});

let savedTheme = 'violet';
try {
  const storedTheme = localStorage.getItem('axel-portfolio-theme');
  if (validThemes.includes(storedTheme)) savedTheme = storedTheme;
} catch (error) {
  // Use the default theme when browser storage is unavailable.
}
applyTheme(savedTheme);

document.querySelectorAll('.project-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('[type="submit"]');
    const originalButtonContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
      const endpoint = form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error('The enquiry could not be submitted. Please try again.');
      }

      const successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.setAttribute('role', 'status');
      successMessage.setAttribute('aria-live', 'assertive');
      successMessage.tabIndex = -1;
      successMessage.innerHTML = '<span class="success-confetti" aria-hidden="true">🎉</span><p class="eyebrow">Enquiry received</p><h2>Thank you!</h2><p>Your project enquiry was sent successfully. Taking you home in a moment…</p>';
      form.replaceChildren(successMessage);
      successMessage.focus();

      window.setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } catch (error) {
      let errorMessage = form.querySelector('.form-error');
      if (!errorMessage) {
        errorMessage = document.createElement('p');
        errorMessage.className = 'form-error';
        errorMessage.setAttribute('role', 'alert');
        form.querySelector('.form-submit').append(errorMessage);
      }
      errorMessage.textContent = 'Sorry, your enquiry could not be sent. Please check your connection and try again.';
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonContent;
    }
  });
});

const quickPitchForm = document.getElementById('panic-quick-pitch');
if (quickPitchForm) {
  quickPitchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const pitch = quickPitchForm.elements.pitch.value.trim();
    const projectDetails = document.getElementById('home-project-details');
    const enquirySection = document.getElementById('project-enquiry');
    const nameField = document.getElementById('home-client-name');

    if (!pitch || !projectDetails || !enquirySection) return;
    projectDetails.value = `Project idea: ${pitch}${projectDetails.value ? `\n\n${projectDetails.value}` : ''}`;
    enquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => nameField?.focus({ preventScroll: true }), 350);
  });
}

const templateGrid = document.getElementById('template-grid');
if (templateGrid) {
  const categories = [
    { key: 'business', label: 'Business', names: ['Northline Consulting', 'Brightpath Studio', 'Elevate Advisory', 'Clearframe Legal', 'Aster Architecture', 'Fieldwork Agency', 'Goodwell Finance'] },
    { key: 'shop', label: 'Online shop', names: ['Sunday Supply', 'Common Thread', 'Terra Home', 'Little Orbit Kids', 'Wildflower Market', 'Foundry Goods', 'Kindred Skincare'] },
    { key: 'creative', label: 'Creative', names: ['Studio Outline', 'Frame by Frame', 'Paper & Pixel', 'Lumen Photography', 'Forma Interiors', 'Open Canvas', 'Morrow Design Co.'] },
    { key: 'wellness', label: 'Wellness', names: ['Soft Ritual', 'The Daily Practice', 'Mellow Movement', 'Rooted Nutrition', 'Stillwater Therapy', 'Bloom Wellness', 'Calm Current'] },
    { key: 'food', label: 'Food & stay', names: ['Olive & Ember', 'Daybreak Coffee', 'The Little Table', 'Cedar House', 'Coastline Stays', 'Saffron Kitchen', 'Sunday Bakery'] },
    { key: 'community', label: 'Community', names: ['The Makers Circle', 'Good Neighbors', 'Open Door Club', 'Local Stories', 'Brightside Learning', 'Common Ground', 'Playhouse Collective'] }
  ];
  const palettes = [
    ['#f2e9dc', '#33271f', '#b76745'], ['#e6eee9', '#1e3931', '#527b66'],
    ['#eee8f5', '#342646', '#8b67ae'], ['#f7e5e1', '#442a32', '#d46f79'],
    ['#e3edf0', '#20343b', '#5793a3'], ['#f0edda', '#33311f', '#a19c50'],
    ['#252536', '#f7f1e8', '#ac91ff']
  ];
  const styles = ['Studio', 'Modern', 'Editorial', 'Bold', 'Minimal', 'Classic', 'Organic', 'Digital', 'Luxe', 'Playful'];
  const templates = categories.flatMap((category, groupIndex) => category.names.flatMap((name, itemIndex) =>
    styles.map((style, styleIndex) => ({
      name: `${name} ${style}`,
      category: category.key,
      categoryLabel: category.label,
      palette: palettes[(groupIndex + itemIndex + styleIndex) % palettes.length],
      layout: (groupIndex * 2 + itemIndex + styleIndex) % 6
    }))
  ));

  templateGrid.innerHTML = templates.map((template, index) => {
    const [background, ink, accent] = template.palette;
    const title = template.name.split(/\s+/).slice(0, 2).join('<br />');
    return `<article class="template-card" data-template-category="${template.category}">
      <div class="template-preview layout-${template.layout}" style="--preview-bg:${background};--preview-ink:${ink};--preview-accent:${accent}" aria-label="Preview concept ${index + 1}: ${template.name}">
        <div class="preview-nav"><span>${template.name.toUpperCase()}</span><span aria-hidden="true"></span></div>
        <div class="preview-title">${title}<br /><i>made with purpose.</i></div>
        <div class="preview-shape" aria-hidden="true"></div><div class="preview-button" aria-hidden="true"></div>
      </div>
      <div class="template-meta"><div><h3>${String(index + 1).padStart(3, '0')}. ${template.name}</h3><p>${template.categoryLabel} · Design concept</p></div><button class="template-apply" type="button" data-preview-template="${template.name}" data-preview-background="${background}" data-preview-ink="${ink}" data-preview-accent="${accent}" aria-label="Preview the ${template.name} design across the site for 10 seconds">Preview 10s</button></div>
    </article>`;
  }).join('');

  let previewTimeout;
  let loadingInterval;
  let previewNotice;
  const designLoader = document.createElement('div');
  designLoader.className = 'design-loader';
  designLoader.setAttribute('role', 'status');
  designLoader.setAttribute('aria-live', 'polite');
  designLoader.setAttribute('aria-hidden', 'true');
  designLoader.innerHTML = `<div class="loader-orbit loader-orbit-outer" aria-hidden="true"></div><div class="loader-orbit loader-orbit-middle" aria-hidden="true"></div><div class="loader-orbit loader-orbit-inner" aria-hidden="true"><i></i></div><span class="loader-deco loader-top" aria-hidden="true"></span><span class="loader-deco loader-right" aria-hidden="true"></span><span class="loader-deco loader-bottom" aria-hidden="true"></span><span class="loader-deco loader-left" aria-hidden="true"></span><div class="design-loader-content"><div class="design-loader-mark">FSP</div><div class="loader-axel">AXEL</div><p class="loader-system-status" data-loader-status>INITIALIZING DESIGN SYSTEM</p><div class="loader-progress" role="progressbar" aria-label="Design preview loading" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-loader-progress></span></div><div class="loader-progress-meta"><span data-loader-progress-label>0%</span><span>BOOT SEQUENCE</span></div></div>`;
  document.body.append(designLoader);

  const loaderStatus = designLoader.querySelector('[data-loader-status]');
  const loaderProgress = designLoader.querySelector('[data-loader-progress]');
  const loaderProgressLabel = designLoader.querySelector('[data-loader-progress-label]');
  const loaderProgressBar = designLoader.querySelector('[role="progressbar"]');
  const loaderMessages = [
    { at: 0, text: 'INITIALIZING DESIGN SYSTEM' },
    { at: 28, text: 'CALIBRATING ORBITAL INTERFACE' },
    { at: 58, text: 'SYNCHRONIZING COLOR MATRICES' },
    { at: 84, text: 'FINALIZING VISUAL EXPERIENCE' },
    { at: 100, text: 'SYSTEM READY · LAUNCHING PREVIEW' }
  ];

  function playDesignLoader(onComplete = () => {}) {
    window.clearInterval(loadingInterval);
    const startedAt = performance.now();
    designLoader.classList.add('is-visible');
    designLoader.setAttribute('aria-hidden', 'false');
    loaderProgress.style.width = '0%';
    loaderProgressLabel.textContent = '0%';
    loaderProgressBar.setAttribute('aria-valuenow', '0');
    loaderStatus.textContent = loaderMessages[0].text;

    loadingInterval = window.setInterval(() => {
      const progress = Math.min(100, Math.round(((performance.now() - startedAt) / 1300) * 100));
      const message = [...loaderMessages].reverse().find((item) => progress >= item.at);
      loaderProgress.style.width = `${progress}%`;
      loaderProgressLabel.textContent = `${progress}%`;
      loaderProgressBar.setAttribute('aria-valuenow', String(progress));
      loaderStatus.textContent = message.text;

      if (progress >= 100) {
        window.clearInterval(loadingInterval);
        designLoader.classList.remove('is-visible');
        designLoader.setAttribute('aria-hidden', 'true');
        onComplete();
      }
    }, 32);
  }

  document.getElementById('replay-loader')?.addEventListener('click', () => playDesignLoader());

  templateGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preview-template]');
    if (!button) return;

    const background = button.dataset.previewBackground;
    const ink = button.dataset.previewInk;
    const accent = button.dataset.previewAccent;
    const hex = background.match(/^#([0-9a-f]{6})$/i)?.[1];
    const channels = hex ? [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16)) : [0, 0, 0];
    const luminance = (0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]) / 255;
    const darkPreview = luminance < 0.42;

    window.clearTimeout(previewTimeout);
    playDesignLoader(() => {
      document.body.dataset.templatePreview = 'true';
      document.body.style.colorScheme = darkPreview ? 'dark' : 'light';
      document.body.style.setProperty('--preview-background', background);
      document.body.style.setProperty('--preview-ink', ink);
      document.body.style.setProperty('--preview-accent', accent);
      document.body.style.setProperty('--preview-surface', darkPreview
        ? `color-mix(in srgb, ${background} 84%, white)`
        : `color-mix(in srgb, ${background} 92%, ${ink})`);
      document.body.style.setProperty('--preview-muted', `color-mix(in srgb, ${ink} 72%, ${background})`);

      if (!previewNotice) {
        previewNotice = document.createElement('div');
        previewNotice.className = 'template-preview-notice';
        previewNotice.setAttribute('role', 'status');
        previewNotice.setAttribute('aria-live', 'polite');
        document.body.append(previewNotice);
      }
      previewNotice.textContent = `Previewing ${button.dataset.previewTemplate} · returning to your current theme in 10 seconds.`;
      window.clearTimeout(previewTimeout);
      previewTimeout = window.setTimeout(() => {
        delete document.body.dataset.templatePreview;
        document.body.style.removeProperty('color-scheme');
        ['--preview-background', '--preview-ink', '--preview-accent', '--preview-surface', '--preview-muted']
          .forEach((property) => document.body.style.removeProperty(property));
        previewNotice.textContent = 'Design preview ended. Your current theme has been restored.';
        const noticeToRemove = previewNotice;
        window.setTimeout(() => noticeToRemove.remove(), 2200);
        previewNotice = null;
      }, 10000);
    });
  });

  const filterButtons = document.querySelectorAll('[data-template-filter]');
  const templateCount = document.querySelector('.template-count');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.templateFilter;
      let visibleCount = 0;
      templateGrid.querySelectorAll('.template-card').forEach((card) => {
        const isVisible = filter === 'all' || card.dataset.templateCategory === filter;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      if (templateCount) templateCount.textContent = `Showing ${visibleCount} ${filter === 'all' ? 'concepts' : `${button.textContent.toLowerCase()} concepts`}`;
    });
  });
}

const pathwayTabs = document.querySelectorAll('[data-pathway]');
const pathwayPanels = document.querySelectorAll('[data-pathway-panel]');
pathwayTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    const selectedPathway = tab.dataset.pathway;
    pathwayTabs.forEach((item) => {
      const isSelected = item === tab;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });
    pathwayPanels.forEach((panel) => {
      panel.hidden = panel.dataset.pathwayPanel !== selectedPathway;
    });
  });

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextTab = pathwayTabs[(index + direction + pathwayTabs.length) % pathwayTabs.length];
    nextTab.focus();
    nextTab.click();
  });
});

const ventureFilters = document.querySelectorAll('[data-venture-filter]');
const ventureCards = document.querySelectorAll('[data-venture]');
ventureFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const selectedCategory = filterButton.dataset.ventureFilter;
    ventureFilters.forEach((item) => {
      const isActive = item === filterButton;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    ventureCards.forEach((card) => {
      card.hidden = selectedCategory !== 'all' && card.dataset.venture !== selectedCategory;
    });
  });
});

// Delay same-site page navigation behind the FSP loader; leave section links alone.
let pageTransitionTimer;
let pageTransitionInProgress = false;
let pageTransitionLoader = document.querySelector('.design-loader');

if (!pageTransitionLoader) {
  pageTransitionLoader = document.createElement('div');
  pageTransitionLoader.className = 'design-loader';
  pageTransitionLoader.setAttribute('role', 'status');
  pageTransitionLoader.setAttribute('aria-live', 'polite');
  pageTransitionLoader.setAttribute('aria-hidden', 'true');
  pageTransitionLoader.innerHTML = `<div class="loader-orbit loader-orbit-outer" aria-hidden="true"></div><div class="loader-orbit loader-orbit-middle" aria-hidden="true"></div><div class="loader-orbit loader-orbit-inner" aria-hidden="true"><i></i></div><span class="loader-deco loader-top" aria-hidden="true"></span><span class="loader-deco loader-right" aria-hidden="true"></span><span class="loader-deco loader-bottom" aria-hidden="true"></span><span class="loader-deco loader-left" aria-hidden="true"></span><div class="design-loader-content"><div class="design-loader-mark">FSP</div><div class="loader-axel">AXEL</div><p class="loader-system-status" data-loader-status>ROUTING_PAGE...</p><div class="loader-progress" role="progressbar" aria-label="Page transition progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-loader-progress></span></div><div class="loader-progress-meta"><span data-loader-progress-label>0%</span><span>PAGE TRANSITION</span></div></div>`;
  document.body.append(pageTransitionLoader);
}

window.addEventListener('pagehide', () => window.clearInterval(pageTransitionTimer));

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || pageTransitionInProgress) return;
  const link = event.target.closest('a[href]');
  if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return;
  if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

  event.preventDefault();
  pageTransitionInProgress = true;
  pageTransitionLoader.setAttribute('aria-hidden', 'false');
  pageTransitionLoader.classList.add('is-visible');

  const progressBar = pageTransitionLoader.querySelector('[role="progressbar"]');
  const progressFill = pageTransitionLoader.querySelector('[data-loader-progress]');
  const progressLabel = pageTransitionLoader.querySelector('[data-loader-progress-label]');
  const status = pageTransitionLoader.querySelector('[data-loader-status]');
  const label = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 32).toUpperCase();
  let cycleStarted = performance.now();
  let navigationStarted = false;
  status.textContent = label ? `OPENING_${label.replace(/[^A-Z0-9]+/g, '_')}...` : 'ROUTING_REQUEST...';
  progressFill.style.width = '0%';
  progressLabel.textContent = '0%';
  progressBar.setAttribute('aria-valuenow', '0');

  pageTransitionTimer = window.setInterval(() => {
    const now = performance.now();
    const cycleElapsed = now - cycleStarted;
    const progress = Math.min(100, Math.round(cycleElapsed / 1300 * 100));
    progressFill.style.width = `${progress}%`;
    progressLabel.textContent = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', String(progress));

    if (progress >= 100) {
      if (!navigationStarted) {
        navigationStarted = true;
        status.textContent = 'CONNECTING_TO_DESTINATION...';
        window.location.assign(destination.href);
      } else {
        status.textContent = 'WAITING_FOR_NETWORK...';
      }
      cycleStarted = now;
    } else if (navigationStarted) {
      status.textContent = 'WAITING_FOR_NETWORK...';
    } else if (progress >= 65) {
      status.textContent = 'RENDERING_DESTINATION...';
    }
  }, 32);
});


