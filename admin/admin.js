const SUPABASE_URL = 'https://lycezxiivraellfvbcch.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Y2V6eGlpdnJhZWxsZnZiY2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTE0NjcsImV4cCI6MjA5NzE4NzQ2N30.VbdxGDA4zbV711HSP2jVCPogpU1kGAWyqF7lf0Evvc8';

const themes = {
  default: { p: '#6c63ff', s: '#a855f7', name: 'Púrpura' },
  ocean:   { p: '#0ea5e9', s: '#06b6d4', name: 'Océano' },
  sunset:  { p: '#f97316', s: '#ef4444', name: 'Sunset' },
  forest:  { p: '#22c55e', s: '#16a34a', name: 'Bosque' },
  night:   { p: '#1e1b4b', s: '#312e81', name: 'Noche' },
  rose:    { p: '#f43f5e', s: '#ec4899', name: 'Rosa' },
  gold:    { p: '#f59e0b', s: '#d97706', name: 'Dorado' },
  dark:    { p: '#111',    s: '#374151', name: 'Oscuro' },
  custom:  { p: '#6c63ff', s: '#a855f7', name: 'Custom' }
};

let currentTheme = 'default';
let currentBtnStyle = 'rounded';
let currentBg = 'white';
let customLinks = [];

// SIDEBAR
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// NAVIGATION
function showSection(name, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  btn.classList.add('active');
  const titles = { links: 'Links', design: 'Diseño', profile: 'Perfil', stats: 'Estadísticas' };
  document.getElementById('topbarTitle').textContent = titles[name];
  closeSidebar();
}

// DESIGN PANELS
function togglePanel(id) {
  const panel = document.getElementById(id);
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// THEME
function selectTheme(el) {
  document.querySelectorAll('.theme-opt').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentTheme = el.dataset.theme;
  document.getElementById('themeLabel').textContent = el.dataset.name;
  document.getElementById('customColorsPanel').style.display =
    currentTheme === 'custom' ? 'block' : 'none';
}

function getColors() {
  if (currentTheme === 'custom') {
    return {
      p: document.getElementById('primaryColor').value,
      s: document.getElementById('secondaryColor').value
    };
  }
  return themes[currentTheme] || themes.default;
}

// BUTTON STYLE
function selectBtnStyle(el) {
  document.querySelectorAll('.btn-style-opt').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentBtnStyle = el.dataset.style;
  document.getElementById('btnLabel').textContent = el.dataset.name;
}

// BACKGROUND
function selectBg(el) {
  document.querySelectorAll('.bg-opt').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentBg = el.dataset.bg;
  document.getElementById('bgLabel').textContent = el.dataset.name;
  document.getElementById('bgColorWrap').style.display =
    currentBg === 'color' ? 'block' : 'none';
}

// PROFILE
function updateUsername() {
  const val = document.getElementById('username').value || 'tunombre';
  document.getElementById('phUrl').textContent = 'cardlink.app/' + val;
  document.getElementById('sidebarUrl').textContent = 'cardlink.app/' + val;
}

function updateName() {
  const val = document.getElementById('name').value || 'Tu Nombre';
  document.getElementById('phName').textContent = val;
  document.getElementById('sidebarName').textContent = val;
}

// AVATAR
document.getElementById('avatarFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('phAvatar').src = ev.target.result;
    document.getElementById('sidebarAvatar').src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// LINKS
function openAddLink() {
  document.getElementById('newLinkTitle').value = '';
  document.getElementById('newLinkUrl').value = '';
  document.getElementById('addLinkModal').classList.add('show');
}

function closeAddLink() {
  document.getElementById('addLinkModal').classList.remove('show');
}

function confirmAddLink() {
  const title = document.getElementById('newLinkTitle').value.trim();
  const url = document.getElementById('newLinkUrl').value.trim();
  if (!title || !url) return showToast('⚠️ Completa los campos', 'error');
  customLinks.push({ id: Date.now(), label: title, url, active: true });
  renderLinks();
  closeAddLink();
  updateStatLinks();
}

function renderLinks() {
  const list = document.getElementById('linksList');
  if (customLinks.length === 0) {
    list.innerHTML = `
      <div class="empty-links">
        <div style="font-size:2rem;margin-bottom:8px;">🔗</div>
        Agrega tu primer link arriba
      </div>`;
    return;
  }
  list.innerHTML = customLinks.map(link => `
    <div class="link-card">
      <span class="link-drag">⠿</span>
      <div class="link-card-body">
        <div class="link-card-title">${link.label}</div>
        <div class="link-card-url">${link.url}</div>
      </div>
      <div class="link-card-actions">
        <button class="toggle ${link.active ? 'on' : ''}" onclick="toggleLink(${link.id})"></button>
        <button class="link-delete" onclick="deleteLink(${link.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function toggleLink(id) {
  const link = customLinks.find(l => l.id === id);
  if (link) link.active = !link.active;
  renderLinks();
}

function deleteLink(id) {
  if (!confirm('¿Eliminar este link?')) return;
  customLinks = customLinks.filter(l => l.id !== id);
  renderLinks();
  updateStatLinks();
}

function updateStatLinks() {
  document.getElementById('statLinks').textContent = customLinks.length;
}

// TOAST
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.className = 'toast', 3000);
}

// PREVIEW
function previewCard() {
  const username = document.getElementById('username').value.trim();
  if (!username) return showToast('⚠️ Escribe tu username en Perfil', 'error');
  window.open(`/card/${username}`, '_blank');
}

// SAVE
async function saveCard() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const name = document.getElementById('name').value.trim();

  if (!username) return showToast('⚠️ Escribe tu username en Perfil', 'error');
  if (!name) return showToast('⚠️ Escribe tu nombre en Perfil', 'error');
  if (!/^[a-z0-9_-]+$/.test(username)) {
    return showToast('⚠️ Username: solo letras y números', 'error');
  }

  const btn = document.getElementById('saveBtn');
  btn.disabled = true;
  btn.textContent = 'Guardando...';

  const colors = getColors();

  const data = {
    username,
    name,
    role: document.getElementById('role').value.trim(),
    bio: document.getElementById('bio').value.trim(),
    whatsapp: document.getElementById('whatsapp').value.trim(),
    website: document.getElementById('website').value.trim(),
    instagram: document.getElementById('instagram').value.trim(),
    twitter: document.getElementById('twitter').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim(),
    email: document.getElementById('email').value.trim(),
    custom_links: customLinks.filter(l => l.active),
    primary_color: colors.p,
    secondary_color: colors.s,
    avatar_url: document.getElementById('phAvatar').src,
    button_style: currentBtnStyle,
    bg_type: currentBg,
    bg_color: document.getElementById('bgColor') ? document.getElementById('bgColor').value : '#f9fafb',
    theme: currentTheme
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    showToast('✅ Tarjeta guardada!', 'success');

  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }

  btn.disabled = false;
  btn.textContent = 'Guardar';
}

// INIT
renderLinks();