// ═══════════════════════════════════════════════════════════════════════════
//  GRUPO INVERSA — Motor de Búsqueda v1.0
//  js/search.js
// ═══════════════════════════════════════════════════════════════════════════

'use strict';

// ── CONFIGURACIÓN DE CAMPOS POR PESTAÑA ─────────────────────────────────────
const SEARCH_CONFIGS = {
  comprar: {
    fields: [
      { id: 'zona',        label: 'Ubicación',         type: 'text',   placeholder: 'Capital, Caucete, Jáchal...' },
      { id: 'tipo',        label: 'Tipo',              type: 'select', options: ['Todos', 'Casa', 'Departamento', 'Terreno'] },
      { id: 'precio_max',  label: 'Precio máx. (USD)', type: 'select', options: ['Cualquiera', 'Hasta USD 50k', 'USD 50k–100k', 'Más de USD 100k'] },
      { id: 'dormitorios', label: 'Ambientes',         type: 'select', options: ['Cualquiera', '1', '2', '3', '4+'] }
    ]
  },
  alquilar: {
    fields: [
      { id: 'zona',        label: 'Ubicación',         type: 'text',   placeholder: 'Capital, Caucete, Rivadavia...' },
      { id: 'tipo',        label: 'Tipo',              type: 'select', options: ['Todos', 'Casa', 'Departamento'] },
      { id: 'precio_max',  label: 'Precio máx. (ARS)', type: 'select', options: ['Cualquiera', 'Hasta $300k', '$300k–$600k', 'Más de $600k'] },
      { id: 'dormitorios', label: 'Ambientes',         type: 'select', options: ['Cualquiera', '1', '2', '3', '4+'] }
    ]
  },
  pozo: {
    fields: [
      { id: 'zona',        label: 'Ubicación',    type: 'text',   placeholder: 'Capital, Rivadavia...' },
      { id: 'dormitorios', label: 'Ambientes',    type: 'select', options: ['Cualquiera', '1 amb.', '2 amb.', '3+ amb.'] },
      { id: 'etapa',       label: 'Etapa',        type: 'select', options: ['Cualquiera', 'Cimientos', 'Estructura', 'Terminaciones'] },
      { id: 'entrega',     label: 'Entrega',      type: 'select', options: ['Cualquiera', '2026', '2027', '2028'] }
    ]
  },
  comercial: {
    fields: [
      { id: 'zona',          label: 'Ubicación',    type: 'text',   placeholder: 'Parque Industrial, Capital...' },
      { id: 'tipo',          label: 'Tipo',         type: 'select', options: ['Todos', 'Galpón', 'Depósito', 'Local'] },
      { id: 'superficie',    label: 'Superficie',   type: 'select', options: ['Cualquiera', 'Hasta 200 m²', '200–500 m²', 'Más de 500 m²'] },
      { id: 'sub_operacion', label: 'Operación',    type: 'select', options: ['Cualquiera', 'Alquilar', 'Comprar'] }
    ]
  },
  minero: {
    fields: [
      { id: 'zona',      label: 'Zona',      type: 'text',   placeholder: 'Caucete, Rivadavia, Rawson...' },
      { id: 'tipo',      label: 'Tipo',      type: 'select', options: ['Todos', 'Casa amoblada', 'Galpón', 'Terreno'] },
      { id: 'personas',  label: 'Personas',  type: 'select', options: ['Cualquiera', '2–4', '5–8', '+8'] },
      { id: 'duracion',  label: 'Duración',  type: 'select', options: ['Cualquiera', 'Corto plazo', 'Mediano plazo', 'Largo plazo'] }
    ]
  }
};

// ── TAB → OPERACION MAPPING ──────────────────────────────────────────────────
const TAB_TO_OP = {
  comprar:   ['venta'],
  alquilar:  ['alquiler'],
  pozo:      ['pozo'],
  comercial: ['comercial_venta', 'comercial_alquiler'],
  minero:    ['minero']
};

// ── ESTADO GLOBAL ────────────────────────────────────────────────────────────
let currentTab = 'comprar';
let favorites  = new Set();

// ── INICIALIZACIÓN ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  renderSearchFields('comprar');
  renderFeatured();
  renderAgencies();
  updateCounters();
  bindTabs();
  bindNavbarScroll();
  bindChips();
  bindEscape();
});

// ── FAVORITOS ────────────────────────────────────────────────────────────────
function loadFavorites() {
  try { favorites = new Set(JSON.parse(localStorage.getItem('gi_favs') || '[]')); }
  catch(e) { favorites = new Set(); }
}
function saveFavorites() {
  try { localStorage.setItem('gi_favs', JSON.stringify([...favorites])); } catch(e) {}
}
function toggleFav(id, btn) {
  id = Number(id);
  if (favorites.has(id)) {
    favorites.delete(id);
    btn.classList.remove('active');
    btn.querySelector('i').className = 'far fa-heart';
  } else {
    favorites.add(id);
    btn.classList.add('active');
    btn.querySelector('i').className = 'fas fa-heart';
  }
  saveFavorites();
}

// ── RENDER CAMPOS DE BÚSQUEDA ────────────────────────────────────────────────
function renderSearchFields(tab) {
  currentTab = tab;
  const config = SEARCH_CONFIGS[tab];
  const grid   = document.getElementById('searchGrid');
  if (!grid || !config) return;

  grid.innerHTML = config.fields.map(f => {
    const input = f.type === 'text'
      ? `<input type="text" id="sf_${f.id}" placeholder="${f.placeholder || ''}">`
      : `<select id="sf_${f.id}">${f.options.map(o => `<option>${o}</option>`).join('')}</select>`;
    return `<div class="search-field"><label>${f.label}</label>${input}</div>`;
  }).join('') + `<button class="search-btn" onclick="handleSearch()">
    <i class="fas fa-search me-2"></i>Buscar
  </button>`;
}

// ── BIND EVENTS ──────────────────────────────────────────────────────────────
function bindTabs() {
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderSearchFields(this.dataset.tab);
    });
  });
}
function bindNavbarScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('mainNav')?.classList.toggle('scrolled', window.scrollY > 50);
  });
}
function bindChips() {
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.addEventListener('click', function () { this.classList.toggle('active'); });
  });
  const adv = document.getElementById('advancedToggle');
  if (adv) adv.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('advancedFilters').classList.toggle('active');
  });
}
function bindEscape() {
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePropModal(); });
}

// ── BÚSQUEDA PRINCIPAL ───────────────────────────────────────────────────────
function handleSearch() {
  const props = window.PROPIEDADES_DATA || [];

  const filters = {
    tab:           currentTab,
    zona:         (document.getElementById('sf_zona')?.value         || '').toLowerCase().trim(),
    tipo:          document.getElementById('sf_tipo')?.value         || 'Todos',
    precio_max:    document.getElementById('sf_precio_max')?.value   || 'Cualquiera',
    dormitorios:   document.getElementById('sf_dormitorios')?.value  || 'Cualquiera',
    etapa:         document.getElementById('sf_etapa')?.value        || 'Cualquiera',
    entrega:       document.getElementById('sf_entrega')?.value      || 'Cualquiera',
    superficie:    document.getElementById('sf_superficie')?.value   || 'Cualquiera',
    sub_operacion: document.getElementById('sf_sub_operacion')?.value|| 'Cualquiera',
    personas:      document.getElementById('sf_personas')?.value     || 'Cualquiera',
    duracion:      document.getElementById('sf_duracion')?.value     || 'Cualquiera',
    apto_credito:  document.getElementById('fc_credito')?.classList.contains('active') || false
  };

  const results = filterProps(props, filters);
  renderResults(results, filters);

  setTimeout(() => {
    document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── LÓGICA DE FILTRADO ───────────────────────────────────────────────────────
function filterProps(props, f) {
  return props.filter(p => {
    // Operación según pestaña
    const allowedOps = TAB_TO_OP[f.tab] || [];
    if (!allowedOps.includes(p.operacion)) return false;

    // Zona: búsqueda parcial en zona + barrio
    if (f.zona) {
      const hay = `${p.zona} ${p.barrio}`.toLowerCase();
      if (!hay.includes(f.zona)) return false;
    }

    // Tipo de propiedad
    if (f.tipo && f.tipo !== 'Todos') {
      const map = {
        'Casa':         'casa',
        'Departamento': 'departamento',
        'Terreno':      'terreno',
        'Galpón':       'galpon',
        'Depósito':     'deposito',
        'Local':        'local',
        'Casa amoblada':'casa'
      };
      const expected = map[f.tipo] || f.tipo.toLowerCase();
      if (p.tipo !== expected) return false;
      if (f.tipo === 'Casa amoblada' && !p.amoblada) return false;
    }

    // Precio máximo — Comprar (USD)
    if (f.tab === 'comprar' && f.precio_max !== 'Cualquiera') {
      const pr = p.precio;
      if (f.precio_max.includes('50k') && !f.precio_max.includes('–')) { if (pr > 50000) return false; }
      else if (f.precio_max.includes('50k–100k'))   { if (pr < 50001 || pr > 100000) return false; }
      else if (f.precio_max.includes('100k'))        { if (pr <= 100000) return false; }
    }

    // Precio máximo — Alquilar (ARS)
    if (f.tab === 'alquilar' && f.precio_max !== 'Cualquiera') {
      const pr = p.precio;
      if (f.precio_max.includes('300k') && !f.precio_max.includes('–')) { if (pr > 300000) return false; }
      else if (f.precio_max.includes('300k–600k'))  { if (pr < 300001 || pr > 600000) return false; }
      else if (f.precio_max.includes('600k'))        { if (pr <= 600000) return false; }
    }

    // Dormitorios / ambientes
    if (f.dormitorios && f.dormitorios !== 'Cualquiera') {
      const d = p.dormitorios || 0;
      if      (f.dormitorios === '1' || f.dormitorios === '1 amb.')  { if (d !== 1) return false; }
      else if (f.dormitorios === '2' || f.dormitorios === '2 amb.')  { if (d !== 2) return false; }
      else if (f.dormitorios === '3')                                 { if (d !== 3) return false; }
      else if (f.dormitorios === '4+' || f.dormitorios === '3+ amb.'){ if (d < 3)  return false; }
    }

    // Etapa (pozo)
    if (f.etapa && f.etapa !== 'Cualquiera' && p.etapa && p.etapa !== f.etapa) return false;

    // Entrega (pozo)
    if (f.entrega && f.entrega !== 'Cualquiera' && p.entrega && !p.entrega.includes(f.entrega)) return false;

    // Superficie (comercial)
    if (f.superficie && f.superficie !== 'Cualquiera') {
      const s = p.superficie || 0;
      if      (f.superficie.includes('200 m²') && !f.superficie.includes('–')) { if (s > 200) return false; }
      else if (f.superficie.includes('200–500'))  { if (s < 200 || s > 500) return false; }
      else if (f.superficie.includes('500 m²'))   { if (s <= 500) return false; }
    }

    // Sub-operación (comercial: comprar / alquilar)
    if (f.tab === 'comercial' && f.sub_operacion && f.sub_operacion !== 'Cualquiera') {
      if (f.sub_operacion === 'Comprar'  && p.operacion !== 'comercial_venta')    return false;
      if (f.sub_operacion === 'Alquilar' && p.operacion !== 'comercial_alquiler') return false;
    }

    // Personas (minero)
    if (f.tab === 'minero' && f.personas && f.personas !== 'Cualquiera' && p.personas) {
      const pMap = { '2–4': ['2-4'], '5–8': ['5-8'], '+8': ['+8'] };
      const allowed = pMap[f.personas] || [];
      if (allowed.length && !allowed.includes(p.personas)) return false;
    }

    // Duración (minero)
    if (f.tab === 'minero' && f.duracion && f.duracion !== 'Cualquiera' && p.duracion) {
      if (p.duracion !== f.duracion) return false;
    }

    // Apto crédito
    if (f.apto_credito && !p.apto_credito) return false;

    return true;
  });
}

// ── RENDER RESULTADOS ────────────────────────────────────────────────────────
function renderResults(results, filters) {
  const sec     = document.getElementById('propiedades');
  const eyebrow = sec?.querySelector('.section-eyebrow');
  const title   = sec?.querySelector('.section-title');
  const sub     = sec?.querySelector('.section-subtitle');
  const grid    = document.getElementById('propiedadesGrid');
  if (!grid) return;

  const labels = { comprar:'en venta', alquilar:'en alquiler', pozo:'en pozo', comercial:'comerciales', minero:'sector minero' };
  const label  = labels[filters.tab] || '';

  if (eyebrow) eyebrow.textContent = 'Resultados de búsqueda';
  if (title)   title.textContent   = `${results.length} propiedad${results.length !== 1 ? 'es' : ''} ${label}`;
  if (sub)     sub.innerHTML       = filters.zona
    ? `Zona: <strong>${filters.zona}</strong> &nbsp;·&nbsp; <a href="#" onclick="resetSearch();return false;" style="color:var(--gold)">Ver destacadas</a>`
    : `<a href="#" onclick="resetSearch();return false;" style="color:var(--gold)">Ver propiedades destacadas</a>`;

  if (results.length === 0) {
    grid.innerHTML = `<div class="col-12">
      <div class="no-results">
        <div class="no-results-icon"><i class="fas fa-search"></i></div>
        <h3>Sin resultados</h3>
        <p>No encontramos propiedades con esos filtros.<br>Probá cambiando la zona o los criterios de búsqueda.</p>
        <button onclick="resetSearch()" style="margin-top:20px;background:var(--navy);color:white;border:none;padding:14px 30px;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;border-radius:2px;">
          Ver propiedades destacadas
        </button>
      </div>
    </div>`;
    return;
  }

  grid.innerHTML = results.map(p => buildCard(p)).join('');
}

// ── RENDER DESTACADAS ────────────────────────────────────────────────────────
function renderFeatured() {
  const props = window.PROPIEDADES_DATA || [];
  const grid  = document.getElementById('propiedadesGrid');
  if (!grid) return;
  const featured = props.filter(p => p.destacada).slice(0, 6);
  grid.innerHTML  = featured.map(p => buildCard(p)).join('');
}

function resetSearch() {
  const sec     = document.getElementById('propiedades');
  const eyebrow = sec?.querySelector('.section-eyebrow');
  const title   = sec?.querySelector('.section-title');
  const sub     = sec?.querySelector('.section-subtitle');
  if (eyebrow) eyebrow.textContent = 'Selección destacada';
  if (title)   title.textContent   = 'Propiedades en San Juan';
  if (sub)     sub.innerHTML       = 'Una selección curada por nuestras agencias asociadas.';
  renderFeatured();
}

// ── FILTRAR POR AGENCIA ──────────────────────────────────────────────────────
function filterByAgency(agId) {
  const props = window.PROPIEDADES_DATA || [];
  const ags   = window.AGENCIAS_DATA   || [];
  const ag    = ags.find(a => a.id === agId);
  const res   = props.filter(p => p.agencia_id === agId);

  const sec     = document.getElementById('propiedades');
  const eyebrow = sec?.querySelector('.section-eyebrow');
  const title   = sec?.querySelector('.section-title');
  const sub     = sec?.querySelector('.section-subtitle');
  if (eyebrow) eyebrow.textContent = 'Propiedades de la agencia';
  if (title)   title.textContent   = ag ? ag.nombre : 'Agencia';
  if (sub)     sub.innerHTML       = `${res.length} propiedades · <a href="#" onclick="resetSearch();return false;" style="color:var(--gold)">Ver todas</a>`;

  const grid = document.getElementById('propiedadesGrid');
  if (grid) grid.innerHTML = res.map(p => buildCard(p)).join('');

  setTimeout(() => sec?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

// ── BUILD CARD ───────────────────────────────────────────────────────────────
function buildCard(p) {
  const isFav  = favorites.has(p.id);
  const badges = (p.badges || []).map(b => {
    const cls = { 'Alquiler':'rent','Minero':'mining','Pozo':'new','Amoblada':'gold','Premium':'gold','Financiación':'new','Apto Crédito':'rent','Comercial':'','Industrial':'' }[b] || '';
    return `<span class="property-badge ${cls}">${b}</span>`;
  }).join('');

  const price  = fmtPrice(p.precio, p.moneda);
  const period = ['venta','pozo','comercial_venta'].includes(p.operacion) ? '' : '<small>/mes</small>';
  const specs  = buildSpecs(p);

  return `<div class="col-md-6 col-lg-4">
    <div class="property-card" onclick="openModal(${p.id})" style="cursor:pointer;">
      <div class="property-img" style="background-image:url('${p.imagen}');">
        <div class="property-badges">${badges}</div>
        <button class="property-favorite ${isFav?'active':''}"
          onclick="event.stopPropagation();toggleFav(${p.id},this)" title="Guardar">
          <i class="${isFav?'fas':'far'} fa-heart"></i>
        </button>
        <div class="property-agency">${p.agencia}</div>
      </div>
      <div class="property-body">
        <div class="property-location"><i class="fas fa-map-marker-alt me-1"></i>${p.barrio}, ${p.zona}</div>
        <h3 class="property-title">${p.titulo}</h3>
        <p class="property-desc">${p.descripcion.substring(0,95)}${p.descripcion.length>95?'…':''}</p>
        <div class="property-price">${price} ${period}</div>
        <div class="property-specs">${specs}</div>
      </div>
    </div>
  </div>`;
}

function buildSpecs(p) {
  const s = [];
  if (p.dormitorios) s.push(`<span><i class="fas fa-bed"></i> ${p.dormitorios} dorm.</span>`);
  if (p.banos)       s.push(`<span><i class="fas fa-bath"></i> ${p.banos} baños</span>`);
  if (p.superficie)  s.push(`<span><i class="fas fa-ruler-combined"></i> ${p.superficie} m²</span>`);
  if (['galpon','deposito'].includes(p.tipo)) s.push(`<span><i class="fas fa-truck"></i> Acceso camión</span>`);
  return s.join('');
}

function fmtPrice(precio, moneda) {
  return moneda === 'USD'
    ? `USD ${precio.toLocaleString('es-AR')}`
    : `$ ${precio.toLocaleString('es-AR')}`;
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function openModal(id) {
  const props = window.PROPIEDADES_DATA || [];
  const ags   = window.AGENCIAS_DATA   || [];
  const p     = props.find(x => x.id === id);
  if (!p) return;

  const price  = fmtPrice(p.precio, p.moneda);
  const period = ['venta','pozo','comercial_venta'].includes(p.operacion) ? '' : '<small style="font-size:0.9rem;font-weight:400;opacity:0.7;">/mes</small>';

  // Imagen y badges
  document.getElementById('modalImg').style.backgroundImage = `url('${p.imagen}')`;
  document.getElementById('modalBadges').innerHTML = (p.badges||[]).map(b => {
    const cls = { 'Alquiler':'rent','Minero':'mining','Pozo':'new','Amoblada':'gold','Premium':'gold' }[b] || '';
    return `<span class="property-badge ${cls}">${b}</span>`;
  }).join('');

  // Textos
  document.getElementById('modalLocation').innerHTML    = `<i class="fas fa-map-marker-alt me-1"></i>${p.barrio}, ${p.zona}`;
  document.getElementById('modalTitle').textContent     = p.titulo;
  document.getElementById('modalPrice').innerHTML       = `${price} ${period}`;
  document.getElementById('modalDesc').textContent      = p.descripcion;
  document.getElementById('modalAgTag').textContent     = p.agencia;

  // Specs
  const specItems = [];
  if (p.dormitorios)  specItems.push(['fa-bed',           `${p.dormitorios} dormitorios`]);
  if (p.banos)        specItems.push(['fa-bath',          `${p.banos} baños`]);
  if (p.superficie)   specItems.push(['fa-ruler-combined',`${p.superficie} m²`]);
  if (p.apto_credito) specItems.push(['fa-university',    'Apto crédito hipotecario']);
  if (p.amoblada)     specItems.push(['fa-couch',         'Completamente amoblada']);
  if (p.etapa)        specItems.push(['fa-hard-hat',      `Etapa: ${p.etapa}`]);
  if (p.entrega)      specItems.push(['fa-calendar-alt',  `Entrega estimada: ${p.entrega}`]);
  if (p.personas)     specItems.push(['fa-users',         `Capacidad: ${p.personas} personas`]);
  if (p.duracion)     specItems.push(['fa-clock',         `Duración: ${p.duracion}`]);
  document.getElementById('modalSpecs').innerHTML = specItems.map(([ic, label]) =>
    `<div class="modal-spec"><i class="fas ${ic}"></i><span>${label}</span></div>`
  ).join('');

  // Tags
  document.getElementById('modalTags').innerHTML = (p.tags||[]).map(t =>
    `<span class="modal-tag">${t}</span>`
  ).join('');

  // Agencia info
  const ag = ags.find(a => a.id === p.agencia_id);
  document.getElementById('modalAgInfo').innerHTML = ag ? `
    <div class="modal-ag-logo">${ag.siglas}</div>
    <div>
      <div style="font-weight:600;color:var(--navy);font-size:0.95rem;">${ag.nombre}</div>
      <div style="font-size:0.78rem;color:var(--gold);text-transform:uppercase;letter-spacing:0.1em;">${ag.zona}</div>
    </div>` : '';

  // Botón WhatsApp
  const waMsg = encodeURIComponent(`Hola! Vi la propiedad "${p.titulo}" en Grupo Inversa y me interesa recibir más información.`);
  document.getElementById('modalWaBtn').href = `https://wa.me/${p.whatsapp}?text=${waMsg}`;

  // Botón favorito en modal
  const favBtn = document.getElementById('modalFavBtn');
  favBtn.classList.toggle('active', favorites.has(p.id));
  favBtn.querySelector('i').className = favorites.has(p.id) ? 'fas fa-heart' : 'far fa-heart';
  favBtn.onclick = () => {
    const isFav = favorites.has(p.id);
    if (isFav) { favorites.delete(p.id); } else { favorites.add(p.id); }
    saveFavorites();
    favBtn.classList.toggle('active', !isFav);
    favBtn.querySelector('i').className = !isFav ? 'fas fa-heart' : 'far fa-heart';
    // Actualizar card en el grid
    document.querySelectorAll('[onclick*="toggleFav"]').forEach(btn => {
      if (btn.getAttribute('onclick')?.includes(`,${p.id},`) || btn.getAttribute('onclick')?.includes(`(${p.id},`)) {
        btn.classList.toggle('active', !isFav);
        btn.querySelector('i').className = !isFav ? 'fas fa-heart' : 'far fa-heart';
      }
    });
  };

  document.getElementById('propModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePropModal() {
  document.getElementById('propModal')?.classList.remove('active');
  document.body.style.overflow = '';
}
function closeModalOverlay(e) {
  if (e.target === document.getElementById('propModal')) closePropModal();
}

// ── RENDER AGENCIAS ──────────────────────────────────────────────────────────
function renderAgencies() {
  const ags  = window.AGENCIAS_DATA   || [];
  const props = window.PROPIEDADES_DATA || [];
  const grid = document.getElementById('agenciasGrid');
  if (!grid) return;

  grid.innerHTML = ags.map(ag => {
    const count = props.filter(p => p.agencia_id === ag.id).length;
    return `<div class="col-md-6 col-lg-4">
      <div class="agency-card">
        <div class="agency-logo">${ag.siglas}</div>
        <h4 class="agency-name">${ag.nombre}</h4>
        <span class="agency-zone">${ag.zona}</span>
        <p class="agency-desc">${ag.descripcion}</p>
        <div class="agency-stats">
          <div class="agency-stat"><strong>${count}</strong><small>Propiedades</small></div>
          <div class="agency-stat"><strong>${ag.años}</strong><small>Años</small></div>
        </div>
        <div class="agency-actions">
          <a href="#propiedades" onclick="filterByAgency(${ag.id})" class="agency-btn-primary">Ver propiedades</a>
          <a href="https://wa.me/${ag.whatsapp}" class="agency-btn-secondary" target="_blank">Contactar</a>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── CONTADORES ───────────────────────────────────────────────────────────────
function updateCounters() {
  const props = window.PROPIEDADES_DATA || [];
  const ags   = window.AGENCIAS_DATA   || [];

  animCount('counterProps',    props.length);
  animCount('counterAgencias', ags.length);
  animCount('counterBusquedas', 847);

  const hint = document.getElementById('searchCountHint');
  if (hint) hint.textContent = `+${props.length} propiedades disponibles`;
}

function animCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step  = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString('es-AR');
    if (cur >= target) clearInterval(timer);
  }, 25);
}

// ── FORMULARIOS ──────────────────────────────────────────────────────────────
function enviarWhatsAppPublicar(e) {
  e.preventDefault();
  const nombre    = document.getElementById('pub_nombre')?.value    || '';
  const tipo      = document.getElementById('pub_tipo')?.value      || '';
  const operacion = document.getElementById('pub_operacion')?.value || '';
  const ubicacion = document.getElementById('pub_ubicacion')?.value || '';
  const texto = encodeURIComponent(
    `Hola! Quiero publicar mi propiedad en Grupo Inversa:\n*Nombre:* ${nombre}\n*Tipo:* ${tipo}\n*Operación:* ${operacion}\n*Ubicación:* ${ubicacion}`
  );
  window.open(`https://wa.me/5492645304372?text=${texto}`, '_blank');
}

function enviarWhatsAppTasacion(e) {
  e.preventDefault();
  const nombre    = document.getElementById('tas_nombre')?.value    || '';
  const direccion = document.getElementById('tas_direccion')?.value || '';
  const tipo      = document.getElementById('tas_tipo')?.value      || '';
  const texto = encodeURIComponent(
    `Hola! Quiero una tasación gratuita:\n*Nombre:* ${nombre}\n*Dirección:* ${direccion}\n*Tipo:* ${tipo}`
  );
  window.open(`https://wa.me/5492645304372?text=${texto}`, '_blank');
}

// ── CHATBOT ──────────────────────────────────────────────────────────────────
function toggleChatbot() {
  const w = document.getElementById('chatbotWindow');
  w.classList.toggle('active');
  if (w.classList.contains('active')) showMainMenu();
}

function showMainMenu() {
  document.getElementById('chatbotBody').innerHTML = `
    <div class="chatbot-message">¡Hola! Bienvenido a Grupo Inversa. ¿En qué te puedo ayudar?</div>
    <div class="chatbot-options">
      <button class="chatbot-option" onclick="showChatOpt('comprar')"><i class="fas fa-home"></i> Quiero comprar</button>
      <button class="chatbot-option" onclick="showChatOpt('alquilar')"><i class="fas fa-key"></i> Quiero alquilar</button>
      <button class="chatbot-option" onclick="showChatOpt('minero')"><i class="fas fa-hard-hat"></i> Sector minero</button>
      <button class="chatbot-option" onclick="showChatOpt('publicar')"><i class="fas fa-bullhorn"></i> Publicar propiedad</button>
      <button class="chatbot-option" onclick="showChatOpt('tasacion')"><i class="fas fa-chart-line"></i> Tasar mi propiedad</button>
      <button class="chatbot-option" onclick="showChatOpt('agencia')"><i class="fas fa-building"></i> Soy una agencia</button>
    </div>`;
}

function showChatOpt(opt) {
  const msgs = {
    comprar:  'Usá el buscador con la pestaña "Comprar". Podés filtrar por zona, tipo y precio. Si necesitás ayuda personalizada, te conectamos con una agencia.',
    alquilar: 'Seleccioná "Alquilar" en el buscador. Tenemos casas y departamentos en Capital, Caucete, Rawson y Rivadavia.',
    minero:   'Tenemos sección especial para el sector minero: casas amobladas, galpones y depósitos en zonas clave. Usá la pestaña "Minero" en el buscador.',
    publicar: 'Podés publicar tu propiedad con el formulario de la sección "Publicar" o directamente por WhatsApp. Es rápido, sin costo y sin comisión.',
    tasacion: 'Te enviamos una tasación orientativa en menos de 24 horas, completamente gratis y sin visita previa.',
    agencia:  'Tenemos cupos disponibles para agencias de San Juan. Alta en 24hs, sin comisión. Escribinos por WhatsApp y te explicamos cómo sumarte.'
  };
  document.getElementById('chatbotBody').innerHTML = `
    <button class="chatbot-back" onclick="showMainMenu()"><i class="fas fa-arrow-left me-1"></i> Volver</button>
    <div class="chatbot-response">${msgs[opt] || ''}</div>
    <a href="https://wa.me/5492645304372" class="chatbot-wa-btn" target="_blank">
      <i class="fab fa-whatsapp"></i> Chatear con un asesor
    </a>`;
}
