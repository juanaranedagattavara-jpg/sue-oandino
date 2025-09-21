/**
 * Scripts para bloques personalizados de Sueño Andino
 */

(function() {
    'use strict';

    // Registrar bloques dinámicamente
    if (typeof wp !== 'undefined' && wp.blocks && wp.element && wp.blockEditor && wp.components) {
        const { registerBlockType } = wp.blocks;
        const { createElement: el } = wp.element;
        const { InspectorControls, useBlockProps } = wp.blockEditor;
        const { PanelBody, TextControl, TextareaControl, Button, ButtonGroup } = wp.components;

        // Hero Block
        registerBlockType('sueno-andino/hero-block', {
            edit: function(props) {
                const { attributes, setAttributes } = props;
                const { tituloLinea1, tituloLinea2, subtitulo, textoBoton, enlaceBoton } = attributes;
                const blockProps = useBlockProps();

                return el('div', blockProps, [
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Configuración del Hero' },
                            el(TextControl, {
                                label: 'Título Línea 1 (Blanco)',
                                value: tituloLinea1,
                                onChange: (value) => setAttributes({ tituloLinea1: value })
                            }),
                            el(TextControl, {
                                label: 'Título Línea 2 (Naranja)',
                                value: tituloLinea2,
                                onChange: (value) => setAttributes({ tituloLinea2: value })
                            }),
                            el(TextareaControl, {
                                label: 'Subtítulo',
                                value: subtitulo,
                                onChange: (value) => setAttributes({ subtitulo: value }),
                                rows: 3
                            }),
                            el(TextControl, {
                                label: 'Texto del Botón',
                                value: textoBoton,
                                onChange: (value) => setAttributes({ textoBoton: value })
                            }),
                            el(TextControl, {
                                label: 'Enlace del Botón',
                                value: enlaceBoton,
                                onChange: (value) => setAttributes({ enlaceBoton: value })
                            })
                        )
                    ),
                    el('div', {
                        style: {
                            background: 'linear-gradient(135deg, #2a4351 0%, #1e3a47 100%)',
                            minHeight: '60vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            textAlign: 'center',
                            padding: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '0.5rem'
                        }
                    }, [
                        el('div', {
                            style: {
                                maxWidth: '900px',
                                zIndex: 2,
                                position: 'relative'
                            }
                        }, [
                            el('h1', {
                                style: {
                                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                                    fontWeight: '800',
                                    margin: '0 0 2rem 0',
                                    lineHeight: '1.1',
                                    fontFamily: 'Playfair Display, serif',
                                    textShadow: '0 6px 12px rgba(0,0,0,0.6)'
                                }
                            }, [
                                el('div', {
                                    style: {
                                        color: 'white',
                                        marginBottom: '0.5rem'
                                    }
                                }, tituloLinea1),
                                el('div', {
                                    style: {
                                        color: '#d3600f'
                                    }
                                }, tituloLinea2)
                            ]),
                            el('p', {
                                style: {
                                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                                    fontWeight: '300',
                                    lineHeight: '1.4',
                                    margin: '0 0 2rem 0',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }
                            }, subtitulo),
                            el('a', {
                                href: enlaceBoton,
                                style: {
                                    background: 'linear-gradient(135deg, #d3600f 0%, #c16134 100%)',
                                    color: 'white',
                                    padding: '1rem 2.5rem',
                                    borderRadius: '0.75rem',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    display: 'inline-block',
                                    boxShadow: '0 10px 25px -5px rgba(211,96,15,0.4)'
                                }
                            }, textoBoton)
                        ])
                    ])
                ]);
            },
            save: function() {
                return null; // Se renderiza desde PHP
            }
        });

        // Servicios Block
        registerBlockType('sueno-andino/servicios-block', {
            edit: function(props) {
                const { attributes, setAttributes } = props;
                const { titulo, subtitulo, servicios } = attributes;
                const blockProps = useBlockProps();

                const updateServicio = (index, field, value) => {
                    const nuevosServicios = [...servicios];
                    nuevosServicios[index][field] = value;
                    setAttributes({ servicios: nuevosServicios });
                };

                const addServicio = () => {
                    const nuevosServicios = [...servicios, {
                        titulo: 'Nuevo Servicio',
                        descripcion: 'Descripción del nuevo servicio...',
                        icono: 'personas'
                    }];
                    setAttributes({ servicios: nuevosServicios });
                };

                const removeServicio = (index) => {
                    if (servicios.length > 1) {
                        const nuevosServicios = servicios.filter((_, i) => i !== index);
                        setAttributes({ servicios: nuevosServicios });
                    }
                };

                return el('div', blockProps, [
                    el(InspectorControls, {},
                        el(PanelBody, { title: 'Configuración de Servicios' },
                            el(TextControl, {
                                label: 'Título Principal',
                                value: titulo,
                                onChange: (value) => setAttributes({ titulo: value })
                            }),
                            el(TextareaControl, {
                                label: 'Subtítulo',
                                value: subtitulo,
                                onChange: (value) => setAttributes({ subtitulo: value }),
                                rows: 3
                            }),
                            el('hr'),
                            el('h4', {}, 'Servicios'),
                            servicios.map((servicio, index) => 
                                el('div', { 
                                    key: index,
                                    style: { 
                                        border: '1px solid #ddd', 
                                        padding: '1rem', 
                                        marginBottom: '1rem',
                                        borderRadius: '4px',
                                        backgroundColor: '#f9f9f9'
                                    }
                                }, [
                                    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' } },
                                        el('strong', {}, `Servicio ${index + 1}`),
                                        el(Button, {
                                            isDestructive: true,
                                            isSmall: true,
                                            onClick: () => removeServicio(index),
                                            disabled: servicios.length <= 1
                                        }, 'Eliminar')
                                    ),
                                    el(TextControl, {
                                        label: 'Título del Servicio',
                                        value: servicio.titulo,
                                        onChange: (value) => updateServicio(index, 'titulo', value)
                                    }),
                                    el(TextareaControl, {
                                        label: 'Descripción',
                                        value: servicio.descripcion,
                                        onChange: (value) => updateServicio(index, 'descripcion', value),
                                        rows: 3
                                    }),
                                    el('div', { style: { marginTop: '0.5rem' } },
                                        el('label', { style: { display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' } }, 'Icono:'),
                                        el(ButtonGroup, {},
                                            ['personas', 'empresas', 'gobiernos'].map(icono =>
                                                el(Button, {
                                                    key: icono,
                                                    isPrimary: servicio.icono === icono,
                                                    isSmall: true,
                                                    onClick: () => updateServicio(index, 'icono', icono)
                                                }, icono.charAt(0).toUpperCase() + icono.slice(1))
                                            )
                                        )
                                    )
                                ])
                            ),
                            el(Button, {
                                isPrimary: true,
                                onClick: addServicio
                            }, 'Agregar Servicio')
                        )
                    ),
                    el('div', {
                        style: {
                            background: '#ffffff',
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e0e0e0'
                        }
                    }, [
                        el('div', { style: { textAlign: 'center', marginBottom: '2rem' } }, [
                            el('div', {
                                style: {
                                    display: 'inline-block',
                                    marginBottom: '1rem',
                                    background: 'rgba(211,96,15,0.08)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '1.5rem',
                                    border: '1px solid rgba(211,96,15,0.15)'
                                }
                            }, 'Nuestros Servicios'),
                            el('h2', {
                                style: {
                                    fontSize: '2rem',
                                    fontWeight: '400',
                                    color: '#2a4351',
                                    margin: '0 0 1rem 0',
                                    fontFamily: 'Playfair Display, serif'
                                }
                            }, titulo),
                            el('p', {
                                style: {
                                    fontSize: '1.125rem',
                                    color: '#6b6b6b',
                                    lineHeight: '1.6',
                                    margin: '0',
                                    maxWidth: '600px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }
                            }, subtitulo)
                        ]),
                        el('div', {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '2rem'
                            }
                        }, servicios.map((servicio, index) =>
                            el('div', {
                                key: index,
                                style: {
                                    background: '#2a4351',
                                    borderRadius: '1rem',
                                    padding: '2rem',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }
                            }, [
                                el('div', {
                                    style: {
                                        width: '3rem',
                                        height: '3rem',
                                        background: 'rgba(211,96,15,0.08)',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem'
                                    }
                                }, [
                                    el('span', { style: { color: '#d3600f', fontSize: '1.5rem' } }, 
                                        servicio.icono === 'personas' ? '👥' : 
                                        servicio.icono === 'empresas' ? '🏢' : '⭐'
                                    )
                                ]),
                                el('h3', {
                                    style: {
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        margin: '0 0 1rem 0',
                                        fontFamily: 'Playfair Display, serif'
                                    }
                                }, servicio.titulo),
                                el('p', {
                                    style: {
                                        color: 'rgba(255,255,255,0.9)',
                                        lineHeight: '1.6',
                                        margin: '0',
                                        fontSize: '0.9rem'
                                    }
                                }, servicio.descripcion)
                            ])
                        ))
                    ])
                ]);
            },
            save: function() {
                return null; // Se renderiza desde PHP
            }
        });
    }
})();
