// ===========================================
// SUEÑO ANDINO - SERVICE WORKER
// ===========================================

const CACHE_NAME = 'sueño-andino-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Recursos críticos para cachear
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/base.css',
    '/assets/css/premium.css',
    '/assets/css/style.css',
    '/assets/img/hero-background.jpg',
    '/assets/img/logo-sa-blanco.png',
    '/assets/js/main.js'
];

// Recursos dinámicos
const DYNAMIC_ASSETS = [
    '/assets/img/galeria1.jpg',
    '/assets/img/galeria2.jpg',
    '/assets/img/galeria3.jpg',
    '/assets/img/galeria4.jpg',
    '/assets/img/galeria5.jpg',
    '/assets/img/galeria6.jpg',
    '/assets/img/galeria7.jpg',
    '/assets/img/galeria8.jpg',
    '/assets/img/timeline-background.jpg',
    '/assets/img/fondo-casosexito.jpg',
    '/assets/img/equipo-fondo.jpg'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Cacheando recursos estáticos');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Instalación completada');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error en instalación', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Eliminando cache antiguo', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activación completada');
                return self.clients.claim();
            })
    );
});

// Interceptar requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo procesar requests GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Estrategia para recursos estáticos
    if (STATIC_ASSETS.includes(url.pathname)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        console.log('Service Worker: Sirviendo desde cache estático', url.pathname);
                        return response;
                    }
                    
                    return fetch(request)
                        .then(fetchResponse => {
                            const responseClone = fetchResponse.clone();
                            caches.open(STATIC_CACHE)
                                .then(cache => cache.put(request, responseClone));
                            return fetchResponse;
                        });
                })
        );
        return;
    }
    
    // Estrategia para imágenes
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        console.log('Service Worker: Sirviendo imagen desde cache', url.pathname);
                        return response;
                    }
                    
                    return fetch(request)
                        .then(fetchResponse => {
                            if (fetchResponse.status === 200) {
                                const responseClone = fetchResponse.clone();
                                caches.open(DYNAMIC_CACHE)
                                    .then(cache => cache.put(request, responseClone));
                            }
                            return fetchResponse;
                        })
                        .catch(() => {
                            // Fallback para imágenes
                            return new Response(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif">Imagen no disponible</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        });
                })
        );
        return;
    }
    
    // Estrategia para CSS y JS
    if (url.pathname.match(/\.(css|js)$/)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        console.log('Service Worker: Sirviendo recurso desde cache', url.pathname);
                        return response;
                    }
                    
                    return fetch(request)
                        .then(fetchResponse => {
                            if (fetchResponse.status === 200) {
                                const responseClone = fetchResponse.clone();
                                caches.open(STATIC_CACHE)
                                    .then(cache => cache.put(request, responseClone));
                            }
                            return fetchResponse;
                        });
                })
        );
        return;
    }
    
    // Estrategia para HTML (Network First)
    if (request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then(fetchResponse => {
                    if (fetchResponse.status === 200) {
                        const responseClone = fetchResponse.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return fetchResponse;
                })
                .catch(() => {
                    return caches.match(request)
                        .then(response => {
                            if (response) {
                                console.log('Service Worker: Sirviendo HTML desde cache offline', url.pathname);
                                return response;
                            }
                            
                            // Página offline
                            return new Response(
                                `<!DOCTYPE html>
                                <html>
                                <head>
                                    <title>Sueño Andino - Sin conexión</title>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <style>
                                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f3f4f6; }
                                        .offline { max-width: 400px; margin: 0 auto; }
                                        h1 { color: #2a4351; }
                                        p { color: #6b7280; }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline">
                                        <h1>Sin conexión</h1>
                                        <p>No se pudo cargar la página. Verifica tu conexión a internet.</p>
                                        <button onclick="window.location.reload()">Reintentar</button>
                                    </div>
                                </body>
                                </html>`,
                                { headers: { 'Content-Type': 'text/html' } }
                            );
                        });
                })
        );
        return;
    }
});

// Limpiar cache dinámico periódicamente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        caches.open(DYNAMIC_CACHE)
            .then(cache => cache.keys())
            .then(keys => {
                keys.forEach(key => {
                    cache.delete(key);
                });
                console.log('Service Worker: Cache dinámico limpiado');
            });
    }
});

// Manejar actualizaciones
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
