# El blog de Fede Álvarez

Blog personal estático sobre videojuegos, libros, música, cine y nostalgia de los 80 y 90.
Online desde 2004. Generado con [Sculpin](https://sculpin.io).

## Stack tecnológico

- **PHP 8.5** con extensión `intl` + **Sculpin** (generador de sitios estáticos)
- **Twig** con extensiones: `IntlExtra`, `Jasny\Twig\PcreExtension`, y 3 extensiones personalizadas (`TagsExtension`, `LcfirstExtension`, `SpanishDateExtension`)
- **Bootstrap 2.3.x**, **Clean Blog Theme**, **jQuery**, **Chart.js**, **highlightjs**
- **Docker** — `php:8.5-cli` para generación, `node:20-alpine` para servidor dev
- Sin base de datos, sin tests, sin linters

## Requisitos

- Docker y Docker Compose (o servicios compatibles)

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
└── uploads/           # Contenido subido (2004–2019)
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
Dockerfile.web          # Imagen Node 20 (servidor estático)
docker-compose.yml     # Orquestación de servicios
sculpin.json           # Dependencias de componentes frontend
data/solr/             # Núcleo Solr para búsqueda
```

## Licencia

CC BY-NC-ND 4.0 — [Fede J. Álvarez Valero](mailto:fede.alvarez@gmail.com)
