(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = Array.from(document.querySelectorAll('[data-animate], .section, .card, .proof-chip, .faq-list details, .mini-faq details'));

  if (!reduce) {
    revealTargets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  const kpis = document.querySelectorAll('.kpi-value[data-count]');
  if (!reduce && kpis.length) {
    const animateCount = (el) => {
      const target = Number(el.dataset.count || 0);
      const suffix = target === 90 ? 'd' : target === 30 ? 'd' : '×';
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const val = Math.max(1, Math.round(target * p));
        el.textContent = `${val}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const kpiObserver = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        o.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    kpis.forEach((k) => kpiObserver.observe(k));
  }

  const steps = Array.from(document.querySelectorAll('[data-progress] [data-step]'));
  if (!reduce && steps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.55 });
    steps.forEach((s) => stepObserver.observe(s));
  }
})();
