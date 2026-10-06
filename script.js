const clock = document.getElementById('clock');
const year = document.getElementById('year');
const commandWrap = document.getElementById('commandWrap');
const commandInput = document.getElementById('commandInput');
const commandItems = document.getElementById('commandItems');
const typedWord = document.getElementById('typedWord');

function updateClock() {
  const value = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date());
  clock.textContent = value;
}
updateClock();
setInterval(updateClock, 1000);
year.textContent = new Date().getFullYear();

function openCommands() {
  commandWrap.hidden = false;
  commandInput.value = '';
  filterCommands('');
  setTimeout(() => commandInput.focus(), 0);
}
function closeCommands() { commandWrap.hidden = true; }

document.getElementById('cmdOpen').addEventListener('click', openCommands);
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    commandWrap.hidden ? openCommands() : closeCommands();
  }
  if (e.key === 'Escape') closeCommands();
});
commandWrap.addEventListener('click', (e) => { if (e.target === commandWrap) closeCommands(); });

function filterCommands(term) {
  [...commandItems.querySelectorAll('button')].forEach(btn => {
    btn.hidden = !btn.textContent.toLowerCase().includes(term.toLowerCase());
  });
}
commandInput.addEventListener('input', () => filterCommands(commandInput.value));
commandItems.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  closeCommands();
  if (action === 'email') location.href = 'mailto:aylanajamkhan@gmail.com';
  if (action === 'projects' || action === 'skills') {
    const heading = [...document.querySelectorAll('h2')].find(h => h.textContent.toLowerCase() === action);
    heading?.parentElement.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

const words = ['work.', 'learn.', 'design.', 'build.', 'debug.', 'ship.'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
function typeLoop() {
  const currentWord = words[wordIndex];
  if (!deleting) {
    charIndex++;
    typedWord.textContent = currentWord.slice(0, charIndex);
    if (charIndex === currentWord.length) {
      deleting = true;
      return setTimeout(typeLoop, 1150);
    }
    setTimeout(typeLoop, 95);
  } else {
    charIndex--;
    typedWord.textContent = currentWord.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      return setTimeout(typeLoop, 260);
    }
    setTimeout(typeLoop, 55);
  }
}
if (typedWord) typeLoop();

const garden = document.getElementById('garden');
const resetGarden = document.getElementById('resetGarden');
const palettes = [
  ['#c9c0ff','#8e79ff'],
  ['#9deaff','#55c8ff'],
  ['#f2c7ff','#ba7dff'],
  ['#b6d8ff','#7b9dff'],
  ['#e7dcff','#a291ff']
];

function makePetal(i) {
  const p = document.createElement('span');
  p.className = `petal p${i}`;
  return p;
}

function addFlower(x, y, type = null, palette = null) {
  const rect = garden.getBoundingClientRect();
  const flower = document.createElement('span');
  flower.className = `flower ${type === 'tulip' ? 'tulip' : ''}`;
  const chosen = palette || palettes[Math.floor(Math.random() * palettes.length)];
  flower.style.setProperty('--petal-a', chosen[0]);
  flower.style.setProperty('--petal-b', chosen[1]);

  const stemH = Math.max(58, Math.min(125, rect.height - y + 20));
  flower.style.setProperty('--stem-h', `${stemH}px`);

  const stem = document.createElement('span');
  stem.className = 'stem-line';
  const leaf1 = document.createElement('span');
  leaf1.className = 'leaf l1';
  const leaf2 = document.createElement('span');
  leaf2.className = 'leaf l2';
  const bloom = document.createElement('span');
  bloom.className = 'bloom-shape';
  const petalCount = type === 'tulip' ? 3 : 6;
  for (let i = 1; i <= petalCount; i++) bloom.appendChild(makePetal(i));
  if (type !== 'tulip') {
    const center = document.createElement('span');
    center.className = 'center';
    bloom.appendChild(center);
  }
  flower.appendChild(stem);
  flower.appendChild(leaf1);
  flower.appendChild(leaf2);
  flower.appendChild(bloom);
  flower.style.left = `${x}px`;
  garden.appendChild(flower);
  garden.querySelector('.garden-message').style.opacity = '0';
}

garden.addEventListener('click', (e) => {
  const rect = garden.getBoundingClientRect();
  const type = Math.random() > .72 ? 'tulip' : 'daisy';
  addFlower(e.clientX - rect.left, e.clientY - rect.top, type);
});

function seedGarden() {
  const seeds = [
    [58, 234, 'daisy', palettes[1]],
    [155, 230, 'tulip', palettes[2]],
    [228, 236, 'daisy', palettes[0]],
    [304, 232, 'daisy', palettes[3]],
    [380, 226, 'tulip', palettes[4]],
    [458, 236, 'daisy', palettes[1]],
    [535, 228, 'daisy', palettes[2]],
    [640, 235, 'tulip', palettes[0]]
  ];
  seeds.forEach(([x,y,type,p]) => addFlower(x,y,type,p));
}
seedGarden();

resetGarden.addEventListener('click', () => {
  garden.querySelectorAll('.flower').forEach(el => el.remove());
  garden.querySelector('.garden-message').style.opacity = '1';
  seedGarden();
});

const root = document.body;
function setGlowPosition(x, y) {
  root.style.setProperty('--mx', `${x}px`);
  root.style.setProperty('--my', `${y}px`);
}
setGlowPosition(window.innerWidth * 0.72, Math.min(window.innerHeight * 0.18, 180));
window.addEventListener('mousemove', (e) => setGlowPosition(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  setGlowPosition(touch.clientX, touch.clientY);
}, { passive: true });
window.addEventListener('mouseleave', () => {
  setGlowPosition(window.innerWidth * 0.72, Math.min(window.innerHeight * 0.18, 180));
});
