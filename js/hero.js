// Hero: one scrubbed timeline turns the main logo into the Razor logo and docks it in the header.
// All positions are in main logo units (the viewBox of the brand pack's Logos/Colour/Main-Logo.svg).
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (sel) => document.querySelector(sel);
const root = document.documentElement;
const stage = $('#stage');
const logo = $('#logo');
const mw = $('#mw');
const rx = $('#rx');
const hrule = $('#hrule');
const korean = $('#korean');
const fadeStop = $('#mwFill stop');
const navLogo = $('#navLogo');
const bg = $('#bg');
const hudStage = $('#hudStage');
const hudPct = $('#hudPct');

const BONE = [233, 228, 214];
const YELLOW = [254, 208, 0];
const BLACK = [20, 20, 18];
const MUD = [74, 70, 48];

const HOME = { x: 100, y: 182 };     // centre of the M/W inside the main logo
const CENTER = { x: 434.5, y: 182 }; // centre of the whole main logo
const RAZOR_SCALE = 1.557;           // Razor symbol = Standing symbol x 1.557
const RAZOR_C = { x: 210, y: 113.44 }; // centre of the symbol in the Razor logo file
const RAZOR_LIFT = 63.06;            // symbol centre sits this far above the centre of the full Razor logo
const STAGES = ['01 HOLD', '02 SEPARATE', '03 SPIN', '04 ASSEMBLE', '05 DOCK'];

// Parts that break away from the M/W: direction, spin while flying, and when they leave (0 to 100)
const FLY = [
  { id: 'brush', dx: 1, dy: 0.12, r: 10, at: 10 },
  { id: 'vrule', dx: 0, dy: -1, r: 0, at: 11 },
  { id: 't', dx: 0.9, dy: -0.6, r: 35, at: 12 },
  { id: 's', dx: 0.35, dy: -1, r: -30, at: 13 },
  { id: 'u', dx: -0.15, dy: -1, r: -20, at: 14 },
  { id: 'block', dx: 0.55, dy: 1, r: 25, at: 15 },
  { id: 'n', dx: 0.95, dy: 0.7, r: -30, at: 16 },
  { id: 'i', dx: -0.1, dy: 1, r: 35, at: 17 },
];

const st = { a: 0, s: 0, f: 0, rd: 0, kr: 0, d: 0, gi: 0.22, gs: 0, cue: 1, mud: 0 };

FLY.forEach((f) => {
  f.el = $('#p-' + f.id);
  f.mv = f.el.querySelector('.mv');
  f.blur = $('#f-' + f.id + ' feGaussianBlur');
  const len = Math.hypot(f.dx, f.dy);
  f.ux = f.dx / len;
  f.uy = f.dy / len;
  const b = f.mv.getBBox();
  f.cx = b.x + b.width / 2;
  f.cy = b.y + b.height / 2;
  f.key = 'fly_' + f.id;
  st[f.key] = 0;
});

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(',')})`;
const n = (v) => Math.round(v * 100) / 100;

let L = {};
let tl = null;

function layout() {
  const box = stage.getBoundingClientRect();
  const W = box.width;
  const H = box.height;
  stage.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const S0 = Math.min((0.84 * W) / 805, (0.46 * H) / 266);
  const Tx = W / 2 - CENTER.x * S0;
  const Ty = H / 2 - CENTER.y * S0;
  logo.setAttribute('transform', `translate(${n(Tx)} ${n(Ty)}) scale(${S0})`);

  // Size of the assembled Razor logo (380 x 313 Razor units), as a multiple of the M/W's starting size
  const u = Math.min((0.62 * W) / 380, (0.5 * H) / 313);
  const kSpin = Math.max((u * RAZOR_SCALE) / S0, 1.25);

  // Where the symbol ends up in the header logo
  const r = navLogo.getBoundingClientRect();
  const sc = r.height / 330;
  const nx = r.left + (RAZOR_C.x - 12) * sc;
  const ny = r.top + (RAZOR_C.y - 12) * sc;

  L = {
    W, H, S0, Tx, Ty, kSpin,
    kEnd: (sc * RAZOR_SCALE) / S0,
    dock: { x: (nx - Tx) / S0, y: (ny - Ty) / S0 },
    dist: (Math.hypot(W, H) / S0) * 1.1,
  };
  render();
}

function render() {
  FLY.forEach((f) => {
    const p = st[f.key];
    f.mv.setAttribute('transform',
      `translate(${n(f.dx * L.dist * p)} ${n(f.dy * L.dist * p)}) rotate(${n(f.r * p)} ${f.cx} ${f.cy})`);
    f.el.style.opacity = p < 0.35 ? 1 : Math.max(0, 1 - (p - 0.35) / 0.5);
    const b = 14 * p;
    if (b > 0.1) {
      f.blur.setAttribute('stdDeviation', `${n(b * Math.abs(f.ux) + 0.3)} ${n(b * Math.abs(f.uy) + 0.3)}`);
      f.el.setAttribute('filter', `url(#f-${f.id})`);
    } else {
      f.el.removeAttribute('filter');
    }
  });

  // M/W: slide to centre, spin and grow into the Razor symbol, then dock
  let x = lerp(HOME.x, CENTER.x, st.a);
  let y = lerp(HOME.y, CENTER.y, st.a) - ((RAZOR_LIFT * L.kSpin) / RAZOR_SCALE) * st.s;
  let k = lerp(1, L.kSpin, st.s);
  x = lerp(x, L.dock.x, st.d);
  y = lerp(y, L.dock.y, st.d);
  k = lerp(k, L.kEnd, st.d);
  mw.setAttribute('transform', `translate(${n(x)} ${n(y)}) rotate(${n(450 * st.s)}) scale(${k})`);
  fadeStop.setAttribute('stop-color', mix(BONE, YELLOW, st.f));

  rx.setAttribute('transform', `translate(${n(x)} ${n(y)}) scale(${k / RAZOR_SCALE}) translate(${-RAZOR_C.x} ${-RAZOR_C.y})`);
  hrule.setAttribute('transform', `translate(${RAZOR_C.x} 0) scale(${Math.max(st.rd, 0.0001)} 1) translate(${-RAZOR_C.x} 0)`);
  hrule.style.opacity = st.rd > 0 ? 1 : 0;
  korean.setAttribute('transform', `translate(0 ${n((1 - st.kr) * 95)})`);

  // Background follows the M/W
  const gx = L.Tx + x * L.S0;
  const gy = L.Ty + y * L.S0;
  const progress = tl ? tl.progress() : 0;
  const gs = 1 + 0.2 * progress;
  const s = bg.style;
  s.setProperty('--gx', n(gx) + 'px');
  s.setProperty('--gy', n(gy) + 'px');
  s.setProperty('--gi', n(st.gi));
  s.setProperty('--gsx', n(1 + 3.2 * st.gs + 0.5 * st.s * (1 - st.d)));
  s.setProperty('--gsy', n(Math.max(0.2, 1 - 0.8 * st.gs)));
  s.setProperty('--gs', n(gs * 1000) / 1000);
  s.setProperty('--lx', n(L.W * 0.6 + (gx - L.W / 2) / gs) + 'px'); // grid box is 120% of the screen
  s.setProperty('--ly', n(L.H * 0.6 + (gy - L.H / 2) / gs) + 'px');
  s.setProperty('--lr', n(180 + 160 * st.s) + 'px');
  s.setProperty('--cue', n(st.cue));
  s.setProperty('--bg', mix(BLACK, MUD, 0.3 * st.mud));

  hudStage.textContent = STAGES[[0.1, 0.35, 0.65, 0.85].filter((t) => progress >= t).length];
  hudPct.textContent = String(Math.round(progress * 100)).padStart(3, '0') + '%';
  root.classList.toggle('is-docked', st.d >= 0.999);
}

function buildTimeline() {
  tl = gsap.timeline({ paused: true, defaults: { ease: 'none' }, onUpdate: render });
  tl.to(st, { cue: 0, duration: 6 }, 0);
  // 10 to 35: separate
  FLY.forEach((f) => tl.to(st, { [f.key]: 1, duration: 14, ease: 'power2.in' }, f.at));
  tl.to(st, { a: 1, duration: 15, ease: 'power2.inOut' }, 20);
  // 35 to 65: spin
  tl.to(st, { s: 1, duration: 30, ease: 'power3.inOut' }, 35);
  tl.to(st, { f: 1, duration: 20, ease: 'power1.inOut' }, 40);
  tl.to(st, { gi: 0.9, duration: 15, ease: 'power2.in' }, 35);
  tl.to(st, { gs: 1, duration: 10, ease: 'power2.out' }, 57);
  // 65 to 85: assemble
  tl.to(st, { rd: 1, duration: 10, ease: 'power3.out' }, 65);
  tl.to(st, { gs: 0, gi: 0.35, duration: 12, ease: 'power2.inOut' }, 68);
  tl.to(st, { kr: 1, duration: 11, ease: 'power3.out' }, 73);
  tl.to(st, { mud: 1, duration: 30 }, 70);
  // 85 to 100: dock
  tl.to(st, { d: 1, duration: 15, ease: 'power2.inOut' }, 85);
  tl.to(st, { gi: 0, duration: 15 }, 85);
}

layout();

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  root.classList.add('rm');
  $('#rmRazor').appendChild(navLogo.querySelector('svg').cloneNode(true));
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom 40%',
    onUpdate: (self) => {
      root.classList.toggle('rm-razor', self.progress > 0.1);
      root.classList.toggle('is-docked', self.progress > 0.9);
    },
  });
} else {
  buildTimeline();
  ScrollTrigger.addEventListener('refreshInit', layout);
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom 40%',
    scrub: 0.8,
    animation: tl,
  });
}
