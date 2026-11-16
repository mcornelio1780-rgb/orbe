# orbe · Guía de puesta en marcha

Orden recomendado: **GitHub + Vercel (sección 2) → Polar (sección 3) → Firebase (sección 1) → probar**. Primero publicas la web con el zip, que ya funciona sin Polar ni Firebase; así obtienes la URL que Polar pide como Success URL. Tiempo total: unas 2 horas. Costo: $0.

Los datos con 🟢 se pueden enviar por el chat para que los pegue en el código. Los marcados con 🔒 son secretos: van directo a Vercel y **nunca** se pegan en el chat ni en el código.

---

## 1. Firebase (cuentas de usuario y base de datos) · 30 min

1. Entra a **console.firebase.google.com** con tu cuenta de Google → **Agregar proyecto** → nombre `orbe` → desactiva Google Analytics → Crear. Es el plan Spark, gratis.
2. **Compilación → Authentication → Comenzar → Método de acceso:**
   - **Correo electrónico/contraseña** → Habilitar → Guardar. Firebase envía gratis el correo de activación y el de recuperar contraseña.
   - **Google** → Habilitar → elige tu correo de asistencia → Guardar.
3. **Authentication → Plantillas:** idioma de las plantillas → Español; nombre público del proyecto → `orbe`. El sitio cambia solo el idioma del correo según el idioma que elija el usuario (ES/EN/PT/FR).
4. **Firestore Database → Crear base de datos** → modo **producción** → ubicación `nam5 (Estados Unidos)` → Habilitar.
5. **Reglas de seguridad (dónde pegarlas):**
   1. En el menú izquierdo de Firebase: **Compilación → Firestore Database**.
   2. Arriba verás pestañas: *Datos · Reglas · Índices · Uso*. Haz clic en **Reglas**.
   3. Aparece un editor con un texto que empieza por `rules_version = '2';`. **Borra todo** ese texto.
   4. Abre el archivo `firestore.rules` (viene en el zip, carpeta `firebase/`) con TextEdit o el Bloc de notas, copia todo y pégalo en el editor.
   5. Busca `TU-CORREO-ADMIN@gmail.com` y cámbialo por el correo con el que entrarás al panel (por ejemplo `manyosa@limly.io`).
   6. Botón azul **Publicar**. Listo: nadie puede darse acceso pagado ni leer los mensajes de otros.
6. **⚙ Configuración del proyecto → General → Tus apps → icono web `</>`** → apodo `orbe-web` → Registrar. Copia el bloque `firebaseConfig`.
   🟢 **Envíame:** `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` y `appId`. Son públicos por diseño; la seguridad está en las reglas.
7. **⚙ Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada** → se descarga un `.json`.
   🔒 Ese archivo va completo a Vercel (paso 2.4). No lo envíes por chat.

## 2. GitHub + Vercel (publicar la web) · 20 min

1. **github.com → New repository** → `orbe-web` → Private → Create.
2. **Add file → Upload files** → arrastra **todo el contenido de la carpeta `web/`**: `index.html`, `radar.html`, `legal.html`, `admin.html`, `orbe-config.js`, `orbe-auth.js`, `package.json`, `vercel.json` y la carpeta `api/` → Commit.
3. **vercel.com → Add New → Project → Import** `orbe-web` → Framework Preset: **Other** → sin build command → **Deploy**. Tu dirección será algo como `https://orbe-web.vercel.app`.
4. **Vercel → Settings → Environment Variables** (Production y Preview):
   | Nombre | Valor |
   |---|---|
   | `FIREBASE_SERVICE_ACCOUNT` 🔒 | Todo el contenido del `.json` del paso 1.7 |
   | `POLAR_ORG_ID` | El Organization ID de Polar (paso 3.1) |
   | `POLAR_WEBHOOK_SECRET` 🔒 | El secreto del webhook (paso 3.6) |
   | `POLAR_API_BASE` | Solo mientras pruebas en sandbox: `https://sandbox-api.polar.sh`. Bórrala al pasar a producción |
   Después: **Deployments → ⋯ → Redeploy**.
5. **Firebase → Authentication → Configuración → Dominios autorizados → Agregar dominio** → `orbe-web.vercel.app` (y tu dominio propio, si lo compras luego). Sin esto, el login con Google falla.

> Nota: el plan gratuito de Vercel (Hobby) está pensado para uso personal y no comercial. Puedes empezar ahí. Cuando haya ventas constantes, conviene pasar a Pro ($20/mes) o mover el mismo repositorio a Cloudflare Pages, que es gratis y permite uso comercial.

## 3. Polar (productos y cobros) · 40 min

Haz todo primero en **sandbox.polar.sh** (pruebas con la tarjeta `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC). Cuando funcione, repítelo en **polar.sh**.

1. **Settings → General:** nombre `orbe`, slug `orbe`, correo de soporte, sitio web (tu URL de Vercel).
   🟢 **Envíame:** el **Organization ID**.
   En producción, completa también **Finance → Payout account** con los datos de la LLC.
2. **Products → New Product → orbe brief**
   - Name: `orbe brief`
   - Description: *25 orbital businesses and the launch price at which each one makes money. 40-page PDF in ES/EN/PT/FR, editable spreadsheet and full access to the orbe radar.*
   - Pricing: **One-time purchase** · Fixed price · **39 USD**
   - Media: sube `orbe-1x1-vertical-noche.png`
   - **Benefits → Create benefit:**
     1. **License Keys** → nombre `orbe access` → prefijo `ORBE` → sin vencimiento → **sin límite de activaciones** → Save. Es la clave única que desbloquea el radar.
     2. **Custom** → nombre `Cómo entrar` → nota privada:
        *Your access is ready. 1) Go to https://TU-DOMINIO/radar 2) Log in or sign up with this same email: access turns on automatically. 3) If you paid with a different email, paste your license key in "I have a code". / Tu acceso está listo: entra a https://TU-DOMINIO/radar con este mismo correo.*
     3. **File Downloads** → sube los PDF del brief y el Excel cuando estén listos.
   - Save.
3. **Products → New Product → orbe sprint**
   - Pricing: One-time · **149 USD**
   - Benefits: reutiliza **orbe access** (License Keys) + un **Custom** con *Book your 90-minute session here: [tu enlace de Cal.com]* + el File Downloads del brief.
4. **Products → Discounts:**
   - `LATAM` · Fixed amount · 20 USD · aplica solo a orbe brief · sin vencimiento.
   - `SUBS10` · Fixed amount · 10 USD · solo orbe brief · fecha de fin = 72 h después del correo del día 4.
5. **Products → Checkout Links → New:**
   - Producto `orbe brief` · **Allow discount codes: Sí** · **Success URL:** `https://TU-DOMINIO/radar?paid=1` → Create → copia el enlace `https://buy.polar.sh/polar_cl_...`
   - Producto `orbe sprint` · Success URL `https://TU-DOMINIO/radar?paid=1` → copia el enlace.
   🟢 **Envíame:** los dos enlaces de checkout.
6. **Settings → Webhooks → Add Endpoint:**
   - URL: `https://TU-DOMINIO/api/polar-webhook`
   - Format: **Raw**
   - Events: **order.paid** y **order.refunded**
   - Copia el **secret** → 🔒 Vercel `POLAR_WEBHOOK_SECRET` → Redeploy.
7. **Refund policy** (en Settings, si aparece): 7 días para el brief.

## 4. Otros enlaces (opcional, 10 min)

- **Cal.com:** evento público `orbe-briefing-30` (30 min) y evento oculto `orbe-sprint` (90 min). 🟢 Envíame el enlace del público.
- **Substack:** 🟢 la URL de tu publicación (ej. `https://michell.substack.com`). Si no la envías, los correos del newsletter se guardan en tu base de datos.
- **Redes:** 🟢 las URLs de LinkedIn, X, Instagram, TikTok y YouTube.
- **Legal:** 🟢 la dirección registrada de la LLC, el estado de registro y el correo de contacto.

## 5. Qué enviarme (copia y completa)

```
Dominio final: https://
Polar Organization ID:
Checkout brief: https://buy.polar.sh/
Checkout sprint: https://buy.polar.sh/
Códigos creados: LATAM, SUBS10
¿Sandbox o producción?:
Firebase apiKey:
Firebase authDomain:
Firebase projectId:
Firebase storageBucket:
Firebase messagingSenderId:
Firebase appId:
Correo administrador:
Cal.com (briefing 30 min):
Substack:
LinkedIn / X / Instagram / TikTok / YouTube:
Correo de contacto:
Dirección LLC y estado:
```

Con eso actualizo `orbe-config.js` (es el único archivo que cambia) y te lo devuelvo para subirlo a GitHub. Vercel republica solo en 1 minuto.

## 6. Prueba final antes de anunciar (15 min)

1. Abre la landing en el celular y en la computadora; cambia los 4 idiomas.
2. **Crear cuenta** con un correo nuevo → llega el correo de activación → actívala → inicia sesión.
3. **Continuar con Google** → entra sin contraseña.
4. Envía el **formulario de contacto** y una **pregunta** → aparecen en `https://TU-DOMINIO/admin`.
5. Compra el brief en **sandbox** con el mismo correo → Polar te devuelve a `/radar?paid=1` → los 25 casos se desbloquean solos.
6. Compra con **otro correo** → pega la clave de licencia del correo de Polar → se desbloquea.
7. Haz un **reembolso** en sandbox → el acceso se desactiva.
8. Pasa todo a producción: datos de Polar reales, borra `POLAR_API_BASE`, Redeploy.

## Dónde se guarda cada dato

| Dato | Dónde | Cómo verlo |
|---|---|---|
| Formulario de contacto y preguntas del FAQ | Firestore → colección `contacts` | `/admin` → Mensajes y preguntas → Exportar CSV |
| Suscriptores del newsletter | Substack (o `contacts` con tipo `newsletter` si no hay Substack) | Substack → Subscribers, o `/admin` |
| Cuentas de usuario | Firebase Authentication + Firestore `users` | Firebase console o `/admin` → Usuarios |
| Compras | Polar + Firestore `purchases` (vía webhook) | Polar → Orders, o `/admin` → Compras |
| Acceso completo | Firestore `users/{id}.pro` (solo lo escribe el servidor) | `/admin` → Usuarios |
| Ideas guardadas en el radar | Navegador de cada usuario | Privadas |

Límites gratuitos de Firebase Spark: 50.000 lecturas y 20.000 escrituras al día en Firestore, y autenticación por correo y Google sin costo. Para el lanzamiento sobra.
