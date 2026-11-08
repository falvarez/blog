# AGENTS.md - Blog de Fede Álvarez

Guía de referencia de la arquitectura del repositorio para agentes y futuras tareas.

## Resumen del proyecto

Blog personal estático generado con [Sculpin](https://sculpin.io) (PHP + Twig).
Temática: videojuegos, libros, música, cine y nostalgia ochentera/noventera.
Idioma: español (`es_ES`, zona horaria `Europe/Madrid`). Activo desde noviembre de 2004.
URL de producción: https://blog.falvarez.es

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Generador | **Sculpin 4.0.0-alpha1** (`require-dev` en `composer.json`, instalado desde `source`) |
| Lenguaje | **PHP 8.5** con extensión `intl` (imagen `php:8.5-cli`) |
| Plantillas | **Twig 3** + `twig/intl-extra` + `jasny/twig-extensions` (PCRE) + 3 extensiones propias |
| CSS | **Bootstrap 4.3.1** + **Start Bootstrap Clean Blog** + `custom.css` |
| JS | **jQuery 2.1.1**, **Chart.js 2.9.3**, **lozad** (CDN, lazy loading), resaltado de código casero en `app.js` |
| Iconos/fuentes | Font Awesome (kit remoto), Google Fonts (Roboto, Roboto Slab) |
| Búsqueda | Google Custom Search (`source/search.html`) |
| Dev | Docker Compose (gestionado con **OrbStack**) + servidor Node 20 con live-reload (`server.js`) |
| Deploy | `rsync` (Homebrew, `/opt/homebrew/bin/rsync`) por SSH al host `fspeccyorg` |

Sin base de datos, sin framework PHP completo, sin tests, sin linters, sin pipeline de assets.

## Comandos principales (Makefile)

Todos dependen de `check-orbstack`, que arranca OrbStack si no está corriendo.

| Comando | Descripción |
|---------|-------------|
| `make run` | `docker compose up --build`: genera en modo `--watch` y sirve en http://localhost:3000 con live-reload |
| `make build` | `docker compose build` |
| `make generate-prod` | `composer install` + `sculpin generate --env=prod --url=https://blog.falvarez.es` → `output_prod/` (montado como bind del host) |
| `make deploy` | `generate-prod` + `rsync -avz --delete --iconv=utf-8-mac,utf-8` a `fspeccyorg:/var/www/falvarez/blog.falvarez.es/public_html` (excluye `.DS_Store` y `*.bak`) |
| `make update-deps` | `composer update` dentro del contenedor |

Toda ejecución de PHP se hace dentro de Docker con `php -d intl.default_locale=es_ES vendor/bin/sculpin ...`.

## Flujo de generación

```
source/ ──(Sculpin + Twig + extensiones src/)──> output_prod/ ──rsync──> servidor
                                                      │
                                         (dev) volumen Docker compartido
                                                      │
                                         server.js (Node, :3000, SSE reload)
```

### Entorno de desarrollo (`docker-compose.yml`)

- **`sculpin`** (`Dockerfile`, PHP 8.5 + intl + Composer): monta el repo en `/app` y ejecuta
  `sculpin generate --watch --env=prod --url=http://localhost:3000`. Escribe en el volumen
  nombrado `output_prod` (no en la carpeta del host).
- **`web`** (`Dockerfile.web`, Node 20 Alpine): ejecuta `server.js`, que:
  - sirve estáticos desde `/output_prod` (protección contra path traversal);
  - redirige rutas sin extensión ni barra final a `ruta/` y sirve `index.html`;
  - inyecta antes de `</body>` un script `EventSource("/__reload")`;
  - sondea cada 2 s el `mtime` de los `.html` generados y emite `reload` por SSE.
- Ojo: el entorno de desarrollo **también usa `--env=prod`**, así que los posts con `draft: true`
  no se generan ni en local.

## Estructura de directorios

```
source/                      # Todo lo que procesa Sculpin
├── _posts/<año>/            # Posts (2004–2026), ~760 ficheros
├── _layouts/
│   ├── default.html         # Layout base: <head>, navbar, masthead, footer, scripts
│   └── static.html          # Variante para páginas estáticas (cabecera con page.title/subtitle/fecha)
├── _views/
│   ├── post.html            # Vista de post (extiende "default"): meta OG/Twitter, tags, widgets, navegación
│   ├── components/          # Includes reutilizables dentro del contenido
│   │   ├── image.twig           # <figure> con lazy loading (lozad) + <noscript>
│   │   ├── image-webp.twig      # Igual con <picture> y varias fuentes (webp/gif/png/jpg)
│   │   └── multimedia-card.twig # Tarjeta de juego/libro (portada, progreso, duración, estrella)
│   └── widgets/             # Bloques que se añaden al final del post vía front-matter `widgets`
│       ├── now-playing.twig     # "¿A qué estoy jugando?" + perfiles online
│       ├── now-reading.twig     # Enlace a la lista de libros
│       └── zelda.twig, metroid.twig, assassins-creed.twig  # Listas de sagas
├── index.html               # Portada paginada (8 posts por página, contenido completo)
├── archive.html             # Archivo paginado agrupado por mes/año
├── tags.html                # Nube de etiquetas (usa filtro tagSort)
├── tags/tags.html           # Página por etiqueta (generator posts_tag_index + pagination, 20/página)
├── tags/tags.xml            # Feed Atom por etiqueta
├── atom.xml                 # Feed Atom principal (10 últimos, con media:content)
├── sitemap.xml
├── search.html              # Google Custom Search
├── about.html, cookies.html, colaboraciones-retromaniac.html   # Páginas estáticas (layout static)
├── 404.html, 50x.html, robots.txt, favicon.ico, google*.html, instafeed.xml
├── css/                     # bootstrap, clean-blog, custom (+ versiones .min)
├── js/                      # jquery, bootstrap, clean-blog, chart, app.js, games-stats.js, books-stats.js
├── fonts/, img/             # Recursos del tema (home-bg.jpg, somerights20.gif)
├── uploads/<año>/<mes>/     # Imágenes de los posts
├── uploads/covers/games/    # Portadas para multimedia-card
├── uploads/retromaniac/     # Imágenes de colaboraciones en RetroManiac
└── components/              # Legacy (gitignored, de sculpin.json); no se referencia en los layouts
src/                         # Extensiones Twig propias (namespace Falvarez\Blog, PSR-4)
app/config/
├── sculpin_kernel.yml       # Tipo de contenido posts, permalinks y servicios Twig
└── sculpin_site.yml         # Variables site.* (title, subtitle, years)
templates/1970-01-01-post-template.draft.html   # Plantilla de referencia para posts nuevos
bin/optimize-images.sh       # Conversión/redimensionado de imágenes con sips
server.js                    # Servidor dev con live-reload
Dockerfile, Dockerfile.web, docker-compose.yml, Makefile
sculpin.json                 # Legacy (dependencias de componentes antiguas, no se usa)
data/solr/                   # Legacy (gitignored, no se usa)
output_prod/                 # Sitio generado (gitignored)
```

## Configuración de Sculpin

`app/config/sculpin_kernel.yml`:

- Tipo de contenido `posts`: `path: _posts/**`, `permalink: :year/:month/:filename.html`.
  La fecha se deduce de la ruta (`_posts/2026/08-16-slug.html` → `/2026/08/slug.html`).
- Servicios Twig registrados (tag `twig.extension`): `IntlExtension`, `Jasny\Twig\PcreExtension`,
  `TagsExtension`, `LcfirstExtension`, `SpanishDateExtension`.
- Parámetros: `locale: es_ES`, `timezone: Europe/Madrid`.

`app/config/sculpin_site.yml`: `site.title`, `site.subtitle`, `site.years`. `site.url` lo
inyecta `--url` al generar.

## Extensiones Twig propias (`src/`)

| Clase | Filtro | Uso |
|-------|--------|-----|
| `SpanishDateExtension` | `spanish_date` | Fecha larga en español con `IntlDateFormatter` (p. ej. "Sábado, 16 de agosto de 2026"). Acepta timestamp, string o `DateTimeInterface` |
| `TagsExtension` | `tagSort` | `ksort` de `data.posts_tags` para la nube de etiquetas |
| `LcfirstExtension` | `lcfirst` | Envoltorio de `lcfirst` |

Para añadir una nueva: crear la clase en `src/` extendiendo `Twig\Extension\AbstractExtension`
y registrarla como servicio en `sculpin_kernel.yml`.

## Posts

- Ubicación y nombre: `source/_posts/<año>/<MM>-<DD>-<slug>.html` (HTML, no Markdown).
- Plantilla de referencia: `templates/1970-01-01-post-template.draft.html`.
- Front-matter real (no hay `date`, `categories` ni `template`):

```yaml
---
layout: post                         # siempre "post" (→ _views/post.html)
title: "Juegos: eFootball™ Kick Off!"
summary: "Resumen usado en meta description, OG, Twitter y archivo"
header_image: /uploads/2026/08/xxx-cabecera.jpg   # fondo del masthead (opcional)
main_image: /uploads/2026/08/xxx.jpg              # miniatura en archivo/tags, og:image, feed (opcional)
tags: [análisis videojuegos, konami, nintendo switch 2]
widgets: [now-playing]               # opcional; nombres de _views/widgets/*.twig
last_update_date: 2025-08-01         # opcional; muestra "Actualizado el ..."
draft: true                          # opcional; con --env=prod no se publica
---
```

- `subtitle` también se admite en el masthead y en la portada.
- Etiquetas: en minúsculas, en español, pueden llevar espacios y tildes; generan
  `/tags/<tag>/` y `/tags/<tag>.xml` automáticamente. Reutilizar etiquetas existentes
  (ver `grep -rh "^tags:" source/_posts`).
- Convenciones de título: prefijos `Juegos: ...` (análisis de videojuegos, con `widgets: [now-playing]`)
  y `Lecturas: ...` (libros, con `widgets: [now-reading]`).
- Imágenes dentro del contenido:

```twig
{% include 'components/image.twig' with {'src': '/uploads/2026/08/foto.jpg', 'alt': 'Texto', 'position': 'center'} %}
```

  Parámetros opcionales: `caption` (HTML, si no se usa `alt`), `additionalClasses` (por defecto `w-100`).
- Vídeos: `<div class="embed-responsive embed-responsive-16by9"><iframe ...></iframe></div>`.

### Posts "vivos" (listas que se actualizan periódicamente)

| Fichero | URL | Contenido |
|---------|-----|-----------|
| `_posts/2004/11-18-jugando.html` | `/2004/11/jugando.html` | Juegos completados (cientos de `multimedia-card`) + gráfico por plataforma |
| `_posts/2004/11-17-leyendo.html` | `/2004/11/leyendo.html` | Libros leídos |
| `_posts/2008/08-26-pelculas-vistas.html` | `/2008/08/pelculas-vistas.html` | Películas vistas |
| `source/colaboraciones-retromaniac.html` | `/colaboraciones-retromaniac.html` | Índice de reseñas en RetroManiac |

- El gráfico de `jugando.html` (`<canvas id="game-stats-by-platform">`) lo pinta
  `source/js/games-stats.js` con **datos escritos a mano** (etiquetas `"Plataforma (N)"` y array
  `data`). Al añadir un juego completado hay que actualizar ambos sitios del JS y subir el
  parámetro de caché `?YYYYMMDD` de su `<script>` en los layouts.
- El widget `now-playing.twig` contiene el juego en curso; se actualiza a mano.
- `books-stats.js` existe pero no está referenciado en los layouts.

## Layouts y assets

- `post.html` extiende `default`; ambos layouts (`default.html` y `static.html`) duplican
  `<head>`, navbar y footer: un cambio en esas partes debe hacerse en **los dos**.
- Bloques Twig disponibles: `title`, `head_meta`, `template_class`, `header`, `content_wrapper`, `content`.
  Las páginas con layout `default` personalizan la cabecera con
  `{% block header %}{% set h1 = ... %}{% set subheading = ... %}{{ parent() }}{% endblock %}`.
- Cache busting manual con query string de fecha (`custom.min.css?20250815`, `games-stats.js?20260129`...).
- No hay minificador: si se toca `custom.css` hay que regenerar `custom.min.css` a mano (es el
  que se carga) y actualizar su `?YYYYMMDD`.
- Lazy loading: las imágenes usan clase `lozad` con `data-src` y un pixel base64 en `src`;
  `app.js` inicializa `lozad()`.
- El sitio declara no usar cookies ni rastreo: no añadir analíticas ni scripts de terceros que rastreen.

## Imágenes

- `bin/optimize-images.sh <dir_origen> <dir_destino> <dimensión_máxima>`: convierte todo a JPEG
  y redimensiona con `sips` (solo macOS, se ejecuta en el host, no en Docker).
- Destino habitual: `source/uploads/<año>/<mes>/`. Cabeceras con sufijo `-cabecera.jpg`.

## Git

- Rama única `master`.
- Mensajes estilo conventional commits en español/inglés mezclado:
  - `feat: Post - AAAA/MM/DD Título del post`
  - `fix: Post - AAAA/MM/DD Título. <cambio>` / `fix: Update seen movies list`
  - `vendor: Update dependencies`
- Ignorados: `vendor/`, `output_*/`, `.sculpin/`, `source/components/`, `data/`, `*draft.html`.

## Notas adicionales

- **No hay tests.** No configurar PHPUnit, Pest, ni ningún test runner.
- **No hay linters.** No ejecutar PHP CS Fixer, PHPStan, ESLint, etc.
- `composer install --no-interaction --no-ansi --no-progress` para instalar dependencias (dentro del contenedor).
- No ejecutar `make deploy` sin confirmación explícita: publica en producción con `--delete`.
- Autor: Federico J. Álvarez Valero (`fede.alvarez@gmail.com`)
- Licencia: CC BY-NC-ND 4.0
