<?php
/**
 * Equipo Block
 * 
 * @package SueñoAndino
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Get block attributes
$title = $attributes['title'] ?? 'Conoce a Nuestro Equipo';
$description = $attributes['description'] ?? 'Profesionales comprometidos con la transformación social y el desarrollo regenerativo.';
$members = $attributes['members'] ?? [];

// Get wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'equipo-section',
    'id' => 'equipo'
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Nuestro Equipo</span>
            <h2 class="section-title"><?php echo esc_html($title); ?></h2>
            <p class="section-description"><?php echo esc_html($description); ?></p>
        </div>
        
        <?php if (!empty($members)): ?>
        <div class="equipo-grid">
            <?php foreach ($members as $member): ?>
            <div class="equipo-item">
                <div class="equipo-avatar">
                    <?php if (!empty($member['image'])): ?>
                        <img src="<?php echo esc_url($member['image']); ?>" 
                             alt="<?php echo esc_attr($member['name']); ?>" 
                             loading="lazy">
                    <?php else: ?>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    <?php endif; ?>
                </div>
                <h4><?php echo esc_html($member['name']); ?></h4>
                <p><?php echo esc_html($member['position']); ?></p>
                <?php if (!empty($member['bio'])): ?>
                    <p class="equipo-bio"><?php echo esc_html($member['bio']); ?></p>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>