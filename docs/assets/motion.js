(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function SectionReveal() {
    const targets = Array.from(document.querySelectorAll('[data-animate], .faq-list details, .mini-faq details, [data-stagger] > *'));
    if (prefersReduced) {
      targets.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('section-reveal');
        const parent = el.parentElement;
        if (parent?.hasAttribute('data-stagger')) {
          const step = Number(parent.getAttribute('data-stagger')) || 0.08;
          const index = Array.from(parent.children).indexOf(el);
          el.style.transitionDelay = `${(index * step).toFixed(2)}s`;
        }
        requestAnimationFrame(() => el.classList.add('in'));
        observer.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((el) => {
      el.classList.add('section-reveal');
      io.observe(el);
    });
  }

  function CardHover() {
    document.querySelectorAll('.card').forEach((el) => el.classList.add('card-hover'));
  }

  function ButtonHover() {
    document.querySelectorAll('.btn').forEach((el) => el.classList.add('btn-hover'));
  }

  function animateKpis() {
    const kpis = document.querySelectorAll('.kpi-value[data-count]');
    if (prefersReduced || !kpis.length) return;
    const animateCount = (el) => {
      const target = Number(el.dataset.count || 0);
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.max(1, Math.round(target * p)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        o.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    kpis.forEach((k) => io.observe(k));
  }

  function timelineAndFlow() {
    const steps = Array.from(document.querySelectorAll('[data-progress] [data-step]'));
    if (!prefersReduced && steps.length) {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.55 });
      steps.forEach((s) => stepObserver.observe(s));
    }

    const flow = document.querySelector('[data-flow]');
    if (!flow || prefersReduced) {
      flow?.classList.add('draw');
      return;
    }
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('draw');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    io.observe(flow);
  }

  function stickyCTA() {
    const cta = document.getElementById('sticky-cta');
    const hero = document.querySelector('.hero');
    if (!cta || !hero) return;
    cta.classList.add('is-hidden');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        cta.classList.toggle('is-hidden', entry.isIntersecting);
      });
    }, { threshold: 0.15 });
    io.observe(hero);
  }

  function insightEnhancements() {
    if (!window.location.pathname.includes('/insights/')) return;
    const main = document.querySelector('main .container');
    if (!main) return;
    const h2s = Array.from(main.querySelectorAll('h2'));
    if (h2s.length >= 2 && !document.querySelector('.toc')) {
      const nav = document.createElement('nav');
      nav.className = 'toc card';
      nav.setAttribute('aria-label', 'Table of contents');
      nav.innerHTML = '<h2>Table of contents</h2><ul></ul>';
      const ul = nav.querySelector('ul');
      h2s.forEach((h, i) => {
        if (!h.id) h.id = `section-${i + 1}`;
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
        ul.appendChild(li);
      });
      const lead = main.querySelector('.lead');
      lead?.insertAdjacentElement('afterend', nav);
    }

    if (!document.querySelector('.related-links')) {
      const related = document.createElement('section');
      related.className = 'answer-snippets related-links';
      related.innerHTML = '<h2>Related insights</h2><div class="snippet"><p><a href="/insights/why-delivery-timelines-slip.html">Delivery recovery</a> · <a href="/insights/fractional-cto-vs-full-time.html">Fractional CTO</a> · <a href="/insights/technical-due-diligence-checklist.html">Technical due diligence</a></p></div>';
      const cta = main.querySelector('.cta-row');
      cta?.insertAdjacentElement('beforebegin', related);
    }
  }

  function injectLabSymbol() {
    const footer = document.querySelector('.site-footer .footer-grid');
    if (!footer || footer.querySelector('.lab-symbol-link')) return;
    const a = document.createElement('a');
    a.href = '/lab/';
    a.className = 'lab-symbol-link';
    a.title = 'Zenith Lab';
    a.setAttribute('aria-label', 'Zenith Lab');
    a.textContent = '∆';
    footer.appendChild(a);
  }

  SectionReveal();
  CardHover();
  ButtonHover();
  animateKpis();
  timelineAndFlow();
  stickyCTA();
  insightEnhancements();
  injectLabSymbol();
})();
