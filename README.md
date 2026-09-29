# Amaré Studio — tienda online (v1)

Sitio e-commerce estático de **Amaré Studio**, álbumes de fotos personalizados.
*El regalo que se queda para siempre.*

HTML + CSS + JavaScript sin frameworks ni build: se sube tal cual a Hostinger
(o Netlify, Vercel, etc.).

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Home: hero con carrusel, bienvenida con contadores, las dos líneas de producto, ocasiones, colecciones con pestañas, las hermanas, banda de confianza, cómo funciona, flipbook, testimonios, newsletter y contacto |
| `tienda.html` | Catálogo con filtros por tipo, ocasión, precio y orden (los filtros quedan en la URL: `tienda.html?tipo=digital&ocasion=pareja`) |
| `producto.html?p=<slug>` | Ficha: galería, variantes, personalización de tapa, envío, acordeón y relacionados |
| `checkout.html` | Datos → envío (CABA / GBA / Resto del país) → pago (placeholder Mercado Pago) |
| `nosotras.html` · `preguntas-frecuentes.html` · `contacto.html` | Páginas institucionales |

La estructura sigue el template kit "Inner" (Elementor) en el que se basa el sitio actual:
cabecera oscura con migas en las páginas internas, tarjeta superpuesta sobre foto, grilla de
servicios, galería con pestañas, bloque "Get in touch" negro y footer centrado. La paleta es
blanco, negro y rosa (`--pink: #E48DBF`).

El header, el footer, el carrito lateral y el botón de WhatsApp se arman desde `js/ui/components.js`
y `js/ui/cart-drawer.js`, así que se editan en un solo lugar.

## Dónde editar cada cosa

- **WhatsApp, Instagram, mail, zonas y costos de envío, cupón del newsletter** → `js/config.js`
- **Productos, precios, variantes y textos** → `js/data/products.js`
- **Colores y tipografías** → variables al principio de `css/styles.css` (el rosa es `--pink`)
- **Contadores de la home y Nosotras** ("4+ años", "1.375+ álbumes") → atributo `data-count` en el HTML
- **Imágenes** → `assets/img/`. Hoy son ilustraciones placeholder (las genera
  `tools/generate_placeholders.py`). Para usar fotos reales, subilas a `assets/img/`
  y cambiá las rutas en `js/data/products.js` y en el HTML.

## Carrito

`js/cart.js` guarda el carrito en `localStorage` (sobrevive a recargas y se sincroniza
entre pestañas). Cada línea es producto + variantes + texto de tapa. Calcula subtotal,
descuento por cupón (`BIENVENIDA10`), envío por zona y envío gratis desde $120.000.

## Conectar un backend (Supabase / Shopify)

Todo el sitio lee los productos a través de `js/services/catalog.js`, que devuelve promesas.
Para conectar un backend real:

1. Reemplazá `fetchAll()` en `catalog.js` por la consulta a Supabase o a la Storefront API
   de Shopify, y adaptá la respuesta a la misma forma que `js/data/products.js`.
2. En `js/pages/checkout.js`, reemplazá `createPayment(order)` por una llamada a tu backend
   que cree la preferencia de Mercado Pago y redirija al `init_point`.
3. Newsletter (`js/ui/effects.js`) y contacto (`js/pages/contact.js`) tienen un `TODO backend`
   donde enviar los datos.

## Publicar en Hostinger

1. Subí todo el contenido de la carpeta a `public_html` (incluido `.htaccess`).
2. En cada nueva versión, cambiá el `?v=20260929` de los `<link>` y `<script>` por la fecha
   del día, para que los navegadores no muestren archivos viejos.

## Ver en local

```bash
python3 -m http.server 8765
# abrir http://localhost:8765
```
