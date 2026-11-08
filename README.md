# El blog de Fede Álvarez

Blog personal estático sobre videojuegos, libros, música, cine y nostalgia de los 80 y 90.
Online desde 2004. Generado con [Sculpin](https://sculpin.io).

## Stack tecnológico

- **PHP 8.5** con extensión `intl` + **Sculpin** (generador de sitios estáticos)
- **Twig** con extensiones: `IntlExtra`, `Jasny\Twig\PcreExtension`, y 3 extensiones personalizadas (`TagsExtension`, `LcfirstExtension`, `SpanishDateExtension`)
- **Bootstrap 4.3.1**, **Clean Blog Theme**, **jQuery 2.1.1**, **Chart.js 2.9.3**, **lozad** (lazy loading)
- **Docker** — `php:8.5-cli` para generación, `node:20-alpine` para servidor dev
- Sin base de datos, sin tests, sin linters

## Requisitos

- [OrbStack](https://orbstack.dev) (proporciona Docker y Docker Compose; el Makefile lo arranca con `orbctl` si no está en marcha)
- `rsync` de Homebrew (`/opt/homebrew/bin/rsync`) y acceso SSH al host `fspeccyorg` para el despliegue

## Comandos (Makefile)

| Comando | Descripción |
|---------|-------------|
| `make run` | Arranca entorno de desarrollo con live-reload |
| `make build` | Construye las imágenes Docker |
| `make generate-prod` | Genera el sitio estático en `output_prod/` |
| `make deploy` | Genera + rsync al servidor remoto |
| `make update-deps` | Actualiza dependencias Composer |

## Desarrollo

```bash
make run
```

Esto levanta dos contenedores:
- **sculpin**: genera el sitio y lo reconstruye al detectar cambios (`--watch`)
- **web**: servidor Node.js en el puerto 3000 con **live-reload vía SSE**

El blog se accede en `http://localhost:3000`.

La generación en desarrollo también usa `--env=prod`, por lo que los posts con `draft: true` no se muestran.

## Producción

```bash
make deploy
```

Ejecuta `generate-prod` y sincroniza `output_prod/` con el servidor remoto vía rsync.

Para generar solo el sitio estático:

```bash
make generate-prod
```

El sitio generado queda en `output_prod/`, listo para subir a cualquier servidor web.

## Estructura del proyecto

```
source/                # Contenido fuente (procesado por Sculpin)
├── _posts/            # Posts por año (2004–2026)
├── _layouts/          # Layouts Twig (default.html, static.html)
├── _views/            # Plantillas y componentes Twig
│   ├── post.html
│   ├── widgets/       # Widgets (now-reading, now-playing, etc.)
│   └── components/    # Componentes reutilizables (image, multimedia-card)
├── css/               # Hojas de estilo
├── js/                # Scripts (app, clean-blog, chart.js, etc.)
├── img/               # Imágenes
└── uploads/           # Imágenes de los posts por año/mes (2004–2026), portadas y RetroManiac
src/                   # Extensiones PHP personalizadas (Twig)
├── LcfirstExtension.php
├── SpanishDateExtension.php
└── TagsExtension.php
app/config/            # Configuración Sculpin
├── sculpin_kernel.yml
└── sculpin_site.yml
templates/             # Plantillas/borradores de post
server.js              # Servidor HTTP dev con live-reload (SSE)
Dockerfile             # Imagen PHP 8.5 + Composer
Dockerfile.web         # Imagen Node 20 (servidor estático)
docker-compose.yml     # Orquestación de servicios
bin/optimize-images.sh # Conversión y redimensionado de imágenes (sips, macOS)
sculpin.json           # Legacy: dependencias de componentes antiguas, sin uso
data/solr/             # Legacy: núcleo Solr sin uso (gitignored)
```

## Licencia

CC BY-NC-ND 4.0 — [Fede J. Álvarez Valero](mailto:fede.alvarez@gmail.com)
