// Builds the Crew and Projects cards from CREW and PROJECTS and animates sections in on scroll.
const crewGrid = document.querySelector('#crewGrid');
const dialog = document.querySelector('#crewDialog');
const THEME_LOGOS = {
  'white-on-mud': 'assets/razor/white.svg',
  yellow: 'assets/razor/yellow.svg',
  fade: 'assets/razor/fade.svg',
  'black-on-yellow': 'assets/razor/black.svg',
};

// "https://www.youtube.com/@Name" and "https://x.com/Name" both become "@Name"
function handleFrom(url) {
  const last = new URL(url).pathname.split('/').filter(Boolean).pop() || '';
  return last.startsWith('@') ? last : '@' + last;
}

function openMember(member) {
  const theme = THEME_LOGOS[member.theme] ? member.theme : 'fade';
  dialog.dataset.theme = theme;
  dialog.querySelector('.crew-dialog-logo').src = THEME_LOGOS[theme];
  dialog.querySelector('#crewDialogName').textContent = member.name;
  dialog.querySelector('.label').textContent = member.role ? 'Crew / ' + member.role : 'Crew';
  const list = dialog.querySelector('.crew-dialog-links');
  list.innerHTML = '';
  member.links.forEach((link) => {
    const li = document.createElement('li');
    li.innerHTML = '<a target="_blank" rel="noopener"><span class="cd-platform"></span><span class="cd-handle"></span><span class="cd-arrow">↗</span></a>';
    li.querySelector('a').href = link.url;
    li.querySelector('.cd-platform').textContent = link.platform;
    li.querySelector('.cd-handle').textContent = handleFrom(link.url);
    list.appendChild(li);
  });
  dialog.showModal();
}

document.querySelectorAll('.crew-dialog').forEach((d) => {
  d.querySelector('.crew-dialog-close').addEventListener('click', () => d.close());
  d.addEventListener('click', (e) => {
    if (e.target === d) d.close(); // click on the backdrop
  });
});

// Email popup: shows the address with a copy button
const emailDialog = document.querySelector('#emailDialog');
const copyButton = emailDialog.querySelector('.email-copy');
document.querySelector('#emailOpen').addEventListener('click', () => {
  copyButton.textContent = 'Copy';
  emailDialog.showModal();
});
copyButton.addEventListener('click', async () => {
  const address = emailDialog.querySelector('.email-address');
  try {
    await navigator.clipboard.writeText(address.textContent);
    copyButton.textContent = 'Copied';
  } catch {
    getSelection().selectAllChildren(address); // clipboard blocked: select it so they can copy by hand
  }
});

CREW.forEach((member) => {
  const handles = [...new Set(member.links.map((link) => handleFrom(link.url)))];
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'card crew-card reveal';
  card.innerHTML = `
    <div class="card-top">
      ${member.role ? '<span class="tag tag--role"></span>' : '<span></span>'}
      <svg class="card-mark" viewBox="12 12 396 203" aria-hidden="true"><use href="#razor-mark"/></svg>
    </div>
    <h3 class="card-name"></h3>
    <p class="card-desc"></p>
    <div class="card-foot"><span>${member.links.length} LINKS</span><span class="card-go">OPEN ↗</span></div>`;
  if (member.role) card.querySelector('.tag--role').textContent = member.role.toUpperCase();
  card.querySelector('.card-name').textContent = member.name;
  card.querySelector('.card-desc').textContent = handles.join(' / ');
  card.addEventListener('click', () => openMember(member));
  crewGrid.appendChild(card);
});

const grid = document.querySelector('#projectsGrid');

if (PROJECTS.length === 0) {
  grid.outerHTML = '<p class="empty reveal">Projects coming soon.</p>';
}

const projectDialog = document.querySelector('#projectDialog');

function openProject(project) {
  projectDialog.style.setProperty('--t-bg', project.color || 'var(--mw-winners-black)');
  projectDialog.querySelector('#projectDialogName').textContent = project.name;
  projectDialog.querySelector('.project-dialog-desc').textContent = project.description;
  projectDialog.showModal();
}

PROJECTS.forEach((project, i) => {
  const card = document.createElement(project.link ? 'a' : 'button');
  card.className = 'card project-card reveal';
  if (project.link) {
    card.href = project.link;
    card.target = '_blank';
    card.rel = 'noopener';
  } else {
    card.type = 'button';
    card.addEventListener('click', () => openProject(project));
  }
  card.innerHTML = `
    <div class="card-top">
      <span class="tag tag--${project.status.toLowerCase().replace(/ /g, '-')}">${project.status}</span>
      <svg class="card-mark" viewBox="12 12 396 203" role="img" aria-label="A MUST WIN project"><use href="#razor-mark"/></svg>
    </div>
    <h3 class="card-name"></h3>
    <p class="card-desc"></p>
    <div class="card-foot">
      <span>${String(i + 1).padStart(2, '0')}</span>
      <span class="card-go">OPEN ↗</span>
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
