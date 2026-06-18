# 🏠 Grupo Inversa — Sitio Web Completo

**Plataforma inmobiliaria + marketplace gratuito para particulares**  
San Juan, Argentina · Desplegado en Cloudflare Pages

---

## 📁 Estructura del proyecto

```
grupo-inversa/
├── index.html                  # Sitio principal: inmobiliaria, propiedades, tasación
├── particulares.html           # Plataforma gratuita para particulares
├── functions/
│   └── api/
│       └── contact.js          # Backend: maneja todos los formularios
├── wrangler.toml               # Config Cloudflare Pages
├── .dev.vars.example           # Template de variables de entorno (local)
├── .gitignore
└── README.md
```

---

## ⚡ Deploy en 4 pasos

### Paso 1 — Subir a GitHub

Crear un repositorio en [github.com](https://github.com) y ejecutar:

```bash
git init
git add .
git commit -m "feat: Grupo Inversa sitio web completo"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/grupo-inversa.git
git push -u origin main
```

> Si ya tenés Git instalado y una cuenta en GitHub, esto tarda menos de 5 minutos.

---

### Paso 2 — Configurar el email (Resend)

1. Ir a **[resend.com](https://resend.com)** → Crear cuenta gratuita
2. En el dashboard → **API Keys** → **Create API Key** → copiar la clave (`re_xxxxxx`)
3. *(Recomendado para producción)* → **Domains** → agregar `grupoinversa.com.ar` → verificar con DNS

> **Plan gratuito de Resend:** 3.000 emails/mes, 100/día. Más que suficiente para empezar.

---

### Paso 3 — Conectar Cloudflare Pages

1. Ir a **[cloudflare.com](https://cloudflare.com)** → iniciar sesión (o crear cuenta gratis)
2. Menú izquierdo → **Workers & Pages** → **Pages** → **Create a project**
3. Seleccionar **"Connect to Git"** → autorizar GitHub → elegir el repo `grupo-inversa`
4. Configuración de build:

   | Campo | Valor |
   |---|---|
   | Framework preset | `None` |
   | Build command | *(dejar vacío)* |
   | Build output directory | `/` |
   | Root directory | *(dejar vacío)* |

5. Clic en **"Save and Deploy"** → esperar ~2 minutos

> 🎉 Tu sitio quedará disponible en `https://grupo-inversa.pages.dev`

---

### Paso 4 — Variables de entorno

En Cloudflare → tu proyecto → **Settings** → **Environment variables** → **Add variable**:

| Variable | Valor de ejemplo | Descripción |
|---|---|---|
| `RESEND_API_KEY` | `re_abc123...` | API Key de Resend (obligatorio para emails) |
| `NOTIFICATION_EMAIL` | `info@grupoinversa.com.ar` | Donde recibís los leads |
| `FROM_EMAIL` | `notificaciones@grupoinversa.com.ar` | Remitente (requiere dominio verificado en Resend) |

> ⚠️ Después de agregar las variables, hacer **Redeploy** para que tomen efecto:  
> Deployments → último deployment → ⋮ → Retry deployment

---

## 🌐 Dominio personalizado

Para usar `grupoinversa.com.ar` en lugar de `*.pages.dev`:

1. Cloudflare Pages → tu proyecto → **Custom domains** → **Set up a custom domain**
2. Ingresar `grupoinversa.com.ar`
3. Si el dominio ya está en Cloudflare DNS → se configura automáticamente ✅  
   Si está en otro registrador → seguir las instrucciones de DNS que muestra CF

---

## 💻 Desarrollo local (opcional)

Para probar el backend localmente antes de subir:

```bash
# 1. Instalar Wrangler CLI
npm install -g wrangler

# 2. Autenticarse con Cloudflare
wrangler login

# 3. Crear el archivo de variables locales
cp .dev.vars.example .dev.vars
# ✏️  Editar .dev.vars con tus valores reales

# 4. Iniciar el servidor local
wrangler pages dev . --port 8788
```

Acceder en: **http://localhost:8788**

---

## 🔧 Personalización

### Número de WhatsApp

Buscar en `index.html` y `particulares.html`:
```
5492645304372
```
Reemplazar por tu número en formato: `549` + código de área sin 0 + número sin 15  
Ejemplo: (264) 5-304372 → `5492645304372`

### Colores de marca

En el bloque `<style>` de cada página, modificar las variables CSS al principio:

```css
:root {
  --brand-blue:  #003366;   /* Color principal */
  --brand-green: #10b981;   /* Color de acento / CTA */
  --mine-gold:   #d97706;   /* Acento sección minera */
  --free-green:  #059669;   /* Color "Gratis" en particulares */
}
```

### Propiedades y listings

Los avisos de muestra están hardcodeados en el HTML.  
Para una base de datos dinámica con panel de administración, contactar al desarrollador.

### Nombre de la inmobiliaria

Buscar y reemplazar `Grupo Inversa` (mayúscula) y `grupoinversa.com.ar` en ambos HTMLs.

---

## 📋 Formularios disponibles

Todos los formularios envían a `POST /api/contact` con el campo `formTipo`:

| Formulario | `formTipo` | Descripción |
|---|---|---|
| Contacto general | `contacto` | Consulta libre |
| Tasación | `tasacion` | Solicita tasación gratis |
| Publicar agencia | `publicar` | Agencia carga nueva propiedad |
| Solicitar visita | `visita` | Agendar visita a propiedad |
| Aviso particular | `particular` | Particular publica aviso gratis |
| Alerta de propiedades | `alerta` | Suscripción a novedades |

---

## 🐛 Troubleshooting

### Los formularios no envían
1. Verificar que `RESEND_API_KEY` esté cargada en las env vars de CF Pages
2. Hacer Redeploy después de agregar las variables
3. Ver los logs en tiempo real: CF Dashboard → Workers & Pages → tu proyecto → Functions → Logs

### El email llega pero desde "onboarding@resend.dev"
Es el sender de test de Resend. Para usar tu propio dominio, verificarlo en:  
Resend Dashboard → Domains → Add domain

### El sitio muestra "404 Not Found"
El Build output directory debe ser `/` (barra simple), no vacío ni `.`

### Las funciones no corren en local
```bash
# Verificar que .dev.vars existe y tiene los valores correctos
cat .dev.vars

# Verificar que wrangler está actualizado
npm install -g wrangler@latest
```

---

## 📊 Logs y monitoreo

- **Logs de funciones**: CF Dashboard → Workers & Pages → grupo-inversa → Functions → View real-time logs  
- **Analytics del sitio**: CF Dashboard → grupo-inversa → Analytics  
- **Errores de deploy**: CF Dashboard → grupo-inversa → Deployments → ver el deployment → Build log

---

## 🔄 Actualizaciones futuras

Para actualizar el sitio:

```bash
git add .
git commit -m "fix: descripción del cambio"
git push
```

Cloudflare Pages detecta el push y hace un nuevo deploy automáticamente en ~1 minuto.

---

## 📞 Recursos útiles

| Recurso | URL |
|---|---|
| Cloudflare Pages docs | https://developers.cloudflare.com/pages/ |
| Cloudflare Pages Functions | https://developers.cloudflare.com/pages/functions/ |
| Resend docs | https://resend.com/docs |
| Wrangler CLI | https://developers.cloudflare.com/workers/wrangler/ |

---

*Desarrollado para Grupo Inversa · San Juan, Argentina · 2025*
