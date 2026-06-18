# Template de Inmobiliaria — Guía de uso

## Estructura de archivos

```
inmobiliaria-[nombre]/
├── index.html          ← Página principal (no editar)
├── config.js           ← ✅ ÚNICO archivo que cambia por agencia
├── 404.html            ← Página de error (no editar)
├── data/
│   └── propiedades.js  ← ✅ Propiedades de la agencia (editar)
└── js/
    └── app.js          ← Motor de búsqueda (no editar)
```

---

## Setup de una nueva agencia — 3 pasos

### Paso 1 — Editar `config.js`
Completar con los datos reales de la agencia:
- Nombre, slogan, descripción
- WhatsApp (formato: `549` + código área sin 0 + número sin 15)
- Email, teléfono, dirección, horario
- Años de experiencia y operaciones cerradas
- Zonas que cubre
- Redes sociales (dejar `""` si no existe)

### Paso 2 — Cargar propiedades en `data/propiedades.js`
Reemplazar las propiedades de ejemplo con las reales de la agencia.
Ver la sección "Cómo agregar propiedades" más abajo.

### Paso 3 — Deploy
Subir a GitHub + conectar Cloudflare Pages (ver guía completa abajo).

---

## Cómo agregar una propiedad

1. Abrir `data/propiedades.js`
2. Copiar el último bloque completo (desde `{` hasta `},`)
3. Pegar antes del comentario `AGREGAR NUEVAS PROPIEDADES AQUÍ`
4. Cambiar el `id` al número siguiente
5. Completar todos los campos

**Valores válidos:**
- `operacion`: `"alquiler"` | `"venta"` | `"pozo"` | `"comercial_alquiler"` | `"comercial_venta"`
- `tipo`: `"casa"` | `"departamento"` | `"ph"` | `"terreno"` | `"galpon"` | `"local"` | `"deposito"`
- `moneda`: `"ARS"` | `"USD"`
- `destacada`: `true` = aparece en el inicio sin búsqueda (max 6)
- `vistas_hoy`: número que aparece en la card como "Vista X veces hoy" (urgencia)
- `dias_publicada`: número de días publicada (aparece en la card)

---

## Probar localmente

```bash
cd inmobiliaria-[nombre]
python -m http.server 8000
# Luego abrir: http://localhost:8000
```

> No abrir `index.html` con doble clic — los archivos JS no cargan por restricciones CORS.

---

## Deploy en GitHub + Cloudflare Pages

```bash
# 1. Inicializar git
git init
git add .
git commit -m "Lanzamiento [Nombre Agencia]"

# 2. Crear repo en github.com y luego:
git remote add origin https://github.com/TU_USUARIO/inmobiliaria-[nombre].git
git push -u origin main
```

En Cloudflare Pages:
1. Workers & Pages → Create → Connect to Git
2. Seleccionar el repositorio
3. Framework: None · Build command: vacío · Output directory: vacío
4. Save and Deploy

URL resultante: `inmobiliaria-[nombre].pages.dev`
Después conectar dominio propio si la agencia tiene uno.

---

## Actualizar propiedades (flujo diario)

```bash
git add .
git commit -m "Nuevas propiedades - [fecha]"
git push
```
Cloudflare publica en ~30 segundos automáticamente.

---

## Personalizar colores (opcional)

En `config.js`, cambiar:
```javascript
color_primario: "#003366",   // Color principal (azul navy por defecto)
color_acento:   "#c9a961",   // Color dorado por defecto
```

Dejar en `null` para usar el diseño default.

---

## Qué hace cada sección de la página

| Sección | Descripción |
|---|---|
| Hero + Buscador | Titular impactante + búsqueda por pestaña y zona |
| Stats strip | Contadores animados de propiedades, años, operaciones |
| Categorías | 5 íconos que filtran propiedades al hacer clic |
| Propiedades | Grid dinámico renderizado desde `propiedades.js` |
| ¿Por qué elegirnos? | 6 diferenciadores clave |
| Cómo funciona | 3 pasos simples |
| Calculadora UVA | **El gancho más poderoso** — calcula si el usuario puede acceder a crédito |
| Alertas | Formulario → WhatsApp para recibir notificaciones de propiedades |
| Publicar | Formulario de propietarios → WhatsApp |
| Hipotecario | Banner de crédito hipotecario |
| Tasación | Formulario gratuito → WhatsApp |
| Testimonios | 3 reseñas de clientes |
| Chatbot | Asistente virtual con 6 opciones |
| Modal | Detalle completo de cada propiedad al hacer clic |

---

## FAQ

**¿La calculadora de crédito es exacta?**
No — es orientativa. Usa una tasa UVA del 8% anual como referencia. Siempre muestra el disclaimer. Está pensada para generar leads, no para reemplazar a un asesor bancario.

**¿Cómo cambio los testimonios?**
En `index.html`, buscar la sección `<!-- ── OPINIONES ──`. Editar los textos, nombres y localidades directamente en el HTML.

**¿Puedo agregar más categorías?**
Sí. En `index.html` agregar una nueva `.cat-card` con el `onclick` correspondiente, y en `app.js` agregar el caso en la función `filtrarCategoria()`.

**¿El buscador necesita backend?**
No. Todo corre en el navegador. Los datos están en `propiedades.js` y el filtrado es JavaScript puro.
