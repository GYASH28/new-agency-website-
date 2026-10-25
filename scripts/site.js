
/**
 * BRAYRO AI — independent new agency website.
 * Intentionally dependency-free. All enquiry drafts stay in the browser until
 * the visitor explicitly opens their mail client or WhatsApp.
 */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const nav = $('#primary-nav');
  const toggle = $('.menu-toggle');
  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  $$('.reveal').forEach(el => el.classList.add('in-view'));
  // The site never hides content while JS or an observer is unavailable.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.reveal').forEach(el => el.classList.remove('in-view'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
  }

  const back = $('.back-to-top');
  if (back) {
    const sync = () => back.classList.toggle('visible', window.scrollY > 600);
    addEventListener('scroll', sync, { passive: true });
    sync();
    back.addEventListener('click', () => window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
  }
  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // Values transcribed from original GYASH28/BRAYROAI-/data/pricing.js.
  // They are market-specific offers, NOT foreign exchange conversions.
  const OFFERS = Object.freeze({
    'monthly-starter': { name: 'Monthly Website Starter', prices: { in:'₹2,599/mo', ae:'AED 690/month', au:'A$390/month' } },
    'monthly-growth': { name: 'Monthly Website Growth', prices: { in:'₹3,999/mo', ae:'AED 1,190/month', au:'A$690/month' } },
    'monthly-studio': { name: 'Monthly Website Studio', prices: { in:'₹5,999+/mo', ae:'AED 1,990+/month', au:'A$1,190+/month' } },
    'launch-website': { name: 'Launch Website', prices: { in:'₹9,999', ae:'AED 2,990', au:'A$1,490' } },
    'business-experience': { name: 'Business Experience', prices: { in:'₹17,999', ae:'AED 5,990', au:'A$2,990' } },
    'premium-experience': { name: 'Premium Experience', prices: { in:'₹25K–₹35K+', ae:'AED 9,990–14,990+', au:'A$5,900–8,900+' } },
    'ai-workflow-audit': { name: 'AI Workflow Audit', prices: { in:'₹9,999', ae:'AED 2,490', au:'A$990' } },
    'company-second-brain': { name: 'Company Second Brain', prices: { in:'₹29,999', ae:'AED 7,900', au:'A$4,900' } },
    'knowledge-care': { name: 'Knowledge Care', prices: { in:'₹2,999/mo', ae:'AED 990/month', au:'A$590/month' } }
  });
  const markets = { in: 'India', ae: 'UAE', au: 'Australia' };
  const params = new URLSearchParams(location.search);
  function validMarket(value) { return Object.prototype.hasOwnProperty.call(markets,value) ? value : 'in'; }
  let market = validMarket(params.get('market'));
  const marketSelect = $('[data-market]');
  function setMarket(nextMarket) {
    market = validMarket(nextMarket);
    $$('[data-price]').forEach(el => {
      const offer = OFFERS[el.dataset.price];
      if (offer) el.textContent = offer.prices[market];
    });
    $$('[data-offer]').forEach(el => {
      const offer = OFFERS[el.dataset.offer];
      if (!offer) return;
      const next = new URLSearchParams({ offer: el.dataset.offer, market });
      el.href = '/contact?' + next;
      el.setAttribute('aria-label', 'Enquire about ' + offer.name + ' (' + offer.prices[market] + ')');
    });
    if (marketSelect) marketSelect.value = market;
    try { sessionStorage.setItem('brayro-new-market', market); } catch { /* storage may be disabled */ }
  }
  if (!params.has('market')) {
    try { market = validMarket(sessionStorage.getItem('brayro-new-market')); } catch {}
  }
  setMarket(market);
  if (marketSelect) marketSelect.addEventListener('change', event => setMarket(event.target.value));

  const form = $('#contact-form');
  if (form) {
    const serviceSelect = $('#project-type');
    const offer = OFFERS[params.get('offer')];
    if (offer) {
      serviceSelect.value = offer.name.startsWith('Monthly') ? 'A monthly website'
        : /Workflow|Second Brain|Knowledge Care/.test(offer.name) ? 'AI systems' : 'A new website';
      const status = $('#form-status');
      status.textContent = 'Enquiring about ' + offer.name + ' (' + offer.prices[market] + '). No data is sent until you open email or WhatsApp.';
    }
    const requestedService = params.get('service');
    if (requestedService && [...serviceSelect.options].some(option => option.value === requestedService)) {
      serviceSelect.value = requestedService;
    }
    function message() {
      const data = new FormData(form);
      const lines = [
        'Hello Brayro AI,',
        '',
        'I would like to discuss a project.',
        '',
        'Name: ' + String(data.get('name') || '').trim().slice(0,80),
        'Email: ' + String(data.get('email') || '').trim().slice(0,120),
        'Project type: ' + String(data.get('service') || ''),
        'Market: ' + markets[market],
      ];
      if (offer) lines.push('Offer: ' + offer.name + ' (' + offer.prices[market] + ')');
      lines.push('', 'My idea:', String(data.get('message') || '').trim().slice(0,1200), '', 'Sent using the BRAYRO AI project planner.');
      return lines.join('\n');
    }
    function ready() { return form.reportValidity(); }
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!ready()) return;
      const subject = encodeURIComponent('BRAYRO AI — New Project Enquiry');
      location.href = 'mailto:yashganesh.work@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(message());
    });
    const whatsapp = $('#whatsapp-send');
    whatsapp?.addEventListener('click', () => {
      if (!ready()) return;
      const url = 'https://wa.me/919175524637?text=' + encodeURIComponent(message());
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
