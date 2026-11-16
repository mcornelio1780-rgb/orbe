# orbe-web · cómo subirlo

Este zip ya funciona sin Polar y sin Firebase. Súbelo tal cual y la web queda en línea hoy.

## Qué funciona desde el primer día (sin configurar nada)

- Landing y radar en español, inglés, portugués y francés.
- Radar con 6 casos gratis; los códigos ORBE-FOUNDER y ORBE-LATAM desbloquean los 25.
- Formulario de contacto, preguntas del FAQ y newsletter: llegan a **manyosa@limly.io** (vía FormSubmit, gratis).
  La primera vez que alguien envíe un formulario, FormSubmit te manda un correo para **activar** el reenvío: haz clic en "Activate Form" una sola vez.
- Botones de compra: mientras no haya enlaces de Polar, llevan al formulario de contacto con el producto ya elegido. No aparece ningún aviso de "modo de prueba".
- Páginas legales: Términos, Privacidad, Uso de IA, Reembolsos y Cookies (`/legal`).
- El botón "Iniciar sesión" aparece solo cuando Firebase esté configurado.

## Paso 1 · GitHub (5 min)

1. github.com → **New repository** → nombre `orbe-web` → **Private** → Create repository.
2. En la página vacía: **uploading an existing file**.
3. Descomprime el zip en tu Mac y arrastra **todo el contenido** de la carpeta (no la carpeta en sí): `index.html`, `radar.html`, `legal.html`, `admin.html`, `orbe-config.js`, `orbe-auth.js`, `package.json`, `vercel.json`, `LEEME.md` y la carpeta `api`.
4. **Commit changes**.

## Paso 2 · Vercel (5 min)

1. vercel.com → **Add New → Project** → importa `orbe-web`.
2. Framework Preset: **Other**. No toques nada más → **Deploy**.
3. Copia tu dirección, por ejemplo `https://orbe-web.vercel.app`. Esa URL es la que pones en Polar.

## Paso 3 · Polar (ya con la web publicada)

Products → **Checkout Links → New**:
- Producto `orbe brief` · Allow discount codes: Sí · **Success URL:** `https://TU-URL.vercel.app/radar?paid=1`
- Producto `orbe sprint` · Success URL igual.

Envíame los dos enlaces `https://buy.polar.sh/...` y te devuelvo `orbe-config.js` actualizado.

## Actualizar la web después

Solo cambia `orbe-config.js`. En GitHub: abre el archivo → lápiz (Edit) → pega el nuevo contenido → Commit. Vercel republica solo en un minuto.
