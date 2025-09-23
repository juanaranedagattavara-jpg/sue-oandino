<?php
/**
 * Contacto Block
 * 
 * @package SueñoAndino
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Get block attributes
$title = $attributes['title'] ?? '¿Listo para Transformar tu Comunidad?';
$description = $attributes['description'] ?? 'Conecta con nosotros y descubre cómo podemos impulsar el desarrollo regenerativo en tu territorio.';
$email = $attributes['email'] ?? 'hola@sueñoandino.com';
$phone = $attributes['phone'] ?? '+51 999 888 777';
$address = $attributes['address'] ?? 'Lima, Perú';
$calendarEmbed = $attributes['calendarEmbed'] ?? '';
$formTitle = $attributes['formTitle'] ?? 'Agenda tu Consulta Gratuita';
$formDescription = $attributes['formDescription'] ?? 'Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.';

// Get wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'contacto-section',
    'id' => 'contacto'
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Contacto</span>
            <h2 class="section-title"><?php echo esc_html($title); ?></h2>
            <p class="section-description"><?php echo esc_html($description); ?></p>
        </div>
        
        <div class="contacto-content">
            <div class="contacto-info">
                <div class="contacto-item">
                    <div class="contacto-icon">
                        <span class="dashicons dashicons-email"></span>
                    </div>
                    <div class="contacto-details">
                        <h4>Email</h4>
                        <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
                    </div>
                </div>
                
                <div class="contacto-item">
                    <div class="contacto-icon">
                        <span class="dashicons dashicons-phone"></span>
                    </div>
                    <div class="contacto-details">
                        <h4>Teléfono</h4>
                        <a href="tel:<?php echo esc_attr($phone); ?>"><?php echo esc_html($phone); ?></a>
                    </div>
                </div>
                
                <div class="contacto-item">
                    <div class="contacto-icon">
                        <span class="dashicons dashicons-location"></span>
                    </div>
                    <div class="contacto-details">
                        <h4>Ubicación</h4>
                        <p><?php echo esc_html($address); ?></p>
                    </div>
                </div>
            </div>
            
            <div class="contacto-form">
                <h3><?php echo esc_html($formTitle); ?></h3>
                <p><?php echo esc_html($formDescription); ?></p>
                
                <form id="contactoForm" class="contacto-form-element">
                    <div class="form-group">
                        <input type="text" id="nombre" name="nombre" placeholder="Nombre completo" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="email" name="email" placeholder="Correo electrónico" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="telefono" name="telefono" placeholder="Teléfono">
                    </div>
                    <div class="form-group">
                        <select id="tipo" name="tipo" required>
                            <option value="">Tipo de consulta</option>
                            <option value="persona">Persona</option>
                            <option value="empresa">Empresa</option>
                            <option value="gobierno">Gobierno</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <textarea id="mensaje" name="mensaje" placeholder="Cuéntanos sobre tu proyecto o consulta" rows="4"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar Consulta</button>
                </form>
            </div>
        </div>
        
        <?php if (!empty($calendarEmbed)): ?>
        <div class="contacto-calendar">
            <h3>Agenda una Reunión</h3>
            <div class="calendar-container">
                <iframe src="<?php echo esc_url($calendarEmbed); ?>" 
                        width="100%" 
                        height="600" 
                        frameborder="0" 
                        scrolling="no">
                </iframe>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>