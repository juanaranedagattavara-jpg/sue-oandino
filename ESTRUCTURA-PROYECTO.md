# 📁 Estructura del Proyecto Sueño Andino

## 🎯 Organización de Archivos

### 📄 **Archivos Principales**
- `index.html` - Página principal del sitio web
- `README.md` - Documentación principal del proyecto
- `.htaccess` - Configuración del servidor web
- `server-config.json` - Configuración del servidor de desarrollo

### 📁 **Carpetas Organizadas**

#### 🎨 **assets/**
Contiene todos los recursos estáticos del sitio:
- `css/` - Hojas de estilo (main.css, components.css, base.css, premium.css)
- `js/` - Archivos JavaScript (main.js, utils.js, modals.js, forms.js)
- `img/` - Imágenes del sitio (logos, galería, fondos)

#### 📄 **pages/**
Páginas HTML del sitio web:
- `blog.html` - Página del blog
- `404.html` - Página de error 404
- `500.html` - Página de error 500
- `preview-equipo.html` - Vista previa del equipo

#### ⚖️ **legal/**
Páginas legales y políticas:
- `politica-privacidad.html` - Política de privacidad
- `terminos-condiciones.html` - Términos y condiciones
- `cookies-policy.html` - Política de cookies

#### 📚 **docs/**
Documentación del proyecto:
- `CONFIGURACION_GOOGLE_CALENDAR.md` - Configuración del calendario
- `PERFORMANCE_REPORT.md` - Reporte de rendimiento

#### 🧪 **testing/**
Archivos de testing y pruebas:
- `lighthouse-test.js` - Pruebas de Lighthouse
- `performance-test.html` - Pruebas de rendimiento

#### 🧩 **patterns/**
Patrones de WordPress (para futura migración):
- `agenda-contacto.html`
- `casos-exito.html`
- `directorio.html`
- `equipo.html`
- `golden-circle.html`
- `hero.html`
- `prensa-alianzas.html`
- `servicios.html`
- `timeline.html`

#### 📋 **templates/**
Plantillas de WordPress (para futura migración):
- `front-page.html`
- `page-arquitectura.html`
- `page-estandar-calidad.html`

#### 🔧 **parts/**
Partes reutilizables:
- `footer.html`
- `header.html`

#### 🎨 **wp-theme/**
Tema completo de WordPress (para futura migración):
- `assets/` - Recursos del tema
- `blocks/` - Bloques personalizados
- `inc/` - Funciones PHP
- `template-parts/` - Partes de plantillas
- `templates/` - Plantillas PHP

## 🔗 **Rutas Actualizadas**

### Navegación Principal
- Blog: `/pages/blog.html`
- Servicios: `#servicios` (sección en index.html)
- Nosotros: `#equipo` (sección en index.html)
- Contacto: `#contacto` (sección en index.html)

### Páginas Legales
- Política de Privacidad: `/legal/politica-privacidad.html`
- Términos y Condiciones: `/legal/terminos-condiciones.html`
- Política de Cookies: `/legal/cookies-policy.html`

### Páginas de Error
- Error 404: `/pages/404.html`
- Error 500: `/pages/500.html`

## 🚀 **Ventajas de la Nueva Estructura**

1. **Organización Clara**: Cada tipo de archivo tiene su carpeta específica
2. **Mantenimiento Fácil**: Fácil localizar y editar archivos
3. **Escalabilidad**: Estructura preparada para crecimiento
4. **Migración WordPress**: Carpetas `patterns/`, `templates/`, `wp-theme/` listas
5. **SEO Optimizado**: Rutas limpias y redirecciones configuradas
6. **Desarrollo Eficiente**: Separación clara entre desarrollo y producción

## 📝 **Notas Importantes**

- Todas las referencias en `index.html` han sido actualizadas
- El archivo `.htaccess` maneja las redirecciones automáticamente
- La estructura mantiene compatibilidad con el servidor actual
- Los archivos de WordPress están listos para futura migración
