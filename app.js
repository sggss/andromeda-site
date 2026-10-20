'use strict';

/* ---------- Данные клуба (из прайса и конфигураций в VK) ---------- */
const PACKS = [
  { id: 'h1', name: '1 час', hours: 1 },
  { id: 'morning', name: 'Утро', note: '08:00–12:00' },
  { id: 'h3', name: '3 часа', hours: 3 },
  { id: 'h5', name: '5 часов', hours: 5 },
  { id: 'h8', name: '8 часов', hours: 8 },
  { id: 'night', name: 'Ночь', note: '22:00–08:00', ps: '00:00–08:00' },
];

const CLUBS = [
  {
    id: 'lenina', name: 'Ленина 23А',
    zones: ['Standart', 'VIP 1–2', 'VIP+ DUO'],
    prices: {
      h1: [120, 150, 170, 300], morning: [220, 320, 400, 500], h3: [300, 400, 460, 800],
      h5: [500, 650, 750, 1200], h8: [700, 950, 1050, null], night: [550, 700, 850, 1200],
    },
    specs: [
      { zone: 'Standart', gpu: 'RTX 2060 Super', cpu: 'Intel Core i5-9400F', ram: 'Kingston Fury 16 ГБ', monitor: 'AOC C24G1 144 Гц', kb: 'ARDOR Blade PRO', mouse: 'MSI Clutch / Logitech G102', head: 'Acer AHW 120' },
      { zone: 'VIP 1–2', gpu: 'RTX 3060 Ti', cpu: 'Intel Core i5-12400F', ram: 'Kingston Fury Beast 32 ГБ', monitor: 'LG Gaming 27" 240 Гц / Samsung 27" 240 Гц', kb: 'HyperX Alloy FPS Pro', mouse: 'AJAZZ AJ159 APEX', head: 'HyperX Cloud II / Razer BlackShark V2' },
      { zone: 'VIP+ DUO', gpu: 'RTX 5060 Dual OC', cpu: 'Intel Core i5-12400F', ram: 'Kingston Fury Beast 32 ГБ', monitor: 'AOC C27G 280 Гц', kb: 'HyperX Alloy FPS Pro', mouse: 'AJAZZ AJ159 APEX', head: 'Razer BlackShark V2' },
    ],
    psZone: '2 × PlayStation 5',
  },
  {
    id: 'mkr54', name: 'Микрорайон 54',
    zones: ['Comfort', 'Ultra'],
    prices: {
      h1: [140, 180, 300], morning: [300, 420, 500], h3: [360, 480, 800],
      h5: [600, 800, 1200], h8: [850, 1150, null], night: [700, 900, 1200],
    },
    specs: [
      { zone: 'Comfort', gpu: 'RTX 5060 8 ГБ', cpu: 'Intel Core i5-12400F', ram: 'Kingston Fury Beast 32 ГБ', monitor: 'AOC 24.5" 180 Гц', kb: 'Red Square Keyrox', mouse: 'Logitech G102', head: 'Acer AHW 120' },
      { zone: 'Ultra', gpu: 'RTX 5070 12 ГБ', cpu: 'Intel Core i7-12700KF', ram: 'Kingston Fury Beast 32 ГБ', monitor: 'AOC 27" 2K 240 Гц', kb: 'Dark Project Arena', mouse: 'AJAZZ AJ159 APEX', head: 'Razer BlackShark V2' },
    ],
    psZone: 'PlayStation 5',
  },
];

const GAMES = {
  pc: ['CS 1.6', 'CS 2', 'Fortnite', 'Dota 2', 'PUBG', 'GTA 5', 'Warface', 'VALORANT', 'Call of Duty: Warzone 2', 'Battlefield 2042', 'Apex Legends', 'Rust', 'The Finals', 'Left 4 Dead 2', 'Lethal Company', 'Euro Truck Simulator 2', 'Dying Light', 'Stalcraft', 'Minecraft', 'Phasmophobia', 'The Forest', 'Sons of the Forest', 'Valheim', 'Mafia: Definitive Edition', 'Genshin Impact', 'League of Legends', 'Forza Horizon 4', 'Dead by Daylight', 'World of Tanks', 'War Thunder', 'Diablo II: Resurrected', 'Warcraft III', 'The Witcher 3', 'RAGE MP', 'GTA 5 RP', 'Civilization VI'],
  ps: ['EA Sports FC 26', 'NBA 26', 'NHL 26', 'UFC 6', 'UFC 5', 'REANIMAL', 'A Way Out', 'Star Wars Jedi: Fallen Order', 'Mortal Kombat 1', 'Mortal Kombat 11', 'Need for Speed', 'It Takes Two', 'Подписка EA Play'],
};

/* ---------- Утилиты ---------- */
const $ = (s, r = document) => r.querySelector(s);
const rub = n => n.toLocaleString('ru-RU') + ' ₽';
const el = (tag, props = {}, ...kids) => {
  const e = Object.assign(document.createElement(tag), props);
  kids.forEach(k => e.append(k));
  return e;
};

function makeTabs(container, items, onSelect, initial = 0) {
  const btns = items.map((label, i) => {
    const b = el('button', { type: 'button', textContent: label });
    b.addEventListener('click', () => select(i));
    container.append(b);
    return b;
  });
  function select(i) {
    btns.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    onSelect(i);
  }
  select(initial);
}

/* ---------- Прайс ---------- */
function renderPrice(ci) {
  const c = CLUBS[ci];
  const t = $('#priceTable');
  t.textContent = '';
  const head = el('tr', {}, el('th', { scope: 'col', textContent: 'Время' }));
  c.zones.forEach(z => head.append(el('th', { scope: 'col', textContent: z.toUpperCase() })));
  head.append(el('th', { scope: 'col', className: 'ps', textContent: 'PS 5' }));
  t.append(el('thead', {}, head));
  const body = el('tbody');
  PACKS.forEach(p => {
    const row = el('tr');
    const th = el('th', { scope: 'row', textContent: p.name });
    if (p.note) th.append(el('small', { textContent: p.note }));
    row.append(th);
    c.prices[p.id].forEach((v, i, arr) => {
      const isPs = i === arr.length - 1;
      const td = el('td', { textContent: v == null ? '—' : rub(v) });
      if (v == null) td.setAttribute('aria-label', 'недоступно');
      if (isPs) td.className = v == null ? 'ps na' : 'ps';
      if (isPs && p.ps && v != null) td.append(el('small', { textContent: p.ps }));
      row.append(td);
    });
    body.append(row);
  });
  t.append(body);
}

/* ---------- Калькулятор ---------- */
const calc = { club: 0, zone: 'Standart', pack: 'h3' };
const PS = 'PlayStation 5';
function seg(container, items, active, onPick) {
  const hadFocus = container.contains(document.activeElement);
  container.textContent = '';
  items.forEach(([key, label]) => {
    const b = el('button', { type: 'button', textContent: label });
    b.setAttribute('aria-pressed', String(key === active));
    b.addEventListener('click', () => onPick(key));
    container.append(b);
    if (hadFocus && key === active) b.focus();
  });
}
function renderCalc() {
  const c = CLUBS[calc.club];
  const zoneNames = [...c.zones, PS];
  if (!zoneNames.includes(calc.zone)) calc.zone = zoneNames[0];
  const zi = zoneNames.indexOf(calc.zone);
  seg($('#cClub'), CLUBS.map((x, i) => [i, x.name]), calc.club, i => { calc.club = i; renderCalc(); });
  seg($('#cZone'), zoneNames.map(z => [z, z]), calc.zone, z => { calc.zone = z; renderCalc(); });
  const available = PACKS.filter(p => c.prices[p.id][zi] != null);
  if (!available.some(p => p.id === calc.pack)) calc.pack = available[0].id;
  seg($('#cPack'), available.map(p => [p.id, p.name]), calc.pack, id => { calc.pack = id; renderCalc(); });

  const price = c.prices[calc.pack][zi];
  const pack = PACKS.find(p => p.id === calc.pack);
  $('#rPrice').textContent = rub(price);
  const side = [$('#rHour'), $('#rSave')];
  side.forEach(s => (s.textContent = ''));
  if (pack.hours) {
    const base = c.prices.h1[zi] * pack.hours;
    side[0].textContent = `≈ ${rub(Math.round(price / pack.hours))} в час`;
    if (pack.hours > 1 && base > price) side[1].textContent = `Экономия ${rub(base - price)}`;
  } else {
    const when = calc.zone === PS && pack.ps ? pack.ps : pack.note;
    side[0].textContent = when ? `Пакет ${when}` : '';
  }
}

/* ---------- Железо ---------- */
function renderSpecs(ci) {
  const c = CLUBS[ci];
  const box = $('#specCards');
  box.textContent = '';
  const rows = [['cpu', 'Процессор'], ['ram', 'Оперативка'], ['monitor', 'Монитор'], ['kb', 'Клавиатура'], ['mouse', 'Мышь'], ['head', 'Наушники']];
  c.specs.forEach(s => {
    const dl = el('dl');
    rows.forEach(([k, l]) => dl.append(el('div', {}, el('dt', { textContent: l }), el('dd', { textContent: s[k] }))));
    box.append(el('article', { className: 'spec' }, el('h3', { textContent: s.zone }), el('p', { className: 'gpu-line', textContent: s.gpu }), dl));
  });
  box.append(el('div', { className: 'ps-zone' }, el('b', { textContent: 'PS ZONE' }), document.createTextNode(c.psZone)));
}

/* ---------- Игры ---------- */
let gameTab = 'pc';
function renderGames() {
  const q = $('#gameSearch').value.trim().toLowerCase();
  const list = $('#gameList');
  list.textContent = '';
  const found = GAMES[gameTab].filter(g => g.toLowerCase().includes(q));
  found.forEach(g => list.append(el('li', { textContent: g })));
  if (gameTab === 'pc' && !q) list.append(el('li', { className: 'more', textContent: 'и другие актуальные игры…' }));
  $('#gameEmpty').hidden = found.length > 0;
}

/* ---------- Инициализация ---------- */
const clubNames = CLUBS.map(c => c.name);
makeTabs($('[data-group=price]'), clubNames, renderPrice);
makeTabs($('[data-group=spec]'), clubNames, renderSpecs);
makeTabs($('[data-group=games]'), ['Игры на ПК', 'Игры на PS5'], i => { gameTab = i ? 'ps' : 'pc'; renderGames(); });
$('#gameSearch').addEventListener('input', renderGames);
renderCalc();

/* меню */
const burger = $('.burger'), menu = $('.nav nav');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('open')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
});

/* появление при скролле */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(n => io.observe(n));

/* счётчики */
document.querySelectorAll('[data-count]').forEach(n => {
  const to = +n.dataset.count, suffix = n.dataset.suffix || '', plus = 'plus' in n.dataset ? '+' : '';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { n.textContent = to + plus + suffix; return; }
  const t0 = performance.now(), dur = 1400;
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    n.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + plus + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

/* фон: неоновые частицы */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = $('#bg'), ctx = cv.getContext('2d');
  let w, h, pts;
  const init = () => {
    w = cv.width = innerWidth; h = cv.height = innerHeight;
    pts = Array.from({ length: Math.min(w < 700 ? 24 : 70, Math.round(w * h / 22000)) }, () => ({
      x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w * .8, 0, 0, w * .8, 0, w * .7);
    g.addColorStop(0, 'rgba(124,58,237,.22)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    pts.forEach((p, i) => {
      p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
      ctx.fillStyle = 'rgba(255,45,120,.7)';
      ctx.fillRect(p.x, p.y, 2, 2);
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(160,100,255,${.16 * (1 - d / 130)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    });
    if (!document.hidden) requestAnimationFrame(draw); else running = false;
  };
  let running = true;
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !running) { running = true; requestAnimationFrame(draw); } });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth !== w) init(); }, 200); });
  init(); draw();
})();
