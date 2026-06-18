// ═══════════════════════════════════════════════════════════════════════════
//  MOTOR DE LA AGENCIA — app.js
// ═══════════════════════════════════════════════════════════════════════════
'use strict';

// ── ESTADO GLOBAL ────────────────────────────────────────────────────────────
let currentTab  = 'alquiler';
let favorites   = new Set();
let allProps    = [];
let cfg         = {};

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  cfg      = window.AGENCIA_CONFIG   || {};
  allProps = window.PROPIEDADES_DATA || [];

  applyConfig();
  loadFavorites();
  renderFeatured();
  bindTabs();
  bindNavScroll();
  bindSearchBtn();
  bindEscape();
  animateCounters();
});

// ── APLICAR CONFIGURACIÓN ─────────────────────────────────────────────────────
function applyConfig() {
  // Colores custom (opcional)
  if (cfg.color_primario) document.documentElement.style.setProperty('--primary', cfg.color_primario);
  if (cfg.color_acento)   document.documentElement.style.setProperty('--accent',  cfg.color_acento);

  // Textos dinámicos
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
  set('cfg_nombre',    cfg.nombre);
  set('cfg_slogan',    cfg.slogan);
  set('cfg_telefono',  cfg.telefono);
  set('cfg_email',     cfg.email);
  set('cfg_direccion', cfg.direccion);
  set('cfg_años',      cfg.años_experiencia);
  set('cfg_ops',       cfg.operaciones_cerradas);
  set('cfg_horario',   cfg.horario);

  // Propiedades activas (del JS o del config)
  const propCount = cfg.propiedades_activas ?? allProps.length;
  set('cfg_props', propCount);

  // Brand en navbar y footer
  document.querySelectorAll('.brand-name').forEach(el => el.textContent = cfg.nombre || 'Grupo Inversa');

  // WhatsApp float link
  const waFloat = document.getElementById('waFloat');
  if (waFloat) waFloat.href = `https://wa.me/${cfg.whatsapp}`;

  // Zonas en footer
  const zonasEl = document.getElementById('footerZonas');
  if (zonasEl && cfg.zonas) {
    zonasEl.innerHTML = cfg.zonas.map(z => `<a href="#">${z}</a>`).join('');
  }

  // Meta SEO
  if (cfg.meta_title)       document.title = cfg.meta_title;
  if (cfg.meta_description) {
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = cfg.meta_description;
  }

  // Redes sociales
  const igEl = document.getElementById('socialIG');
  const fbEl = document.getElementById('socialFB');
  if (igEl) igEl.style.display = cfg.instagram ? '' : 'none';
  if (fbEl) fbEl.style.display = cfg.facebook  ? '' : 'none';
  if (igEl && cfg.instagram) igEl.href = cfg.instagram;
  if (fbEl && cfg.facebook)  fbEl.href = cfg.facebook;
}

// ── FAVORITOS ─────────────────────────────────────────────────────────────────
function loadFavorites() {
  try { favorites = new Set(JSON.parse(localStorage.getItem('gi_ag_favs') || '[]')); } catch(e) {}
}
function saveFavorites() {
  try { localStorage.setItem('gi_ag_favs', JSON.stringify([...favorites])); } catch(e) {}
}
function toggleFav(id, btn) {
  id = Number(id);
  const on = favorites.has(id);
  on ? favorites.delete(id) : favorites.add(id);
  saveFavorites();
  btn.classList.toggle('active', !on);
  btn.querySelector('i').className = !on ? 'fas fa-heart' : 'far fa-heart';
}

// ── TABS DE BÚSQUEDA ──────────────────────────────────────────────────────────
function bindTabs() {
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentTab = this.dataset.tab;
    });
  });
}

// ── BÚSQUEDA ──────────────────────────────────────────────────────────────────
function bindSearchBtn() {
  document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
}

function handleSearch() {
  const zona  = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const results = filterProps(allProps, { tab: currentTab, zona });

  renderResults(results, zona);
  setTimeout(() => {
    document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// ── FILTRO ────────────────────────────────────────────────────────────────────
function filterProps(props, f) {
  const TAB_MAP = {
    alquiler:  ['alquiler'],
    comprar:   ['venta'],
    galpones:  ['comercial_alquiler', 'comercial_venta'],
    terrenos:  ['venta'],          // filtra por tipo también
    pozo:      ['pozo']
  };
  const ops = TAB_MAP[f.tab] || [];

  return props.filter(p => {
    // Operación
    if (!ops.includes(p.operacion)) return false;
    // Terrenos: solo tipo terreno
    if (f.tab === 'terrenos' && p.tipo !== 'terreno') return false;
    // Zona
    if (f.zona) {
      const hay = `${p.zona} ${p.barrio}`.toLowerCase();
      if (!hay.includes(f.zona)) return false;
    }
    return true;
  });
}

// ── RENDER PROPIEDADES ────────────────────────────────────────────────────────
function renderFeatured() {
  const grid    = document.getElementById('propiedadesGrid');
  const title   = document.getElementById('propiedadesTitle');
  const subtitle= document.getElementById('propiedadesSubtitle');
  if (!grid) return;
  if (title)    title.textContent   = 'Propiedades destacadas';
  if (subtitle) subtitle.textContent= 'Una selección de las mejores oportunidades del mercado hoy.';
  grid.innerHTML = allProps.filter(p => p.destacada).slice(0, 6).map(buildCard).join('');
}

function renderResults(results, zona) {
  const grid    = document.getElementById('propiedadesGrid');
  const title   = document.getElementById('propiedadesTitle');
  const subtitle= document.getElementById('propiedadesSubtitle');
  if (!grid) return;

  const labels = { alquiler:'en alquiler', comprar:'en venta', galpones:'comerciales / industriales', terrenos:'— terrenos', pozo:'en pozo' };
  if (title)    title.textContent   = `${results.length} propiedad${results.length!==1?'es':''} ${labels[currentTab]||''}`;
  if (subtitle) subtitle.innerHTML  = zona
    ? `Zona: <strong>${zona}</strong> · <a href="#" onclick="resetSearch();return false;" style="color:var(--primary);">Ver destacadas</a>`
    : `<a href="#" onclick="resetSearch();return false;" style="color:var(--primary);">Ver propiedades destacadas</a>`;

  if (results.length === 0) {
    grid.innerHTML = `<div class="col-12">
      <div class="no-results">
        <i class="fas fa-search no-results-icon"></i>
        <h3>Sin resultados</h3>
        <p>No encontramos propiedades con esos criterios.<br>Probá cambiando la zona o el tipo de búsqueda.</p>
        <button onclick="resetSearch()" class="btn-reset">Ver propiedades destacadas</button>
      </div>
    </div>`;
    return;
  }
  grid.innerHTML = results.map(buildCard).join('');
}

function resetSearch() {
  document.getElementById('searchInput').value = '';
  renderFeatured();
}

// ── BUILD CARD ────────────────────────────────────────────────────────────────
function buildCard(p) {
  const isFav  = favorites.has(p.id);
  const price  = fmtPrice(p.precio, p.moneda);
  const period = ['venta','pozo','comercial_venta'].includes(p.operacion) ? '' : '<small>/mes</small>';

  const badges = (p.badges||[]).map(b => {
    const cls = b==='Alquiler'?'rent':b==='Pozo'?'pozo':b==='Apto Crédito'?'mortgage':b==='Premium'||b==='Corporativo'?'premium':'';
    return `<span class="prop-badge ${cls}">${b}</span>`;
  }).join('');

  const specs = buildSpecs(p);
  const urgency = buildUrgency(p);

  return `<div class="col-md-6 col-xl-4">
    <div class="property-card" onclick="openModal(${p.id})" style="cursor:pointer;">
      <div class="property-img" style="background-image:url('${p.imagen}');">
        <div class="prop-badges">${badges}</div>
        <button class="prop-fav ${isFav?'active':''}"
          onclick="event.stopPropagation();toggleFav(${p.id},this)" title="Guardar">
          <i class="${isFav?'fas':'far'} fa-heart"></i>
        </button>
        ${urgency}
      </div>
      <div class="property-body">
        <div class="property-address"><i class="fas fa-map-marker-alt me-1"></i>${p.barrio}, ${p.zona}</div>
        <h3 class="property-title">${p.titulo}</h3>
        <p class="property-desc">${p.descripcion.substring(0,90)}${p.descripcion.length>90?'…':''}</p>
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
  if (p.superficie)  s.push(`<span><i class="fas fa-ruler-combined"></i> ${p.superficie}m²</span>`);
  if (['galpon','deposito'].includes(p.tipo)) s.push(`<span><i class="fas fa-truck"></i> Camiones</span>`);
  if (p.etapa)       s.push(`<span><i class="fas fa-hard-hat"></i> ${p.etapa}</span>`);
  if (p.apto_credito) s.push(`<span><i class="fas fa-university"></i> Apto crédito</span>`);
  return s.join('');
}

function buildUrgency(p) {
  if (!p.vistas_hoy && !p.dias_publicada) return '';
  const parts = [];
  if (p.vistas_hoy   > 0)  parts.push(`<i class="fas fa-eye me-1"></i>${p.vistas_hoy} vistas hoy`);
  if (p.dias_publicada > 0) parts.push(`<i class="fas fa-clock me-1"></i>Hace ${p.dias_publicada} día${p.dias_publicada>1?'s':''}`);
  return `<div class="prop-urgency">${parts.join(' · ')}</div>`;
}

function fmtPrice(precio, moneda) {
  return moneda === 'USD'
    ? `USD ${precio.toLocaleString('es-AR')}`
    : `$ ${precio.toLocaleString('es-AR')}`;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function openModal(id) {
  const p = allProps.find(x => x.id === id);
  if (!p) return;

  const price  = fmtPrice(p.precio, p.moneda);
  const period = ['venta','pozo','comercial_venta'].includes(p.operacion) ? '' : '<small style="font-size:0.85rem;opacity:0.65;font-weight:400">/mes</small>';

  document.getElementById('modalImg').style.backgroundImage    = `url('${p.imagen}')`;
  document.getElementById('modalLocation').innerHTML           = `<i class="fas fa-map-marker-alt me-1"></i>${p.barrio}, ${p.zona}`;
  document.getElementById('modalTitle').textContent            = p.titulo;
  document.getElementById('modalPrice').innerHTML              = `${price} ${period}`;
  document.getElementById('modalDesc').textContent             = p.descripcion;

  // Badges
  document.getElementById('modalBadges').innerHTML = (p.badges||[]).map(b => {
    const cls = b==='Alquiler'?'rent':b==='Pozo'?'pozo':b==='Apto Crédito'?'mortgage':b==='Premium'||b==='Corporativo'?'premium':'';
    return `<span class="prop-badge ${cls}">${b}</span>`;
  }).join('');

  // Specs
  const specsArr = [];
  if (p.dormitorios)  specsArr.push(['fa-bed',            `${p.dormitorios} dormitorios`]);
  if (p.banos)        specsArr.push(['fa-bath',           `${p.banos} baños`]);
  if (p.superficie)   specsArr.push(['fa-ruler-combined', `${p.superficie} m²`]);
  if (p.amoblada)     specsArr.push(['fa-couch',          'Completamente amoblada']);
  if (p.apto_credito) specsArr.push(['fa-university',     'Apto crédito hipotecario']);
  if (p.etapa)        specsArr.push(['fa-hard-hat',       `Etapa: ${p.etapa}`]);
  if (p.entrega)      specsArr.push(['fa-calendar-alt',   `Entrega estimada: ${p.entrega}`]);
  if (['galpon','deposito'].includes(p.tipo)) specsArr.push(['fa-truck','Acceso camiones']);
  document.getElementById('modalSpecs').innerHTML = specsArr.map(([ic,label]) =>
    `<div class="modal-spec"><i class="fas ${ic}"></i><span>${label}</span></div>`
  ).join('');

  // Extras / tags
  document.getElementById('modalExtras').innerHTML = (p.extras||[]).map(e =>
    `<span class="modal-extra">${e}</span>`
  ).join('');

  // WhatsApp
  const waMsg = encodeURIComponent(p.whatsapp_msg || `Hola! Vi la propiedad "${p.titulo}" y me interesa.`);
  document.getElementById('modalWaBtn').href = `https://wa.me/${cfg.whatsapp}?text=${waMsg}`;

  // Favorito en modal
  const favBtn = document.getElementById('modalFavBtn');
  favBtn.classList.toggle('active', favorites.has(p.id));
  favBtn.querySelector('i').className = favorites.has(p.id) ? 'fas fa-heart' : 'far fa-heart';
  favBtn.onclick = () => {
    const on = favorites.has(p.id);
    on ? favorites.delete(p.id) : favorites.add(p.id);
    saveFavorites();
    favBtn.classList.toggle('active', !on);
    favBtn.querySelector('i').className = !on ? 'fas fa-heart' : 'far fa-heart';
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
function bindEscape() {
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePropModal(); });
}

// ── CALCULADORA DE CRÉDITO UVA ────────────────────────────────────────────────
function calcularCredito() {
  const precioStr   = document.getElementById('calc_precio')?.value  || '0';
  const ingresoStr  = document.getElementById('calc_ingreso')?.value || '0';
  const plazoMeses  = parseInt(document.getElementById('calc_plazo')?.value || '360');

  const precioARS  = parseMonto(precioStr);
  const ingreso    = parseMonto(ingresoStr);

  if (!precioARS || !ingreso) {
    showCalcError('Completá precio e ingreso para calcular.');
    return;
  }

  // Tasa UVA estimada ~8% anual nominal (orientativa, varía por banco y momento)
  const tasaAnual    = 0.08;
  const tasaMensual  = tasaAnual / 12;

  // Factor de amortización
  const factor = (tasaMensual * Math.pow(1+tasaMensual, plazoMeses)) /
                 (Math.pow(1+tasaMensual, plazoMeses) - 1);

  // Banco presta hasta 75% del valor de la propiedad
  const montoPorValor  = precioARS * 0.75;
  // Cuota máxima = 25% del ingreso
  const cuotaMaxIngreso = ingreso * 0.25;
  const montoPorIngreso = cuotaMaxIngreso / factor;

  // Banco presta el menor de los dos
  const montoCredito  = Math.min(montoPorValor, montoPorIngreso);
  const cuota         = montoCredito * factor;
  const aportePropio  = precioARS - montoCredito;
  const porcentaje    = Math.round(cuota / ingreso * 100);
  const puedeAcceder  = aportePropio >= 0 && aportePropio <= precioARS && ingreso > 0;

  const waMsg = encodeURIComponent(
    `Hola! Usé la calculadora de crédito en su web. Quiero consultar sobre propiedades aptas para crédito hipotecario.\n` +
    `Precio aprox: ${fmtARS(precioARS)} · Ingreso familiar: ${fmtARS(ingreso)}`
  );

  document.getElementById('calcResult').innerHTML = puedeAcceder ? `
    <div class="calc-yes">
      <div class="calc-result-icon">✅</div>
      <h3>¡Sí podés acceder!</h3>
      <div class="calc-grid">
        <div class="calc-item">
          <span class="calc-label">El banco te prestaría</span>
          <span class="calc-value">${fmtARS(montoCredito)}</span>
        </div>
        <div class="calc-item">
          <span class="calc-label">Cuota estimada</span>
          <span class="calc-value">${fmtARS(cuota)}<small>/mes</small></span>
        </div>
        <div class="calc-item">
          <span class="calc-label">% de tu ingreso</span>
          <span class="calc-value ${porcentaje>25?'warn':''}">${porcentaje}%</span>
        </div>
        <div class="calc-item">
          <span class="calc-label">Tu aporte propio</span>
          <span class="calc-value">${fmtARS(aportePropio)}</span>
        </div>
      </div>
      <a href="https://wa.me/${cfg.whatsapp}?text=${waMsg}" class="calc-wa-btn" target="_blank">
        <i class="fab fa-whatsapp me-2"></i>Hablar con un asesor hipotecario
      </a>
      <p class="calc-disclaimer">⚠️ Valores orientativos basados en tasa UVA ~8% anual. Los bancos evalúan cada caso en particular.</p>
    </div>
  ` : `
    <div class="calc-no">
      <div class="calc-result-icon">💡</div>
      <h3>Necesitás revisar las condiciones</h3>
      <p>Con los datos ingresados, el crédito no alcanza para cubrir la propiedad. Podés:</p>
      <ul>
        <li>Buscar propiedades de menor valor</li>
        <li>Sumar ingresos familiares</li>
        <li>Ampliar el plazo del crédito</li>
      </ul>
      <a href="https://wa.me/${cfg.whatsapp}?text=${waMsg}" class="calc-wa-btn" target="_blank">
        <i class="fab fa-whatsapp me-2"></i>Consultá con un asesor
      </a>
    </div>
  `;
}

function parseMonto(str) {
  return parseFloat(str.replace(/[^\d,.]/g,'').replace(',','.')) || 0;
}
function fmtARS(n) {
  return `$ ${Math.round(n).toLocaleString('es-AR')}`;
}
function showCalcError(msg) {
  const el = document.getElementById('calcResult');
  if (el) el.innerHTML = `<p style="color:#ef4444;text-align:center;padding:20px;">${msg}</p>`;
}

// ── ALERTAS DE PROPIEDADES ────────────────────────────────────────────────────
function enviarAlerta(e) {
  e.preventDefault();
  const zona  = document.getElementById('alerta_zona')?.value   || '';
  const tipo  = document.getElementById('alerta_tipo')?.value   || '';
  const precio= document.getElementById('alerta_precio')?.value || '';
  const wa    = document.getElementById('alerta_wa')?.value     || '';
  const texto = encodeURIComponent(
    `Hola! Quiero recibir alertas de propiedades:\n*Zona:* ${zona}\n*Tipo:* ${tipo}\n*Precio máx.:* ${precio}\n*Mi WhatsApp:* ${wa}`
  );
  window.open(`https://wa.me/${cfg.whatsapp}?text=${texto}`, '_blank');
}

// ── FORMULARIOS WHATSAPP ─────────────────────────────────────────────────────
function enviarPublicar(e) {
  e.preventDefault();
  const nombre    = document.getElementById('pub_nombre')?.value    || '';
  const telefono  = document.getElementById('pub_telefono')?.value  || '';
  const tipo      = document.getElementById('pub_tipo')?.value      || '';
  const operacion = document.getElementById('pub_operacion')?.value || '';
  const ubicacion = document.getElementById('pub_ubicacion')?.value || '';
  const mensaje   = document.getElementById('pub_mensaje')?.value   || '';
  const texto = encodeURIComponent(
    `¡Hola! Quiero publicar mi propiedad con ${cfg.nombre}.\n\n` +
    `*Nombre:* ${nombre}\n*WhatsApp:* ${telefono}\n*Tipo:* ${tipo}\n` +
    `*Operación:* ${operacion}\n*Ubicación:* ${ubicacion}\n*Detalles:* ${mensaje||'—'}`
  );
  window.open(`https://wa.me/${cfg.whatsapp}?text=${texto}`, '_blank');
}

function enviarTasacion(e) {
  e.preventDefault();
  const nombre   = document.getElementById('tas_nombre')?.value    || '';
  const telefono = document.getElementById('tas_telefono')?.value  || '';
  const direccion= document.getElementById('tas_direccion')?.value || '';
  const tipo     = document.getElementById('tas_tipo')?.value      || '';
  const texto = encodeURIComponent(
    `¡Hola! Quiero una tasación gratuita.\n\n` +
    `*Nombre:* ${nombre}\n*WhatsApp:* ${telefono}\n` +
    `*Dirección/Barrio:* ${direccion}\n*Tipo:* ${tipo}`
  );
  window.open(`https://wa.me/${cfg.whatsapp}?text=${texto}`, '_blank');
}

// ── CHATBOT ───────────────────────────────────────────────────────────────────
function toggleChatbot() {
  const w = document.getElementById('chatbotWindow');
  w.classList.toggle('active');
  if (w.classList.contains('active')) showChatMenu();
}

function showChatMenu() {
  document.getElementById('chatbotBody').innerHTML = `
    <div class="chatbot-message">
      ¡Hola! 👋 Soy el asistente de <strong>${cfg.nombre||'Grupo Inversa'}</strong>. ¿En qué te puedo ayudar?
    </div>
    <div class="chatbot-options">
      <button class="chatbot-option" onclick="showChatOpt('buscar')"><i class="fas fa-search"></i> Buscar propiedad</button>
      <button class="chatbot-option" onclick="showChatOpt('visita')"><i class="fas fa-calendar-check"></i> Agendar una visita</button>
      <button class="chatbot-option" onclick="showChatOpt('publicar')"><i class="fas fa-bullhorn"></i> Publicar mi propiedad</button>
      <button class="chatbot-option" onclick="showChatOpt('tasacion')"><i class="fas fa-chart-line"></i> Tasar mi propiedad</button>
      <button class="chatbot-option" onclick="showChatOpt('credito')"><i class="fas fa-university"></i> Crédito hipotecario</button>
      <button class="chatbot-option" onclick="showChatOpt('otra')"><i class="fas fa-question-circle"></i> Otra consulta</button>
    </div>`;
}

function showChatOpt(opt) {
  const data = {
    buscar:   { msg: `Usá el buscador en la parte de arriba. Podés buscar por zona (Capital, Rivadavia, Caucete...) y tipo de propiedad. Si no encontrás lo que buscás, escribinos directamente.`, wa: 'Hola! Estoy buscando una propiedad y necesito ayuda personalizada.' },
    visita:   { msg: `Excelente decisión. Para coordinar una visita necesitamos saber qué propiedad te interesa. Un asesor te responderá a la brevedad para acordar día y horario.`, wa: 'Hola! Quiero agendar una visita a una propiedad.' },
    publicar: { msg: `Publicamos tu propiedad de forma rápida y profesional. Fotos, descripción, publicación en portales y redes. Sin costos iniciales. Escribinos con los datos básicos.`, wa: 'Hola! Quiero publicar mi propiedad con ustedes.' },
    tasacion: { msg: `Te enviamos una tasación orientativa en menos de 24 horas, completamente gratis. Sin visita previa ni compromiso. Basada en operaciones reales de tu zona.`, wa: 'Hola! Quiero solicitar una tasación gratuita.' },
    credito:  { msg: `Trabajamos con propiedades aptas para crédito hipotecario UVA. También podés usar la calculadora de crédito en la web para ver si podés acceder. Un asesor te orienta sin cargo.`, wa: 'Hola! Tengo consultas sobre crédito hipotecario.' },
    otra:     { msg: `Sin problema. Contanos tu consulta y un asesor de ${cfg.nombre||'nuestra agencia'} te responderá personalmente.`, wa: 'Hola! Tengo una consulta.' }
  };
  const d = data[opt] || data.otra;
  document.getElementById('chatbotBody').innerHTML = `
    <button class="chatbot-back" onclick="showChatMenu()"><i class="fas fa-arrow-left me-1"></i> Volver</button>
    <div class="chatbot-response">${d.msg}</div>
    <a href="https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(d.wa)}" class="chatbot-wa-btn" target="_blank">
      <i class="fab fa-whatsapp"></i> Chatear por WhatsApp
    </a>`;
}

// ── CONTADORES ANIMADOS ───────────────────────────────────────────────────────
function animateCounters() {
  const propCount = cfg.propiedades_activas ?? allProps.length;
  animCount('counter_props',   propCount);
  animCount('counter_años',    cfg.años_experiencia    || 0);
  animCount('counter_ops',     cfg.operaciones_cerradas|| 0);
}

function animCount(id, target) {
  const el = document.getElementById(id);
  if (!el || !target) return;
  let cur = 0;
  const step  = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString('es-AR');
    if (cur >= target) clearInterval(timer);
  }, 25);
}

// ── NAVBAR SCROLL ─────────────────────────────────────────────────────────────
function bindNavScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('mainNav')?.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── FILTRO RÁPIDO POR CATEGORÍA ───────────────────────────────────────────────
function filtrarCategoria(tipo) {
  const results = allProps.filter(p => {
    if (tipo === 'casas')        return p.tipo === 'casa' && p.operacion !== 'pozo';
    if (tipo === 'departamentos') return p.tipo === 'departamento' && p.operacion !== 'pozo';
    if (tipo === 'galpones')     return ['galpon','deposito','local'].includes(p.tipo);
    if (tipo === 'terrenos')     return p.tipo === 'terreno';
    if (tipo === 'pozo')         return p.operacion === 'pozo';
    return true;
  });

  const labels = { casas:'Casas',departamentos:'Departamentos',galpones:'Galpones y Locales',terrenos:'Terrenos',pozo:'Proyectos en Pozo' };
  const grid    = document.getElementById('propiedadesGrid');
  const title   = document.getElementById('propiedadesTitle');
  const subtitle= document.getElementById('propiedadesSubtitle');

  if (title)    title.textContent   = `${results.length} ${labels[tipo]||tipo}`;
  if (subtitle) subtitle.innerHTML  = `<a href="#" onclick="resetSearch();return false;" style="color:var(--primary);">Ver todas las propiedades</a>`;
  if (grid)     grid.innerHTML      = results.map(buildCard).join('');

  setTimeout(() => document.getElementById('propiedades')?.scrollIntoView({ behavior:'smooth', block:'start' }), 80);
}
