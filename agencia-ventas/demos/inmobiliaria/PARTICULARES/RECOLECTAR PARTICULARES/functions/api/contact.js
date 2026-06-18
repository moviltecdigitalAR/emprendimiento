/**
 * Grupo Inversa — API Contact Handler
 * Cloudflare Pages Function · POST /api/contact
 *
 * Handles all form submissions from:
 *   - index.html: contact, tasacion, publicar, visita, alerta
 *   - particulares.html: particular (private listing submission)
 *
 * Required env vars (set in CF Pages Dashboard → Settings → Env Variables):
 *   RESEND_API_KEY       → API key from resend.com (free tier: 3,000 emails/month)
 *   NOTIFICATION_EMAIL   → Where to send lead notifications (e.g. info@grupoinversa.com.ar)
 *   FROM_EMAIL           → Sender address (must be verified domain in Resend)
 */

/* ─────────────────────────────────────────
   Entry point
───────────────────────────────────────── */
export async function onRequest({ request, env }) {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }

  // Only accept POST
  if (request.method !== 'POST') {
    return json({ success: false, error: 'Método no permitido' }, 405);
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'JSON inválido' }, 400);
  }

  // Basic validation
  const { nombre, telefono, formTipo } = body;
  if (!nombre || !telefono || !formTipo) {
    return json({ success: false, error: 'Campos requeridos: nombre, telefono, formTipo' }, 400);
  }

  // Sanitize inputs
  const data = sanitize(body);

  // Send email notification (non-blocking on failure)
  let emailSent = false;
  if (env.RESEND_API_KEY) {
    try {
      await sendEmail(data, env);
      emailSent = true;
    } catch (err) {
      console.error('[GrupoInversa] Email error:', err.message);
      // Don't fail the request if email fails
    }
  } else {
    console.warn('[GrupoInversa] RESEND_API_KEY not configured. Email not sent.');
  }

  // Log to Cloudflare logs (visible in dashboard)
  console.log(
    `[GrupoInversa] ${formTipo.toUpperCase()} | ${data.nombre} | ${data.telefono} | emailSent:${emailSent} | ${new Date().toISOString()}`
  );

  return json({
    success: true,
    message: 'Consulta recibida correctamente',
    emailSent
  });
}

/* ─────────────────────────────────────────
   Email via Resend API
───────────────────────────────────────── */
async function sendEmail(data, env) {
  const {
    nombre, telefono, email, categoria, operacion, titulo,
    precio, moneda, zona, tipo, descripcion, mensaje,
    direccion, fotos, formTipo
  } = data;

  /* Subject by form type */
  const subjects = {
    tasacion:   '📊 Nueva tasación solicitada — Grupo Inversa',
    publicar:   '📣 Propiedad para publicar — Grupo Inversa',
    contacto:   '💬 Nuevo contacto web — Grupo Inversa',
    visita:     '📅 Solicitud de visita — Grupo Inversa',
    particular: '🆓 Nuevo aviso PARTICULARES — Grupo Inversa',
    alerta:     '🔔 Nueva suscripción de alertas — Grupo Inversa',
  };
  const subject = subjects[formTipo] || `📧 Nueva consulta (${formTipo}) — Grupo Inversa`;

  /* Header color by form type */
  const isParticular = formTipo === 'particular';
  const headerBg = isParticular ? '#059669' : '#003366';
  const accentBg = isParticular ? '#d1fae5' : '#eff6ff';
  const accentText = isParticular ? '#059669' : '#003366';

  /* Build table rows dynamically */
  const rows = [
    ['Nombre',           nombre],
    ['WhatsApp',         `<a href="tel:${telefono}" style="color:#003366;">${telefono}</a>`],
    email      && ['Email',            email],
    categoria  && ['Categoría',        categoria],
    operacion  && ['Operación',        operacion],
    titulo     && ['Título',           titulo],
    precio     && ['Precio',           `${precio} ${moneda || ''}`],
    zona       && ['Zona',             zona],
    tipo       && ['Tipo de propiedad',tipo],
    direccion  && ['Dirección',        direccion],
    (descripcion || mensaje) && ['Descripción', descripcion || mensaje],
    fotos      && ['Fotos adjuntas',   fotos],
    ['Formulario',       `<code style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:12px;">${formTipo}</code>`],
    ['Recibido',         new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })],
  ].filter(Boolean);

  const rowsHTML = rows.map(([label, val]) => `
    <tr>
      <td style="padding:10px 20px;border-bottom:1px solid #f3f4f6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;white-space:nowrap;vertical-align:top;width:140px;">${label}</td>
      <td style="padding:10px 20px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;vertical-align:top;">${val}</td>
    </tr>`
  ).join('');

  /* WhatsApp number cleaned */
  const waNumber = telefono.replace(/\D/g, '');
  const firstName = nombre.split(' ')[0];

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;">

    <!-- Header -->
    <div style="background:${headerBg};color:#fff;padding:28px 32px;border-radius:10px 10px 0 0;">
      <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;opacity:.65;margin-bottom:6px;">
        Grupo Inversa · San Juan, Argentina
      </div>
      <div style="font-size:20px;font-weight:800;line-height:1.2;">${subject}</div>
    </div>

    <!-- Data table -->
    <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;">
      <table style="width:100%;border-collapse:collapse;">${rowsHTML}</table>
    </div>

    <!-- CTA -->
    <div style="background:${accentBg};padding:24px 32px;border:1px solid #e5e7eb;border-top:none;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${accentText};margin-bottom:14px;">
        Responder ahora
      </div>
      ${waNumber ? `
      <a href="https://wa.me/${waNumber}"
         style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:13px 24px;border-radius:8px;font-weight:700;font-size:14px;margin-right:10px;">
        📱 WhatsApp a ${firstName}
      </a>` : ''}
      ${email ? `
      <a href="mailto:${email}"
         style="display:inline-block;background:${headerBg};color:#fff;text-decoration:none;padding:13px 24px;border-radius:8px;font-weight:700;font-size:14px;">
        ✉️ Responder email
      </a>` : ''}
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;padding:14px 32px;">
      <div style="font-size:11px;color:#9ca3af;">
        Consulta recibida desde <strong>grupoinversa.com.ar</strong>
        ${isParticular ? '· Sección Particulares' : '· Sitio Principal'}
      </div>
    </div>

  </div>
</body>
</html>`;

  const from = env.FROM_EMAIL
    ? `Grupo Inversa <${env.FROM_EMAIL}>`
    : 'Grupo Inversa <onboarding@resend.dev>'; // Resend test sender (for dev only)

  const to = env.NOTIFICATION_EMAIL || 'info@grupoinversa.com.ar';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend ${res.status}: ${errBody}`);
  }

  return res.json();
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

/** Sanitize string values to prevent XSS in email */
function sanitize(obj) {
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    clean[k] = typeof v === 'string'
      ? v.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()
      : v;
  }
  return clean;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
