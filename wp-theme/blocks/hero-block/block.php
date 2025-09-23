<?php
/**
 * Hero Block
 * 
 * @package SueñoAndino
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Get block attributes
$title = $attributes['title'] ?? 'DESARROLLO TERRITORIAL REGENERATIVO';
$subtitle = $attributes['subtitle'] ?? 'DESDE Y HACIA LATINOAMÉRICA';
$description = $attributes['description'] ?? 'Impulsamos proyectos de desarrollo territorial que devuelven vitalidad a los ecosistemas, fortalecen comunidades y generan prosperidad consciente y regenerativa';
$primaryButtonText = $attributes['primaryButtonText'] ?? 'Conoce Nuestros Servicios';
$primaryButtonLink = $attributes['primaryButtonLink'] ?? '#servicios';
$secondaryButtonText = $attributes['secondaryButtonText'] ?? 'Descarga Guía Gratuita';
$backgroundImage = $attributes['backgroundImage'] ?? get_template_directory_uri() . '/assets/img/hero-background.jpg';
$stats = $attributes['stats'] ?? [];

// Get wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'hero-section',
    'id' => 'hero'
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="hero-background">
        <img src="<?php echo esc_url($backgroundImage); ?>" 
             alt="Paisaje andino regenerativo" 
             loading="eager" 
             decoding="async" 
             fetchpriority="high">
        <div class="hero-overlay"></div>
    </div>
    
    <div class="hero-content">
        <h1 class="hero-title">
            <span class="hero-title-line"><?php echo esc_html($title); ?></span>
            <span class="hero-title-accent"><?php echo esc_html($subtitle); ?></span>
        </h1>
        
        <p class="hero-description"><?php echo esc_html($description); ?></p>
        
        <div class="hero-cta">
            <a href="<?php echo esc_url($primaryButtonLink); ?>" class="btn btn-primary">
                <?php echo esc_html($primaryButtonText); ?>
            </a>
            <button id="leadMagnetBtn" class="btn btn-secondary">
                <?php echo esc_html($secondaryButtonText); ?>
            </button>
        </div>
    </div>
    
    <?php if (!empty($stats)): ?>
    <div class="hero-stats">
        <?php foreach ($stats as $stat): ?>
        <div class="stat-item">
            <div class="stat-number"><?php echo esc_html($stat['number']); ?></div>
            <div class="stat-label"><?php echo esc_html($stat['label']); ?></div>
        </div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>
</section>