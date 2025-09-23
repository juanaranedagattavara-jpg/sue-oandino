<?php
/**
 * Servicios Block
 * 
 * @package SueñoAndino
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Get block attributes
$title = $attributes['title'] ?? 'Soluciones Especializadas';
$description = $attributes['description'] ?? 'Desarrollamos programas integrales que combinan metodologías probadas con innovación constante.';
$services = $attributes['services'] ?? [];
$ctaTitle = $attributes['ctaTitle'] ?? '¿Listo para transformar tu organización?';
$ctaDescription = $attributes['ctaDescription'] ?? 'Descubre cómo nuestros servicios pueden impulsar el desarrollo regenerativo en tu comunidad o empresa.';
$ctaButtonText = $attributes['ctaButtonText'] ?? 'Agendar Consulta';

// Get wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'servicios-section',
    'id' => 'servicios'
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Nuestros Servicios</span>
            <h2 class="section-title"><?php echo esc_html($title); ?></h2>
            <p class="section-description"><?php echo esc_html($description); ?></p>
        </div>
        
        <?php if (!empty($services)): ?>
        <div class="servicios-grid">
            <?php foreach ($services as $service): ?>
            <div class="servicio-card">
                <div class="servicio-icon">
                    <span class="dashicons <?php echo esc_attr($service['icon'] ?? 'dashicons-admin-tools'); ?>"></span>
                </div>
                <h3><?php echo esc_html($service['title']); ?></h3>
                <p><?php echo esc_html($service['description']); ?></p>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <div class="servicios-cta">
            <h3><?php echo esc_html($ctaTitle); ?></h3>
            <p><?php echo esc_html($ctaDescription); ?></p>
            <button onclick="abrirModalCalendario()" class="btn btn-primary">
                <?php echo esc_html($ctaButtonText); ?>
            </button>
        </div>
    </div>
</section>