// Builds the Arsenal cards from PROJECTS and animates sections in on scroll.
const grid = document.querySelector('#arsenalGrid');

if (PROJECTS.length === 0) {
  grid.outerHTML = '<p class="empty reveal">Projects coming soon.</p>';
}

PROJECTS.forEach((project, i) => {
  const card = document.createElement(project.link ? 'a' : 'article');
  card.className = 'card reveal';
  if (project.link) {
    card.href = project.link;
    card.target = '_blank';
    card.rel = 'noopener';
  }
  card.innerHTML = `
    <div class="card-top">
      <span class="tag tag--${project.status.toLowerCase()}">${project.status}</span>
      <svg class="card-mark" viewBox="12 12 396 203" role="img" aria-label="A MUST WIN project"><use href="#razor-mark"/></svg>
    </div>
    <h3 class="card-name"></h3>
    <p class="card-desc"></p>
    <div class="card-foot">
      <span>${String(i + 1).padStart(2, '0')}</span>
      ${project.link ? '<span class="card-go">OPEN ↗</span>' : ''}
    </div>`;
  card.querySelector('.card-name').textContent = project.name;
  card.querySelector('.card-desc').textContent = project.description;
  grid.appendChild(card);
});

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set('.reveal', { opacity: 0, y: 40 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }),
  });
  gsap.utils.toArray('.section-rule').forEach((rule) => {
    gsap.fromTo(rule, { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: rule, start: 'top 90%', end: 'top 50%', scrub: true },
    });
  });
}
