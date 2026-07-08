# AGENTS.md - Blog de Fede Álvarez

## Resumen del proyecto

Blog personal estático generado con [Sculpin](https://sculpin.io) (PHP + Twig).
Temática: videojuegos, libros, música, cine y nostalgia ochentera/noventera.
Idioma: español. Activo desde 2004.

## Stack tecnológico

- **PHP 8.5** con extensión `intl`
- **Sculpin** (fork en https://github.com/falvarez/sculpin.git) — generador de sitios estáticos
- **Twig** — motor de plantillas
- **Bootstrap 2.3.x** + **Clean Blog Theme** + CSS personalizado
- **jQuery**, **Chart.js**, **lozad** (lazy loading)
- **Docker** — PHP 8.4 CLI (generación) + Node 20 Alpine (servidor dev con live-reload vía SSE)
- **Node.js** (servidor HTTP estático en desarrollo, `server.js`)
- Sin base de datos, sin framework PHP completo (solo componentes Symfony)
- Sin tests ni linters configurados

## Comandos principales

| Comando | Descripción |
|---------|-------------|
| `make run` | `docker compose up --build` (dev con live-reload) |
| `make build` | `docker compose build` |
| `make generate-prod` | Genera sitio estático en `output_prod/` |
| `make deploy` | Genera + rsync a servidor remoto (`fspeccyorg`) |

## Estructura de directorios

```
source/                # Contenido fuente (lo que Sculpin procesa)
├── _posts/            # Posts por año (2004–2026)
├── _layouts/          # Layouts Twig (default.html, static.html)
├── _views/            # Vistas y componentes Twig (post.html, widgets, components)
├── _components/       # Dependencias frontend (Bootstrap, jQuery, highlightjs)
├── css/               # Hojas de estilo
├── js/                # Scripts JS
├── img/               # Imágenes
└── uploads/           # Contenido subido
src/                   # Extensiones PHP personalizadas (Twig)
├── LcfirstExtension.php
├── SpanishDateExtension.php
└── TagsExtension.php
app/config/            # Configuración Sculpin (YAML)
├── sculpin_kernel.yml
└── sculpin_site.yml
templates/             # Plantillas/borradores de post
output_prod/           # Sitio generado (gitignored)
```

## Convenciones de código

### Posts

- Formato: **HTML con YAML front-matter**
- Ubicación: `source/_posts/<año>/<slug>.html`
- Front-matter requerido: `title`, `date`, `tags`, `categories`, `template`
- Template por defecto: `_views/post.html` (que extiende `_layouts/default.html`)
- Las etiquetas (`tags`) se usan para generar páginas de etiquetas automáticamente

### Plantillas Twig

- Los layouts extienden `_layouts/default.html`
- Los componentes reutilizables van en `source/_views/components/`
- Los widgets van en `source/_views/widgets/`
- Filtros Twig personalizados registrados en `sculpin_kernel.yml`

### PHP (extensiones Twig)

- Namespace: `Falvarez\Blog` (PSR-4, mapeado a `src/`)
- Las extensiones deben registrarse en `app/config/sculpin_kernel.yml`

### Imágenes

- Optimizar imágenes locales con: `bin/optimize-images.sh`
- Usa `sips` (herramienta nativa de macOS)

### Deployment

- Generación: `sculpin generate --env=prod --url=https://blog.falvarez.es`
- Subida: rsync a `fspeccyorg:/var/www/falvarez/blog.falvarez.es/public_html`
- Puerto SSH remoto no estándar: no (rsync directo)
- Se excluyen `.DS_Store` y `*.bak`

## Notas adicionales

- **No hay tests.** No configurar PHPUnit, Pest, ni ningún test runner.
- **No hay linters.** No ejecutar PHP CS Fixer, PHPStan, ESLint, etc.
- `composer install --no-interaction --no-ansi --no-progress` para instalar dependencias
- Escritura de posts: usar `templates/1970-01-01-post-template.draft.html` como referencia
- Autor: Federico J. Álvarez Valero (`fede.alvarez@gmail.com`)
- Licencia: CC BY-NC-ND 4.0
