const siteHeader = document.querySelector('.site-header');

function updateHeaderOnScroll() {
  if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);
}

updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

// Compact mobile shortcuts for the site's main destinations.
const bottomNav = document.createElement('nav');
bottomNav.className = 'site-bottom-nav';
bottomNav.setAttribute('aria-label', 'Quick navigation');
bottomNav.innerHTML = `
  <a class="bottom-nav-link" href="index.html#home" data-bottom-nav="home" aria-label="Home">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7v10a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"></path><path d="M9 21v-7h6v7"></path></svg><span>Home</span>
  </a>
  <a class="bottom-nav-link" href="design.html" data-bottom-nav="design" aria-label="Website design">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"></path><path d="m14 6 4 4"></path></svg><span>Design</span>
  </a>
  <a class="bottom-nav-link" href="team.html" data-bottom-nav="team" aria-label="Team">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="10" cy="7" r="4"></circle><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg><span>Team</span>
  </a>
  <a class="bottom-nav-link" href="webcore.html" data-bottom-nav="webcore" aria-label="WebCore member information">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"></path></svg><span>WebCore</span>
  </a>
  <a class="bottom-nav-link" href="index.html#project-enquiry" data-bottom-nav="form" aria-label="Project form">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6M8 13h8M8 17h8"></path></svg><span>Form</span>
  </a>
  <a class="bottom-nav-link" href="join.html#team-join-form" data-bottom-nav="join" aria-label="Join FS Panic">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="4"></circle><path d="M3 21v-2a6 6 0 0 1 12 0v2M19 8v6M16 11h6"></path></svg><span>Join</span>
  </a>`;
document.body.append(bottomNav);

const bottomNavPage = window.location.pathname.split('/').pop() || 'index.html';
const bottomNavHash = window.location.hash;
const teamPages = ['team.html', 'president.html', 'vice-president.html', 'designer.html', 'tester.html', 'graphics-designer.html'];
const activeBottomNav = bottomNavPage === 'design.html' ? 'design'
  : bottomNavPage === 'webcore.html' ? 'webcore'
  : teamPages.includes(bottomNavPage) ? 'team'
  : bottomNavHash === '#project-enquiry' ? 'form'
  : (bottomNavPage === 'join.html' || bottomNavHash === '#team-join-form') ? 'join'
  : (bottomNavPage === 'index.html' && (!bottomNavHash || bottomNavHash === '#home')) ? 'home' : '';
if (activeBottomNav) {
  const activeLink = bottomNav.querySelector(`[data-bottom-nav="${activeBottomNav}"]`);
  activeLink?.classList.add('is-active');
  activeLink?.setAttribute('aria-current', 'page');
}

bottomNav.addEventListener('click', (event) => {
  const selectedLink = event.target.closest('.bottom-nav-link');
  if (!selectedLink) return;

  bottomNav.querySelectorAll('.bottom-nav-link').forEach((link) => {
    const isSelected = link === selectedLink;
    link.classList.toggle('is-active', isSelected);
    if (isSelected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
});

// Site-wide search covers pages, sections, and interactive tools.
const searchItems = [
  { title: 'Home', detail: 'FS Panic builder collective and launchpad', href: 'index.html#home', keywords: 'homepage collective builder launchpad' },
  { title: 'Builder pathways', detail: 'Choose an idea, working build, or builder pathway', href: 'index.html#panic-pathways', keywords: 'pathway idea mvp build builder tabs selector' },
  { title: 'Join the team', detail: 'Apply to contribute your skills to FS Panic projects', href: 'join.html#team-join-form', keywords: 'join team application skills developer designer collaborator' },
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
  { title: 'Meet the team', detail: 'Meet Axel, Vice President, Designer, Tester, and Graphics Designer', href: 'team.html', keywords: 'people profiles president vice designer tester graphics' },
  { title: 'Services', detail: 'Strategy, website design, and web development', href: 'services.html', keywords: 'services offering' },
  { title: 'Strategy & direction', detail: 'Project discovery, planning, and website strategy', href: 'strategy.html', keywords: 'strategy discover planning direction' },
  { title: 'Website design', detail: 'Design service and 420-concept template gallery', href: 'design.html', keywords: 'design gallery templates concepts preview filters' },
  { title: 'WebCore member access', detail: 'Open the separate WebCore members page', href: 'webcore.html', keywords: 'webcore member access second website' },
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
      return;
    }

    if (searchDialog.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSiteSearch();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = Array.from(searchDialog.querySelectorAll('button, input, a[href]'))
        .filter((element) => !element.disabled && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  function closeNavigation() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  }

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });

  document.addEventListener('click', (event) => {
    if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
    if (navigation.contains(event.target) || menuToggle.contains(event.target)) return;
    closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      menuToggle.focus();
    }
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Submit Web3Forms enquiries asynchronously while keeping native POST as a no-JS fallback.
document.querySelectorAll('form[action="https://api.web3forms.com/submit"], form#form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const statusMessage = form.querySelector('.form-note[role="status"], #result');
    const originalButtonHTML = submitButton?.innerHTML;
    const originalButtonValue = submitButton?.value;
    const formData = new FormData(form);

    if (!formData.has('access_key')) {
      formData.append('access_key', '98e942a3-015d-4ab4-a276-906a42c91f8d');
    }

    if (submitButton) {
      submitButton.disabled = true;
      if (submitButton instanceof HTMLInputElement) submitButton.value = 'Sending…';
      else submitButton.textContent = 'Sending…';
    }
    if (statusMessage) statusMessage.textContent = 'Sending your message…';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Your message could not be sent. Please try again.');
      }

      form.reset();
      if (statusMessage) statusMessage.textContent = 'Success! Your message has been sent.';
      else window.alert('Success! Your message has been sent.');
    } catch (error) {
      const message = error.message || 'Something went wrong. Please try again.';
      if (statusMessage) statusMessage.textContent = message;
      else window.alert(message);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        if (submitButton instanceof HTMLInputElement) submitButton.value = originalButtonValue;
        else submitButton.innerHTML = originalButtonHTML;
      }
    }
  });
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

const customSkillList = document.getElementById('custom-skill-list');
const addSkillButton = document.querySelector('[data-add-skill]');
if (customSkillList && addSkillButton) {
  addSkillButton.addEventListener('click', () => {
    const skillNumber = customSkillList.querySelectorAll('input').length + 1;
    const skillInput = document.createElement('input');
    skillInput.type = 'text';
    skillInput.name = 'otherSkills[]';
    skillInput.id = `join-other-skills-${skillNumber}`;
    skillInput.placeholder = 'Add another skill';
    skillInput.setAttribute('aria-label', `Additional skill ${skillNumber}`);
    customSkillList.append(skillInput);
    skillInput.focus();
  });
}

const joinPaymentButton = document.getElementById('join-payment-button');
const joinPaymentStatus = document.getElementById('join-payment-status');
if (joinPaymentButton && joinPaymentStatus) {
  const paymentConfig = window.RAZORPAY_CONFIG || {};
  const paymentAmountPaise = 40000;
  let razorpayScriptPromise;

  function setPaymentStatus(message) {
    joinPaymentStatus.textContent = message;
  }

  function setPaymentBusy(isBusy) {
    joinPaymentButton.disabled = isBusy;
    joinPaymentButton.textContent = isBusy ? 'Please wait…' : 'Pay ₹400 with Razorpay ↗';
  }

  function loadRazorpayCheckout() {
    if (window.Razorpay) return Promise.resolve();
    if (razorpayScriptPromise) return razorpayScriptPromise;

    razorpayScriptPromise = new Promise((resolve, reject) => {
      const checkoutScript = document.createElement('script');
      checkoutScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
      checkoutScript.onload = resolve;
      checkoutScript.onerror = () => reject(new Error('Razorpay Checkout could not be loaded.'));
      document.head.append(checkoutScript);
    });
    return razorpayScriptPromise;
  }

  joinPaymentButton.addEventListener('click', async () => {
    if (!paymentConfig.keyId || !paymentConfig.createOrderUrl || !paymentConfig.verifyPaymentUrl) {
      setPaymentStatus('Razorpay is not configured yet. Add the public key ID and secure order/verification endpoint URLs, then configure the matching backend before accepting payments.');
      return;
    }

    setPaymentBusy(true);
    setPaymentStatus('Creating a secure ₹400 payment order…');

    try {
      const orderResponse = await fetch(paymentConfig.createOrderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ amount: paymentAmountPaise, currency: 'INR', purpose: 'Optional FS Panic team application payment' })
      });
      const orderResult = await orderResponse.json();
      const order = orderResult.order || orderResult;
      if (!orderResponse.ok || !order.id || order.amount !== paymentAmountPaise || order.currency !== 'INR') {
        throw new Error('A valid ₹400 INR Razorpay order was not returned.');
      }

      await loadRazorpayCheckout();
      const checkout = new window.Razorpay({
        key: paymentConfig.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'FS Panic',
        description: 'Optional separate payment',
        order_id: order.id,
        theme: { color: '#a58bff' },
        handler: async (paymentResponse) => {
          setPaymentStatus('Payment received by Razorpay. Verifying it securely…');
          try {
            const verificationResponse = await fetch(paymentConfig.verifyPaymentUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(paymentResponse)
            });
            const verification = await verificationResponse.json();
            if (!verificationResponse.ok || verification.verified !== true) {
              throw new Error('Payment verification was not confirmed.');
            }
            setPaymentStatus('Payment verified successfully. Your team application is still submitted separately using the form below.');
          } catch (error) {
            setPaymentStatus('We could not verify this payment yet. Please contact the team with your Razorpay payment ID before trying again.');
          } finally {
            setPaymentBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('Payment window closed. No payment was confirmed; you can try again or submit your application without paying.');
            setPaymentBusy(false);
          }
        }
      });
      checkout.on('payment.failed', () => {
        setPaymentStatus('Payment did not complete. You can try again or submit your application without paying.');
        setPaymentBusy(false);
      });
      checkout.open();
    } catch (error) {
      setPaymentStatus('Razorpay could not start the payment. Check the payment setup and try again.');
      setPaymentBusy(false);
    }
  });
}



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
  if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;

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
    const progress = Math.min(100, Math.round(cycleElapsed / 350 * 100));
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


