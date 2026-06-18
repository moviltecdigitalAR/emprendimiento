# Grupo Inversa — Guía de implementación

## Estructura de archivos

```
grupo-inversa/
├── index.html              ← Página principal
├── data/
│   ├── propiedades.js      ← BASE DE DATOS de propiedades (editá este archivo)
│   └── agencias.js         ← BASE DE DATOS de agencias (editá este archivo)
├── js/
│   └── search.js           ← Motor de búsqueda (no editar)
└── README.md               ← Este archivo
```

---

## ¿Cómo agregar una propiedad?

1. Abrí `data/propiedades.js`
2. Copiá el último bloque completo (desde `{` hasta `},`)
3. Pegalo justo antes del comentario `AGREGAR NUEVAS PROPIEDADES AQUÍ`
4. Cambiá el `id` al número siguiente
5. Completá todos los campos
6. Guardá el archivo
7. Hacé push a GitHub → Cloudflare lo publica en ~30 segundos

**Valores válidos:**
- `operacion`: `"venta"` | `"alquiler"` | `"pozo"` | `"comercial_venta"` | `"comercial_alquiler"` | `"minero"`
- `tipo`: `"casa"` | `"departamento"` | `"terreno"` | `"galpon"` | `"deposito"` | `"local"`
- `moneda`: `"ARS"` | `"USD"`
- `destacada`: `true` = aparece en el inicio sin búsqueda (máximo 6 destacadas activas)

---

## ¿Cómo agregar una agencia?

1. Abrí `data/agencias.js`
2. Copiá el último bloque
3. Cambiá el `id` al número siguiente
4. Completá nombre, siglas, zona, descripción, años y whatsapp
5. Guardá → push → listo

---

## Probar en tu computadora (antes de subir)

Necesitás tener Python instalado. Abrí una terminal en la carpeta del proyecto y ejecutá:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego abrí el navegador en: `http://localhost:8000`

> **Importante:** No abras `index.html` directamente con doble clic. Los archivos JS no cargan por restricciones de seguridad del navegador. Siempre usá el servidor local.

---

## Subir a GitHub (primera vez)

### Paso 1 — Crear cuenta en GitHub
Ve a [github.com](https://github.com) → Sign up (gratis)

### Paso 2 — Instalar Git
Descargalo de [git-scm.com](https://git-scm.com) e instalalo

### Paso 3 — Crear el repositorio
1. En GitHub, clic en el `+` arriba a la derecha → "New repository"
2. Nombre: `grupo-inversa` (o el que quieras)
3. Marcar como **Public**
4. Clic en "Create repository"

### Paso 4 — Subir los archivos
Abrí una terminal en la carpeta del proyecto y ejecutá:

```bash
git init
git add .
git commit -m "Lanzamiento inicial Grupo Inversa"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/grupo-inversa.git
git push -u origin main
```

Reemplazá `TU_USUARIO` con tu nombre de usuario de GitHub.

---

## Publicar en Cloudflare Pages (gratis)

### Paso 1 — Crear cuenta en Cloudflare
Ve a [cloudflare.com](https://cloudflare.com) → Sign up (gratis)

### Paso 2 — Crear el proyecto
1. En el panel de Cloudflare → menú izquierdo → **Workers & Pages**
2. Clic en **Pages** → **Create a project**
3. Clic en **Connect to Git**
4. Autorizá Cloudflare en GitHub
5. Seleccioná el repositorio `grupo-inversa`
6. Clic en **Begin setup**

### Paso 3 — Configurar el deploy
En la pantalla de configuración:
- **Project name**: `grupo-inversa` (o el que prefieras)
- **Production branch**: `main`
- **Framework preset**: `None`
- **Build command**: *(dejar vacío)*
- **Build output directory**: *(dejar vacío)*

Clic en **Save and Deploy**

### Paso 4 — ¡Listo!
En ~1 minuto tenés el sitio en:
`https://grupo-inversa.pages.dev`

---

## Conectar tu dominio propio (ej: grupoinversa.com.ar)

### Si ya tenés el dominio en Cloudflare:
1. En Pages → tu proyecto → **Custom domains**
2. Clic en **Set up a custom domain**
3. Escribí tu dominio: `grupoinversa.com.ar`
4. Seguí las instrucciones para el DNS

### Si el dominio está en otro registrador (NIC.ar, GoDaddy, etc.):
1. En tu registrador, cambiá los nameservers a los de Cloudflare
2. Cloudflare te da los nameservers cuando creás una cuenta gratuita
3. Una vez transferido el DNS, seguí el paso de arriba

---

## Actualizar el sitio (flujo diario)

Cada vez que agregues o editás una propiedad:

```bash
git add .
git commit -m "Nuevas propiedades - [fecha]"
git push
```

Cloudflare detecta el push automáticamente y publica en ~30 segundos.

---

## Personalizar el número de WhatsApp

Buscá `5492645304372` en todos los archivos y reemplazalo con tu número.
El formato es: `549` + código de área sin el 0 + número sin el 15.
Ejemplo: San Juan 264 530-4372 → `5492645304372`

---

## FAQ

**¿Por qué no funciona si abro el index.html directamente?**
Por restricciones de seguridad del navegador (CORS). Siempre usá un servidor local (`python -m http.server`) o subilo a Cloudflare.

**¿Puedo usar un dominio `.com.ar`?**
Sí. Registralo en NIC.ar (gratis para personas físicas argentinas) y apuntá el DNS a Cloudflare.

**¿Cuánto cuesta todo esto?**
- GitHub: gratis
- Cloudflare Pages: gratis (hasta 500 deploys/mes, más que suficiente)
- Dominio: NIC.ar cobra alrededor de $500-800 ARS/año

**¿Cómo hago para que una propiedad no aparezca más?**
Cambiá `destacada: false` o eliminá el bloque completo del archivo. Luego push.

**¿Puedo tener más de 6 propiedades destacadas?**
El sistema muestra hasta 6 en el inicio. Podés cambiar ese número en `js/search.js`, línea que dice `.slice(0, 6)`, y poner el número que quieras.

---

## Soporte

Si algo no funciona, revisá:
1. Que los archivos estén en la estructura correcta (data/, js/)
2. Que no haya comas faltantes o sobrantes en los JSON
3. Que el servidor local esté corriendo cuando probás en local
