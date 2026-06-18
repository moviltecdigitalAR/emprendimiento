// ═══════════════════════════════════════════════════════════════════════════
//  GRUPO INVERSA — Base de Agencias
//
//  Para AGREGAR una agencia:
//    1. Copiar un bloque completo
//    2. Cambiar el "id" al número siguiente
//    3. Completar todos los campos
//    4. Guardar → git add . → git commit -m "Nueva agencia" → git push
// ═══════════════════════════════════════════════════════════════════════════

const AGENCIAS_DATA = [
  {
    id: 1,
    nombre: "Inmobiliaria del Sol",
    siglas: "IS",
    zona: "Capital · Rivadavia · Rawson",
    descripcion: "Especialistas en propiedades residenciales desde hace más de 18 años. Asesoramiento personalizado en compra, venta y alquiler en toda la provincia.",
    años: 18,
    whatsapp: "5492645304372",
    web: "",
    instagram: ""
  },
  {
    id: 2,
    nombre: "Grupo Andino",
    siglas: "GA",
    zona: "Industrial · Minero · Caucete",
    descripcion: "Líderes en propiedades comerciales e industriales. Especialistas en soluciones inmobiliarias para el sector minero, logístico y corporativo de San Juan.",
    años: 12,
    whatsapp: "5492645304373",
    web: "",
    instagram: ""
  },
  {
    id: 3,
    nombre: "San Juan Propiedades",
    siglas: "SJ",
    zona: "Capital · Rivadavia · Premium",
    descripcion: "Propiedades premium y proyectos de inversión. Especialistas en créditos hipotecarios UVA y desarrollos en pozo de alta rentabilidad en San Juan.",
    años: 22,
    whatsapp: "5492645304374",
    web: "",
    instagram: ""
  }

  // ──────────────────────────────────────────────────────────────────────
  //  AGREGAR NUEVAS AGENCIAS AQUÍ
  // ──────────────────────────────────────────────────────────────────────
];
