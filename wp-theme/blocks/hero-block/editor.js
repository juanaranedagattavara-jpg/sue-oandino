/**
 * Hero Block Editor Script
 */

import { registerBlockType } from '@wordpress/blocks';
import { 
    RichText, 
    InspectorControls, 
    MediaUpload, 
    MediaUploadCheck,
    useBlockProps 
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl, 
    Button, 
    TextareaControl,
    RepeaterControl 
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

registerBlockType('sueño-andino/hero-block', {
    edit: function(props) {
        const { attributes, setAttributes } = props;
        const {
            title,
            subtitle,
            description,
            primaryButtonText,
            primaryButtonLink,
            secondaryButtonText,
            backgroundImage,
            stats
        } = attributes;

        const blockProps = useBlockProps({
            className: 'hero-section'
        });

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Configuración General', 'sueño-andino')}>
                        <TextControl
                            label={__('Título Principal', 'sueño-andino')}
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                        />
                        <TextControl
                            label={__('Subtítulo', 'sueño-andino')}
                            value={subtitle}
                            onChange={(value) => setAttributes({ subtitle: value })}
                        />
                        <TextareaControl
                            label={__('Descripción', 'sueño-andino')}
                            value={description}
                            onChange={(value) => setAttributes({ description: value })}
                            rows={3}
                        />
                    </PanelBody>
                    
                    <PanelBody title={__('Botones', 'sueño-andino')}>
                        <TextControl
                            label={__('Texto Botón Principal', 'sueño-andino')}
                            value={primaryButtonText}
                            onChange={(value) => setAttributes({ primaryButtonText: value })}
                        />
                        <TextControl
                            label={__('Enlace Botón Principal', 'sueño-andino')}
                            value={primaryButtonLink}
                            onChange={(value) => setAttributes({ primaryButtonLink: value })}
                        />
                        <TextControl
                            label={__('Texto Botón Secundario', 'sueño-andino')}
                            value={secondaryButtonText}
                            onChange={(value) => setAttributes({ secondaryButtonText: value })}
                        />
                    </PanelBody>
                    
                    <PanelBody title={__('Imagen de Fondo', 'sueño-andino')}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => setAttributes({ backgroundImage: media.url })}
                                allowedTypes={['image']}
                                value={backgroundImage}
                                render={({ open }) => (
                                    <Button onClick={open}>
                                        {backgroundImage ? __('Cambiar Imagen', 'sueño-andino') : __('Seleccionar Imagen', 'sueño-andino')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    </PanelBody>
                </InspectorControls>

                <div className="hero-background">
                    {backgroundImage && (
                        <img src={backgroundImage} alt="Hero background" />
                    )}
                    <div className="hero-overlay"></div>
                </div>
                
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="hero-title-line">
                            <RichText
                                value={title}
                                onChange={(value) => setAttributes({ title: value })}
                                placeholder={__('Título principal...', 'sueño-andino')}
                            />
                        </span>
                        <span className="hero-title-accent">
                            <RichText
                                value={subtitle}
                                onChange={(value) => setAttributes({ subtitle: value })}
                                placeholder={__('Subtítulo...', 'sueño-andino')}
                            />
                        </span>
                    </h1>
                    
                    <p className="hero-description">
                        <RichText
                            value={description}
                            onChange={(value) => setAttributes({ description: value })}
                            placeholder={__('Descripción...', 'sueño-andino')}
                        />
                    </p>
                    
                    <div className="hero-cta">
                        <a href={primaryButtonLink} className="btn btn-primary">
                            {primaryButtonText}
                        </a>
                        <button className="btn btn-secondary">
                            {secondaryButtonText}
                        </button>
                    </div>
                </div>
                
                {stats && stats.length > 0 && (
                    <div className="hero-stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    },
    
    save: function() {
        return null; // Dynamic block
    }
});
