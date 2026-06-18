// ═══════════════════════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE LA AGENCIA
//  ─────────────────────────────────────────────────────────────────────────
//  Este es el ÚNICO archivo que cambia por agencia.
//  Completar con los datos reales antes del deploy.
// ═══════════════════════════════════════════════════════════════════════════

const AGENCIA_CONFIG = {

  // Identidad
  nombre:          "Inmobiliaria del Sol",
  slogan:          "Especialistas en propiedades en San Juan desde 2006",
  descripcion:     "Más de 18 años ayudando a familias y empresas a encontrar su lugar en San Juan. Alquileres, ventas, galpones, terrenos y proyectos en pozo.",

  // Contacto principal (WhatsApp que recibe todos los formularios)
  whatsapp:        "5492645304372",   // formato: 549 + código área sin 0 + número sin 15
  email:           "contacto@inmobiliariadelsol.com.ar",
  telefono:        "+54 9 264 530-4372",
  direccion:       "Av. Córdoba 1234, Capital, San Juan",
  horario:         "Lunes a Viernes 9–18hs · Sábados 9–13hs",

  // Credenciales (aparecen en el hero y el footer)
  años_experiencia:      18,
  operaciones_cerradas:  320,
  propiedades_activas:   null, // null = se cuenta automáticamente desde propiedades.js

  // Zonas que cubre la agencia (aparecen en footer y filtros)
  zonas: ["Capital", "Rivadavia", "Rawson", "Caucete", "Chimbas", "Santa Lucía"],

  // SEO
  meta_title:       "Inmobiliaria del Sol | Alquileres y Ventas en San Juan",
  meta_description: "Especialistas en alquileres, ventas, galpones, terrenos y proyectos en pozo en San Juan. Tasación gratuita en 24hs.",
  ciudad:           "San Juan",

  // Redes sociales (dejar vacío "" si no existe)
  instagram:  "https://instagram.com/inmobiliariadelsol",
  facebook:   "",
  google_maps: "",

  // Colores (dejar null para usar el diseño default)
  // Si la agencia tiene colores propios, ponerlos aquí en formato HEX
  color_primario: null,   // ej: "#003366"
  color_acento:   null,   // ej: "#c9a961"

};
